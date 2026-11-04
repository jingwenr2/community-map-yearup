# Year Up community map

A short, full-screen presentation of six students and the places and communities connected to them. The globe uses Canvas orthographic projection, a bundled Earth texture and great-circle connection geometry.

## Run and publish

Node.js 18+ is required. Run `npm run dev` and open http://127.0.0.1:5180. Run `npm run check` for data and navigation checks, `npm run build` to create `dist/`, and `npm run preview` to serve the build.

The GitHub Actions workflow in `.github/workflows/deploy.yml` checks, builds and publishes pushes to `main` through GitHub Pages. The live site is https://jingwenr2.github.io/community-map-yearup/. All asset paths are relative and work beneath the repository path.

## Presentation

Seven screens: Ricardo → Christina → Fariza → Jenny → Ibrahim → Yense → shared summary. Each student has one complete profile containing their portrait, short story, communities, places, languages, interests and colors where supplied. The final screen shows all four shared insights together. There are no chapters or location steps.

Next and Back move between people and the final summary. Arrow keys follow the same sequence. Bottom portraits and globe portraits select the same complete profile. Home and Our people return to Ricardo; Shared summary opens the final screen. The globe only animates when changing the selected person, for 500 milliseconds. Reduced-motion preferences and Instant transitions skip camera movement. Repeated clicks during a transition are ignored.

The existing factual answers and geographic relationships remain in `src/team.js`. Concise editorial stories and the navigation model live in `src/scenes.js`; the stories are summaries, not direct quotes. Jenny’s profile highlights her Math Club and Chinese Culture Club presidencies at BMCC, the five or six attendees at the first meeting, and her aim to help members become friends through fun, educational activities. All of a person's places are listed at once. Globe markers hide behind Earth; flags indicate the country connected to a place, without making nationality claims. The map information button explains geographic accuracy and relationship labels.

## Portraits and assets

All six portraits are bundled in `public/photos/`. Ibrahim’s file was copied from the upload named `ibarhim.jpeg`. Original uploads remain unchanged. Individual crop settings keep faces visible. Nearby globe portraits spread with leader lines to their unchanged geographic coordinates.

Inter is bundled with its license in `public/fonts/`. Chinese-language elements use PingFang SC, Microsoft YaHei, Noto Sans SC and sans-serif fallbacks. Earth surface imagery is from the [WebGL Earth example texture](https://github.com/turban/webgl-earth/blob/master/images/2_no_clouds_4k.jpg), based on NASA Blue Marble. The fallback country boundaries are from [johan/world.geo.json](https://github.com/johan/world.geo.json), based on Natural Earth.

Automated checks cover all six profiles, location semantics, photo formats, globe arcs, direct student selection, the seven-screen sequence, Back/Next behavior, and Jenny’s supplied leadership details. Browser checks cover portrait loading, classroom laptop layouts, responsive width, keyboard controls, serial transitions, and the shared summary.
