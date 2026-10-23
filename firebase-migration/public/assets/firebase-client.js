import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,GoogleAuthProvider,signInWithPopup,signOut,signInAnonymously,inMemoryPersistence,setPersistence} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFirestore,doc,collection,getDoc,getDocs,query,orderBy,documentId,limit,startAfter,runTransaction,writeBatch,serverTimestamp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import {firebaseConfig,ownerEmail} from './firebase-config.js';
export const ready=Boolean(firebaseConfig?.projectId&&firebaseConfig?.apiKey);
const app=ready?initializeApp(firebaseConfig):null;
export const auth=app?getAuth(app):null;
export const db=app?getFirestore(app):null;
export async function isOwner(user){if(!user)return false;const {claims}=await user.getIdTokenResult();return claims.email===ownerEmail&&claims.email_verified===true&&claims.firebase?.sign_in_provider==='google.com';}
export async function login(){const provider=new GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account',login_hint:ownerEmail});return signInWithPopup(auth,provider);}
export async function logout(){await signOut(auth);location.reload();}
function reference(key){return key.startsWith('records/')?doc(db,'studioRecords',key.slice(8,-5)):doc(db,'studioSettings',encodeURIComponent(key));}
export const bucket={
 async get(key){const snapshot=await getDoc(reference(key));if(!snapshot.exists())return null;const {value,etag}=snapshot.data();return {etag,json:async()=>structuredClone(value)};},
 async put(key,raw,options={}){const ref=reference(key),value=JSON.parse(raw),etag=crypto.randomUUID();return runTransaction(db,async transaction=>{const old=await transaction.get(ref),condition=options.onlyIf;if(condition?.etagMatches&&(!old.exists()||old.data().etag!==condition.etagMatches)||condition?.etagDoesNotMatch==='*'&&old.exists())return null;transaction.set(ref,{value,etag});return {etag};});},
 async list({prefix,limit:pageSize=200,cursor}){if(prefix!=='records/')throw Error('Unsupported collection');const parts=[orderBy(documentId()),limit(Math.min(pageSize,200))];if(cursor)parts.push(startAfter(cursor));const batch=await getDocs(query(collection(db,'studioRecords'),...parts));return {objects:batch.docs.map(item=>({key:'records/'+item.id+'.json'})),truncated:batch.size===pageSize,cursor:batch.size===pageSize?batch.docs.at(-1).id:null};}
};
export async function saveInquiry(record){
 if(!ready)throw Error('Online inquiries are not configured yet. Please email or text Andre.');
 if(!auth.currentUser){await setPersistence(auth,inMemoryPersistence);await signInAnonymously(auth);}
 const value={...record,submittedBy:auth.currentUser.uid,submittedAt:serverTimestamp()};
 const batch=writeBatch(db);batch.set(doc(db,'studioRecords',record.id),{value,etag:record.id});
 batch.set(doc(db,'submissionLimits',auth.currentUser.uid),{lastSubmittedAt:serverTimestamp(),recordId:record.id});
 await batch.commit();return {id:record.id};
}
// Private backups stay on the owner's computer and are never bundled with the website.
export async function exportBackup(){if(!await isOwner(auth.currentUser))throw Error('Owner sign-in required');const data={schemaVersion:1,exportedAt:new Date().toISOString(),records:[],settings:[]};for(const name of ['studioRecords','studioSettings']){const all=await getDocs(collection(db,name));data[name==='studioRecords'?'records':'settings']=all.docs.map(item=>({id:item.id,...item.data()}));}const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));link.download='madman-private-backup.json';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);}
