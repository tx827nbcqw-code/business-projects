# Madman Firebase Spark migration — preparation branch

This is isolated migration groundwork. The live website still uses its existing backend.
No Firebase project has been connected, no production rules have been deployed, and no DNS changes have been made for this migration.

## Free plan requirements

Use Spark only. Do not attach a billing account or enable Blaze, Cloud Functions, Cloud Run, App Hosting, or Cloud Storage. Hosting, Google Authentication, anonymous Authentication for silent inquiry submission, and Firestore are the planned services. Images remain in the existing GitHub repository.

## Current implementation

- Owner access requires the verified Google account `andreottati4@gmail.com` in Firestore Security Rules. Client UI checks are not the security boundary.
- Public clients may create a new inquiry only; they cannot read inquiries, alter bookings, change prices, or access private settings.
- Each inquiry is written atomically with a per-identity one-minute limit. Anonymous identities can be recreated by determined attackers; this is not a CAPTCHA or global spam defense. Spark quotas cap usage instead of charging overages.
- The existing dashboard UI and business rules are being adapted to Firestore, preserving booking approval, shoot tasks, pricing drafts, and ledger fields.
- Private data must never be committed to GitHub. Backups download to the owner computer.
- Firebase web configuration is intentionally null. This branch must not replace the live forms until connected and tested.

## Remaining before cutover

1. Connect the official Firebase integration or authorize a Firebase console/CLI setup.
2. Create a dedicated Spark project with no billing account; register a web app.
3. Enable Google and Anonymous Authentication. Add madmanphoto.com and www.madmanphoto.com to authorized domains.
4. Create Firestore in production mode and deploy the rules before any clients connect.
5. Supply the public web configuration in public/assets/firebase-config.js.
6. Complete print inquiry migration, private backup import, and static-host download routing.
7. Run emulator tests and browser verification against the project, including owner and non-owner sign-in, inquiry receipt, and booking updates.
8. Import existing records and private settings through the signed-in owner, preserving IDs and ledgers, and reconcile counts. Keep the old service until the migration is reconciled.
9. Publish the finished static pages under the existing domain. Existing GitHub Pages can remain the free public host; Firebase Hosting is optional if the full portfolio is packaged there.
10. Remove obsolete ChatGPT endpoint links only after the replacement has passed end-to-end checks.

The supplied Hosting public folder contains staged forms and dashboard only, not the entire portfolio. It must not be pointed at madmanphoto.com in its current state.

## Validation performed

`npm test`: three input and payload tests.
`npm run test:rules`: five tests against the official Firestore emulator covering valid inquiry creation, unauthorized reads and writes, forged booking/finance payloads, atomic submission limits, verified owner access, and default deny.

The Firebase CLI is pinned to v14 for the available Java 17 local emulator. It is development tooling only, not shipped to clients. Upgrade the development runtime and CLI before ongoing maintenance.
