---
name: scene-builder
description: Build or extend Son Vapur locations while preserving the existing art direction, limited 2.5D movement and architecture. Use for requested location implementation or extension; use visual-polish-playtest for polishing an existing playable scene.
---

# Scene builder

Follow the repository's `AGENTS.md`; keep implementation within the requested location and avoid unrelated gameplay features.

## Inspect before building

Read and run `src/scenes/PierScene.ts` (Kadıköy) and `src/scenes/FerryScene.ts` before designing a new scene. Compare their composition, player scale, palette, lighting, UI and transitions. Inspect the current implementation rather than assuming the architecture has stayed unchanged.

Reuse the existing responsibilities:

- Scenes compose assets and systems, configure the player, and manage lifecycle and transitions; scene configuration holds bounds, footprints and lighting parameters.
- `src/entities/Player.ts` accepts `PlayerEnvironment` overrides. Reuse `src/entities/movement.ts` for normalized movement and swept foot collisions, and `src/scenes/promenade.ts` for ground-contact depth sorting. See `ferryConfig.ts` for a second environment using these systems.
- Inspect `Interaction`, `FerryInteractions` and `Boarding` in `src/systems/` for proximity prompts, E-key handling and handoffs. Reuse applicable behavior without imposing a new interaction framework.
- Reuse `Water`, `Atmosphere`, `FerryWeather`, the generators in `src/assets/`, and the cached textures and seeded drawing helpers in `src/utils/drawing.ts`. Extend narrowly where a location needs a variation.

## Compose the location

Establish foreground framing, a readable playable strip, midground structures and a receding background. Keep these planes distinct through overlap, contrast, scale and appropriate parallax. Match the existing muted blue-grey night palette, restrained amber light, softened skyline, wet surfaces and understated animation.

Make the Istanbul location recognisable through its architecture, shoreline, ferry infrastructure, Turkish signage and plausible local details. Choose details that support the requested place and composition rather than adding systems to explain it.

Keep movement within a shallow side-view depth band, with slower vertical travel and normalized diagonals. Configure clear spawn positions and ground footprints; tall artwork is not a top-down collision box. Use the shared Y-depth mapping for the player's feet and solid props' ground-contact positions. Keep reflections and shadows below actors and intentional foreground occluders above them; preserve room for lighting, weather and UI layers.

Retain delta-time updates, bounded animated effects, cached static art and shutdown cleanup. Keep scene-specific variations from changing the behavior of existing locations.

## Verify implementation

Run `npm test`, `npm run build` and `npm run dev`. Play the changed location and the existing Kadıköy/Ferry route; inspect browser errors, both control schemes, diagonal movement, boundaries, prop collisions, front/behind occlusion, E prompts and transitions. Use relevant existing pages under `tests/` (smoke, depth, boarding, ferry) and extend coverage only when new behavior warrants it. Compare rendered scenes for visual continuity, fix introduced regressions, and report what was actually verified and any remaining limits.
