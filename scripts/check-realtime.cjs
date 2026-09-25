const { Client } = require('@stomp/stompjs');
const SockJS = require('sockjs-client');
const base = process.env.API_URL || 'http://localhost:8081';
async function login(email) {
 const r=await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password:'password123'})});
 if(!r.ok)throw new Error('Login failed');return (await r.json()).token;
}
async function connect(token) {
 return new Promise((resolve,reject)=>{
  const client = new Client({webSocketFactory:()=>new SockJS(base+'/ws'),connectHeaders:{Authorization:'Bearer '+token},reconnectDelay:0,onConnect:()=>resolve(client),onStompError:f=>reject(new Error(f.headers.message))});
  client.activate();
 });
}
(async()=>{
 let trader,admin;
 const timeout=setTimeout(()=>{console.error('Realtime test timed out');process.exit(1)},20000);
 try {
  trader=await connect(await login('trader@cargoshare.com'));
  const delivered=new Promise(resolve=>trader.subscribe('/topic/chat/2_3',m=>resolve(JSON.parse(m.body))));
  await new Promise(r=>setTimeout(r,500));
  const token=await login('provider@cargoshare.com');
  const r=await fetch(base+'/api/chat/messages',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({receiverId:2,message:'Verified real-time delivery'})});
  if(!r.ok)throw new Error('Send failed');
  const message=await delivered;
  if(message.content!=='Verified real-time delivery')throw new Error('Unexpected message');
  console.log('PASS: authenticated real-time message delivery');
  admin=await connect(await login('admin@cargoshare.com'));
  const blocked=new Promise(resolve=>{admin.onStompError=()=>resolve();});
  admin.subscribe('/topic/chat/2_3',()=>{throw new Error('Private message leaked')});
  await blocked;
  console.log('PASS: unrelated user cannot subscribe to private chat');
 } finally { clearTimeout(timeout); await trader?.deactivate();await admin?.deactivate(); }
})().catch(e=>{console.error(e);process.exit(1)});
