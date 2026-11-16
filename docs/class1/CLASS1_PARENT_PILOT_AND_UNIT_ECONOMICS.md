# Class 1 CBSE — Parent Report, Pilot and ₹599 Operating Model

**Status:** Proposal only. Not approval to recruit, collect student data or take payments.

## 1. What a guardian should understand in under one minute

A weekly **Class 1 Learning Snapshot** (verified guardian-only):
- **Practiced:** “English • action words (clap, tap and wave).”
- **Observed:** “Chose clap from a new picture independently” when supported by actual stored evidence.
- **Needs practice:** “Clap versus tap” when supported by recorded errors; else “Not enough evidence yet.”
- **At home:** One safe, optional 2-minute game. No requirement for purchase of materials.
- **Next:** New recheck when content/reviewer recommends it.
- **Learning history:** Baseline vs later alternate question results with sample sizes and support levels; no peer rankings, percentile, personality label or IQ.
- **Privacy:** Guardian controls and withdrawal request link, a clear explanation of retention limits and how to reach support.

Illustrative example MUST be labelled sample until real consented data exists. Children should never see public ranks.

## 2. Suggested data contract to assess during post-P0 design

Keep minimal values in a guardian-authorized, filtered server response:
```json
{
  "unitId": "<opaque ID>",
  "outcomeIds": ["E1_ACTION_WORD"],
  "evidence": [
    { "phase": "baseline", "attemptId": "<opaque>", "correct": 1, "total": 3, "assistance": "prompt_read" },
    { "phase": "alternate_recheck", "attemptId": "<opaque>", "correct": 3, "total": 3, "assistance": "independent" }
  ],
  "teacherReviewedSignalCodes": ["ACTION_CLAP_VS_TAP"],
  "nextHomeActivityId": "<approved ID>",
  "evidenceStatus": "limited_observation"
}
```
Shape is a design proposal, not an implemented endpoint or migration. Never expose item answer keys, other learners' data, unreleased authored materials or unnecessary PII. Server-enforced consent and ownership checks. Clear data retention and erasure process subject to legal review.

## 3. Small pilot protocol (after P0 clearance only)

- **Participants:** 20–30 Class 1 CBSE families across a mix of reading fluency, devices and internet quality; no forced participation.
- **Guardian onboarding:** Verifiable consent, child-friendly assent, purpose-specific notice and easy withdrawal.
- **Exposure:** One English Chapter 1 learning journey, and later Maths Chapter 1 after educator approval.
- **Baseline:** New teacher-approved pictorial/oral checks; caregiver may read but must note support.
- **Observation:** Did the child understand directions? Can the parent find next activity? Did audio/captions work? No recording of a child required.
- **Recheck:** Alternative examples after learning, optionally days later. Report limitations; avoid strong causal claims from small uncontrolled pilot.
- **Guardian interview:** In plain language ask: “What did your child demonstrate? What will you try together next?” Mark correct response vs confusion.
- **Safety monitoring:** Stop enrollment on serious privacy/authorization failure, distress, inaccessible instructions or unreviewed media claims.

Suggested thresholds for discussion, not predetermined evidence:
- 100% lesson/media/items educator reviewed with recorded approval.
- >=80% guardians can state a next action correctly without guidance.
- >=99% lesson starts without technical errors in an adequately-sized observed sample; always report numerator/denominator.
- Positive directional signal on alternate-item learning checks, with ability/support noted and no misleading statistical certainty.
- Zero unresolved critical child privacy or payment vulnerabilities.

## 4. ₹599/year unit economics — hypothesis, not forecast

Recommended input sheet (record observed value + uncertainty):
1. **Price:** ₹599 cash price for annual self-paced learning pass, pending verified tax treatment/CA sign-off.
2. **Net revenue:** Gross minus any correctly applicable taxes, discounts and refunds.
3. **Payment fee:** Captured actual provider fees + settlement differences per successful payment.
4. **Variable delivery:** Video egress/CDN, platform bandwidth/storage, logging/observability and any AI inference.
5. **Support:** Actual assisted minutes per enrolled household multiplied by fully burdened hourly cost.
6. **Acquisition:** Attributable marketing and sales expense / verified new paid households; do not assume referrals are free.
7. **Fixed:** Content production, educator QA, founder operations, security/privacy, salaries, platform fixed costs and annual support.

**Contribution per paid student = net collected revenue - variable delivery - payment fees - variable support - attributable acquisition cost - refunds/credits.**

**Break-even active new subscribers = annual fixed costs / positive contribution per student** (only as a simplified annual planning model; account for renewal cohorts, timing, capacity, cash flow, tax and refunds in the real model).

Illustrative scenario **only**: if price inclusive of 18% GST is legally confirmed by the CA, revenue before gateway costs is about ₹507.63. Assuming ₹15 processing, ₹30 delivery, ₹40 support and ₹100 acquisition, illustrative contribution is **₹322.63** before fixed costs. Do not present 18% GST as a verified Vayentra liability or infer margin from this illustration.

## 5. Decisions to make from pilot evidence

- **STOP:** Privacy/security failure, material inaccuracies, high frustration or unsustainable negative contribution with no credible fix.
- **ITERATE:** Child comprehension unclear, parent next step unclear, failure on weak networks, repeat-item bias, large support burden.
- **CONTROLLED EXPAND:** Safeguards closed, independent educator sign-off, functional accessibility, parent clarity and positive learner evidence with realistic cost estimates.

All decisions belong to accountable humans, with citations to evidence; no automatic public launch based solely on a test count.
