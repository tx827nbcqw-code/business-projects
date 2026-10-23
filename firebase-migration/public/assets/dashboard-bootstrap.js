import engine from './studio-engine.js';
import {auth,ready,isOwner,login,logout,bucket,exportBackup} from './firebase-client.js';
const gate=document.querySelector('#owner-gate'),studio=document.querySelector('#studio'),message=document.querySelector('#login-status');
document.querySelector('#google-signin').onclick=async()=>{try{await login();}catch(error){message.textContent=error.message;}};
document.querySelector('#signout').onclick=logout;
document.querySelector('#owner-signout').onclick=logout;
document.querySelector('#backup').onclick=()=>exportBackup().catch(error=>{message.textContent=error.message;});
if(!ready){message.textContent='The private dashboard is not configured yet.';document.querySelector('#google-signin').disabled=true;}
else{await auth.authStateReady();let started=false;auth.onAuthStateChanged(async user=>{gate.hidden=false;studio.hidden=true;document.querySelector('#owner-tools').hidden=true;
 if(!await isOwner(user)){message.textContent=user?'This Google account does not have access. Sign out and use Andre’s owner account.':'';document.querySelector('#signout').hidden=!user;return;}
 document.querySelector('#owner-tools').hidden=false;gate.hidden=true;studio.hidden=false;
 if(started)return;started=true;
 const nativeFetch=window.fetch.bind(window);window.fetch=async function(input,options){const url=new URL(input instanceof Request?input.url:input,location.href);if(url.origin===location.origin&&url.pathname.startsWith('/api/')){if(!await isOwner(auth.currentUser))return Response.json({error:'Owner sign-in required'},{status:403});const headers=new Headers(options?.headers);headers.set('Origin',location.origin);headers.set('oai-authenticated-user-id',auth.currentUser.uid);headers.set('oai-authenticated-user-email',auth.currentUser.email);return engine.fetch(new Request(url,{...options,headers}),{BUCKET:bucket});}return nativeFetch(input,options);};
 // Domain entry points share the existing private studio views and business rules.
 await import('./dashboard-app.js');
 });}
