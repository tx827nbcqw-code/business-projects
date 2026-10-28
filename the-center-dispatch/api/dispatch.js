import crypto from 'node:crypto';
import {dispatch} from '../lib/dispatch.js';
function authorized(received,expected){
 if(!expected||expected.length<20||typeof received!=='string')return false;
 return crypto.timingSafeEqual(crypto.createHash('sha256').update(received).digest(),crypto.createHash('sha256').update(expected).digest());
}
async function bodyJson(req){
 if(req.body&&typeof req.body==='object')return req.body;
 if(typeof req.body==='string')return JSON.parse(req.body);
 let body='';for await(const chunk of req){body+=chunk.toString();if(body.length>28000)throw Error('Request too large')}
 return JSON.parse(body||'{}');
}
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='POST')return res.status(405).json({error:'POST required'});
 const {AI_GATEWAY_API_KEY:key,CENTER_ACCESS_TOKEN:token,OPENAI_MODEL:openaiModel,ANTHROPIC_MODEL:claudeModel}=process.env;
 if(!key||!token||token.length<20||!openaiModel||!claudeModel)return res.status(503).json({error:'Setup required: private key, access token and model IDs.'});
 if(!authorized((req.headers.authorization||'').replace(/^Bearer\s+/i,''),token))return res.status(401).json({error:'Invalid access code'});
 try{
  const b=await bodyJson(req),message=typeof b.message==='string'?b.message.trim():'';
  if(!message||message.length>11000)return res.status(400).json({error:'Message must be 1–11,000 characters.'});
  const pref=['auto','quick','best','independent'].includes(b.preference)?b.preference:'auto';
  const result=await dispatch({message,preference:pref,key,openaiModel,claudeModel});
  return res.status(result.status==='failed'?502:200).json(result);
 }catch(e){return res.status(400).json({error:e instanceof SyntaxError?'Invalid JSON.':'Unable to complete request. Inspect server logs.'})}
}
