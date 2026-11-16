# Vayentra P0 Security and Privacy — Release Acceptance Record
**Status: NO-GO** — 16 November 2026. This is an engineering evidence record, not legal or independent-security sign-off.

## Evidence-backed engineering changes
- Draft security PR #2: https://github.com/vayentragurukula-ctrl/vayentra-gurukula-/pull/2
- CI: https://github.com/vayentragurukula-ctrl/vayentra-gurukula-/actions/runs/43882439145
- On commit `6f66a9d29bdd7ca2d4228ec0bed94b74a65e1985`: **325/325 backend tests passed, 0 failed across 53 suites, frontend build passed**, and dedicated payment-isolation suite passed.
- Current tree does not track `server/db/vayentra.sqlite`; this does NOT remove historic Git data or revoke exposed credentials.
- Retired legacy `/api/v1/checkout` and `/api/v1/webhook/payment` simulators with authenticated HTTP 410 responses.
- New orders, verification, paid admissions, and gateway webhook activation remain disabled outside automated tests.
- Mandatory-reset enforcement, versioned JWT invalidation on password changes and logout, and disabled legacy plaintext PINs on migration.
- Owner-bound parental-consent withdrawal blocks enrolled learner access. Added guardian erasure-request ledger with status. Request recording does not remove data.
- Added ownership and active-consent enforcement to selected legacy learner routes and report-card notifications. New negative-path tests prove cross-family writes are rejected.

## Release gate matrix
| Gate | Owner/signoff | Evidence required | Status |
| --- | --- | --- | --- |
| Historical public SQLite incident assessed and contained | Incident lead + privacy counsel | Encrypted evidence, exposure scope, affected-account list, forensic timeline, notification decision | OPEN |
| Git history, tags, forks and caches remediated | Repo administrator + incident lead | Coordinated rewrite plan and independent proof of ref/copy cleanup; assume old clones compromised | OPEN |
| Exposed password, PIN, activation token and JWT credentials revoked/reset | Identity lead | Controlled reset logs and verified guardian recovery, including rotation of any exposed environment secrets | OPEN |
| All learner-data APIs reviewed for consent, ownership, erasure and retention | Privacy/security reviewer | Route matrix (including legacy, admin/staff, exports, logs, diagnostics, backups) and negative tests | PARTIAL |
| Consent withdrawal and erasure requests operationally fulfilled | Privacy reviewer | Human verification, retention exceptions, deletion/anonymisation procedure, completion notice, proof | PARTIAL |
| Payment integration independently reviewed | External payment/security reviewer | Gateway API proof, event signatures, anti-replay, ownership, negative path, settlement/refund tests | OPEN |
| Automated test suite and frontend build | CI maintainer | Clean run on latest branch head | VERIFIED at 6f66a9d2 |
| Browser E2E and permissions under production-like configuration | QA/security reviewer | Authenticated flows, accessibility, minors' consent, denied operations and pilot validation | OPEN |
| Public claims match available curriculum | Academic + legal/commercial reviewer | All pages, enrollment forms, API product descriptions, advertising, refund and language claims | PARTIAL |

## Required incident response sequence (do not skip)
1. Appoint an incident lead and legal/privacy reviewer. Preserve encrypted forensic copies privately outside version control.
2. Confirm whether Git history included genuine personal data; review relevant logs, exposure period and potential impact. Never paste affected records into issues.
3. Disable/rotate potentially compromised JWT keys, credential hashes/PINs, activation and checkout tokens, database/third-party secrets; support verified guardian reset. Test old-session rejection.
4. Coordinate a Git history rewrite and GitHub reference/cache purge with all collaborators and fork owners. This step changes repository history and requires explicit repository-owner authorization.
5. Evaluate and fulfill applicable security-incident notification and erasure/retention obligations with counsel.
6. Conduct independent external payment review, all-route privacy review, browser E2E, and verify that CI remains green on the final audited commit.

## Explicit release blockers
- **Do not remove** `VAYENTRA_RELEASE_BLOCKED` production startup gate merely to deploy.
- **Do not enable** paid admission, payments, checkout activation or public ₹599 subscriptions.
- **Do not market** Classes 4–10 as complete digital textbooks or lessons when they contain placeholders.
- **Do not merge** PR #2 solely because CI passes.
- **Do not describe** recorded erasure requests as completed deletion.
- Founder, incident lead and independent security reviewer approvals are **not yet recorded**.

## Required sign-offs (blank until genuine evidence exists)
- Founder/owner: PENDING
- Security incident lead: PENDING
- Privacy counsel/DPDP reviewer: PENDING
- Independent payment assessor: PENDING
- QA lead (production-like browser E2E): PENDING
- Academic and marketing integrity reviewer: PENDING

**Release decision remains NO-GO until every blocking gate is signed and evidence-backed.**
