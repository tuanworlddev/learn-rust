# Lesson illustrations

Four original editorial illustrations were generated with the built-in Imagegen tool for this project. The selected originals are stored in the current image-generation session; production assets are compressed WebP copies without compositional edits.

- `public/images/lessons/embedded-workbench.webp`: temperature sensor, microcontroller, and a display. Context illustration, not a wiring reference.
- `public/images/lessons/backend-service.webp`: a client, services, and data storage. Context illustration, not an exact network topology.
- `public/images/lessons/desktop-shared.webp`: notes on a laptop, phone and tablet, illustrating a shared application core.
- `public/images/lessons/game-simulation.webp`: robots moving through a grid with obstacles, illustrating a programmable simulation.

Concepts that depend on exact rules—ownership, borrowing, Result, and the poll/wake cycle—use native interactive diagrams in `components/lesson-visual.tsx`, with accessible text and keyboard controls. Their explanatory text is part of the lesson UI, not embedded in a raster image.

## Embedded illustration prompt

Use case: scientific-educational. Asset type: editorial illustration embedded inside a Vietnamese Rust Embedded/IoT lesson, wide landscape. Primary request: a concrete, technically plausible electronics workbench showing how an embedded application connects a temperature sensor, a small development microcontroller board, and a modest desktop display with a simple live temperature line graph. Show a few clear insulated jumper wires on a breadboard, a USB cable connecting the board to a laptop, and a separate small status LED, arranged neatly and legibly. Style: sophisticated clean editorial illustration with realistic object shapes and subtle paper-like texture, warm neutral background and restrained rust orange, teal, and charcoal accents. Composition: close view, all major objects entirely within frame, generous breathing space, no people. No letters, words, labels, logos, numbers or fake source code anywhere. Do not imply exact circuit wiring; this is contextual illustration, not a schematic. Avoid clutter, glossy 3D emojis, neon gradients and decorative icons.

## Backend illustration prompt

Use case: illustration-story. Asset type: contextual illustration inside an introductory Vietnamese Rust backend lesson. Primary request: a calm, professional, educational cutaway scene showing a small software service: a laptop on a tidy developer desk facing three compact server units in the background, one database storage unit, and a few simple orange data packets moving along a visible connecting cable. This is a contextual picture, not an exact architecture diagram. Style: refined editorial illustration with tactile paper grain, clean technically recognizable silhouettes, consistent warm neutral, charcoal, rust orange and muted teal colors. Composition: wide landscape, compact subject group with generous clear space, no giant title area, all subjects legible at half-width in a course page. No people. No text, letters, source code, numbers, logos or watermarks. Avoid excessive detail, neon, glossy emoji shapes, fake screens full of nonsense, floating decorative badges.

## Desktop/shared core illustration prompt

Use case: illustration-story. Asset type: contextual illustration for a Vietnamese Rust desktop and shared mobile library lesson. Draw a tidy developer workbench with a laptop, a smartphone on a stand, and a small tablet, all showing a similar minimal note-taking app with a few simple colored note cards, a search magnifying glass, and a checkmark. No legible text or numbers on screens. A small central copper-colored modular component beside the devices subtly represents the shared application logic. Refined editorial illustration, tactile paper texture, natural proportions, warm off-white and charcoal, restrained rust orange and muted teal. Wide landscape composition, recognizably functional devices, calm professional educational tone. No people, lettering, logos, watermarks, decorative floating icons, neon or excessive details. The picture illustrates shared functionality across devices, not a wiring diagram.

## Game/simulation illustration prompt

Use case: illustration-story. Asset type: educational context illustration for a Vietnamese Rust game and simulation programming lesson. Depict a developer's monitor displaying a small top-down 2D simulation: a simple square-tiled landscape with several tiny autonomous wheeled robots navigating around a few rectangular obstacles. Beside the monitor, neatly arranged small cards with simple object silhouettes hint at entities, movement, and collision without any text. Refined editorial illustration with tactile paper grain, clean shapes, warm neutral background, charcoal, rust orange and muted teal. Wide landscape, coherent scale, calm focused professional atmosphere, modest scene, no people. No letters, numbers, source code, logos, watermarks, neon, glossy emoji styling, or complicated fake interface. This is a concrete example of a programmable simulation, not an exact algorithm diagram.

The 32×32 PNG/ICO in the introductory Tauri Cargo lab is a deterministic code-generated build fixture, separate from these educational illustrations. It lets the text-only downloadable lab compile without a missing icon asset.
