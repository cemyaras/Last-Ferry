# ⛴️ SON VAPUR

🎮 **[Play on GitHub Pages](https://cemyaras.github.io/Last-Ferry/)**

A small atmospheric journey from Kadıköy ferry pier through a Bosphorus crossing to the first Karaköy lane and onto Galata Bridge, at night. Built with TypeScript, Phaser 3 and Vite. Opens directly into the scene, with no menus or external assets.

## 🏃‍♂️ Run

```sh
npm install
npm run dev
```

Open the localhost URL printed by Vite. Click the scene if the browser has not given it keyboard focus.

- **A / D** or **← / →** — walk along the pier
- **W / S** or **↑ / ↓** — move toward / away from the water within the shallow promenade
- **E** near the bench — look out over the water
- **E** at the left-side boarding bridge — board the Karaköy ferry
- **E** at the left end of the Karaköy lane — walk onto Galata Bridge

You begin at the right end of the promenade, facing left toward the ferry terminal. Follow the left-pointing İSKELE sign; the original bench reflection remains available along the way. Walk left to the terminal and approach the bridge marked KARAKÖY. Press E to walk aboard the waiting ferry. Boarding fades into the playable FerryScene. Explore its open deck with the same controls and look out at the water. After a 30-second cruise, the Karaköy waterfront emerges during a 14-second approach, followed by four seconds of docking. When “Karaköy’e yanaştık.” appears, use E at the right-hand exit to step ashore. The small Karaköy lane remains freely explorable up to its closed uphill gate; at its left end, past the terminal, a lamp plate points to Galata Bridge. Reload the page to replay from Kadıköy. The continuous pier is 2112 pixels wide (1.65 screens), with a gently following camera and depth-dependent parallax. Feet stay within a 106-pixel promenade depth band; depth movement is slower and diagonals are normalized. The terminal, rail edge and furniture have solid footprints. Furniture and the traveller sort by ground contact Y, while the camera remains horizontal. The scene is designed for desktop keyboards and scales to fit the window with cinematic letterboxing. Movement guidance fades after walking; the clock and terminal sign share the fixed 23:40 scene time.

```sh
npm run build   # TypeScript check and production bundle
npm run preview
```

## 🏗️ Structure

- `src/scenes/PierScene.ts` — Kadıköy composition and minimal UI
- `src/scenes/FerryScene.ts` — playable crossing, scene lifecycle and arrival handoff
- `src/scenes/KarakoyScene.ts` — first waterfront lane and shared-system composition
- `src/scenes/karakoyConfig.ts` — street bounds, solid footprints, lights and three observations
- `src/assets/karakoy.ts` — original street art and the waterfront seen during arrival
- `src/scenes/GalataBridgeScene.ts` — bridge composition, walk-in, camera and the brief wide view
- `src/scenes/galataBridgeConfig.ts` — walkway bounds, footprints, lamps, fishermen and three observations
- `src/assets/galataBridge.ts` — skylines, railing, walkway, opening span, barrier and tram road art
- `src/entities/BridgeLocals.ts` — three fishermen, an umbrella pedestrian, rods and lines
- `src/systems/BridgeMotion.ts` — tram, car lights, flag, far ferry, circling gulls and barrier lamps
- `src/systems/FerryJourney.ts` — active-time cruise, smooth approach and docking phases
- `src/scenes/ferryConfig.ts` — deck bounds, footprints, lights and crossing duration
- `src/scenes/config.ts` — dimensions, movement bounds, interaction position, lamps, shared scene time and parallax
- `src/entities/Player.ts` — smooth two-axis movement, directional walk and idle animation
- `src/entities/movement.ts` — normalized movement and swept foot collisions
- `src/scenes/promenade.ts` — walkable strip, furniture footprints and Y sorting
- `src/assets/` — original, deterministic Canvas art for the pier, skyline, ferry and traveller
- `src/systems/Water.ts` — waves, light reflections, ferry passage
- `src/systems/Atmosphere.ts` — three light rain layers, ripples, animated wet reflections, clouds, haze, rare lamp flicker and distant gulls
- `src/systems/Boarding.ts` — proximity prompt, single boarding path, and transition into FerryScene
- `src/assets/boarding.ts` — moored ferry, doorway, bridge and destination sign
- `src/systems/Interaction.ts` — proximity prompts with optional per-point label and callback, and a fading line
- `src/systems/Ambience.ts` — optional future audio channels
- `src/utils/drawing.ts` — reusable drawing and seeded randomness helpers
- `public/assets/` — reserved for future original audio files

All artwork is generated locally in code. No downloaded images, fonts or audio. Static art is cached into textures; animated effects use bounded particle/stroke counts. The ferry wraps offscreen for uninterrupted atmosphere. Movement and effects are delta-time based, with a capped delta on resume.

## 🔊 Audio

The arrival has one quiet, procedurally synthesized two-tone ferry horn. Audio unlocks after a keyboard or pointer gesture on the ferry; there are no downloaded sound assets. Other ambience remains silent. `Ambience` accepts an optional manifest with `rain`, `water`, `ferry-horn`, `seagulls` and `city` channels. Supply `{ url, volume, loop }` entries when original audio is available. The scene preloads the manifest and starts looping tracks after a keyboard or pointer gesture. Non-looping tracks are triggered with `play(channel)`. Audio objects are cleaned up when the scene shuts down.

## 🎯 Scope

Kadıköy pier, one compact ferry deck, a 1920-pixel (1.5-screen) Karaköy lane and a 2176-pixel (1.7-screen) stretch of Galata Bridge. The deck has two passengers; the street has a waiting resident and a shopkeeper; the bridge has three fishermen and one pedestrian. Each location offers at most three brief observations. Eminönü is not built yet. No quests, inventory, saves, combat, menus or dialogue trees.

## 🧪 Browser verification

With the dev server running, open `/tests/smoke.html` and click **Run playable scene checks**. The development-only harness drives the real Phaser scene with keyboard events and checks both control schemes, direction, opposing keys, world bounds, bench proximity, the exact quote, fade-out, and animation-loop performance. It also checks the wider pier, camera limits, traveller scale, ferry occlusion order, fading movement hint, shared clock, and screen-fixed dialogue. It takes about 50 seconds and is not included in the production build.

For the 2.5D movement changes, run `npm test` for collision and normalization checks. Open `/tests/depth.html` for live keyboard, obstacle, foot reflection, interaction-distance and Y-sorting checks, including front/behind bench inspection buttons. These are development-only pages.

`/tests/boarding.html` runs an end-to-end walk from the right-hand spawn, verifies the bench still receives E, approaches the boarding bridge, checks the boarding animation under held movement input, and verifies the transition into a playable FerryScene without loading Karaköy.

## Ferry deck

Use WASD / arrows on the deck. Press **E** near the open railing for the Bosphorus line, near the cabin door for its short notice, or near the right-side exit to check arrival. The ship cruises for 30 seconds, eases down as the waterfront approaches for 14 seconds, then settles against the quay for four seconds. A single soft horn accompanies the approach; wake, horizon drift and engine motion subside. The exit only permits disembarkation once moored. Arrival never forces the player out of exploration.

`/tests/ferry.html` opens the deck in a development-only harness and checks movement, collisions, Y sorting, the exact railing line, closed cabin, timed arrival and one-shot destination handoff.

The exit emits `karakoy-arrival` once and fades into `KarakoyScene` with `{ from: 'FerryScene' }`. The traveller stays visible during the fade, input resets on shore, and the previous scene shuts down. There is no loading screen.

### Ferry visual clarity

The deck keeps its existing layout and collision footprints. Its artwork now includes a rounded hull return, teak-topped tubular rails, narrow longitudinal deck boards, bolted bench feet, rounded riveted cabin glazing, an upper-deck overhang, an ochre-banded funnel and Turkish flag. Ship-specific water flow and wake are opt-in `Water` options; Kadıköy retains its existing water behavior. The distant horizon moves independently of the deck, with a small camera roll and subdued engine vibration. Flow and motion ease down on arrival.

## Karaköy lane

Arriving from the ferry, the traveller steps out of the lit terminal door along a short authored path before normal controls resume; the same Karaköy-bound ferry stays moored behind the terminal. Walk right from the terminal through the older shopfronts. Warm lamps, a Galata sign and the receding stairs guide the way. E offers one line each at the terminal, closed clock shop and uphill gate. The locked stair gate and end wall mark the current content boundary. The street uses the existing player, foot collisions, Y sorting, observation UI, rain and reflection systems with scene-specific configuration.

`/tests/journey.html` runs the entire route from the actual Kadıköy spawn, boards the ferry, explores its deck, waits through the unaccelerated approach and docking, disembarks, and walks through all three street observations and the end boundary. Keep the test tab active; it takes about two minutes. `/tests/karakoy.html` provides inspection buttons for the uphill gate and both sides of the planter. `npm test` also checks street collision/accessibility and arrival phase/frame-rate invariants.

## Galata Bridge

The traveller walks in from the Karaköy end and heads west toward Eminönü, looking up the Golden Horn: Yeni Cami and Süleymaniye ahead, Galata Tower behind. The walkway runs along a baluster railing, with fishermen, buckets, a bench and the opening span's two control houses at the middle. Rain slants harder and gusts; the flag, umbrella and fishing lines move with the same gusts. The T1 tram and car lights pass on the road nearer the viewer, below the playable strip. E offers three things: a look over the railing, a line from the fisherman standing back from the rail, and, at the opening span, a brief camera widening that holds both shores before settling back. Screen-fixed sky, rain, vignette and type are compensated during the zoom so they do not shrink. Work barriers with slow amber lamps close the walkway at the Eminönü end. `Atmosphere` accepts an optional `wind`; other scenes keep their original rain.

`/tests/bridge.html` checks the Karaköy handoff and walk-in, diagonal movement, rail, kerb and both ends, footprints of every fisherman, prop and the pedestrian, front/behind sorting, all three prompts and lines, and the wide view returning to normal. `/tests/journey.html` now continues from Karaköy onto the bridge.
