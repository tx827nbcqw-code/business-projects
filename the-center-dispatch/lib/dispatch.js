import {chooseRoute,workerInstructions,synthesisInstructions} from './router.js';
import {generateWithGateway} from './gateway.js';
export async function dispatch({message,preference='auto',key,openaiModel,claudeModel,invoke=generateWithGateway}) {
 const route=chooseRoute(message,preference),prompts=workerInstructions(route.kind,message),started=Date.now();
 const models=route.kind==='single'?[openaiModel]:[openaiModel,claudeModel];
 const responses=await Promise.allSettled(models.map((model,i)=>invoke({apiKey:key,model,instructions:prompts[i]})));
 const ok=responses.flatMap((r,i)=>r.status==='fulfilled'?[{index:i,...r.value}]:[]);
 const failures=responses.flatMap((r,i)=>r.status==='rejected'?[{worker:i+1,error:String(r.reason?.message||r.reason)}]:[]);
 if(!ok.length)return {status:'failed',route,workers:[],failures,answer:'',elapsedMs:Date.now()-started};
 let answer=ok[0].text,integrator=null;
 if(ok.length===2){try {
  const x=await invoke({apiKey:key,model:openaiModel,instructions:synthesisInstructions(route.kind,message,ok[0].text,ok[1].text),maxTokens:1800,timeoutMs:26000});
  answer=x.text;integrator={model:x.model,usage:x.usage};
 }catch(e){failures.push({worker:'integrator',error:String(e.message||e)});answer='Integration failed; these are UNMERGED outputs.\n\nA:\n'+ok[0].text+'\n\nB:\n'+ok[1].text}}
 return {status:failures.length?'partial':'completed',route,workers:ok.map(x=>({role:x.index===0?'OpenAI':'Claude',model:x.model,text:x.text,usage:x.usage})),integrator,failures,answer,elapsedMs:Date.now()-started,caveat:'No external actions and no automated source verification were performed.'};
}
