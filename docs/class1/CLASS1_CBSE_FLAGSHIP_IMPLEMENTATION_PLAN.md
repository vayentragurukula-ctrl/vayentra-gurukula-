# Vayentra ONE — Class 1 CBSE Flagship: Child Learning, Parent Evidence, Sustainable Delivery

**Date:** 2026-11-16  
**Status:** PLANNING ONLY — NO-GO FOR PRODUCTION / NO REAL-LEARNER PILOT  
**Base:** `yashdev` @ `1267223e5acc91544e6676d5ec3af51d2cfcc8cd`  
**Scope:** Class 1 CBSE, English (*Mridang*) Chapter 1 “Two Little Hands”, then Mathematics (*Joyful Mathematics*) Chapter 1 “Finding the Furry Cat!”  
**Explicit constraint:** No deployment, migration, production content publishing, actual child account access, or payment activation from this planning PR.

## 0. Immutable prerequisites

Release is **NO-GO** per P0 security/privacy PR #2 and `docs/security/P0_SECURITY_PRIVACY_ACCEPTANCE.md` on `security/p0-gateway-test-isolation-20261116`. Implement academic improvements only after the owner and independent reviewers have evidence-backed closure of:
- Historical public SQLite/database exposure, affected data scope, coordinated Git history/fork/cache remediation and notification determination.
- Credential/PIN/JWT/activation/checkout/service-secret rotation and old-session invalidation.
- All-route parent/child authorization, consent withdrawal, erasure/retention, exports, logs and backups.
- Independent Razorpay/payment verification review; production-like browser E2E; truthful public claims; latest-head CI and human sign-offs.
- **Never remove** the `VAYENTRA_RELEASE_BLOCKED` gate merely to demo features.

This planning work neither resolves nor attests to any of the above. No real child identifiers in issues, fixtures or PRs.

## 1. Product promise and scope

**Child:** I can watch a short, clear explanation, speak/act/point, make mistakes safely, and improve on a new example.  
**Parent:** In less than 60 seconds I can see what my child demonstrated, what was not yet shown, and one 2-minute home activity.  
**Business:** Each quality-reviewed lesson reuses secure common components and pre-rendered owned media; no unlimited individual tutor or open-ended child chatbot at ₹599/year.

Class 1 core priority order: English (Mridang), Mathematics (Joyful Mathematics), Hindi (Sarangi). Kannada only when an actual enrolled school's subject/edition mapping is verified. Vayentra AI/Digital Thinking and Money/Life Skills must be labelled *original enrichment*, not official Class 1 CBSE requirements.

### Official reference points
- NCERT/CIET Mridang audiobook chapter index: https://ciet.ncert.gov.in/audio-book/115
- NCERT official textbook selection: https://ncert.nic.in/textbook.php?bemr1=0-9
- NCF Foundational Stage 2022: https://www.ncert.nic.in/pdf/focus-group/NCF-FS_2022EN.pdf

Follow the foundational-stage stance: observation, play, oral language and natural formative evidence; avoid exam-style pressure. Use original licensed scripts, illustrations, questions and narration. Mapping to an NCERT chapter is not permission to copy textbook artworks, songs or recordings.

## 2. Existing architecture — reuse before rebuilding

| Responsibility | Existing path | Planned extension |
| --- | --- | --- |
| Source lesson content | `server/data/grade1EnglishMridang.js` | Reviewable learning outcomes, distinct question variants, misconception tags |
| Curated maths content | `server/data/grade1MathsJoyful.js` | Reuse same child learning-loop contract after English quality acceptance |
| Content import | `server/services/seedAndPublishGrade1Curriculum.js` | Import as DRAFT; remove automatic independent-review and publish attribution |
| Authenticated Class 1 lesson and attempt routes | `server/routes/grade1Curriculum.js` | Allow limited, versioned observation/assessment phases and secure summary |
| Student explorer | `src/components/OneGrade1Explorer.tsx` | Embed learning loop and contextual next activity |
| Lesson player | `src/components/OneGrade1AiVideoPlayer.tsx` | Storyboard phase pauses, replay/captions, reduced-motion, distinct media status |
| Parent UI | `src/views/ParentView.tsx`; `src/components/ParentLearningCompass.tsx` | Visible, understandable Class 1 weekly concept evidence |
| Media | `public/media/class1_english/` | Check media paths, sync and rights for each asset |
| Existing tests | `server/tests/grade1_english_ai_video.test.js`, `server/tests/grade1_complete_curriculum.test.js` | Academic/authorization test additions, not only content-presence assertions |

Do not use grade 7 diagnostic psychometrics as if it establishes grade 1 mastery. Avoid using `localStorage` as authoritative progress. Keep existing routes backward compatible where safe; use scoped migrations only after reviewing persistence/consent requirements.

## 3. Child's 8–12 minute learning loop (not 8–12 minutes of continuous screen)

1. **Hook, 30–45 sec:** Show two original pictures and invite the child to predict an action.
2. **Model, up to 2 min:** Short original narration and action demo with accessible captions.
3. **Do/say, ~2 min:** Child claps, taps, waves, and says “I can ___” with family support when needed.
4. **Evidence check, ~1–2 min:** 2–4 picture/oral prompts; do not demand writing literacy.
5. **Alternative explanation, 1–2 min if needed:** Demonstrate the specific confused action or body part; no shaming/leaderboards.
6. **Off-screen play, ~2 min:** An adult asks the child to demonstrate the idea with safe household activity.
7. **Later recheck:** New picture/action wording, not the same item repeated; report “demonstrated with support / independently / not yet demonstrated,” not permanent or medical labels.

Progress is not a score on the video. Video completion is not equal to understanding.

## 4. First English Chapter 1 learning objectives

After learning, child can:
- Recognize and demonstrate **clap, tap and wave** when prompted with picture or spoken instruction.
- Choose the correct body part/function in simple, age-appropriate representations, without implying universal bodily ability.
- Form an age-appropriate short oral sentence, such as “I can wave,” when able.
- Transfer the target concept to a previously unseen pictured or real-world action.

Use inclusive alternatives for children with mobility/speech/hearing variations; allow pointing/gesture, caregiver-supported communication and pace changes. Do not require microphone, webcam, recording or voice recognition.

Suggested misconception *signals*, not diagnoses: `ACTION_CLAP_VS_TAP`, `BODY_FUNCTION_PAIR`, `NEEDS_ORAL_PROMPT`. Human-reviewed explanatory content is mapped to each signal.

## 5. Assessment architecture: separate phases

- **Baseline (A):** 2–4 unseen checks; no pre-taught answer cues; guardian may help read prompt but not supply answer. Store assistance type.
- **Learning/practice:** Corrective feedback, hint, manipulatives, replay.
- **Immediate transfer (B):** Equivalently difficult, alternate contexts, no identical answer array.
- **Delayed recheck (C):** Short optional recheck on a later day; require a new question set.
- **Guardian observation:** Adult can document child demonstration but distinguish observed from independent machine-scored response.

Do not certify ‘mastered’ on the basis of 4 MCQs. Use confidence-free evidence categories, retain minimal needed data and enforce consent/retention rules. Display child-friendly feedback with no humiliating grades.

## 6. Academic publishing gate

Draft -> teacher review -> independent academic approval -> QA verified -> owner authorized -> public/pilot published.

A seed routine may **never** set `reviewed`, reviewer IDs, reference numbers, timestamps or `published` as a substitute for actual educator actions. Older persisted states must be re-audited without destroying learner evidence. Publishing gate must require distinct authorized actors and audit trail. Preview in test fixtures is separate from actual production publication.

Checklist: current NCERT mapping; child-safe and inclusive learning objective; language and readability; original media rights; correct answer/explanation; alternate forms; keyboard/touch/zoom/caption behavior; parent guidance; content-status integrity.

## 7. Proposed implementation slices — post P0 ONLY

**Slice A. Academic QA / content**
- Correct 36/36 English MCQ answer-key positional bias (currently `answerIndex: 0` across all nine lessons).
- Rewrite/review distractors; version question bank without altering prior attempt meaning.
- Add independent human content review artifacts and future-proof publish gate.
- QA inventory audio, caption file paths and truthfully label SVG/audio instead of claiming true full-motion video.

**Slice B. Lesson experience**
- Build named phases in existing viewer; pause for action, show visual prompt, resume safely.
- Let child listen/see/gesture, with replay, reduced motion, captions and full keyboard accessibility.
- Audit behavior on 360px, 390px screens and weak connections, including media failure fallbacks.

**Slice C. Learning evidence**
- Store `phase`, `contentVersion`, `questionSetVersion`, `learningObjectiveIds`, `answer`, `assistanceLevel`, timestamp; server validates ownership, purpose and idempotency.
- Preserve source attempts, avoid overwriting, offer only aggregate authorized guardian-facing output.
- Implement reviewed deterministic recommendation rules; do not use unrestricted LLM chat for children.

**Slice D. Guardian experience**
- `What your child practiced`, `What they showed`, `What to revisit`, `Try at home`, `Next recheck`.
- Render a ‘not enough evidence yet’ state rather than making up improvement.
- No peer ranking, disease/intelligence/psychological SWOC label or unsupported promise.

**Slice E. Maths transfer**
- Port the proven template to Joyful Mathematics Chapter 1 spatial vocabulary with toys/picture scenes.
- Repeat academic approval, accessibility and parent clarity tests before broadening content.

## 8. Acceptance and proof

**Engineering:** Latest-head full tests and TypeScript/build pass, browser E2E passes; secure child/guardian/adult permissions; consent withdrawal blocks access; not yet paid-release sign-off.  
**Academics:** 100% pilot questions and scripts reviewed; no predictable correct-answer positions; baseline and recheck use materially distinct forms; every intervention maps to an observed concept gap.  
**Child experience:** Child can complete assisted loop without timed examination, distressing gamification, mandatory recording, or inaccessible UI.  
**Parent:** In usability interviews, target >=80% can correctly state “one thing learned, one next activity” without help.  
**Pilot reliability:** Target >=99% successful lesson starts measured in controlled staging; publish actual sample size/uncertainty.  
**Learning:** Estimate change using alternate checks, report individual trajectories and limitations; small N=20–30 is for usability and feasibility, not proof of general effectiveness.
**Business:** Record cost per produced minute, media storage/egress, QA labour, variable support cost, payment processing, customer acquisition and refund rate. Derive ₹599 gross-to-net treatment with CA sign-off.

## 9. Pilot controls (only after P0 clearance)

A 20–30 family Class 1 CBSE, parent-consented, time-limited, free pilot:
1. Recruit with clear explanation of what is and is not included.
2. Obtain verifiable guardian consent, offer withdrawal and erasure procedures.
3. Baseline; supervised child learning with accessible alternatives; later alternate-item recheck.
4. Parent weekly report; interview guardians for comprehension; log technical failures without collecting unnecessary PII.
5. Publish an internal go/no-go table, not inflated outcome claims.

No production API calls, student datasets, live payment credentials or marketing campaigns are authorized by this planning document.

## 10. Owner decisions and independent approvals

- Incident/privacy lead — P0 release record and remediation evidence.
- Educator — lesson and item set review with actual identity, date and evidence.
- QA/security — staging test and consent/auth negative paths.
- Founder — product acceptance and budget, *after* independent checks.
- CA — GST/invoice treatment, subscription unit-economics assumptions.
- Data protection lead — retention, erasure workflow and child-safe analytics.

**Done means:** one English learning journey is approved, browser-tested, measurable, guardian-explainable and reproducible at acceptable unit cost; not just that chapter text exists in a database.
