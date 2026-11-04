import {account} from './customer-account.js';
import {bookingDraft} from './customer-model.mjs';
(() => {
 'use strict';
 const API='https://photography-hub.andreottati.chatgpt.site';
 const form=document.querySelector('#request'),fields=form.elements,details=document.querySelector('#session-details'),review=document.querySelector('#estimate-review'),out=document.querySelector('#result'),confirm=document.querySelector('#confirm-request'),edit=document.querySelector('#edit-request'),reviewButton=document.querySelector('#review-request'),advice=document.querySelector('#location-advice');
 let requestId=crypto.randomUUID(),receipt=null,activeUid=null,draftTimer;let reviewedData=null,busy=false,done=false,sequence=0,timer;
 let ratesPromise;
 const rates=()=>ratesPromise??=fetch('/assets/approved-pricing.json').then(r=>{if(!r.ok)throw Error('Unable to load the estimate. Please try again.');return r.json();}).catch(e=>{ratesPromise=null;throw e;});
 const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
 function configure(){const business=fields.shootType.value==='Business / branding';document.querySelector('#business-fields').hidden=!business;document.querySelector('#business-fields').querySelectorAll('input,select').forEach(el=>{el.disabled=!business;el.required=business&&['businessName','businessUse'].includes(el.name);});fields.location.required=!advice.checked;if(advice.checked&&!fields.travelZone.value)fields.travelZone.value='custom';}
 function data(){const d=Object.fromEntries(new FormData(form));if(advice.checked)d.location=d.location.trim()?d.location.trim()+' (open to suggestions; would like location advice)':'Not decided. I’d like Andre’s help choosing a location.';d.sessionPackage='flexible-v1';d.smsConsent=!!d.smsConsent;d.requestId=requestId;return d;}
 function estimateData(d){return {durationMinutes:d.durationMinutes,requestedImages:d.requestedImages,travelZone:d.travelZone};}
 async function api(path,d){if(path==='/api/estimate')return MadmanPricing.estimate(await rates(),estimateData(d));const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);try{const r=await fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(path==='/api/estimate'?estimateData(d):d),signal:controller.signal}),j=await r.json();if(!r.ok)throw Error(j.error||'Please try again. Your details are still here.');return j;}catch(e){if(e.name==='AbortError')throw Error('The connection is taking longer than expected. Please retry; your inquiry will not be duplicated.');throw e;}finally{clearTimeout(timeout);}}
 function items(target,j){target.replaceChildren();for(const item of j.lineItems||[]){const row=document.createElement('div'),label=document.createElement('span'),amount=document.createElement('span');row.className='estimate-item';label.textContent=item.label;amount.textContent=item.amount==null?'To be confirmed':money(item.amount);row.append(label,amount);target.append(row);}}
 async function live(){const seq=++sequence,d=data(),total=document.querySelector('#live-total'),scope=document.querySelector('#live-scope');if(!fields.requestedImages.checkValidity())return;try{const j=await api('/api/estimate',d);if(seq!==sequence)return;total.textContent=money(j.subtotal??j.total)+(j.customQuote?' + travel to confirm':' estimated');items(document.querySelector('#live-items'),j);scope.textContent='Minimum: 30 minutes + 5 edited photos — $25. First hour $40 (prorated below 1 hour) · additional time $15/hour · $5 per 5 edited photos. All-day coverage $150 plus photos. Final booking and price confirmed by Andre.';}catch(e){if(seq===sequence){total.textContent='Estimate unavailable right now';scope.textContent=e.message;}}}
 function addDetail(label,value){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value||'To be discussed';document.querySelector('#review-details').append(dt,dd);}
 function showReview(d,j){document.querySelector('#review-details').replaceChildren();addDetail('Session',d.shootType);addDetail('Date & time',d.date?new Intl.DateTimeFormat('en-US',{dateStyle:'medium',timeZone:'America/New_York'}).format(new Date(d.date+'T12:00:00-05:00'))+(d.time?' · '+d.time+' Eastern':' · time to discuss'):'To be discussed');addDetail('Duration',d.durationMinutes==='all-day'?'All day · coverage to discuss':j.minutes+' minutes');addDetail('Location',d.location);addDetail('People',d.people);addDetail('Edited photos',String(j.images));addDetail('Contact',d.client+' · '+d.email);items(document.querySelector('#estimate-items'),j);document.querySelector('#estimate-total').textContent=money(j.subtotal??j.total)+(j.customQuote?' + travel to confirm':' estimated');details.hidden=true;review.hidden=false;document.querySelector('#intro').hidden=true;reviewedData=Object.freeze({...d});out.textContent='';document.querySelector('#review-title').focus();review.scrollIntoView({behavior:'smooth',block:'start'});}
 edit.addEventListener('click',()=>{if(busy)return;reviewedData=null;review.hidden=true;details.hidden=false;document.querySelector('#intro').hidden=false;reviewButton.focus();});
 for(const event of ['input','change'])form.addEventListener(event,()=>{configure();clearTimeout(timer);timer=setTimeout(live,event==='change'?100:350);});
 form.addEventListener('submit',async e=>{
   e.preventDefault();if(busy||done||!await account.requireLogin())return;
   const submissionUid=account.user.uid,inquiryId=requestId,payload=reviewedData;
   const stillSignedIn=()=>account.user?.uid===submissionUid;
   clearTimeout(draftTimer);busy=true;confirm.disabled=edit.disabled=reviewButton.disabled=true;out.className='';out.textContent='';
   try{
     if(!payload){
       await saveDraft();if(!stillSignedIn())return;
       await account.saveProfile({name:fields.client.value,phone:fields.phone.value});if(!stillSignedIn())return;
       const d=data(),j=await api('/api/estimate',d);if(stillSignedIn())showReview(d,j);
     }else{
       if(!account.user.emailVerified)throw Error('Verify your email in My account before sending an inquiry. Your draft stays saved.');
       confirm.textContent=receipt?'Saving your inquiry…':'Sending your inquiry…';
       if(!receipt){
         const received=await api('/api/request',{...payload,requests:payload.requests+'\nCustomer account reference: '+submissionUid});
         if(!stillSignedIn())return;receipt=received;
       }
       await account.recordInquiry(inquiryId,{type:'booking',hubReference:String(receipt.id),summary:Object.entries(payload).filter(([key])=>!['website','requestId','sessionPackage'].includes(key)).map(([key,value])=>key+': '+value).join('\n')});
       if(!stillSignedIn())return;await account.clearDraft();if(!stillSignedIn())return;
       clearTimeout(timer);done=true;form.replaceChildren();
       const section=document.createElement('section');section.className='success';
       const eyebrow=document.createElement('p'),h=document.createElement('h2'),p=document.createElement('p'),ref=document.createElement('p'),back=document.createElement('a');
       eyebrow.className='eyebrow';eyebrow.textContent='THANK YOU FOR THINKING OF MADMAN';h.textContent='Your story starts here.';
       p.textContent='Your inquiry is safely received. Andre will be in touch to personally confirm the date, details and final pricing. I’m looking forward to hearing more.';
       ref.className='muted';ref.textContent='Inquiry reference: '+receipt.id;back.href='/account/';back.className='button';back.textContent='View your account';
       section.append(eyebrow,h,p,ref,back);form.append(section);section.setAttribute('tabindex','-1');section.focus();status('Your inquiry is saved to your account.');
     }
   }catch(error){
     if(!stillSignedIn())return;out.className='error';
     out.textContent=receipt?'Your inquiry was received. Reference: '+receipt.id+'. Your account history could not be saved yet. Retry to save it; the inquiry will not be resent.':(error.code?account.message(error):error.message);
     confirm.innerHTML='Confirm Inquiry <span aria-hidden="true">→</span>';
   }finally{busy=false;confirm.disabled=edit.disabled=reviewButton.disabled=false;}
 });
 if(new URLSearchParams(location.search).get('type')==='business')fields.shootType.value='Business / branding';configure();

 const access=document.querySelector('#booking-access'),notice=document.querySelector('#booking-login-notice'),saveStatus=document.querySelector('#booking-save-status');
 function status(text,error=false){saveStatus.textContent=text;saveStatus.classList.toggle('error',error);}
 async function saveDraft(){
   const uid=account.user?.uid;if(!uid||uid!==activeUid)return;
   status('Saving your booking details…');
   try{await account.saveDraft({...bookingDraft(form),requestId});if(account.user?.uid===uid)status('Booking details saved to your account.');}
   catch(error){if(account.user?.uid===uid)status('Not saved yet. '+(error.code?account.message(error):error.message),true);throw error;}
 }
 for(const event of ['input','change'])form.addEventListener(event,()=>{if(!activeUid||done||busy)return;clearTimeout(draftTimer);status('Changes waiting to save…');draftTimer=setTimeout(()=>saveDraft().catch(()=>{}),700);});
 account.onChange(async({user,profile,problem})=>{
   if(!user){
     if(done){location.reload();return;}requestId=crypto.randomUUID();
     activeUid=null;clearTimeout(draftTimer);access.disabled=true;notice.hidden=false;form.reset();reviewedData=null;receipt=null;review.hidden=true;details.hidden=false;document.querySelector('#intro').hidden=false;configure();status(problem||'Log in to save your booking details.',!!problem);return;
   }
   if(activeUid===user.uid)return;activeUid=user.uid;const uid=user.uid;access.disabled=true;notice.hidden=true;status('Loading your saved booking details…');
   try{
     const draft=await account.loadDraft();if(account.user?.uid!==uid)return;
     if(draft){for(const [key,value] of Object.entries(draft)){const el=fields[key];if(el&&typeof value==='string')el.value=value;}advice.checked=!!draft.locationAdvice;fields.smsConsent.checked=!!draft.smsConsent;requestId=draft.requestId||crypto.randomUUID();}
     const savedProfile=account.profile;fields.client.value=fields.client.value||savedProfile?.name||user.displayName||'';fields.phone.value=fields.phone.value||savedProfile?.phone||'';fields.email.value=user.email||'';fields.email.readOnly=true;
     configure();access.disabled=false;status(draft?'Your saved booking details are ready.':'Your booking details will save as you go.');live();
   }catch(error){if(account.user?.uid===uid)status('Saved booking details could not be loaded. Reload this page to try again.',true);}
 });
})();
