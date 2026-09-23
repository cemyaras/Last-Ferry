---
name: visual-polish-playtest
description: Review and polish an existing playable Son Vapur scene without expanding gameplay scope. Use for composition, atmosphere, readability, collision, depth or visual continuity work; prefer targeted fixes over a scene redesign.
---

# Visual polish and playtest

Follow the repository's `AGENTS.md`. Preserve the playable layout and working systems unless a demonstrated issue requires a local adjustment. A polish request does not authorize a new location or unrelated gameplay features; if the request is review-only, report findings without editing.

## Establish the baseline

Run the game and inspect the target scene at rest and while walking, including its entrance, exits, interaction points and occluding props. Capture representative views before editing. Compare with both Kadıköy (`src/scenes/PierScene.ts`) and Ferry (`src/scenes/FerryScene.ts`); inspect only the assets, configuration and systems responsible for observed issues.

## Review in context

- **Composition and depth:** Check foreground framing, playable-area clarity, midground silhouettes, background recession, camera edges and parallax. Preserve breathing room around the traveller and points of interest.
- **Player readability and lighting:** Check the traveller against dark and lit surfaces, warm lamp pools, restrained rim light, grounded shadows and consistent light sources. Avoid solving local contrast problems by brightening the whole scene.
- **Rain, water and wet reflections:** Check layer scale, direction, density, water motion and reflection alignment. Ensure effects suggest material and distance without hiding the player, shoreline or UI; check ferry wake and motion easing where relevant.
- **Ambient animation:** Inspect clouds, distant traffic, passengers and vessel movement over time. Keep motion subtle and loops unobtrusive, with bounded effects and stable frame pacing.
- **Collision and depth sorting:** Walk along edges and around furniture from both sides. Compare physical footprints with visible ground contact; check Y-sorted player/prop overlap, shadows and reflections. Look for snagging, clipping, inaccessible prompts and accidental paths into water.
- **UI and scene continuity:** Compare type, spacing, prompt placement, dialogue, fades, palette, scale and weather intensity across the Kadıköy-to-Ferry transition. Keep camera-fixed UI stable and world prompts attached to their intended subjects.

## Make targeted fixes

Prioritize observed readability or playability problems, then the most noticeable atmospheric inconsistencies. Adjust the responsible drawing, effect parameter, depth value, footprint or UI placement rather than redesigning the scene. Preserve established controls, interactions and scene flow. Compare each meaningful change with the baseline; stop when the requested polish is achieved.

## Verify the result

Run `npm test`, `npm run build` and `npm run dev` after implementation. Replay the affected paths, inspect browser errors and compare before/after views at matching positions. Use the relevant existing `tests/smoke.html`, `tests/depth.html`, `tests/boarding.html` or `tests/ferry.html` harness when behavior is affected, and verify neighboring scenes when a shared system changes. Fix introduced regressions before finishing; report the targeted changes, checks performed and unresolved limitations.
