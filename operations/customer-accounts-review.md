# Customer accounts review — Madman Photography

Status: production configuration prepared for the owner-approved release. Owner supplied the public web configuration for `madman-photography` (project number `250572900820`). Analytics is not initialized; the supplied measurement ID is not needed for customer accounts. Publication still requires verifying the GitHub Pages result; configuration checks alone do not establish a live deployment.

Console verification on November 4, 2026: signed in as `andreottati4@gmail.com`; enabled and read back Email/Password and Google providers. Google public app name is Madman Photography, with the project owner's account as support email. Created the default Standard Firestore database in `nam5` (United States), production mode; verified its initial rules deny all client reads and writes. Spark ($0/month) remains selected; no billing upgrade or backups enabled. Website domains and customer-only rules still await activation, followed by real-project tests. Console sign-in does not authorize the local Firebase CLI.

After explicit owner approval, authorized and read back `madmanphoto.com` and `www.madmanphoto.com`; published this repository's customer-only rules and verified the new active rules revision in the console. Real-project SDK tests passed: email/password sign-up and profile save; cart and booking draft restoration after logout and login in an independent client; denied cross-account profile/cart reads and writes; denied signed-out reads. Disposable Auth users, cart and draft were removed by the test. A minimal `RELEASE TEST ONLY` profile remains at `customers/Ur09s4HRrxdVaBnMDdjcEGgnI0M2` because customer rules intentionally forbid profile deletion. No live inquiry or verification email was sent. Google popup/mobile compatibility and verification/reset email delivery still require owner acceptance checks.

## What changed

- The current 60-photo catalog is retained. A Wildlife filter contains eight existing animal photographs, alongside the original filters.
- The print layout uses the site's cream, charcoal, gold, Instrument Serif and DM Mono. The bottom cart bar opens an accessible native dialog. No duplicate cart control or payment checkout was added.
- Print inquiry retries use stable, account-saved references and separate IDs for each line. The existing hub uses different size spelling/options, so matching sizes are translated; other requested sizes are included explicitly in the inquiry notes for Andre's review.
- Booking details are grouped into session, date/location, and contact sections. Estimates use the unchanged approved public rates locally; typing does not send contact details to the hub.
- Email/password and Google sign-in are implemented with Firebase's Web SDK. Password reset and email verification use Firebase. Email verification is required before submitting an inquiry; saving a cart or draft is allowed first.
- Guest browsing and print detail previews remain open. Adding a print or entering booking details requires login. The attempted addition is not performed before login.
- Account pages show profile details and sent inquiry receipts. Their content is inserted as text. No customer records, tokens, passwords or private credentials are stored in Git.

The existing money flow remains inquiry → Andre confirms personally → customer pays Andre directly → Andre orders from the lab. Prices remain unchanged. No payment processor, automated charge, lab order, paid service, or new photo publication is part of this work.

## Firebase ownership and setup

Firebase is Google's service. The installed Firebase development plugin is not proof of a signed-in Google account or an existing project connection. The available CLI reports no authorized account, and the older migration draft has `firebaseConfig = null`.

After the owner signs in, inspect accessible projects and confirm the intended project. Prefer a dedicated, owner-controlled Madman Photography Spark project if there is no suitable existing one. Keep GitHub Pages as the website host. Use Firestore Standard edition with one database; choose the region before creating it. Do not attach billing, enable Blaze, or provision Functions, Cloud Storage or App Hosting.

1. Enable Email/Password and Google in Firebase Authentication. Set the support email and customer-facing application name to Madman Photography. Configure password policy and email enumeration protection.
2. Authorize `madmanphoto.com` and `www.madmanphoto.com`; use the canonical domain consistently. Test Google's popup on iOS/Safari and browsers with popup restrictions. Do not silently switch sign-in methods or create duplicate accounts for an existing email.
3. Create Firestore in production/locked mode, inspect any existing database and rules, then review/deploy this branch's rules to the selected project. Never replace an unrelated project's rules blindly.
4. Register the web app and place its public web configuration in `assets/firebase-config.js`. Never add a service-account JSON file, access token or Admin SDK credential to a static website.
5. Test with a real disposable customer account and two devices before publishing. Test email verification/reset delivery and Google provider setup. Add App Check after monitoring legitimate traffic and verifying provider quotas.
6. Run `npm run check:accounts-release` (currently fails intentionally because production configuration is absent). Obtain approval for publication. Merge only after backend setup and end-to-end checks pass. No DNS migration is needed.

## Private data layout

| Path | Contents | Customer access |
| --- | --- | --- |
| `customers/{uid}` | Name, account email, optional phone, updated timestamp | Own profile only |
| `customers/{uid}/cart/{hash}` | Catalog photo ID, size, paper, border, border size, delivery, quantity, updated timestamp | Own items; transactional quantity changes |
| `customers/{uid}/drafts/booking` | Bounded booking fields, text consent, stable request ID, updated timestamp | Own editable draft |
| `customers/{uid}/drafts/print` | Stable request ID and a SHA-256 payload fingerprint | Own retry marker; no contact/address body |
| `customers/{uid}/inquiries/{id}` | Inquiry type, hub reference, text summary, creation timestamp | Own immutable receipt |

Rules default to deny, validate create and update schemas, restrict catalog/options/quantities, reject additional privilege/payment fields, and prevent users reading another UID's records. Owner operations remain in the existing protected hub; Firebase console access uses project IAM. Customer inquiry receipts are not proof of payment or confirmed availability.

I've set up prototype Security Rules to keep the data in Firestore safe. They are designed to be secure for customer-owned profiles, carts, drafts and inquiry receipts, with identity checks and bounded field validation. However, you should review and verify them before broadly sharing your app. If you'd like, I can help you harden these rules.

## Validation and limits

`npm test`: seven model/pricing/catalog checks. `npm run test:rules`: eleven tests using the official Auth and Firestore emulators. Includes actual Auth sign-up, logout, second-client login, restored cart/draft, concurrent quantity transactions, denied cross-user access, malformed writes, and immutable receipts. `npm run check`: source syntax, assets and approved pricing checks.

Browser review covers catalog filters, print details/cart presentation, booking grouping and estimate calculations. With a disposable Auth-emulator fixture, the browser also saved profile details, added a cloud-backed cart item, restored that cart after reload, and restored a saved booking type and message after reload. Emulator tests do not establish production project access, email delivery, Google OAuth configuration, or successful receipt in the live owner inbox. No live test inquiries were submitted.

The existing hub remains a separate backend and its legacy public intake endpoints remain public. The new customer UI requires login and private account data is protected by Firestore rules. Attaching an account reference to an intake note does not make that public endpoint verify Firebase identity. Enforcing Firebase identity at intake requires a separately reviewed hub change with token verification and compatible CORS; the account frontend must never treat client-supplied UID notes as trusted authorization.

Basic email/password and Google authentication plus small text carts/drafts fit the intended Spark setup. Firestore's documented free quota is one eligible database, 1 GiB stored, 50,000 reads/day, 20,000 writes/day, 20,000 deletes/day, and 10 GiB outbound/month. Draft writes are debounced; listeners subscribe only to the signed-in customer's data. High traffic, bots, excessive listeners/writes, backups, and additional backend services can require another cost decision. No upgrade is authorized here.

Remaining production checks: sign-in on supported mobile browsers; real email verification/reset; two-device cart and draft recovery; account switching clears prior data; network interruption shows unsaved status; multi-item submission and reload/retry arrive once per line in the actual hub; account history appears only for its owner; every price equals the current published amount; existing inquiries and owner dashboard remain accessible. A shared booking draft currently uses last successful save; avoid editing that same draft simultaneously on two devices.
