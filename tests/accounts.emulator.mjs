import {test,before,after,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash,randomUUID} from 'node:crypto';
import {initializeTestEnvironment,assertFails,assertSucceeds} from '@firebase/rules-unit-testing';
import {initializeApp,deleteApp} from 'firebase/app';
import {getAuth,connectAuthEmulator,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut} from 'firebase/auth';
import {getFirestore,connectFirestoreEmulator,doc,getDoc,setDoc,updateDoc,deleteDoc,serverTimestamp,getDocs,collection,query,orderBy,limit,runTransaction} from 'firebase/firestore';
import {cartIdentity} from '../assets/customer-model.mjs';
let env;
const projectId='demo-madman-accounts';
const email=uid=>uid+'@example.test';
const context=(uid,verified=true)=>env.authenticatedContext(uid,{email:email(uid),email_verified:verified}).firestore();
const profile=uid=>({name:'Test Customer',email:email(uid),phone:'',updatedAt:serverTimestamp()});
const item=()=>({photoId:'prints/a-quiet-corner.jpg',size:'8x10',paper:'Moab Lasal Photo Matte 230',border:'Borderless',borderSize:0,delivery:'Shipping',quantity:1,updatedAt:serverTimestamp()});
const itemId=createHash('sha256').update(cartIdentity(item())).digest('hex');
const cartPath=uid=>['customers',uid,'cart',itemId];
const draft=uid=>({client:'Test Customer',email:email(uid),phone:'',shootType:'Couples',durationMinutes:'30',requestedImages:'5',people:'2',date:'',time:'',location:'',travelZone:'',marketingSource:'',businessName:'',businessWebsite:'',businessNeeds:'',businessUse:'',requests:'',smsConsent:false,locationAdvice:false,requestId:randomUUID(),updatedAt:serverTimestamp()});
before(async()=>{env=await initializeTestEnvironment({projectId,firestore:{host:'127.0.0.1',port:8088,rules:await fs.readFile('firestore.rules','utf8')}});});
beforeEach(()=>env.clearFirestore());after(()=>env?.cleanup());
async function seed(uid='alice'){const db=context(uid);await setDoc(doc(db,'customers',uid),profile(uid));return db;}
test('signed-out requests cannot read, list or write customer data',async()=>{
  await seed();const guest=env.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(guest,'customers','alice')));await assertFails(getDocs(collection(guest,'customers')));
  await assertFails(setDoc(doc(guest,'customers','alice'),profile('alice')));
  await assertFails(getDocs(collection(guest,'customers','alice','cart')));
});
test('a second customer cannot read, list, change or delete another customer’s data',async()=>{
  const a=await seed();await setDoc(doc(a,...cartPath('alice')),item());await seed('bob');const b=context('bob');
  for(const path of [['customers','alice'],cartPath('alice')]){await assertFails(getDoc(doc(b,...path)));await assertFails(setDoc(doc(b,...path),item()));await assertFails(deleteDoc(doc(b,...path)));}
  await assertFails(getDocs(collection(b,'customers','alice','cart')));
});
test('profile validation applies to creation and updates, without role escalation',async()=>{
  const a=await seed();
  for(const patch of [{phone:'x'.repeat(41)},{email:email('bob')},{role:'admin'},{name:7},{updatedAt:1}])await assertFails(updateDoc(doc(a,'customers','alice'),{...patch, ...(patch.updatedAt?{}:{updatedAt:serverTimestamp()})}));
  await assertFails(setDoc(doc(a,'customers','alice'),{email:email('alice'),updatedAt:serverTimestamp()}));
  await assertSucceeds(updateDoc(doc(a,'customers','alice'),{phone:'555-0100',updatedAt:serverTimestamp()}));
});
test('cart contents are readable on a second client with the same account',async()=>{
  const a=await seed();await setDoc(doc(a,...cartPath('alice')),item());const otherDevice=context('alice');
  const saved=await assertSucceeds(getDoc(doc(otherDevice,...cartPath('alice'))));assert.equal(saved.data().quantity,1);
  assert.equal((await getDocs(collection(otherDevice,'customers','alice','cart'))).size,1);
});
test('cart rules reject invalid quantities, options, extra fields and changed photograph ownership',async()=>{
  const a=await seed(),ref=doc(a,...cartPath('alice'));await setDoc(ref,item());
  for(const patch of [{quantity:0},{quantity:-1},{quantity:101},{quantity:1.5},{paper:'unknown'},{photoId:'../private/file'},{price:0},{border:'White border'},{quantity:'2'}])await assertFails(updateDoc(ref,{...patch,updatedAt:serverTimestamp()}));
  await assertSucceeds(updateDoc(ref,{quantity:100,updatedAt:serverTimestamp()}));await assertSucceeds(deleteDoc(ref));
});
test('cart writes require a profile and cannot target unknown paths',async()=>{
  const a=context('alice');await assertFails(setDoc(doc(a,...cartPath('alice')),item()));await seed();
  await assertFails(setDoc(doc(a,'customers','alice','secrets','x'),{value:'no'}));await assertFails(setDoc(doc(a,'customers','alice','cart','not-a-hash'),item()));
});
test('transactions from two devices preserve both quantity changes',async()=>{
  const a=await seed(),b=context('alice');await setDoc(doc(a,...cartPath('alice')),item());
  const increment=db=>runTransaction(db,async tx=>{const ref=doc(db,...cartPath('alice'));const snap=await tx.get(ref);tx.update(ref,{quantity:snap.data().quantity+1,updatedAt:serverTimestamp()});});
  await Promise.all([increment(a),increment(b)]);assert.equal((await getDoc(doc(a,...cartPath('alice')))).data().quantity,3);
});
test('booking drafts persist, validate all fields, and keep stable inquiry IDs',async()=>{
  const a=await seed(),ref=doc(a,'customers','alice','drafts','booking'),value=draft('alice');await setDoc(ref,value);
  assert.equal((await getDoc(doc(context('alice'),'customers','alice','drafts','booking'))).data().shootType,'Couples');
  for(const patch of [{requestedImages:'6'},{requests:'x'.repeat(3001)},{email:email('bob')},{smsConsent:'yes'},{requestId:randomUUID()},{role:'admin'}])await assertFails(updateDoc(ref,{...patch,updatedAt:serverTimestamp()}));
  await assertFails(setDoc(ref,{client:'incomplete',updatedAt:serverTimestamp()}));await assertSucceeds(deleteDoc(ref));
});
test('inquiry history is private, immutable, and cannot claim payment or booking authority',async()=>{
  const a=await seed(),id=randomUUID(),path=['customers','alice','inquiries',id];
  const value={type:'booking',hubReference:'test-receipt',summary:'Test inquiry only.',createdAt:serverTimestamp()};
  await assertFails(setDoc(doc(context('alice',false),...path),value));await assertSucceeds(setDoc(doc(a,...path),value));
  await assertFails(updateDoc(doc(a,...path),{status:'BOOKED'}));await assertFails(updateDoc(doc(a,...path),{summary:'replacement'}));await assertFails(deleteDoc(doc(a,...path)));
  await assertFails(getDoc(doc(context('bob'),...path)));await assertFails(setDoc(doc(a,'customers','alice','inquiries',randomUUID()),{...value,paid:true}));
  const history=await assertSucceeds(getDocs(query(collection(a,'customers','alice','inquiries'),orderBy('createdAt','desc'),limit(30))));assert.equal(history.size,1);
});
test('print retry markers persist without contact data and reject arbitrary fields',async()=>{
  const a=await seed(),ref=doc(a,'customers','alice','drafts','print');
  const value={requestId:randomUUID(),fingerprint:'a'.repeat(64),updatedAt:serverTimestamp()};
  await assertSucceeds(setDoc(ref,value));assert.equal((await getDoc(doc(context('alice'),'customers','alice','drafts','print'))).data().requestId,value.requestId);
  await assertFails(updateDoc(ref,{email:email('alice'),updatedAt:serverTimestamp()}));await assertFails(updateDoc(ref,{fingerprint:'bad',updatedAt:serverTimestamp()}));
  await assertFails(getDoc(doc(context('bob'),'customers','alice','drafts','print')));await assertSucceeds(deleteDoc(ref));
});
test('real Auth emulator sign-up, logout and second-device login recover saved cart and draft',async()=>{
  const apps=[];const mail='test-'+randomUUID()+'@example.test',password='Test-only-'+randomUUID();
  function client(){const app=initializeApp({projectId,apiKey:'emulator-only',authDomain:projectId+'.firebaseapp.com'},randomUUID());apps.push(app);const auth=getAuth(app);connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});const db=getFirestore(app);connectFirestoreEmulator(db,'127.0.0.1',8088);return {auth,db};}
  try{
    const first=client();const result=await createUserWithEmailAndPassword(first.auth,mail,password),uid=result.user.uid;
    await setDoc(doc(first.db,'customers',uid),{name:'Emulator Customer',email:mail,phone:'',updatedAt:serverTimestamp()});
    await setDoc(doc(first.db,...cartPath(uid)),item());await setDoc(doc(first.db,'customers',uid,'drafts','booking'),{...draft(uid),email:mail});
    await signOut(first.auth);await assertFails(getDoc(doc(first.db,...cartPath(uid))));
    const second=client();await signInWithEmailAndPassword(second.auth,mail,password);
    assert.equal((await getDoc(doc(second.db,...cartPath(uid)))).data().quantity,1);
    assert.equal((await getDoc(doc(second.db,'customers',uid,'drafts','booking'))).data().shootType,'Couples');
  }finally{await Promise.all(apps.map(deleteApp));}
});
