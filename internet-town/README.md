# Internet Town

A small offline neighborhood connecting Coronda, photography, cooking, The Center, and School Lab. Visit five buildings and play two activities in each. Earn coins and building XP, buy visible landmarks, and complete town goals.

## Play offline

1. Download `index.html` to a laptop. No installation or server is required.
2. Open the downloaded file in a current Edge, Chrome, Firefox, or Safari browser.
3. Disconnect Wi-Fi and play a round before traveling.
4. Use **Export save** for a portable JSON backup. Import it to restore progress after changing devices or moving the HTML file.

The game is entirely self-contained: HTML, CSS, JavaScript, canvas art, and optional synthesized audio. It makes no network requests. Mobile layouts and touch controls are included; some phone file-preview applications do not execute HTML games, so laptop browser playback is the recommended flight setup.

## Activities

| Building | Puzzle | Hands-on activity |
|---|---|---|
| Coronda Café | Scale fictional drink recipes | Timed or relaxed café order service |
| Photo Studio | Balance exposure while preserving a creative requirement | Rule-of-thirds framing |
| Friends' Kitchen | Arrange cooking steps | Repeat a prep-list sequence |
| The Center Depot | Plan efficient delivery routes | Push a crate to its loading bay |
| School Lab | Patterns, break-even, and rate reasoning | Spanish café and supplier conversations |

Every completed challenge earns 30 XP. Buildings gain a level every 100 XP. Café shifts, recipe quantities, memory lists, warehouse layouts, and reasoning numbers vary or increase with progression. Some activities intentionally stay approachable and remix instead of adding difficulty indefinitely. A fifth-win bonus, nine town goals, five purchasable landmarks, and town stages create a shared progression loop.

**Building view** gives direct access to games. **Explore on foot** provides a canvas town with WASD/arrows, touch controls, clickable shops, and day/dusk lighting. Purchased landmarks appear in the town.

## Saves and privacy

Progress lives in `localStorage` under `andre-internet-town-v1`. Browser storage can vary for `file://` URLs and can be cleared; the JSON export is the reliable backup. There are no accounts, analytics, credentials, or connections to real project records. The content is a fictional game, not imported coursework or business data.

## Validation

Run `node check-game.cjs` (Node 18+). The dependency-free harness checks game logic against a minimal DOM stub: completions across ten activities, rewards, purchases, upgrades, duplicate-claim prevention, generated route and warehouse solvability, higher-level café shifts, and walk-view drawing/movement routines. It also checks for network dependencies.

These are logic checks, not real browser interaction tests. Full browser visual and interaction QA was unavailable in the authoring session. Before release, manually check the downloaded file with Wi-Fi disabled, audio activation, touch controls, save reload, and JSON import/export.

## Next iterations

- Test what players actually replay before adding more buildings.
- Add richer photography composition goals and more varied cooking challenges.
- Connect landmark purchases to deeper town changes.
- Add longer challenges that combine skills across buildings.
- Keep the single-file offline build available even if online features are added.

## Files

`index.html` is both the source and playable distribution; edit it directly. `check-game.cjs` is the logic regression harness. No package manager or build step is needed.
