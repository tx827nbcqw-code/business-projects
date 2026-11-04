import {firebaseConfig} from './firebase-config.js';
import {cartRecord,cartIdentity} from './customer-model.mjs';

const listeners=new Set();
let auth,db,A,F,profile=null,user=null,problem=null,stopCart=()=>{},stopHistory=()=>{};
function emit(){for(const fn of listeners)fn({user,profile,problem});}
const ready=(async()=>{
  if(!firebaseConfig){problem='Customer accounts are being prepared. Please contact Andre for now.';return;}
  try{
    const [app,a,f]=await Promise.all([
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js')
    ]);
    A=a;F=f;const client=app.initializeApp(firebaseConfig);auth=A.getAuth(client);db=F.getFirestore(client);
    // Emulators are explicitly opt-in and cannot be selected on a public hostname.
    if(['localhost','127.0.0.1'].includes(location.hostname)&&new URLSearchParams(location.search).get('emulators')==='1'){
      A.connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});F.connectFirestoreEmulator(db,'127.0.0.1',8088);
    }
    await A.setPersistence(auth,A.browserLocalPersistence);
    await new Promise(resolve=>{
      A.onAuthStateChanged(auth,async current=>{
        stopCart();stopHistory();profile=null;user=current;problem=null;emit();
        if(current){
          try{
            const snap=await F.getDoc(F.doc(db,'customers',current.uid));
            if(auth.currentUser?.uid!==current.uid)return;
            profile=snap.exists()?snap.data():{name:current.displayName||'',email:current.email||'',phone:''};
          }catch{problem='Your account is signed in, but saved details could not be loaded. Please retry.';}
        }
        emit();resolve();
      },error=>{problem=message(error);emit();resolve();});
    });
  }catch(error){problem=message(error);}
  finally{emit();}
})();
function message(error){
  const messages={
    'auth/invalid-credential':'The email or password was not recognized. Try again or reset your password.',
    'auth/email-already-in-use':'This email already has an account. Log in or reset your password.',
    'auth/weak-password':'Use a password with at least 12 characters.',
    'auth/too-many-requests':'Too many attempts. Wait a little and try again.',
    'auth/popup-blocked':'Your browser blocked Google sign-in. Allow the popup or use email and password.',
    'auth/popup-closed-by-user':'Google sign-in was closed. You can try again.',
    'auth/account-exists-with-different-credential':'Use your existing sign-in method for this email to keep the same saved cart.',
    'auth/unauthorized-domain':'Sign-in is not enabled for this website address yet. Please contact Andre.',
    'auth/network-request-failed':'Unable to connect. Check your connection and try again.',
    'permission-denied':'Your details could not be saved. Please sign in again or contact Andre.'
  };
  return messages[error?.code]||'Unable to finish that step. Please check your connection and try again.';
}
function signedIn(){if(!user)throw Error('Log in to save your cart and booking details.');return user;}
const userDoc=(...segments)=>F.doc(db,'customers',signedIn().uid,...segments);
const userCollection=name=>F.collection(db,'customers',signedIn().uid,name);
function changedAccount(uid){if(user?.uid!==uid)throw Error('Your account changed. Please try again.');}
async function ensureProfile(current){
  const snap=await F.getDoc(F.doc(db,'customers',current.uid));
  if(!snap.exists())await account.saveProfile({name:current.displayName||'',phone:''});
}
export const account={
  ready,message,get user(){return user;},get profile(){return profile;},get problem(){return problem;},get configured(){return !!firebaseConfig;},
  onChange(fn){listeners.add(fn);fn({user,profile,problem});return()=>listeners.delete(fn);},
  async login(email,password){await ready;if(!auth)throw Error(problem);const result=await A.signInWithEmailAndPassword(auth,email,password);await ensureProfile(result.user);},
  async signup(name,email,password){
    await ready;if(!auth)throw Error(problem);if(password.length<12)throw Error('Use a password with at least 12 characters.');
    const result=await A.createUserWithEmailAndPassword(auth,email,password);
    await A.updateProfile(result.user,{displayName:name});
    // Profile persistence and verification can be retried independently of account creation.
    await this.saveProfile({name,phone:''});await A.sendEmailVerification(result.user);
  },
  async google(){await ready;if(!auth)throw Error(problem);const result=await A.signInWithPopup(auth,new A.GoogleAuthProvider());await ensureProfile(result.user);},
  async reset(email){await ready;if(!auth)throw Error(problem);await A.sendPasswordResetEmail(auth,email);},
  async verify(){await ready;await A.sendEmailVerification(signedIn());},
  async refreshVerification(){const current=signedIn();await A.reload(current);await current.getIdToken(true);emit();return current.emailVerified;},
  async logout(){await ready;if(auth){stopCart();stopHistory();user=null;profile=null;emit();await A.signOut(auth);}},
  async saveProfile({name,phone}){
    await ready;const current=signedIn(),uid=current.uid;
    const value={name:name.trim(),email:current.email||'',phone:phone.trim(),updatedAt:F.serverTimestamp()};
    await F.setDoc(userDoc(),value);changedAccount(uid);profile={...value};emit();
  },
  async requireLogin(){await ready;if(user)return true;this.showGate();return false;},
  showGate(){
    let dialog=document.querySelector('#login-gate');
    if(!dialog){
      dialog=document.createElement('dialog');dialog.id='login-gate';dialog.className='login-gate';dialog.setAttribute('aria-labelledby','gate-title');
      dialog.innerHTML='<button class="gate-close secondary" type="button" aria-label="Close login notice">Close ×</button><p class="eyebrow">YOUR PHOTOGRAPHS, SAVED</p><h2 id="gate-title">Log in to save your cart.</h2><p>Create an account or log in before adding prints or entering booking details. Your cart and saved details will be here when you return—even on another device.</p><p class="muted">Browsing is always open. Items are added only after you log in.</p><div class="gate-actions"><a class="button" data-gate-login>Log in</a><a class="button secondary" data-gate-signup>Create account</a></div><p class="save-status" data-gate-status></p>';
      dialog.querySelector('button').addEventListener('click',()=>dialog.close());document.body.append(dialog);
    }
    const path=encodeURIComponent(location.pathname+location.search);
    dialog.querySelector('[data-gate-login]').href='/account/?return='+path;
    dialog.querySelector('[data-gate-signup]').href='/account/?mode=signup&return='+path;
    dialog.querySelector('[data-gate-status]').textContent=problem||'';dialog.showModal();
  },
  watchCart(fn,onError){
    stopCart();signedIn();stopCart=F.onSnapshot(userCollection('cart'),{includeMetadataChanges:true},snapshot=>fn(snapshot.docs.map(doc=>({id:doc.id,...doc.data()})),!snapshot.metadata.hasPendingWrites&&!snapshot.metadata.fromCache),error=>onError(message(error)));return stopCart;
  },
  async changeCart(item,delta){
    await ready;const current=signedIn(),uid=current.uid;const value=cartRecord(item);
    const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(cartIdentity(value))))).map(b=>b.toString(16).padStart(2,'0')).join('');
    changedAccount(uid);const ref=userDoc('cart',hash);
    await F.runTransaction(db,async tx=>{
      const old=await tx.get(ref);const quantity=delta==='remove'?0:Math.min(100,Math.max(0,(old.exists()?old.data().quantity:0)+delta));
      if(quantity===0)tx.delete(ref);else tx.set(ref,{...value,quantity,updatedAt:F.serverTimestamp()});
    });changedAccount(uid);
  },
  async clearCart(){await ready;signedIn();const snap=await F.getDocs(userCollection('cart'));for(let i=0;i<snap.docs.length;i+=400){const batch=F.writeBatch(db);snap.docs.slice(i,i+400).forEach(doc=>batch.delete(doc.ref));await batch.commit();}},
  async preparePrintInquiry(fingerprint){
    await ready;const current=signedIn(),uid=current.uid;
    const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(fingerprint)))).map(b=>b.toString(16).padStart(2,'0')).join('');
    changedAccount(uid);const ref=userDoc('drafts','print');const requestId=crypto.randomUUID();
    return F.runTransaction(db,async tx=>{const previous=await tx.get(ref);if(previous.exists()&&previous.data().fingerprint===hash)return previous.data().requestId;tx.set(ref,{fingerprint:hash,requestId,updatedAt:F.serverTimestamp()});return requestId;});
  },
  async clearPrintAttempt(){await ready;signedIn();await F.deleteDoc(userDoc('drafts','print'));},
  async loadDraft(){await ready;signedIn();const snap=await F.getDoc(userDoc('drafts','booking'));return snap.exists()?snap.data():null;},
  async saveDraft(value){await ready;signedIn();await F.setDoc(userDoc('drafts','booking'),{...value,updatedAt:F.serverTimestamp()});},
  async clearDraft(){await ready;signedIn();await F.deleteDoc(userDoc('drafts','booking'));},
  async recordInquiry(id,{type,hubReference,summary}){
    await ready;signedIn();const ref=userDoc('inquiries',id);
    await F.runTransaction(db,async tx=>{if(!(await tx.get(ref)).exists())tx.set(ref,{type,hubReference,summary,createdAt:F.serverTimestamp()});});
  },
  watchHistory(fn,onError){
    stopHistory();signedIn();stopHistory=F.onSnapshot(F.query(userCollection('inquiries'),F.orderBy('createdAt','desc'),F.limit(30)),snapshot=>fn(snapshot.docs.map(doc=>({id:doc.id,...doc.data()}))),error=>onError(message(error)));return stopHistory;
  }
};
