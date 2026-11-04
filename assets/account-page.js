import {account} from './customer-account.js';
import {safeReturnPath} from './customer-model.mjs';
const $=s=>document.querySelector(s),params=new URLSearchParams(location.search);
let mode=params.get('mode')==='signup'?'signup':'login',watchedUid=null,working=false;
let catalog=[];
const catalogReady=fetch('/assets/print-catalog.json').then(r=>{if(!r.ok)throw Error('Catalog unavailable');return r.json();}).then(value=>{catalog=value;}).catch(()=>{});
const returnAfterLogin=()=>location.replace(safeReturnPath(params.get('return')));
function updateMode(){
  const signup=mode==='signup';$('#signup-name').hidden=!signup;$('#signup-name input').required=signup;
  $('#auth-title').textContent=signup?'Create account.':'Log in.';
  $('#auth-description').textContent='Save your cart and booking details.';
  $('#mode-prompt').firstChild.textContent=signup?'Already have an account? ':'New here? ';
  $('#auth-submit').textContent=signup?'Create account':'Log in';$('#switch-mode').textContent=signup?'Log in instead':'Create an account';
  $('#auth-form [name=password]').autocomplete=signup?'new-password':'current-password';$('#auth-form [name=password]').minLength=signup?12:1;$('#password-help').hidden=!signup;$('#reset-password').hidden=signup;
}
async function action(target,fn,success){
  if(working)return;working=true;const buttons=Array.from(document.querySelectorAll('button'));const disabled=buttons.map(el=>el.disabled);buttons.forEach(el=>el.disabled=true);target.classList.remove('error');target.textContent='One moment…';
  try{await fn();const result=account.user?$('#account-result'):$('#auth-result');result.classList.remove('error');result.textContent=success||'';}
  catch(e){const result=account.user?$('#account-result'):$('#auth-result');result.classList.add('error');result.textContent=e.code?account.message(e):e.message;}
  finally{working=false;buttons.forEach((el,i)=>el.disabled=disabled[i]);}
}
$('#switch-mode').addEventListener('click',()=>{mode=mode==='signup'?'login':'signup';updateMode();});updateMode();
$('#auth-form').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.target);action($('#auth-result'),async()=>{
  if(mode==='signup')await account.signup(d.get('name'),d.get('email'),d.get('password'));else await account.login(d.get('email'),d.get('password'));
  e.target.elements.password.value='';
  returnAfterLogin();
},mode==='signup'?'Your account is created. Check your email to verify your address.':'You’re signed in.');});
$('#google-login').addEventListener('click',()=>action($('#auth-result'),async()=>{await account.google();returnAfterLogin();}));
$('#reset-password').addEventListener('click',()=>{const field=$('#auth-form [name=email]');if(!field.reportValidity())return;action($('#auth-result'),()=>account.reset(field.value),'If an account uses that email, you’ll receive a password reset link.');});
$('#logout').addEventListener('click',()=>action($('#account-result'),()=>account.logout()));
$('#profile-form').addEventListener('submit',e=>{e.preventDefault();action($('#account-result'),async()=>{await account.saveProfile(Object.fromEntries(new FormData(e.target)));location.replace('/');});});
$('#send-verification').addEventListener('click',()=>action($('#account-result'),()=>account.verify(),'Check your email for the verification link.'));
$('#check-verification').addEventListener('click',()=>action($('#account-result'),async()=>{if(!await account.refreshVerification())throw Error('Your email is not verified yet. Open the link in your email, then try again.');},'Email verified. You can send your inquiry.'));
account.onChange(({user,profile,problem})=>{
  $('#signed-out').hidden=!!user;$('#signed-in').hidden=!user;
  document.querySelectorAll('[data-account-link]').forEach(el=>el.textContent=user?'My account':'Log in');
  if(problem){const target=user?$('#account-result'):$('#auth-result');target.textContent=problem;target.classList.add('error');}
  if(!user){$('#auth-form [name=password]').value='';watchedUid=null;$('#profile-form').reset();$('#inquiry-history').replaceChildren();$('#account-cart').replaceChildren();$('#review-cart').hidden=true;return;}
  $('#account-email').textContent=user.email||'';$('#welcome').textContent='Your cart.';$('#verification-notice').hidden=user.emailVerified;
  if(profile&&!$('#profile-form').contains(document.activeElement)){const f=$('#profile-form').elements;f.name.value=profile.name||'';f.phone.value=profile.phone||'';}
  if(watchedUid===user.uid)return;watchedUid=user.uid;const historyUid=user.uid;
  $('#account-cart').textContent='Loading your cart…';
  account.watchCart(async(lines,saved)=>{
    await catalogReady;if(account.user?.uid!==historyUid)return;
    const container=$('#account-cart');container.replaceChildren();$('#review-cart').hidden=!lines.length;
    if(!lines.length){container.textContent=saved?'Your cart is empty.':'Loading your cart…';return;}
    for(const line of lines){
      const photo=catalog.find(item=>item.src===line.photoId),entry=document.createElement('article'),image=document.createElement('img'),copy=document.createElement('div'),title=document.createElement('h2'),options=document.createElement('p');
      entry.className='account-cart-item';image.src=photo?.imageUrl||'/assets/'+line.photoId;image.alt=photo?.title||'Selected photograph';title.textContent=photo?.title||'Selected photograph';options.textContent=line.size.replace('x',' × ')+' · '+line.paper+' · Qty '+line.quantity;copy.append(title,options);entry.append(image,copy);container.append(entry);
    }
  },error=>{$('#account-cart').textContent=error;$('#review-cart').hidden=true;});
  account.watchHistory(records=>{
    if(account.user?.uid!==historyUid)return;
    const container=$('#inquiry-history');container.replaceChildren();
    if(!records.length){const p=document.createElement('p');p.className='muted';p.textContent='No sent inquiries yet.';container.append(p);}
    for(const record of records){const entry=document.createElement('details'),summary=document.createElement('summary'),text=document.createElement('pre'),ref=document.createElement('p');entry.className='inquiry-entry';summary.textContent=(record.type==='booking'?'Session inquiry':'Print inquiry')+(record.createdAt?.toDate?' · '+record.createdAt.toDate().toLocaleDateString('en-US'):'');text.textContent=record.summary;ref.className='muted';ref.textContent='Reference: '+record.hubReference;entry.append(summary,text,ref);container.append(entry);}
  },error=>$('#inquiry-history').textContent=error);
});
await account.ready;$('#auth-submit').disabled=$('#google-login').disabled=!account.configured;if(account.configured&&!account.user&&!account.problem)$('#auth-result').textContent='';
