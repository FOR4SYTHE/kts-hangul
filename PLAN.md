# Plan - Optimize Twilight Bolasaek Canvas Background Layers

## Goal
Update the Twilight Bolasaek Canvas background layers in `src/App.tsx` inside the `<main>` tag to use hardware-accelerated, optimized styles for better performance on mobile/tablet devices.

## Proposed Changes
1. Modify `src/App.tsx` around line 958 to 983.
2. Replace the background layers section with the optimized layers provided in the user request.
   - **Layer 1:** Added `style={{ transform: 'translateZ(0)' }}` to force hardware GPU acceleration.
   - **Layer 2:** Added `transform: 'translateZ(0)'`, `willChange: 'transform'`, and `contentVisibility: 'auto'` to style object.
   - **Layer 3:** Changed opacity to `[0.15]` (from `[0.18]`), added `transform: 'translateZ(0)'`, and moved `mixBlendMode: 'overlay'` to inline style.

## Verification
1. Verify that the application builds successfully without any errors using `npm run build` or similar.
2. Verify visual appearance by launching `npm run dev`.
