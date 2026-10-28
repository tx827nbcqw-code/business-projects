const endpoint='https://ai-gateway.vercel.sh/v1/chat/completions';
export async function generateWithGateway({apiKey,model,instructions,maxTokens=1300,timeoutMs=24000,fetchImpl=fetch}) {
 if(!apiKey||!model)throw new Error('Missing Gateway setup.');
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);
 try {
  const r=await fetchImpl(endpoint,{method:'POST',headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json'},body:JSON.stringify({model,messages:[{role:'user',content:instructions}],max_tokens:maxTokens}),signal:controller.signal});
  if(!r.ok)throw new Error('Gateway HTTP '+r.status+'; inspect model, billing and key.');
  const j=await r.json(),c=j?.choices?.[0]?.message?.content;
  const answer=typeof c==='string'?c:Array.isArray(c)?c.filter(x=>x?.type==='text').map(x=>x.text).join('\n'):'';
  if(!answer.trim())throw new Error('No usable model text.');
  return {text:answer,model:j.model||model,usage:j.usage||null};
 }catch(e){if(controller.signal.aborted)throw new Error('Gateway timeout');throw e}finally{clearTimeout(timer)}
}
