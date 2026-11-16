# P0 Data Exposure Incident Response — Founder Approval Checklist

Status: **OPEN / UNRESOLVED**. Do not declare closed solely because the SQLite file is absent from the newest branch tree.

## Evidence and containment
1. Treat historical `server/db/vayentra.sqlite` blobs and any committed tokens/PINs as potentially compromised. Restrict repository access if operationally feasible, but assume copies may already exist.
2. Before altering Git history, preserve an encrypted forensic copy of the affected commit hashes, access logs, deployment environment and incident timeline in a restricted location outside Git. Limit access and log every access.
3. Do not publish screenshots, exports, sample student records, PINs, activation tokens, or hashes in PR discussions.
4. Determine if records are genuine student/guardian data, test fixtures, or a mixture. Document the exact categories, dates and affected accounts without reproducing values.
5. Revoke session and activation tokens associated with exposed records; rotate relevant secrets and issue guardian-mediated credential resets. Existing plaintext PINs must be reset, not re-used.
6. Review obligations to regulators and impacted families with Indian privacy counsel, including applicable DPDP provisions and incident timelines. Do not assert notification is unnecessary without legal review.

## Coordinated historical removal
1. Freeze writes and arrange a maintenance window; confirm that all active clones, forks and CI jobs can be coordinated.
2. Prepare a verified encrypted backup, preferably a clean export of only necessary operational data under authorized retention policies.
3. In a *restricted local security environment*, use a supported history-rewrite tool (e.g. git-filter-repo) to remove sensitive database blobs from **all affected refs**. Do not run a blind force push on an active public repository.
4. Coordinate protected-branch updates, GitHub support cache/pull request reference cleanup, and all collaborators' recloning. Fork owners may need separate action.
5. Verify blob inaccessibility across current branches, tags, PR refs and accessible Git URLs. Assume previously cloned copies remain compromised and rotate credentials regardless.
6. Audit history for any other sensitive exports, secrets and credentials; do not treat one filename as the entire exposure scope.

## Required technical validation
- Runtime SQLite database is not tracked anywhere in the clean repository.
- New secrets are loaded only from managed environment configuration.
- New guardian and child PINs use secure salted hashes; legacy PINs are disabled and reset through verified parent ownership.
- Old tokens cannot authenticate after revocation.
- All data-access endpoints enforce current consent and ownership.
- Security incident log, legal notification decision and remediation evidence have sign-off.

## Owner approvals
- Security incident lead: unassigned
- Legal/privacy reviewer: unassigned
- Database/operations lead: unassigned
- Founder authorization for coordinated history rewrite: **not yet given**
- Incident closure sign-off: **NOT GRANTED**

This checklist is operational guidance, not a claim that any external incident-response work has been carried out.
