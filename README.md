# ⛴️ SON VAPUR

🎮 **[Play on GitHub Pages](https://cemyaras.github.io/Last-Ferry/)**

A small atmospheric, playable scene at Kadıköy ferry pier, 23:40. Built with TypeScript, Phaser 3 and Vite. Opens directly into the scene, with no menus or external assets.

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

You begin at the right end of the promenade, facing left toward the ferry terminal. Follow the left-pointing İSKELE sign; the original bench reflection remains available along the way. Walk left to the terminal and approach the bridge marked KARAKÖY. Press E to walk aboard the waiting ferry. The prototype ends aboard with “Devamı gelecek.”; Karaköy is not implemented. Reload the page to replay. The continuous pier is 2112 pixels wide (1.65 screens), with a gently following camera and depth-dependent parallax. Feet stay within a 106-pixel promenade depth band; depth movement is slower and diagonals are normalized. The terminal, rail edge and furniture have solid footprints. Furniture and the traveller sort by ground contact Y, while the camera remains horizontal. The scene is designed for desktop keyboards and scales to fit the window with cinematic letterboxing. Movement guidance fades after walking; the clock and terminal sign share the fixed 23:40 scene time.

```sh
npm run build   # TypeScript check and production bundle
npm run preview
```

## 🏗️ Structure

- `src/scenes/PierScene.ts` — scene composition and minimal UI
- `src/scenes/config.ts` — dimensions, movement bounds, interaction position, lamps, shared scene time and parallax
- `src/entities/Player.ts` — smooth two-axis movement, directional walk and idle animation
- `src/entities/movement.ts` — normalized movement and swept foot collisions
- `src/scenes/promenade.ts` — walkable strip, furniture footprints and Y sorting
- `src/assets/` — original, deterministic Canvas art for the pier, skyline, ferry and traveller
- `src/systems/Water.ts` — waves, light reflections, ferry passage
- `src/systems/Atmosphere.ts` — three light rain layers, ripples, animated wet reflections, clouds, haze, rare lamp flicker and distant gulls
- `src/systems/Boarding.ts` — proximity prompt, single boarding path, and an aboard ending
- `src/assets/boarding.ts` — moored ferry, doorway, bridge and destination sign
- `src/systems/Interaction.ts` — one proximity prompt and fading line
- `src/systems/Ambience.ts` — optional future audio channels
- `src/utils/drawing.ts` — reusable drawing and seeded randomness helpers
- `public/assets/` — reserved for future original audio files

All artwork is generated locally in code. No downloaded images, fonts or audio. Static art is cached into textures; animated effects use bounded particle/stroke counts. The ferry wraps offscreen for uninterrupted atmosphere. Movement and effects are delta-time based, with a capped delta on resume.

## 🔊 Audio

This prototype is intentionally silent. `Ambience` accepts an optional manifest with `rain`, `water`, `ferry-horn`, `seagulls` and `city` channels. Supply `{ url, volume, loop }` entries when original audio is available. The scene preloads the manifest and starts looping tracks after a keyboard or pointer gesture. Non-looping tracks are triggered with `play(channel)`. Audio objects are cleaned up when the scene shuts down.

## 🎯 Scope

One area, one character, one bench reflection and a short boarding interaction. No Karaköy area, quests, inventory, saves, combat, menus, or dialogue trees.

## 🧪 Browser verification

With the dev server running, open `/tests/smoke.html` and click **Run playable scene checks**. The development-only harness drives the real Phaser scene with keyboard events and checks both control schemes, direction, opposing keys, world bounds, bench proximity, the exact quote, fade-out, and animation-loop performance. It also checks the wider pier, camera limits, traveller scale, ferry occlusion order, fading movement hint, shared clock, and screen-fixed dialogue. It takes about 50 seconds and is not included in the production build.

For the 2.5D movement changes, run `npm test` for collision and normalization checks. Open `/tests/depth.html` for live keyboard, obstacle, foot reflection, interaction-distance and Y-sorting checks, including front/behind bench inspection buttons. These are development-only pages.
