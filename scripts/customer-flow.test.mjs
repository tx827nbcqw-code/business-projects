import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {printMatchesQuery} from '../assets/customer-model.mjs';
const context={};vm.runInNewContext(fs.readFileSync('assets/booking-pricing.js','utf8'),context);
const rates=JSON.parse(fs.readFileSync('assets/approved-pricing.json','utf8'));
const estimate=data=>context.MadmanPricing.estimate(rates,data);
test('approved booking rates retain minimum, extended coverage and all-day prices',()=>{
  assert.equal(estimate({durationMinutes:'30',requestedImages:'5',travelZone:'local'}).total,25);
  assert.equal(estimate({durationMinutes:'120',requestedImages:'20',travelZone:'near'}).total,95);
  assert.equal(estimate({durationMinutes:'all-day',requestedImages:'150',travelZone:'far'}).total,335);
  const custom=estimate({durationMinutes:'60',requestedImages:'10',travelZone:'custom'});
  assert.equal(custom.total,50);assert.equal(custom.customQuote,true);assert.equal(custom.lineItems.at(-1).amount,null);
});
test('invalid photo counts and durations cannot produce a misleading estimate',()=>{
  for(const requestedImages of ['0','6','149','155','5.5','bad'])assert.throws(()=>estimate({durationMinutes:'30',requestedImages,travelZone:'local'}));
  assert.throws(()=>estimate({durationMinutes:'-30',requestedImages:'5',travelZone:'local'}));
});
test('all sixty existing print photographs remain in the catalog',()=>{
  const catalog=JSON.parse(fs.readFileSync('assets/print-catalog.json','utf8'));assert.equal(catalog.length,60);
  for(const p of catalog)assert.ok(fs.existsSync('assets/'+p.src),p.src);
  assert.equal(new Set(catalog.map(p=>p.src)).size,60);
});
test('print prices match the previously published customer amounts',()=>{
  const js=fs.readFileSync('assets/prints.js','utf8');
  const prices=JSON.parse(js.match(/const PRINT_PRICES = (.*);/)[1]);
  const expected={'Moab Lasal Photo Matte 230':[15.56,37.65,62.35,91.25],'Hahnemühle Photo Rag Matt':[26.67,52.94,78.82,130],'Hahnemühle Cézanne Canvas':[26.67,52.94,78.82,130]};
  for(const [paper,values] of Object.entries(expected))assert.deepEqual(Object.values(prices[paper]),values);
  assert.ok(!js.includes('LAB_COST'));assert.ok(!js.includes('_dev_note'));
});

test('print search finds a photograph by subject, place or file name, not only its title',()=>{
  const catalog=JSON.parse(fs.readFileSync('assets/print-catalog.json','utf8'));
  const find=query=>catalog.filter(p=>printMatchesQuery(p,query)).map(p=>p.title);
  assert.deepEqual(find('woodpecker'),['Quiet attention']);
  assert.ok(find('frog').length>=2,'frog should match more than one photograph');
  assert.ok(find('tram').length>=2,'tram should match the transit photographs');
  assert.ok(find('nature').length>=19,'the Nature / Wild category should be searchable');
  assert.ok(find('  FROG  ').length>=2,'search should ignore case and surrounding spaces');
  assert.equal(find('frog portrait').length,0,'every word in a query has to match');
  assert.equal(find('').length,catalog.length,'an empty query keeps the whole catalog');
});

test('booking entry intent survives the login round trip',()=>{
  const js=fs.readFileSync('assets/booking.js','utf8');
  assert.match(js,/const entryType=new URLSearchParams\(location\.search\)\.get\('type'\)/);
  assert.match(js,/form\.reset\(\);applyEntryType\(\)/,'the signed-out reset must reapply the entry type');
  assert.match(js,/else applyEntryType\(\)/,'a saved draft still takes precedence over the entry type');
  assert.ok(js.includes("url.searchParams.set('return',returnPath)"),'login links must carry the intent');
  const html=fs.readFileSync('book/index.html','utf8');
  assert.ok(html.includes('booking.js?v=20261123-intent'),'the booking script needs a new cache-busting version');
  assert.ok(fs.readFileSync('prints/index.html','utf8').includes('prints.js?v=20261123-search'));
});
