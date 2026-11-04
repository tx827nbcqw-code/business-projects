import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
for(const page of ['index.html','book/index.html','prints/index.html','dashboard/index.html']){
 const html=fs.readFileSync(page,'utf8');
 for(const m of html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);
 for(const m of html.matchAll(/(?:src|href)="([^"?#]+)(?:[?#][^"]*)?"/g)){const path=m[1];if(/^(https?:|data:|mailto:|tel:)/.test(path)||path.endsWith('/'))continue;const local=path.startsWith('/')?path.slice(1):new URL(path,'file:///'+page).pathname.slice(1);assert.ok(fs.existsSync(local),'Missing asset '+local);}
}
for(const name of ['booking.js','print-inquiry.js','portfolio-stories.js'])new vm.Script(fs.readFileSync('assets/'+name,'utf8'));
const items=JSON.parse(fs.readFileSync('assets/portfolio-stories.json','utf8'));for(const x of items)assert.ok(fs.existsSync('assets/'+x.src),'Missing photograph '+x.src);
assert.equal(fs.readFileSync('book/index.html','utf8').includes('Confirm Inquiry'),true);
console.log('Website scripts and portfolio asset references verified.');
