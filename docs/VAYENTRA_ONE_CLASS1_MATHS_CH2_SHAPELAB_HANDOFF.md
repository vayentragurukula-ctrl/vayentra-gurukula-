# Vayentra ONE — Class 1 Mathematics Chapter 2: Shape Discovery Lab
Branch: feature/one-grade1-maths-ch2-shape-lab
Base: feature/one-grade1-maths-ch1-playlab
New migration: 016_one_grade1_maths_ch2_shapelab
Release status: SOURCE COMMITTED AS DEVELOPMENT DRAFT. Full local npm, database and real browser QA not executed from GitHub-only session. No content was academically approved, published, or deployed.

## Chapter alignment / sources
School year: 2026–27
Board: CBSE using NCERT Class 1 textbook Joyful Mathematics
Official mapped chapter: 2, "What is Long? What is Round?" (Shapes)
Official CIET chapter index: https://ciet.ncert.gov.in/audio-book/118 (short index title "What is Long?")
Detailed original NCERT chapter text reference in public academic mirror:
https://sathee.iitk.ac.in/ncert-books/class-01/mathematics/chapter-02-what-is-long-what-is-round/
Delhi Directorate of Education 2026–27 Grade 1 Maths course learning outcomes:
https://edustud.nic.in/edu/Syllabus_2026_27/1/1_math_english_2026_27.pdf
Expected concepts: long vs round with justified viewpoints; 2D outline figures; cube/cuboid/sphere/cylinder/cone; recognising flat/curved features; surfaces smooth/rough; objects that roll, slide, or both; stable flat-base towers.
There is no user-facing licensed NCERT text, exercise, image or scanned textbook content. All Vayentra mini-stories and vector drawings are original and need teacher rights review.

## Original chapter content
One continuous optional story world: Milo's Shape Workshop. Ten teacher-review DRAFT micro-lessons, each 5–10 minutes with adult supervision where appropriate:

1. Long, Round, or Both? — compare ribbon, ball, rolling pin, discuss how one object can be described in different ways.
2. Meet the Flat Shapes — circle, triangle, square, rectangle, oval.
3. Shape Stays, Size Changes — size, colour and rotation don't change a shape's core properties.
4. Shapes You Can Hold — cube, cuboid, sphere, cylinder, cone.
5. Faces and Corners — flat vs curved surfaces, cube features, sphere with no corners.
6. Look From the Side, Look From the End — cylindrical body and circular ends.
7. Smooth or Rough? — texture vs geometric shape, safe tactile investigation.
8. Watch It Roll — curvature and rolling with a low, safe adult-supervised ramp.
9. Slide or Roll — Sometimes Both — sliding vs rolling, cylinder when upright or lying.
10. Build a Tower That Stays — safe low cardboard-box stacking and stable bases.

Each lesson has an original scene script, objective, story, four teacher-checkable concept questions with private correct indices and rationales, four guided steps, an offline home activity, and a teacher/guardian facilitation note.

## Committed files
- server/data/grade1MathsChapter2.js — 10 original teaching units, 40 private MCQs and lab configuration.
- server/db/migrations.js — migration 016 creates one_foundation_shape_labs and inserts 10 draft original Class1 CBSE Maths chapter 2 lesson units and 40 question rows. The chapter was already mapped by migration 014; migration 016 checks the official chapter title before insertion.
- server/routes/grade1Curriculum.js — approved learner lesson responses now include shapeLab and guidedSteps for a corresponding unit, sourced only after the existing staff publication, verified enrolment and pilot/entitlement gates. No correct answer, explanation or future lesson content is exposed before a saved check.
- src/components/OneGrade1ShapeLab.tsx — original all-vector responsive interactive illustrations; touch/keyboard switchable shape cards, viewpoint and surface textures, a child-controlled replayable roll-vs-slide diagram, safe tower models, descriptive voice-independent labels.
- src/styles/one-grade1-shapes.css — premium low-bandwidth visual styling and responsive/reduced-motion accessibility support.
- src/components/OneGrade1Explorer.tsx — integrates the new lab alongside the existing Chapter 1 picture explorer without changing guardian role/learner identity.
- server/tests/grade1_curriculum_phase1.test.js — cumulative Class1 migration counts updated.
- server/tests/grade1_maths_ch2_shapelab.test.js — new integration and evidence suite.

## Expected database counts after migrations 014, 015, 016 on isolated clean test DB
- Class1 original foundation lesson units: 58 total (38 CBSE, 20 Karnataka), ALL new originals still DRAFT.
- Class1 private questions: 147 total (71 migration014 + 36 migration015 + 40 migration016).
- Chapter 2 only: 10 original draft concept units, 10 associated interactive lab scene records, 40 question rows.
- Chapter 1 retained: earlier original starter plus 9 independent micro-lessons.
- 41 NCERT chapter-title mappings from earlier Class1 curriculum work, not 41 completed original chapters.
- No new child enrolments, no new paid entitlement or fee changes, no auto-published contents and no mutation of older school identity records.

## Editorial review requirements
A qualified Class 1 primary Mathematics teacher must:
- Verify the real textbook's Chapter 2 scope and all 10 lesson intentions.
- Independently solve all 40 questions; confirm only one unambiguous correct option.
- Audit all visual shape models: sphere has no corners, cube has 6 square faces, cylinder has two flat circular ends and a curved side, a tilted square stays square.
- Check dynamic rolling vs sliding. A cylinder can roll on curved side and slide on flat end when gently pushed; the lesson must not suggest it always moves one way independent of surface/contact.
- Confirm touching smooth/rough is separate from shape classification.
- Review movement safety: no sharp tins, choking hazards, steep ramps, glass, heavy towers or unsafe climbing.
- Ensure every visual is understandable without colour alone and all labels can be read/aloud for Class1.
- Observe 3–5 pilot children with a responsible adult using fictional/test or consent-reviewed profiles; do not claim learning improvements solely from 4-item formative checks.
- Complete existing ONE editorial role sign-off: teacher submits; independent reviewer approves; admin checks actual source/rights and verifies track, subject and chapter. No approval by this feature itself.

## Security and history gates (reused from Grade1 foundation)
- Every student/guardian request must derive or check the authenticated Learner ID, guardian ownership, reviewed consent and active correct Class1 CBSE enrolment.
- Curriculum outline can show chapter TITLE only; draft lesson story, private question keys and lab scene never served to ordinary student until published.
- A temporary pilot grant does NOT give access to a draft; only a separately approved published unit may open.
- Server grades based on private answer keys, idempotent attempts, rate guards; no frontend trust, no official mastery claim.
- Withdrawal prevents new student access while preserving previous practice history.
- State board learners do NOT see CBSE chapter2 content unless a separately reviewed STATE mapping and units are built. Do not overwrite Karnataka state text.

## Antigravity integration: exact order
1. Preserve ALL local unpushed Step3 266-test QA fixes, Class1 curriculum changes, and Chapter1 QA work. Run git status and compare before touching branches. Do NOT force reset, merge main, or deploy.
2. Fetch this branch. Integrate it with the ACTUAL tested local baseline, not an older remote snapshot. Compare migration ledger and stop on competing migration 011.
3. Stop SQLite writers; create a consistent backup and verify a restored disposable test database. Rehearse migration 016 there after canonical 011, 012, 013, 014, 015. No production migrations or real child data.
4. Check 10 new draft units, 10 shape_labs, 40 private chapter2 questions; 58/147 Class1 cumulative units/questions. All DRAFT. No duplicates.
5. Run npm ci, npm test, npm run build and:
   NODE_ENV=test node --test --test-concurrency=1 server/tests/grade1_maths_ch2_shapelab.test.js
6. Test full staff review flow with fictional accounts and a REAL qualified teacher's local source review. Verify draft 404 even with pilot grant; publish one test unit after proper academic gates; verify family access.
7. Open Guardian Family Portal → Class1 Subjects → Mathematics → What is Long? What is Round? → published mini-lesson. Explore all selectable cards, viewpoint changes, texture difference, rolling and sliding play button, animation replay, accessibility and reduced motion.
8. Complete four MCQs, confirm original question text has no pre-submission answer indexes, results use server score, repeated idempotency key returns same attempt, conflicting replay rejected, progress persists, unrelated guardian/student denied.
9. Withdraw test published unit; make sure all student access closes without deleting formative history.
10. Regress Chapter1 picture explorer and browser speech, 16 AI/Money modules, other Class1 subjects, Class4 Concept Studio, guardian admission, login, student dashboards, attendance and homework.
11. Test keyboard-only navigation, 200% zoom, screen readers, low-bandwidth and breakpoints 360, 390, 768, 1024, 1440. Record screenshots and real measurements.
12. Report source review status, actual test logs, artifacts, critical defects and GO/NO-GO. Do NOT push local user work, merge main or deploy without founder approval.

## Known limitations
- Professional audio, original instructor videos, animations beyond the simple roll/slide diagram, native language narration and a full illustrated storybook are NOT finished.
- Only chapter2 is added, not chapters3–13. Early Class1 NCERT textbook chapter titles are mapped but must not be marketed as complete.
- The shape experiments are SVG learning aids, not a physics simulator. Real motion depends on contact, push, surface and object.
- Production security and guardian age-appropriate privacy checks from earlier phases still apply; this development is NOT production launch approval.
- No assurance of actual runtime tests or academic sign-off from this GitHub-only authoring session.

## Next after Chapter 2
Chapter 3: Mango Treat (numbers 1–9); original story-first number sense, one-to-one correspondence, ordering, compare sets, counting visual objects, before and after within 1–9 and short formative checks.
Keep a grade-by-grade progression. Start Grade2 only after authentic source mapping and Class1 core learner experience meet quality gates.
