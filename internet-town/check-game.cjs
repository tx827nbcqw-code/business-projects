const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(require('path').join(__dirname,'index.html'),'utf8');
const nodes=new Map();class Node{constructor(){this.style={};this.value=0;this.innerHTML='';this.textContent='';this.open=false;this.disabled=false;this.classList={add(){},remove(){}}}focus(){}getContext(){return new Proxy({},{get:(o,k)=>()=>{}})}addEventListener(){}showModal(){this.open=true}close(){this.open=false}appendChild(n){}click(){}querySelectorAll(q){return Array.from({length:4},()=>new Node())}}
const node=id=>{if(!nodes.has(id))nodes.set(id,new Node());return nodes.get(id)};let stored=null;
let ctx={console,Math,Date,JSON,Set,Number,Infinity,Blob,URL:{createObjectURL(){return 'blob:test'},revokeObjectURL(){}},localStorage:{getItem(){return stored},setItem(k,v){stored=v}},document:{documentElement:{outerHTML:'<html></html>'},getElementById:node,querySelector:node,createElement(){return new Node()},addEventListener(){}},setTimeout(){},setInterval(){return 1},clearInterval(){},confirm(){return true},window:{addEventListener(){}},requestAnimationFrame(){return 1},cancelAnimationFrame(){}};vm.createContext(ctx);vm.runInContext(html.match(/<script>([\s\S]*)<\/script>/)[1],ctx);const run=s=>vm.runInContext(s,ctx);
assert(!/https?:\/\//.test(html),'No remote asset dependencies');
for(let id of ['cafe','photo','kitchen','supply','school']){
 run(`openGame('${id}')`);
 if(id==='cafe')run(`$('leaf').value=game.grams*game.cups;$('water').value=game.grams*game.cups*game.ratio;serve()`);
 if(id==='photo')run(`game.ap=0;game.sh=game.motion?-Math.max(0,game.target):0;game.iso=-game.target-game.sh;['ap','sh','iso'].forEach(id=>$(id).value=game[id]);shoot()`);
 if(id==='kitchen')run(`game.order=[0,1,2,3,4];checkRecipe()`);
 if(id==='supply')run(`{let q=[[0]],seen=new Set([0]);while(q.length){let p=q.shift(),n=p.at(-1);if(n===24){game.path=p;break}for(let v of neighbors(n))if(!seen.has(v)&&!game.blocks.includes(v)){seen.add(v);q.push([...p,v])}}deliver()}`);
 if(id==='school')run(`answer(game.answer,{})`);
 assert(run('game.done'),id+' puzzle completes');
 run(`switchMode('arcade')`);
 if(id==='cafe')run(`startRush(false);for(let i=0;i<5;i++){game.cup={base:game.queue[i].base,fruit:game.queue[i].fruit,sweet:game.queue[i].sweet};rushServe()}`);
 if(id==='photo')run(`for(let i=0;i<3;i++){game.subject={...game.target};captureFrame()}`);
 if(id==='kitchen')run(`game.ready=true;game.sequence.forEach(i=>memoryTap(i))`);
 if(id==='supply')run(`{let w=game.w,q=[{p:w.player,b:w.box,m:[]}],seen=new Set();while(q.length){let c=q.shift(),key=c.p+','+c.b;if(seen.has(key))continue;seen.add(key);if(c.b===w.goal){for(let d of c.m)warehouseMove(d);break}for(let d of [-6,6,-1,1]){let p=c.p+d,b=c.b;if(w.walls.includes(p)||p<0||p>=36)continue;if(p===b){b+=d;if(w.walls.includes(b)||b<0||b>=36)continue}q.push({p,b,m:[...c.m,d]})}}}`);
 if(id==='school')run(`reward(20,game.phrase.why)`);
 assert(run('game.done'),id+' arcade completes');
 run('closeGame()');
}
assert.equal(run('Object.values(state.wins).reduce((a,b)=>a+b,0)'),10);
let before=run('state.coins');run(`buy('garden')`);assert.equal(run('state.coins'),before-50);assert(run(`state.decor.includes('garden')`));
run('upgradeTown()');assert.equal(run('state.town'),2);
run(`openGame('school');mode='puzzle';school();answer(-999,{disabled:false})`);assert.equal(run('game.done'),false);
for(let i=0;i<150;i++){run(`openGame('supply')`);assert(run('Number.isFinite(game.optimal)'));run(`switchMode('arcade')`);let solved=run(`(()=>{let w=game.w,q=[{p:w.player,b:w.box}],seen=new Set();while(q.length){let c=q.shift(),key=c.p+','+c.b;if(seen.has(key))continue;seen.add(key);if(c.b===w.goal)return true;for(let d of [-6,6,-1,1]){let p=c.p+d,b=c.b;if(w.walls.includes(p)||p<0||p>=36)continue;if(p===b){b+=d;if(w.walls.includes(b)||b<0||b>=36)continue}q.push({p,b})}}return false})()`);assert(solved,'Warehouse is solvable '+run('JSON.stringify(game.w)'))}
console.log('PASS: all 10 activities complete; rewards, purchases, town upgrades, wrong-answer guard, and 150 route/warehouse generations.');
console.log('PASS: no external links, scripts, fonts or assets. Save payload valid:',JSON.parse(stored).version===1);

run('if(!walking)toggleWalk();drawWorld(100);moveWalker(20,0);worldProximity();toggleWalk()');assert.equal(run('walking'),false);console.log('PASS: walk view render, movement and proximity routines execute.');
run(`claimQuest(0)`);let claimedCoins=run('state.coins');run(`claimQuest(0)`);assert.equal(run('state.coins'),claimedCoins);console.log('PASS: quest rewards cannot be claimed twice.');
run(`state.xp.supply=600`);for(let i=0;i<100;i++){run(`openGame('supply');switchMode('arcade')`);assert(run('solveWarehouse(game.w).length>0'),'Generated advanced warehouse must be solvable')}
console.log('PASS: 100 higher-level generated warehouses have solutions.');
run(`state.xp.cafe=900;openGame('cafe');switchMode('arcade');startRush(false);for(let i=0;i<game.orderCount;i++){game.cup={base:game.queue[i].base,fruit:game.queue[i].fruit,sweet:game.queue[i].sweet};rushServe()}`);assert(run('game.done'));assert(run('game.orderCount>5'));console.log('PASS: higher-level café shifts scale up and remain completable.');

run(`state.coins=500;customize();buyCosmetic('terracotta')`);assert.equal(run('state.coins'),465);assert.equal(run('state.look.outfit'),'terracotta');run(`buyCosmetic('terracotta')`);assert.equal(run('state.coins'),465);run(`buyCosmetic('autumn')`);assert.equal(run('state.look.theme'),'autumn');assert.equal(run('state.coins'),365);run(`buyCosmetic('cap')`);assert.equal(run('state.look.hat'),'cap');console.log('PASS: cosmetics charge once, equip free, and apply world theme.');
run(`state.coins=500;visitDestination('valencia')`);assert.equal(run('state.coins'),440);run(`visitDestination('home');visitDestination('valencia')`);assert.equal(run('state.coins'),440);assert.equal(run('state.destination'),'valencia');
run(`state.coins=0;visitDestination('cairo')`);assert.equal(run('state.destination'),'valencia');
run(`state.coins=500;adoptPet('dog');adoptPet('dog')`);assert.equal(run('state.coins'),455);assert.equal(run('state.pet'),'dog');
for(const id of run('destinations.map(d=>d.id)')){run(`state.coins=10000;visitDestination('${id}');drawWorld(400);destinationChallenge();answerTravel(-999)`);assert.equal(run('travelRound.step'),0);for(let i=0;i<3;i++)run('answerTravel(travelRound.answer)');assert(run('travelRound.done'));let coins=run('state.coins');run('answerTravel(travelRound.answer)');assert.equal(run('state.coins'),coins);assert(run(`state.travelWins['${id}']>0`));}
run(`state=JSON.parse(localStorage.getItem(KEY));ensureTravel()`);assert.equal(run('state.pet'),'dog');assert(run(`state.destinations.includes('valencia')`));console.log('PASS: all destination rendering/adventures, one-time unlocks/adoptions, insufficient funds, duplicate reward guard, save restoration.');

run(`openGame('photo');game.target=2;game.motion=true;game.ap=3;game.sh=3;game.iso=3;$('ap').value=0;$('sh').value=-2;$('iso').value=0;shoot()`);assert(run('game.done'),'Shot must read current controls rather than stale slider state');
run(`openGame('photo');switchMode('arcade');game.subject={x:game.target.x+8,y:game.target.y};captureFrame()`);assert.equal(run('game.frames'),1);assert(run(`$('feedback').textContent.includes('accepted')`),'Successful frame feedback persists');console.log('PASS: current slider readings, touch-friendly framing tolerance and visible accepted-shot feedback.');

for(const id of ['ops','acct','law','comm','lit']){run(`openGame('school');chooseSchoolClass('${id}')`);assert.equal(run('game.course'),id);run('answer(game.answer,{})');assert(run('game.done'));}console.log('PASS: all five selectable classes generate and complete questions.');
const pack=JSON.parse(fs.readFileSync(require('path').join(__dirname,'questions.json'),'utf8'));ctx.testPack=pack;assert(run('applyQuestionPack(testPack)'));assert.equal(run('questionPackVersion'),pack.version);run('localStorage.setItem(QUESTION_PACK_KEY,JSON.stringify({pack:testPack,checked:"2026-10-14T23:00:00Z"}));questionPackVersion="reset";loadQuestionPack()');assert.equal(run('questionPackVersion'),pack.version);ctx.badPack={...pack,classes:{...pack.classes,law:[['bad']]}};assert(!run('applyQuestionPack(badPack)'));assert.equal(run('questionPackVersion'),pack.version);console.log('PASS: offline question-pack restoration and invalid-pack rejection preserve working questions.');
