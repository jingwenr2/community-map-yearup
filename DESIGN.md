# Our places, our stories

## Design idea

The six students' actual places form a shared atlas. A large globe is the stage, and each student's own account is the voice. This is a classroom presentation with one scene at a time, rather than a profile directory or a scrolling marketing page.

## Source material

- Six named students and their uploaded portraits in `public/photos/`.
- Original answers and relationship labels in `src/team.js`.
- Three-sentence first-person presentation adaptations in `src/scenes.js`.
- Jenny's two BMCC club presidencies, the small first meeting, friendship through activities, participation and listening are central to her account.
- Family roots and cultural connections are distinct from birthplace or residence. Connectors do not claim travel or migration.

## Visual system

| Role | Value |
| --- | --- |
| Ground | Muted blue `#183d55` |
| Main text | Soft white `#f3f7f8` |
| Secondary text | Pale blue-gray `#bbced8` |
| Active control | Light teal `#aed8dc` |
| Ocean | Soft sea blue, gently shaded |
| Land | Pale gray-green, gently shaded |
| English type | Bundled Inter, then system sans-serif |
| Chinese type | PingFang SC, Microsoft YaHei, Noto Sans SC, sans-serif |

Use one clear type hierarchy: student names at 28–46px, story text at 18px desktop / 15–16px narrow screens, one main community at 12–13px. Main reading text uses full soft-white ink; secondary notes use the muted role. Text should never depend on animation to become readable.

Use consistent outer margins, 8/16/24/32px spacing relationships, and a readable story column. The globe occupies the larger visual field. Space separates elements; cards, glass panels, neon, stars, orbital ornaments and heavy borders are unnecessary.

## Composition

- Desktop: one prominent authentic portrait with the name and one community; a three-sentence story below; a substantially larger globe to the right.
- Narrow screens: a separate globe stage above the full story in normal document flow. Longer stories and the shared summary may scroll naturally. Fixed name navigation and Back/Next controls have comfortable touch targets and safe-area spacing. Do not force desktop slide dimensions onto phones; switching people returns to the start of the new story.
- Keep the large profile portrait. At the user’s request, circular portraits also appear on the globe, tied to each person’s primary supplied place by a leader line. Hide back-facing anchors and keep nearby portraits separate. Bottom navigation keeps names and country flags.
- Geographic points use exact supplied coordinates. Nearby place labels may move with leader lines; their points do not move.
- Continent/ocean labels are geographic context, small enough to remain secondary. Hide labels behind Earth or where they would be clipped or collide.
- Bottom navigation contains names, a clear teal current-state name, and one Back/Next pair. Avoid duplicate counters and decorative labels.
- Home shows six official core values as plain text. Community exploration follows the stories, and one audience question closes the presentation.

## Interaction

A shared-values Home, six person screens, a community explorer and one audience question. One 500ms globe transition when changing people or entering the final question. Reveal the new person's content together after the transition; do not reveal sentences individually. Ignore overlapping navigation clicks. Arrow keys follow Back/Next. Preserve accessible focus, button names and reduced-motion behavior.

## Browser review

Review the rendered screen, not just the source. Verify all six portraits, first-person factual copy, map geometry, no clipped laptop story text, one complete summary, responsive navigation, marker alignment, keyboard operation and half-second transitions. Review at 1366×768, 1024×768, 390×844 and 320×844.

## Design references

This project-specific guide is original and follows the user's chosen palette and presentation constraints. The references inform the method rather than supplying a copied brand interface:

- [awesome-design-md](https://github.com/voltagent/awesome-design-md): explicit color, type and spacing roles; project-local design documentation. The actual `design-md/claude/DESIGN.md` was read in full and selected for its warm reading surface, typography roles and four-pixel spacing system. The user’s teal palette and Inter family take precedence over Claude’s coral and licensed serif fonts.
- [taste-skill](https://github.com/leonxlnx/taste-skill): subject-specific art direction, the project's real imagery, a functioning interactive centerpiece, and screenshot-based review at several widths.

## Selected direction and portrait size

Taste-skill dealt **One motif**, seed **907635137**, with the palette and type kept. Our six students’ documented places become the visual thread on one large Earth. The live interaction is switching between actual students and seeing the globe turn to their primary location. The original globe, not an invented flat ornament, supplies the main shape. No stock people, invented biographies or additional videos are needed.

Desktop portraits are now 160×192px, versus 78×94px before this pass. Laptop/tablet portraits use 130×156px where the story column is narrower. Phone portraits are 112×140px (96×120px on the smallest screens). Each photo keeps the supplied source and individual crop settings. Names and stories share a single visual group.

The user specifically requires one visible student photo and just one short transition when changing people. Those constraints override taste-skill’s general marketing-page expectations of four simultaneous images, footage and multiple entrance animations. Functional progress now reads “1 of 6” rather than decorative zero-padded numbering.

The group requested a blue background. The muted blue canvas now carries soft-white text and light-teal controls; map labels retain a pale blue surface for contrast against the globe. Mobile fixed controls use the same blue ground.

The shared-values globe is the opening page and Home destination. Visitors can select any member using the flags and names or visible portrait markers. The existing person-to-person sequence still ends on the shared view.

## Earth depth refinement

The requested reference now informs the globe itself: preserve the supplied daytime Earth colors, use directional shading and a soft blue atmosphere, and composite a real night-light raster. Connections between documented places use restrained warm-gold raised arcs. No additional student locations or routes were introduced. The night-light source and project license are bundled under public/earth-night-CREDITS.txt and public/earth-night-LICENSE.txt. The globe render uses a 640px sphere raster rather than the former 440px raster.

## Community exploration and audience finale

The values globe remains Home. Explore stories visits the six people in order, followed by the community explorer and one audience question. Header “Our connections” opens the explorer directly. Its five categories (Year Up, New York, Mexico, school/learning and movies/shows) are supported by the existing answers; distinct schools are explicitly not described as the same institution. Selecting a category highlights only its documented members and their routes. Related names open the corresponding full story. Filter changes retain keyboard focus on the selected filter.

The final step gently pulls the globe back over 500ms and reveals the complete question: “What’s one small thing that makes you feel included?” The question invites classroom conversation; no response data is collected. Reduced motion skips the camera movement. Back returns to connections; the final forward control returns Home. Photos, story details, colored geographic anchors and QR destination remain intact.
