import fs from 'node:fs/promises';
import engine from '../public/assets/studio-engine.js';
const base='https://madmanphoto.com';
for(const [route,file,bootstrap] of [['/book','booking-form','inquiry-bootstrap'],['/admin','dashboard-app','dashboard-bootstrap']]){
 let html=await(await engine.fetch(new Request(base+route,{headers:route==='/admin'?{'oai-authenticated-user-id':'page-build','oai-authenticated-user-email':'andreottati4@gmail.com'}:{}}),{})).text();
 const match=html.match(/<script nonce="[^"]*">([\s\S]*?)<\/script>/);if(!match)throw Error('Missing application script');
 let script=match[1];
 script=script.replaceAll('https://photography-hub.andreottati.chatgpt.site/book','/book').replaceAll('/admin?','/dashboard?');
 if(route==='/admin'){
  script=script.replace("document.querySelector('main').prepend", "document.querySelector('#studio').prepend");
  // A static host has no API download routes. Fetch through the authenticated adapter.
  script += `\ndocument.addEventListener('click',async event=>{const link=event.target.closest('a[href]');if(!link)return;const url=new URL(link.href);if(url.origin===location.origin&&['/api/export','/api/contact'].includes(url.pathname)){event.preventDefault();const response=await fetch(url);if(!response.ok){alert('Owner sign-in required or export unavailable.');return;}const download=document.createElement('a');download.href=URL.createObjectURL(await response.blob());download.download=url.pathname==='/api/export'?'photography-operations.csv':'photography-client.vcf';download.click();setTimeout(()=>URL.revokeObjectURL(download.href),1000);}});`;
 }
 await fs.writeFile('public/assets/'+file+'.js',script);
 html=html.replace(match[0],`<script type="module" src="/assets/${bootstrap}.js"></script>`).replace(/<link rel="(?:apple-touch-icon|manifest)"[^>]*>/g,'');
 if(route==='/admin'){
  const opening='<main><section id="owner-gate" class="card"><h1>Your private studio.</h1><p>Sign in with your Google owner account to view inquiries and manage shoots.</p><button id="google-signin">Sign in with Google</button><p id="login-status" role="status"></p><button id="signout" class="secondary" hidden>Sign out</button></section><div id="owner-tools" hidden><button id="backup" class="secondary">Download private backup</button><button id="owner-signout" class="secondary">Sign out</button></div><div id="studio" hidden>';
  html=html.replace('<main>',opening).replace('</main>','</div></main>');
 } else html=html.replace('Campus spot, venue, or not decided','Collegedale, Chattanooga, venue, or not decided');
 html=html.replace('</main>','<p>Contact Andre directly: <a href="mailto:ottati.a.andre@gmail.com">email</a> or <a href="tel:+14075519957">call or text</a>.</p></main>');
 await fs.writeFile('public/'+(route==='/admin'?'dashboard':'book')+'/index.html',html);
}
