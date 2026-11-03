# Different roots. One shared future.

A full-screen, dependency-free Earth presentation using the existing Canvas orthographic globe projection and great-circle connection geometry. A locally bundled Earth texture is mapped onto the sphere with directional lighting and a subtle atmosphere.

Run `npm run dev` and open http://127.0.0.1:5180. Run `npm run check` for data and scene navigation checks, `npm run build` to create `dist/`, and `npm run preview` to serve the build. Node.js 18+ is required.

## Presentation

The homepage opens directly on “Communities we share,” with the shared-connections globe and all five students in the bottom navigation. Next steps through four assignment insights, then student selection. Home returns to the first shared insight. Select a student to reveal their places and three story chapters. Left/right arrows move backward/forward; Escape returns to the people. The selection scene waits for an explicit member choice. Home restarts the presentation. Animations run serially for about 1.3 seconds; operating-system reduced motion and the Instant transitions checkbox skip them. No page scrolling is needed.

`src/scenes.js` contains the pure scene transitions and chapter selection. `src/app.js` coordinates the camera, Earth rendering, and content. `src/team.js` retains all supplied member data. Chapters use editorial summaries from the supplied data, not invented quotes. Missing story or belonging fields are omitted. Interests, languages, and favorite colors remain available in the “A little more about…” disclosure in My communities. Connections represent relationships to places, not migration routes. Country anchors are approximate. Fariza has no inferred New York location.

## Photos

All five uploaded portraits are connected in `src/team.js` and bundled under `public/photos/`: Ricardo (`ricardo.jpeg`), Christina (`christina.jpg`), Fariza (`fariza.jpeg`), Jenny (`jenny.png`), and Ibrahim (`ibrahim.jpeg`, copied from the upload named `ibarhim.jpeg`). Original uploads remain unchanged. Individual CSS crop settings keep faces visible without modifying the source images.

Selected profiles use 140–156px portraits grouped beside names and subtitles; desktop student navigation uses 72–76px portraits with a simple orange selected border. Globe portraits are 64px (56px on smaller screens), with leader lines ending at the exact projected place coordinates. Nearby portraits spread around their shared area without changing those coordinates. During place exploration, markers are hidden on the back hemisphere and remain upright. The opening uses geographic photo markers at the first documented place in each profile. Back-side locations are hidden by Earth, while all five students remain visible in the bottom portrait navigation. Isolated portraits sit directly at their projected place; nearby portraits separate with leader lines to the unchanged anchors. Clicking a globe portrait opens that student's story at the clicked place; bottom navigation opens their distance/place sequence. Both use the same selected-student state.

Browser verification uses an isolated local Chrome session. All five images decoded successfully; desktop/mobile screenshots were reviewed for crops and layout. Clickable marker selection, place/story return paths, New York cluster spacing, and JavaScript exceptions were checked.

## Assets

Earth surface: `public/earth.jpg`, from the [WebGL Earth example texture](https://github.com/turban/webgl-earth/blob/master/images/2_no_clouds_4k.jpg) (NASA Blue Marble imagery). Geographic fallback: `public/world.geo.json` from [johan/world.geo.json](https://github.com/johan/world.geo.json), based on Natural Earth. Assets are bundled; there are no runtime map services or external fonts.

Automated checks cover all member/place/chapter forward and return paths, selection with no default member, shared insights, missing chapter answers, factual location semantics, and arc geometry. Browser visual verification must be performed separately when browser tooling is available.

## Distance presentations

Each member opens on their international connection. Place scenes animate a great-circle line and kilometer count to a consistent New York City reference (40.7128, -74.0060). The camera frames the arc midpoint so both ends remain on the visible hemisphere. Distances use country anchors where no city was supplied. New York is a comparison point, not an inferred residence or journey. Christina’s Mexico introduction follows the user’s correction; other supplied place records are retained.

## Design and accessibility

The interface uses bundled Inter (license in `public/fonts/Inter-LICENSE.txt`), with system sans-serif fallbacks. Chinese-language elements use PingFang SC, Microsoft YaHei, Noto Sans SC, and sans-serif. The navy layout gives portraits and reflections priority, with a smaller globe, restrained lighting, and thin geographic connections. Promotional interface labels and decorative orbital/pulse effects have been removed.

One persistent Back and Next control drives the existing presentation sequence. Header controls provide Home, Our people, and Our connections; bottom portraits select a student and map portraits open that student's story. Country-anchor details, distance methodology, and the distinction between personal connections and travel routes are available from the small map information button. Distance appears as a secondary caption. Escape closes the information tooltip before returning to student selection.

The refined layout was checked in Chrome at 1366×768 and 1280×800 laptop sizes and a 390×844 narrow viewport. All portraits decoded, Inter loaded, every default story chapter fit at the laptop sizes without internal text overflow, and chapter navigation and the map tooltip passed browser checks. Original personal data and source photos remain intact.

The opening was browser-checked at 1366×768 and 390×844 before and after globe rotation. Geographic markers, all five bottom-navigation portraits, viewport bounds, and synchronized selection into Jenny’s story passed.

## Publish on GitHub Pages

The workflow in `.github/workflows/deploy.yml` checks and builds the site, uploads `dist/`, and deploys it to GitHub Pages after a push to `main`. In the repository's Settings → Pages, select **GitHub Actions** as the build and deployment source. All site URLs are relative, including photos, fonts and geographic assets, so the site works under the repository's `/community-map-yearup/` path.
