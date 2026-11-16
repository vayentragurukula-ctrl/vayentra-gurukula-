import test from 'node:test';
import assert from 'node:assert/strict';
import {app} from '../index.js';
import {db} from '../db/database.js';
import {JWT_SECRET} from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

test('P0: legacy payment paths never record captured payments', async()=>{
  const server=app.listen(0,'127.0.0.1');
  await new Promise(r=>server.once('listening',r));
  try {
    const url='http://127.0.0.1:'+server.address().port;
    const login=await fetch(url+'/api/v1/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'guardian@vayentra.org',password:'Gurukula@2026'})});
    assert.equal(login.status,200);
    const {token}=await login.json();
    const before=db.prepare("SELECT COUNT(*) AS total FROM payments WHERE status='Captured'").get().total;
    for(const path of ['/api/v1/checkout','/api/v1/webhook/payment']){
      const res=await fetch(url+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({paymentId:'fake',orderId:'fake'})});
      assert.equal(res.status,410,path);
    }
    assert.equal(db.prepare("SELECT COUNT(*) AS total FROM payments WHERE status='Captured'").get().total,before);
  }finally{await new Promise(r=>server.close(r))}
});

test('P0: flagged credentials are rejected; versioned JWTs are revoked after reset',async()=>{
  const id='p0-session-fixture-'+Date.now();
  db.prepare('INSERT INTO users (id,name,email,role,password_hash,must_reset_password) VALUES (?,?,?,?,?,1)')
    .run(id,'Security Test','security-'+id+'@example.test','parent',bcrypt.hashSync('OldPassword#2026',10));
  const server=app.listen(0,'127.0.0.1');
  await new Promise(r=>server.once('listening',r));
  const base='http://127.0.0.1:'+server.address().port;
  try{
    const login=await fetch(base+'/api/v1/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'security-'+id+'@example.test',password:'OldPassword#2026'})});
    assert.equal(login.status,403);
    const stale=jwt.sign({userId:id,role:'parent',sessionVersion:0},JWT_SECRET,{expiresIn:'1h'});
    let res=await fetch(base+'/api/v1/auth/me',{headers:{Authorization:'Bearer '+stale}});
    assert.equal(res.status,403);
    db.prepare('UPDATE users SET must_reset_password=0, session_version=session_version+1 WHERE id=?').run(id);
    res=await fetch(base+'/api/v1/auth/me',{headers:{Authorization:'Bearer '+stale}});
    assert.equal(res.status,401);
    assert.equal((await res.json()).code,'SESSION_REVOKED');
  }finally{await new Promise(r=>server.close(r))}
});

test('P0: logout invalidates a previously authenticated session token',async()=>{
  const id='p0-logout-fixture-'+Date.now();
  const email=id+'@example.test';
  db.prepare('INSERT INTO users (id,name,email,role,password_hash) VALUES (?,?,?,?,?)')
    .run(id,'Logout Test',email,'parent',bcrypt.hashSync('StrongPassword#2026',10));
  const server=app.listen(0,'127.0.0.1');
  await new Promise(r=>server.once('listening',r));
  const base='http://127.0.0.1:'+server.address().port;
  try{
    const auth=await fetch(base+'/api/v1/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password:'StrongPassword#2026'})});
    assert.equal(auth.status,200);
    const {token}=await auth.json();
    let res=await fetch(base+'/api/v1/auth/me',{headers:{Authorization:'Bearer '+token}});
    assert.equal(res.status,200);
    res=await fetch(base+'/api/v1/auth/logout',{method:'POST',headers:{Authorization:'Bearer '+token}});
    assert.equal(res.status,200);
    res=await fetch(base+'/api/v1/auth/me',{headers:{Authorization:'Bearer '+token}});
    assert.equal(res.status,401);
    assert.equal((await res.json()).code,'SESSION_REVOKED');
  }finally{await new Promise(r=>server.close(r))}
});
