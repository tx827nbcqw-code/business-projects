import engine from './studio-engine.js';
import {saveInquiry,ready} from './firebase-client.js';
import {inquiryRecord} from './inquiry-record.js';
const nativeFetch=window.fetch.bind(window);
window.fetch=async function(input,options){const url=new URL(input instanceof Request?input.url:input,location.href);if(url.origin===location.origin&&['/api/estimate','/api/request','/api/print-options','/api/print-request'].includes(url.pathname)){
 try{const data=options?.body?JSON.parse(options.body):{};if(url.pathname==='/api/request'){if(data.website)return Response.json({id:'received'});return Response.json(await saveInquiry(inquiryRecord(data)),{status:201});}
 if(url.pathname==='/api/print-request')throw Error('Please email Andre about this print while print inquiries are being migrated.');
 return engine.fetch(new Request(url,{...options,headers:{...options?.headers,Origin:location.origin}}),{});
 }catch(error){return Response.json({error:error.code==='permission-denied'?'Could not save. Please wait a minute and try again, or contact Andre directly.':error.message}, {status:400});}}
 return nativeFetch(input,options);};
if(!ready){const notice=document.createElement('p');notice.className='notice';notice.textContent='Online inquiries are being set up. Please email or text Andre in the meantime.';document.querySelector('main').prepend(notice);}
await import(location.pathname.startsWith('/prints')?'./prints-form.js':'./booking-form.js');
