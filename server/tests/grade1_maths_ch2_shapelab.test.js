import {before,after,test} from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {app} from '../index.js';
import {db} from '../db/database.js';
import {GRADE1_MATHS_CHAPTER2} from '../data/grade1MathsChapter2.js';

let server,base,admin,parent,student,teacher,reviewer;
async function call(path,token,method='GET',body){
 const response=await fetch(base+path,{method,headers:{
  ...(body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{})
 },body:body?JSON.stringify(body):undefined});
 return {status:response.status,body:await response.json()};
}
async function login(email){
 const res=await call('/api/v1/auth/login',null,'POST',{email,password:'Gurukula@2026'});
 assert.equal(res.status,200,JSON.stringify(res.body));return res.body.token;
}
before(async()=>{
 await new Promise(resolve=>{
  server=http.createServer(app);server.listen(0,'127.0.0.1',()=>{
   base='http://127.0.0.1:'+server.address().port;resolve();
  });
 });
 [admin,parent,student,teacher,reviewer]=await Promise.all([
  login('admin@vayentra.org'),login('guardian@vayentra.org'),
  login('student@vayentra.org'),login('teacher@vayentra.org'),login('reviewer@vayentra.org')
 ]);
});
after(async()=>{if(server)await new Promise(resolve=>server.close(resolve));});
test('Class 1 Chapter 2 original package: 10 unpublished scenes, 40 private answers and valid concepts',()=>{
 assert.equal(GRADE1_MATHS_CHAPTER2.chapterNumber,2);
 assert.equal(GRADE1_MATHS_CHAPTER2.chapterTitle,'What is Long? What is Round?');
 assert.equal(GRADE1_MATHS_CHAPTER2.lessons.length,10);
 assert.equal(GRADE1_MATHS_CHAPTER2.lessons.reduce((n,u)=>n+u.questions.length,0),40);
 assert.ok(GRADE1_MATHS_CHAPTER2.lessons.every(u=>u.story.length>450&&u.steps.length>=4&&u.lab.choices.length>=3));
 assert.ok(GRADE1_MATHS_CHAPTER2.lessons.every(u=>u.questions.every(q=>q.correctIndex>=0&&q.correctIndex<q.options.length)));
 const unitFilter="one-fdn-one-g1-maths-ch2-%";
 assert.equal(db.prepare('SELECT COUNT(*) AS n FROM one_foundation_units WHERE unit_key LIKE ?').get(unitFilter).n,10);
 assert.equal(db.prepare('SELECT COUNT(*) AS n FROM one_foundation_shape_labs WHERE unit_id LIKE ?').get(unitFilter).n,10);
 assert.equal(db.prepare('SELECT COUNT(*) AS n FROM one_foundation_questions WHERE unit_id LIKE ?').get(unitFilter).n,40);
 assert.equal(db.prepare("SELECT COUNT(*) AS n FROM one_foundation_units WHERE unit_key LIKE ? AND status='published'").get(unitFilter).n,0);
 const rows=db.prepare(`
  SELECT c.position,c.title FROM one_concepts c
  JOIN one_chapters ch ON ch.id=c.chapter_id
  JOIN one_subjects s ON s.id=ch.subject_id
  JOIN one_curriculum_tracks t ON t.id=s.track_id
  WHERE t.board='CBSE' AND t.grade=1 AND t.edition_year='2026-27'
    AND s.subject_title='Mathematics' AND ch.chapter_number=2 ORDER BY c.position
 `).all();
 assert.equal(rows.length,10);
 assert.deepEqual(rows.map(r=>r.position),[1,2,3,4,5,6,7,8,9,10]);
});
test('Class 1 Shape Lab: source verification, review, safe guardian access, grading and withdrawal',async()=>{
 const unitId='one-fdn-one-g1-maths-ch2-long-or-round';
 const unitBefore=db.prepare('SELECT * FROM one_foundation_units WHERE id=?').get(unitId);
 assert.ok(unitBefore);
 const conceptBefore=db.prepare('SELECT * FROM one_concepts WHERE id=?').get(unitBefore.concept_id);
 const linked=db.prepare(`
  SELECT sub.id AS subject_id,sub.review_status AS subject_status,
   ch.id AS chapter_id,ch.review_status AS chapter_status,
   t.id AS track_id,t.catalogue_status AS track_status,t.verified_at AS track_verified_at
  FROM one_foundation_units u
  JOIN one_concepts c ON c.id=u.concept_id
  JOIN one_chapters ch ON ch.id=c.chapter_id
  JOIN one_subjects sub ON sub.id=ch.subject_id
  JOIN one_curriculum_tracks t ON t.id=sub.track_id WHERE u.id=?
 `).get(unitId);
 const evidence=['G1-CH2-TRACK-CHECK-2026','G1-CH2-MATHS-SUBJECT-2026','G1-CH2-CHAPTER-REVIEW-2026'];
 let applicationId=null,childId=null;
 try{
  assert.equal((await call('/api/v1/grade1/editor/map?board=CBSE',parent)).status,403);
  const entry=await call('/api/v1/one-onboarding/guardian/applications',parent,'POST',{
   childName:'Fictional Shapes Lab Test Child',grade:1,board:'CBSE',academicYear:'2026-27',
   guardianAcknowledgement:true,idempotencyKey:'ch2-test-guardian-admission-2026'
  });
  assert.equal(entry.status,201,JSON.stringify(entry.body));applicationId=entry.body.application.id;
  const review=await call('/api/v1/one-onboarding/admin/applications/'+applicationId+'/approve',admin,'POST',{
   confirmed:true,verificationMethod:'verified_in_person',evidenceReference:'CH2-FICTITIOUS-GUARDIAN-CASE'
  });
  assert.equal(review.status,201,JSON.stringify(review.body));childId=review.body.studentId;
  const prefix='/api/v1/grade1/guardian/'+encodeURIComponent(childId);
  assert.equal((await call(prefix+'/units/'+unitId,parent)).status,403,'No approved learning access initially.');
  assert.equal((await call(prefix+'/catalogue',student)).status,403,'Unrelated student blocked.');
  assert.equal((await call('/api/v1/grade1/me/units/'+unitId,parent)).status,403,'Parent cannot impersonate student.');
  const trial=await call('/api/v1/grade1/admin/pilot-grants',admin,'POST',{
   studentId:childId,reason:'Fictional supervised Class One geometry evaluation',
   expiresAt:new Date(Date.now()+9*86400000).toISOString()
  });
  assert.equal(trial.status,200,JSON.stringify(trial.body));assert.equal(trial.body.paidAccessChanged,false);
  assert.equal((await call(prefix+'/units/'+unitId,parent)).status,404,'Draft cannot leak even with pilot.');
  assert.equal((await call('/api/v1/grade1/editor/units/'+unitId+'/publish',admin,'POST',{
   rightsVerified:true,originalWorkReference:'CH2-ORIGINAL-RIGHTS-2026'
  })).status,409);
  assert.equal((await call('/api/v1/grade1/editor/units/'+unitId+'/request-review',teacher,'POST',{
   editorialReference:'CH2-TEACHER-QUALITY-CASE-2026'
  })).status,200);
  assert.equal((await call('/api/v1/grade1/editor/units/'+unitId+'/review',reviewer,'POST',{
   decision:'approved',academicReviewReference:'CH2-INDEPENDENT-MATHS-CHECK'
  })).status,200);
  assert.equal((await call('/api/v1/grade1/editor/units/'+unitId+'/publish',admin,'POST',{
   rightsVerified:true,originalWorkReference:'CH2-ORIGINAL-RIGHTS-2026'
  })).status,409,'Textbook track, subject, chapter not yet verified.');
  assert.equal((await call('/api/v1/one-content/admin/tracks/'+linked.track_id+'/verify',admin,'POST',{
   editorialReference:evidence[0]
  })).status,200);
  assert.equal((await call('/api/v1/one-content/admin/subjects/'+linked.subject_id+'/approve',admin,'POST',{
   academicReviewReference:evidence[1]
  })).status,200);
  assert.equal((await call('/api/v1/one-content/admin/chapters/'+linked.chapter_id+'/approve',admin,'POST',{
   academicReviewReference:evidence[2]
  })).status,200);
  const published=await call('/api/v1/grade1/editor/units/'+unitId+'/publish',admin,'POST',{
   rightsVerified:true,originalWorkReference:'CH2-ORIGINAL-RIGHTS-2026'
  });
  assert.equal(published.status,200,JSON.stringify(published.body));
  const unit=await call(prefix+'/units/'+unitId,parent);
  assert.equal(unit.status,200,JSON.stringify(unit.body));
  assert.equal(unit.body.lesson.shapeLab.kind,'long-round');
  assert.deepEqual(unit.body.lesson.shapeLab.choices,['ribbon','ball','rolling-pin']);
  assert.equal(unit.body.lesson.guidedSteps.length,4);
  assert.equal(unit.body.lesson.questions.length,4);
  assert.equal(Object.hasOwn(unit.body.lesson.questions[0],'correctIndex'),false);
  assert.equal(Object.hasOwn(unit.body.lesson.questions[0],'explanation'),false);
  const keys=[0,0,0,0],key='ch2-shapes-practice-2026-001';
  const first=await call(prefix+'/attempts',parent,'POST',{unitId,answers:keys,idempotencyKey:key});
  assert.equal(first.status,201,JSON.stringify(first.body));assert.equal(first.body.correct,4);
  const replay=await call(prefix+'/attempts',parent,'POST',{unitId,answers:keys,idempotencyKey:key});
  assert.equal(replay.status,200);assert.equal(replay.body.replayed,true);
  assert.equal((await call(prefix+'/attempts',parent,'POST',{unitId,answers:[1,1,1,1],idempotencyKey:key})).status,409);
  const progress=await call(prefix+'/catalogue',parent);
  assert.equal(progress.status,200);assert.equal(progress.body.progress.checkedLessons,1);
  const withdrawal=await call('/api/v1/grade1/editor/units/'+unitId+'/withdraw',admin,'POST',{
   reason:'Fictional test case: post-publication correction requested.'
  });
  assert.equal(withdrawal.status,200);
  assert.equal((await call(prefix+'/units/'+unitId,parent)).status,404);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM one_foundation_attempts WHERE student_id=?').get(childId).n,1);
 }finally{
  // ONLY disposable test DB. Never use this suite against real child records.
  if(childId){
   db.prepare('DELETE FROM one_foundation_attempts WHERE student_id=?').run(childId);
   db.prepare('DELETE FROM one_foundation_pilot_grants WHERE student_id=?').run(childId);
   db.prepare('DELETE FROM one_journey_audit WHERE student_id=?').run(childId);
   db.prepare('DELETE FROM one_academic_years WHERE student_id=?').run(childId);
   db.prepare('DELETE FROM one_consent_reviews WHERE student_id=?').run(childId);
   db.prepare('DELETE FROM one_memberships WHERE student_id=?').run(childId);
  }
  if(applicationId)db.prepare('DELETE FROM one_admission_applications WHERE id=?').run(applicationId);
  if(childId)db.prepare('DELETE FROM students WHERE id=?').run(childId);
  db.prepare('DELETE FROM one_foundation_reviews WHERE unit_id=?').run(unitId);
  db.prepare('DELETE FROM one_content_review_logs WHERE editorial_reference IN (?,?,?)').run(...evidence);
  db.prepare('UPDATE one_curriculum_tracks SET catalogue_status=?,verified_at=? WHERE id=?')
   .run(linked.track_status,linked.track_verified_at,linked.track_id);
  db.prepare('UPDATE one_subjects SET review_status=? WHERE id=?')
   .run(linked.subject_status,linked.subject_id);
  db.prepare('UPDATE one_chapters SET review_status=? WHERE id=?')
   .run(linked.chapter_status,linked.chapter_id);
  db.prepare('UPDATE one_concepts SET content_status=?,reviewer_id=?,reviewed_at=? WHERE id=?')
   .run(conceptBefore.content_status,conceptBefore.reviewer_id,conceptBefore.reviewed_at,unitBefore.concept_id);
  db.prepare(`
   UPDATE one_foundation_units SET status=?,reviewer_id=?,review_reference=?,reviewed_at=?,publisher_id=?,published_at=?
   WHERE id=?
  `).run(unitBefore.status,unitBefore.reviewer_id,unitBefore.review_reference,
   unitBefore.reviewed_at,unitBefore.publisher_id,unitBefore.published_at,unitId);
 }
});
