import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

test('MVP: authentication, SDR simulation, CS tasks and meetings',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'code-pro-ai-'));
 const port=32000+Math.floor(Math.random()*2000);
 const token='test-token-strong-admin';
 const child=spawn(process.execPath,['server.js'],{cwd:process.cwd(),env:{...process.env,PORT:String(port),ADMIN_TOKEN:token,WEBHOOK_TOKEN:'test-token-webhook',OPENWA_WEBHOOK_SECRET:'test-secret-hmac',DATA_FILE:join(dir,'state.json'),SEND_ENABLED:'false',AI_ENABLED:'false'},stdio:'pipe'});
 const base='http://127.0.0.1:'+port;
 const api=async(path,method='GET',data,authorization=true)=>{
   const response=await fetch(base+path,{method,headers:{...(authorization?{Authorization:'Bearer '+token}:{}),'Content-Type':'application/json'},body:data?JSON.stringify(data):undefined});
   return {status:response.status,data:await response.json()}
 };
 try{
   let ready=false;
   for(let i=0;i<50;i++){try{const r=await fetch(base+'/health');if(r.ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,100))}
   assert.ok(ready,'server started');
   assert.equal((await api('/api/overview','GET',null,false)).status,401);
   assert.equal((await api('/api/overview')).data.total,0);
   const lead=(await api('/api/contacts','POST',{name:'Lead Teste',type:'sdr'})).data;
   assert.equal(lead.status,'novo');
   const answer=(await api('/api/contacts/'+lead.id+'/message','POST',{text:'Quero começar na Amazon'})).data;
   assert.ok(answer.reply);
   assert.equal(answer.delivery.sent,false);
   const cs=(await api('/api/contacts','POST',{name:'Mentorado Teste',type:'cs'})).data;
   assert.equal(cs.status,'onboarding');
   assert.equal((await api('/api/contacts/'+cs.id+'/tasks','POST',{title:'Pesquisar 10 produtos'})).status,201);
   assert.equal((await api('/api/contacts/'+cs.id+'/meetings','POST',{title:'Encontro 1',date:'2026-10-15'})).status,201);
   const stored=(await api('/api/contacts/'+cs.id)).data;
   assert.equal(stored.tasks.length,1);
   assert.equal(stored.meetings.length,1);
   assert.equal((await api('/webhooks/openwa','POST',{data:{message:{from:'5511999999999@c.us',body:'Oi'}}})).status,401);
   const webhookData=JSON.stringify({data:{message:{id:'msg-signed',from:'5511999999999@c.us',body:'Oi'}}});
   const signature='sha256='+crypto.createHmac('sha256','test-secret-hmac').update(webhookData).digest('hex');
   const posted=await fetch(base+'/webhooks/openwa?token=test-token-webhook',{method:'POST',headers:{'Content-Type':'application/json','X-OpenWA-Signature':signature,'X-OpenWA-Idempotency-Key':'message-1'},body:webhookData});
   assert.equal(posted.status,200);
   const duplicated=await fetch(base+'/webhooks/openwa?token=test-token-webhook',{method:'POST',headers:{'Content-Type':'application/json','X-OpenWA-Signature':signature,'X-OpenWA-Idempotency-Key':'message-1'},body:webhookData});
   assert.equal((await duplicated.json()).duplicate,true);
   assert.equal((await api('/api/overview')).data.total,3);
 }finally{child.kill();rmSync(dir,{recursive:true,force:true})}
});
