import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import {app} from '../index.js';
import {db} from '../db/database.js';

test('P0: legacy learner routes reject cross-family writes and withdrawn consent', async()=>{
  const otherUser='usr-p0-family-'+Date.now();
  const otherGuardian='par-p0-family-'+Date.now();
  const otherEmail=otherUser+'@example.test';
  db.prepare('INSERT INTO users(id,name,email,role,password_hash) VALUES(?,?,?,?,?)')
    .run(otherUser,'Other Family',otherEmail,'parent',bcrypt.hashSync('OtherFamily#2026',10));
  db.prepare('INSERT INTO guardians(id,user_id,parent_pin) VALUES(?,?,?)')
    .run(otherGuardian,otherUser,bcrypt.hashSync('4927',10));
  const server=app.listen(0,'127.0.0.1');
  await new Promise(r=>server.once('listening',r));
  const base='http://127.0.0.1:'+server.address().port;
  const call=async(path,token,body)=> {
    const response=await fetch(base+path,{method:'POST',
      headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},
      body:JSON.stringify(body)});
    return response;
  };
  try{
    const auth=await call('/api/v1/auth/login','unused',{email:otherEmail,password:'OtherFamily#2026'});
    assert.equal(auth.status,200);
    const {token}=await auth.json();
    let res=await call('/api/v1/doubts/ask',token,{studentId:'stu-001',text:'What is 2 plus 2?'});
    assert.equal(res.status,403);
    res=await call('/api/v1/school/tests/not-a-real-test/submit',token,{studentId:'stu-001',answers:{}});
    assert.equal(res.status,403);
    res=await call('/api/v1/school/chapters/ch01/episodes/ep01/checkpoint',token,{studentId:'stu-001',scorePercent:100});
    assert.equal(res.status,403);
    const mistake=db.prepare("SELECT id FROM mistake_notebook WHERE student_id='stu-001' LIMIT 1").get();
    assert.ok(mistake);
    res=await call('/api/v1/mistakes/'+mistake.id+'/resolve',token,{});
    assert.equal(res.status,403);
    res=await call('/api/v1/parent/notify/report-card',token,{studentId:'stu-001',month:'2026-10'});
    assert.equal(res.status,403);

    const own=await call('/api/v1/auth/login','unused',{email:'guardian@vayentra.org',password:'Gurukula@2026'});
    assert.equal(own.status,200);
    const {token:ownerToken}=await own.json();
    db.prepare("UPDATE students SET has_consent=0 WHERE id='stu-001'").run();
    res=await call('/api/v1/doubts/ask',ownerToken,{studentId:'stu-001',text:'What is water?'});
    assert.equal(res.status,403);
    assert.equal((await res.json()).code,'GUARDIAN_CONSENT_WITHDRAWN');
  } finally {
    db.prepare("UPDATE students SET has_consent=1 WHERE id='stu-001'").run();
    await new Promise(r=>server.close(r));
  }
});
