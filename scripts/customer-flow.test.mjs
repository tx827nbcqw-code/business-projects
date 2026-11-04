import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
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
