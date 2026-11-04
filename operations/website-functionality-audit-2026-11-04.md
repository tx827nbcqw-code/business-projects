# Madman Photography functionality audit — November 4, 2026

## Overall assessment

The main customer journey works, but it is split between a static website, Firebase customer storage, and a separate owner inquiry hub. The next investment should be simplifying and securing those connections, rather than adding more features or more copy.

This audit changes the requested consistent circular branding and automatic session recognition. During publication, automatic review identified internal formulas in the older prints page. That obsolete route was replaced with a redirect to the current catalog to avoid republishing those formulas and a conflicting guest cart. Other findings below are recommendations. No prices, payment processing, lab ordering, customer messages, calendar bookings, or public session photographs were changed.

## Changes included with this audit

- Use the matching approved mountain-and-branch monogram everywhere a photography page displays a logo. Replaced the older footer artwork. Header logos are explicitly clipped to a circle.
- Declare the existing transparent circular PNG as the browser and touch icon on all eight photography HTML routes. Its corner pixels are transparent, not a square background. Reuse it for the homepage social preview. Browsers and operating systems can still apply their own icon container/mask; old shared-link previews may remain cached by third parties.
- Homepage, prints and booking navigation now subscribe to Firebase session restoration. They show Account while checking, My cart for a saved signed-in session, and Log in only once the signed-out state is known. No login click is required to recognize a saved session. Signed-out navigation retains the original Prints/Booking return destination.
- Added a regression check covering pending restoration, signed-in restoration, signed-out restoration and subsequent sign-out.
- Retired the obsolete interactive prints route in favor of a same-site redirect, preserving selected-photo query parameters when JavaScript is available.

## How the site works

1. GitHub Pages serves the homepage, print catalog, account and booking pages.
2. Browsing and photograph previews are public. Adding prints and entering a booking inquiry require Firebase login.
3. Firebase Authentication identifies the customer. Firestore stores that customer's profile, cart, booking draft and inquiry receipts under their UID.
4. Booking estimates use the approved local pricing snapshot. Print estimates use the current public price table. No typing sends an inquiry to the owner hub.
5. The customer reviews and explicitly submits an inquiry to the separate photography hub. A receipt is then saved to their Firebase account. A receipt is not an accepted booking or paid print order.
6. Andre personally confirms details, collects payment directly, and orders prints manually afterward. The hourly owner-approved booking-to-calendar sync is separate; this website does not show live calendar availability.

## Route and interaction coverage

| Area | Observed behavior | Assessment |
| --- | --- | --- |
| Homepage | Public route responds; Business/People/Prints collections, section jump and lightbox work | Working; homepage needs a persistent cart entry after login, addressed in navigation |
| Print catalog | 60 catalog photographs; all 60 referenced local image files exist; Wildlife filter shows eight | Working |
| Selected-print links | Exact-photo matching opens the requested print options rather than the generic top of the catalog | Prior fix retained and tested |
| Search | Searching “frog” finds matching titles; “woodpecker” returns no match despite the woodpecker image being in Wildlife, because its title is Quiet attention | Improve search metadata |
| Guest cart | Quick add shows the login gate; cart remains at zero | Working |
| Customer storage | Prior real-project test restored a cart and booking draft after logout in an independent client; cross-account and signed-out access was denied | Working; not re-created against production in this read-only audit |
| Account | Compact cart view/empty state; optional details and history collapsed; login/save returns appropriately | Source checked; live signed-out view checked; owner device acceptance still needed for current signed-in mobile view |
| Booking | Guest fields are locked, estimate/review/confirm flow exists, draft saves are debounced | Core flow works; business entry context has a defect below |
| Privacy | Public page explains Firebase and separate inquiry storage; account removal is currently a manual email request | Adequate minimal start; operational deletion procedure needed |
| Dashboard | Public route is a landing page linking to the separate protected ChatGPT hub | Not an independent madmanphoto.com owner dashboard |
| Old routes | shoots.html redirects to People; the separate older interactive prints implementation was found live and replaced with a redirect in this release | Verify redirect after deployment |

All eight photography routes returned HTTP 200 during the audit. The separate Internet Town project in this repository was outside the photography audit and was not changed.

## Recommended improvements, in priority order

### 1. Retire the public older prints page — addressed in this release

`/prints/live-prints-v3.html` was a working, publicly accessible older implementation. It did not share the current account gate and contained older internal pricing calculations in its source. Replaced this route with a redirect to `/prints/`, preserving selected-photo query parameters. Git history and third-party caches can retain previous public content; this change removes the older calculations from the current route, not from all historical copies. Further obsolete intake scripts should be reviewed before removal.

### 2. Verify customer identity at the inquiry backend — high

Firestore protects saved customer data, but the hub's legacy public inquiry endpoints do not enforce Firebase identity. The current frontend login gate is not server-side access control. A customer UID written in inquiry notes is a reference, not proof of identity. Add Firebase ID-token verification, input validation, server-side catalog/estimate validation and abuse controls at intake. Preserve the explicit inquire → owner confirmation → direct payment → manual lab flow.

### 3. Preserve booking intent through login — medium

On the live guest `/book/?type=business` route, Photography type resets to Choose a type. Source confirms the initial signed-out callback resets the form after the business query was applied. Login links also use `/book/` without that query. Apply the intended type only when no saved draft takes precedence, and retain the entry query through authentication. The customer should not have to choose Business twice.

### 4. Improve mobile image delivery — medium

The 60 catalog files total approximately 34.4 MiB; this is the total set, not a claim that every visit immediately downloads them all. One river photograph alone is about 3.9 MiB. Lazy loading helps, but thumbnail/responsive variants and modern formats would improve cellular browsing and image previews. Preserve full-resolution originals separately and reserve large files for intentional previews. The monogram icon is also a relatively large 512-pixel source; smaller exact-artwork icon renditions would be useful later.

### 5. Simplify print selection and search — medium

The homepage and catalog are two browsing surfaces with overlapping controls. Keep homepage collections for discovery and make the selected-print detail/cart the short next step. Search should include captions, categories and subject keywords, not just the artistic title. Consider a photo-focused inquiry view on phones rather than loading/scanning the whole catalog around one expanded card.

### 6. Consolidate data sources — medium

Photograph data is repeated in homepage story data, an inline print catalog and a JSON catalog; pricing exists in the static public estimator and the separate hub. Adopt a single versioned catalog/public pricing source for consumers, with compatible server validation. Current prices were checked and left unchanged. Consolidation should not expose internal pricing data.

### 7. Complete device and owner acceptance tests — before promoting widely

On a real iPhone/Safari and a second device: existing-session recognition, Google popup sign-in, verification/reset email delivery, opening a selected print, saved/empty cart, booking recovery and logout clearing. Test the actual inquiry-to-owner receipt once with a clearly labelled owner-approved test; this audit did not submit inquiries or send messages. Add visible retry paths for connection failures and ensure receipt failures cannot cause duplicate submissions. A shared booking draft currently uses the last successful save; simultaneous edits need a conflict policy if that becomes common.

### 8. Clarify owner operations and maintenance — next phase

Decide whether the owner dashboard will remain in the separate hub or be rebuilt under the main domain. Customer Firebase login must not grant owner dashboard privileges. Add a repeatable account/data removal process spanning Firebase and inquiry records, routine security-rule regression checks, and a restore/backup decision compatible with the owner's budget. No paid service was enabled by this audit.

## Validation and limits

- Nine pricing/catalog/model/session-navigation checks pass. Source/asset checks and diff formatting checks pass. Existing Firestore emulator tests remain part of CI; the rules were not changed.
- Browser checks covered homepage collection selection, print section jump, lightbox opening/closing, Wildlife count, title search, guest quick-add blocking, and the guest Business booking entry. No real customer record was modified in these checks.
- Existing desktop screenshots and supplied mobile screenshots informed layout review. This environment's desktop browser is not a substitute for a physical iPhone acceptance test.
- Security findings about the legacy hub are based on its previously inspected server source and the current frontend's requests. This audit did not attempt an unauthorized write, penetration test, customer-data read or production inquiry.
