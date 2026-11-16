# Class 1 CBSE English — Chapter 1 (“Two Little Hands”) QA and Prototype Checklist

**Status:** Documentary QA / development specification only; not a release approval.  
**Source:** `server/data/grade1EnglishMridang.js`, `src/components/OneGrade1AiVideoPlayer.tsx`, `src/components/OneGrade1Explorer.tsx`, `server/routes/grade1Curriculum.js`, `server/services/seedAndPublishGrade1Curriculum.js`, `public/media/class1_english/asset_manifest.json` on `yashdev` @ `1267223e5`.

## What the current system does

- English chapter metadata maps to NCERT CIET's official Mridang title list.
- Original Vayentra story, four storyboard scenes, SVG animation states, offline narration, captions, player controls and four formative questions are present.
- Authenticated Class 1 practice posts are rate-limited, idempotent and persisted; progress summary reports recent scores.
- Asset manifest labels Chapter 1 as `review_pending_owner_approval` while the publishing seed marks English units published/reviewed: review both gates together.
- This is not an independent validation of academic outcomes, media timing or copyright ownership.

## Confirmed QA failures / design limitations

1. **Answer-position leakage:** All 36 `answerIndex` values across nine English chapters are 0. The Grade 1 test checks validity/existence, not correct-answer position diversity or misconception quality. Fix with separately reviewed options and explicit mapping; do not blindly shuffle array order without updating the correct index.
2. **Review provenance:** `seedAndPublishGrade1Curriculum.js` writes reviewed/published status and reviewer IDs based on available user rows or default IDs. This is not independent educator approval; separate import from review and require attested approval events.
3. **Assessment does not establish mastery:** Existing Grade 1 summary returns most recent correct/total for each unit and generic guidance. No distinct baseline, targeted remediation or alternate delayed recheck is represented.
4. **Media claim accuracy:** The component combines local audio, SVG animation and speech synthesis fallback; inventory must clearly distinguish this from a fully produced instructor video. Manifests and referenced subtitle paths should be checked for sync. Chapter 1 code references `ch1_caption.vtt` while the manifest refers to `ch1_two_little_hands.vtt`; both paths may exist but should have a single reviewed authoritative source/version.
5. **Child-language accessibility:** A basic multi-choice `Check my thinking` is useful, but oral and demonstration evidence are better aligned with foundational learning than an exam-like quiz.

## Prototype storyboards (Vayentra original; not NCERT text)

| Beat | What the child sees/hears | What the child demonstrates | QA acceptance |
| --- | --- | --- | --- |
| Hook | Two original illustrated hands, feet and a soft beat | Choose an action to try | Prompt comprehensible without reading |
| Model | Character claps, taps, then waves; distinct visuals | Point to or demonstrate each | Correct action portrayed, captions synced |
| Say/do | “I can clap / I can tap / I can wave” prompts | Oral phrase, gesture or supported communication | Accessible non-speaking option |
| Check A | Novel picture of an action | Select action correctly | No fixed answer position |
| Help | Show side-by-side clap (hands) vs tap (finger/foot) | Explain/point to distinction | Feedback is specific, non-judgmental |
| Check B | Unseen action-context prompt | Transfer learning to new example | No recycled response pattern |
| Off-screen | Adult-led two-minute action game | Demonstrate or point, with support | No camera or microphone recording |
| Parent report | Three plain-English evidence lines | Parent knows next activity | Report distinguishes actual vs unsupported |

## Suggested assessment spec (WRITE NEW ORIGINAL ITEMS; educator must validate)

- **Outcome E1 ACTION_WORD:** Distinguish clap/tap/wave from two pictures or gestures.
- **Outcome E2 BODY_FUNCTION:** Link a depicted action to an appropriate body part, allowing inclusive alternatives.
- **Outcome E3 LISTEN_ACT:** Respond to one clear oral direction.
- **Outcome E4 EXPRESS:** Use an oral, gesture-based or supported short phrase about action.
- **A form:** 3 or 4 items with 2–3 plausible visual choices and answer positions balanced across the test.
- **B form:** 3 or 4 different visual contexts, same intended concepts and similar difficulty.
- **C form:** Brief delayed check several days later, optional and new examples.
- **Assistance:** `independent`, `prompt_read`, `guided`, `not_observed`; do not infer from clicks.
- **Mistake signals:** `ACTION_CLAP_VS_TAP`, `BODY_FUNCTION_PAIR`, `NEEDS_ORAL_PROMPT` are content-level evidence categories, not traits of the child.
- **Success wording:** “Demonstrated this action in a new example” / “More practice useful.” Never “AI-certified mastery” or diagnosis.

## QA test cases to add post P0

- The published question bank has no answer-index positional shortcut; any changed option order and answer key remain correct.
- Every item has an educator-approved learning outcome, original/licensed visual, good distractors and a constructive explanation for wrong options.
- Distinct baseline and recheck questions cannot accidentally be identical and cannot leak answer keys in catalog/lesson response.
- A child cannot tamper with another learner ID; parent cannot view any unlinked learner; consent withdrawal immediately blocks protected routes.
- Repeated submission with same idempotency key is safe, and changed content/answers with same key are rejected.
- Lesson handles audio loading error, caption toggle, pause/play, replay, device keyboard, 200% zoom and reduced motion.
- Child can complete an activity without providing voice/photo/video or other sensitive biometric input.
- Content importer cannot set reviewed/published status with fabricated reviewer authorization.
- An unapproved chapter is hidden despite media files being present.
- Parents see honest empty states and only evidence recorded for their own linked child.

## Completion rule

Do not claim Chapter 1 premium or ready for a paid pilot until a qualified Class 1 educator approves the final teaching flow and questions; the founder approves media; QA independently verifies browser behavior and accessibility; P0/security release blockers are independently closed; and staged child/parent evidence reports show no exposure or unjustified mastery claims.
