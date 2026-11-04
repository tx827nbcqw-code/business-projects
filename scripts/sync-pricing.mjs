// Private Google Sheet -> validated public pricing snapshot. No browser credentials.
// GOOGLE_PRICING_ACCESS_TOKEN is an ephemeral read-only Sheets access token.
// Use --check to validate the checked-in snapshot without network access.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const target=new URL('../assets/approved-pricing.json',import.meta.url);
let p=JSON.parse(await fs.readFile(target,'utf8'));
const check=process.argv.includes('--check');
if(!check){
 const token=process.env.GOOGLE_PRICING_ACCESS_TOKEN;
 if(!token)throw Error('A private Google Sheets read token is required; do not publish or expose sheet editing access.');
 const url='https://sheets.googleapis.com/v4/spreadsheets/'+p.sourceSpreadsheetId+'/values/'+encodeURIComponent(p.sourceRange)+'?valueRenderOption=UNFORMATTED_VALUE';
 const r=await fetch(url,{headers:{Authorization:'Bearer '+token}});if(!r.ok)throw Error('Unable to read the private pricing sheet ('+r.status+').');
 const rows=(await r.json()).values.slice(1),values=Object.fromEntries(rows.map(([key,value])=>[key,value]));
 p={...p,...Object.fromEntries(['version','firstHour','additionalHour','allDay','perFivePhotos','minimumMinutes','maximumPhotos','photoStep'].map(key=>[key,values[key]])),travel:{local:values.travelLocal,near:values.travelNear,far:values.travelFar,custom:null},verifiedAt:new Date().toISOString()};
}
assert.equal(p.approved,true,'Only explicitly approved pricing can be published');
assert.match(p.version,/^\d{4}-\d{2}-\d{2}$/);
for(const key of ['firstHour','additionalHour','allDay','perFivePhotos'])assert.ok(typeof p[key]==='number'&&p[key]>0&&p[key]<=10000,'Invalid rate: '+key);
assert.equal(p.minimumMinutes,30);assert.equal(p.maximumPhotos,150);assert.equal(p.photoStep,5);
for(const key of ['local','near','far'])assert.ok(typeof p.travel[key]==='number'&&p.travel[key]>=0&&p.travel[key]<=1000,'Invalid travel band');
if(!check)await fs.writeFile(target,JSON.stringify(p,null,2)+'\n');
// Optional existing operations checkout. The same snapshot generates server rates.
const serverArg=process.argv.find(a=>a.startsWith('--server-module='));
if(serverArg&&!check){const {sourceSpreadsheetId,sourceRange,verifiedAt,...rates}=p;await fs.writeFile(serverArg.slice('--server-module='.length),'// Generated from verified owner-approved Sheet.\nexport const APPROVED_PRICING='+JSON.stringify(rates)+';\n');}
console.log('Approved pricing snapshot validated. Minimum: $'+(p.minimumMinutes/60*p.firstHour+p.perFivePhotos).toFixed(2));
