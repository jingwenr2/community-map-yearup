# Year Up community map

A short, full-screen presentation of six students and the places and communities connected to them. The globe uses Canvas orthographic projection, a bundled Earth texture and great-circle connection geometry.

## Run and publish

Node.js 18+ is required. Run `npm run dev` and open http://127.0.0.1:5180. Run `npm run check` for data and navigation checks, `npm run build` to create `dist/`, and `npm run preview` to serve the build.

The GitHub Actions workflow in `.github/workflows/deploy.yml` checks, builds and publishes pushes to `main` through GitHub Pages. The live site is https://jingwenr2.github.io/community-map-yearup/. All asset paths are relative and work beneath the repository path.

## Presentation

Seven screens: Ricardo → Christina → Fariza → Jenny → Ibrahim → Yense → shared summary. Each student has one uncluttered screen with one portrait, their name, one main community, and three short first-person English sentences adapted from their supplied answers. The complete original facts remain in `src/team.js`. The final screen shows all four shared insights together. There are no chapters or location steps.

Next and Back move between people and the final summary. Arrow keys follow the same sequence. The small bottom name navigation selects a student; simple clickable place markers use the same selection state. Home and Our people return to Ricardo; Shared summary opens the final screen. The globe only animates when changing the selected person, for 500 milliseconds. Reduced-motion preferences and Instant transitions skip camera movement. Repeated clicks during a transition are ignored.

The original factual answers and geographic relationships remain in `src/team.js`. First-person presentation scripts, main communities and the navigation model live in `src/scenes.js`. The scripts are paraphrases requested for classroom delivery, not verbatim source quotations. Jenny’s profile highlights her Math Club and Chinese Culture Club presidencies at BMCC, the five or six attendees at the first meeting, and her aim to help members become friends through fun, educational activities. Relevant places and geographic connections appear together on the globe. Globe markers hide behind Earth; flags indicate the country connected to a place, without making nationality claims. The map information button explains geographic accuracy and relationship labels.

## Portraits and assets

All six portraits are bundled in `public/photos/`. Ibrahim’s file was copied from the upload named `ibarhim.jpeg`. Original uploads remain unchanged. Individual crop settings keep faces visible. Globe points remain at their exact projected anchors; nearby place-name labels spread with leader lines. The globe and bottom navigation contain no duplicate portraits.

Inter is bundled with its license in `public/fonts/`. Chinese-language elements use PingFang SC, Microsoft YaHei, Noto Sans SC and sans-serif fallbacks. Earth surface imagery is from the [WebGL Earth example texture](https://github.com/turban/webgl-earth/blob/master/images/2_no_clouds_4k.jpg), based on NASA Blue Marble. The fallback country boundaries are from [johan/world.geo.json](https://github.com/johan/world.geo.json), based on Natural Earth.

Automated checks cover all six profiles, location semantics, photo formats, globe arcs, direct student selection, the seven-screen sequence, Back/Next behavior, and Jenny’s supplied leadership details. Browser checks cover portrait loading, classroom laptop layouts, responsive width, keyboard controls, serial transitions, and the shared summary.

Small continent and ocean labels in `src/map-labels.js` follow the globe projection. Labels hide on the far side, near the edge, or when they would overlap student portraits. Oceans use softer italic text to keep the geographic context secondary to the students.

## Warm map storytelling design

A warm white background, charcoal text and muted teal accents replace the navy and orange interface. The larger Earth uses subdued sea blue and gray-green land with gentle shading; stars and glow are removed. One prominent portrait accompanies each story, with no keyword lists, biography sections or repeated photos. The final summary is a plain text sequence rather than a card grid. Continent and ocean labels remain small and readable. The globe rotates only when switching students, with one 500ms transition; content appears together without extra steps.

The project-specific art direction is documented in `DESIGN.md`, informed by the design-system documentation in awesome-design-md and the subject-led, screenshot-review approach in taste-skill. User instructions and the existing student facts determine the actual design.

## Computer presentation and QR browsing

Desktop keeps a full-screen map presentation with one person per slide. On phones, the same URL shows the globe above the complete story in normal document flow, with natural page scrolling for longer text and the shared summary. Student names and Back/Next remain fixed with touch-friendly controls and safe-area padding. There is no separate mobile site or truncated text pane. Switching students returns the phone to the start of the new story.

`design-taste-frontend` was installed using the Skill Installer, then its actual SKILL.md, imagery and critique references were read. Its draw, lint and production-browser inspection scripts were run. `DESIGN-REVIEW.md` records the before/after measurements, selected reference and user-requested exceptions. Portraits were enlarged without changing original image files.
