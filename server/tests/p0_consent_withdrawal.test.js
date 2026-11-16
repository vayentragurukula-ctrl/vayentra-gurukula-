import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../index.js';
import { db } from '../db/database.js';
import { seedAndPublishGrade1Curriculum } from '../services/seedAndPublishGrade1Curriculum.js';

test('P0: verified guardian can withdraw consent and immediately suspend learner access', async () => {
  seedAndPublishGrade1Curriculum(db);
  const studentId = 'stu-g1-001'; // Isolated test fixture, not a real learner.
  assert.equal(db.prepare('SELECT has_consent FROM students WHERE id=?').get(studentId).has_consent, 1);
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  const request = async (path, token=null, method='GET', data=null) => {
    const response = await fetch(base + path, {
      method,
      headers: {'Content-Type':'application/json', ...(token ? {'Authorization':'Bearer '+token} : {})},
      ...(data ? {body:JSON.stringify(data)} : {})
    });
    return {status:response.status,body:await response.json()};
  };
  try {
    const login = await request('/api/v1/auth/login',null,'POST',{
      email:'guardian@vayentra.org',password:'Gurukula@2026'
    });
    assert.equal(login.status,200);
    const token=login.body.token;
    const path='/api/v1/one-onboarding/guardian/learners/'+studentId+'/withdraw-consent';

    const missingConfirmation=await request(path,token,'POST',{confirmed:false});
    assert.equal(missingConfirmation.status,400);
    assert.equal(db.prepare('SELECT has_consent FROM students WHERE id=?').get(studentId).has_consent,1);

    const revoked=await request(path,token,'POST',{confirmed:true});
    assert.equal(revoked.status,200);
    assert.equal(revoked.body.consentWithdrawn,true);
    assert.equal(db.prepare('SELECT has_consent FROM students WHERE id=?').get(studentId).has_consent,0);
    assert.equal(db.prepare('SELECT entitlement_status FROM one_memberships WHERE student_id=?').get(studentId).entitlement_status,'suspended');

    const again=await request(path,token,'POST',{confirmed:true});
    assert.equal(again.status,200);
    assert.equal(again.body.alreadyWithdrawn,true);

    const guardianLearner=await request('/api/v1/one-onboarding/guardian/learners/'+studentId+'/home',token);
    assert.equal(guardianLearner.status,404);
    const privateOutline=await request('/api/v1/one-content/students/'+studentId+'/outline',token);
    assert.equal(privateOutline.status,403);
  } finally {
    await new Promise((resolve,reject)=>server.close(err=>err?reject(err):resolve()));
  }
});
