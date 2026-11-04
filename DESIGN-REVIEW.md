# Design review: a personal atlas

## Files actually read

- Installed `design-taste-frontend/SKILL.md` and its `references/imagery.md` and `references/critique.md`.
- The complete [Claude DESIGN.md](https://github.com/voltagent/awesome-design-md/blob/main/design-md/claude/DESIGN.md) from awesome-design-md. It was selected for its warm canvas, editorial hierarchy and 4/8/12/16/24/32px spacing roles. User-requested teal and Inter remain the actual palette and font.
- The current project’s source, original team answers, uploaded photos, camera/state system and responsive layout.

## Direction

Taste-skill’s draw script produced **One motif**, seed **907635137**, keeping the existing palette and typography. Idea: the six students’ documented places become the visual thread on one large globe. The working interaction is choosing a person and seeing that person’s places rotate into view. The supplied Earth and portraits provide the imagery. No stock imagery or sample personal content was added.

Adaptations required by the brief: preserve the real 3D globe instead of substituting a decorative shape; one portrait per person scene; no staged sentence entrances, extra footage or extra navigation steps. The component-focused portrait refinement does not replace the existing seven-screen presentation with a marketing page.

## Measured comparison

Production build inspected with the skill’s `inspect.mjs` at 1440×900, 768×1024 and 390×844.

| Check | Before | After |
| --- | --- | --- |
| Inspector failures | 5 | 0 |
| Inspector warnings | 8 | 3 |
| Source linter failures | 7 | 0 |
| Desktop portrait | 78×94px | 160×192px |
| Desktop name | about 39px | 46px |
| Body text | 18px | 18px |
| Mobile small-text findings | present | 0 |
| Low-contrast warnings | present | 0 |
| Decorative hairlines | present | removed |
| Primary action | text only | visible 44px-high Next button |
| Mobile frame | unequal measured bounds | equal bounds after header alignment |

Two explicit inspection allowances follow the user’s requirements: `few-pictures` (one actual portrait per scene, not four repeated photos) and `still-page` (one camera animation when changing people, not automatic motion while reading). These are not claims that the unmodified generic marketing rubric passed.

Remaining warnings are retained deliberately:

- `palette-cream`: warm white is expressly requested by the user.
- `no-footage`: the student portraits and working globe are the authentic supplied media; unsolicited video would add motion the user asked to reduce.
- `name-only-title` on smaller screens: the screen is intentionally the named student, with their main community and personal story immediately below; the Year Up stories header identifies the overall presentation.

The linter’s Inter font warnings are expected because the user explicitly requested that family and the draw kept the type system.

## Screenshot critique

ROUND 1
Seen in one second: a large globe, with a person whose photo is too small beside it.
Idea (one sentence): six real community stories connected through their actual places.
Live thing: direct student selection and camera rotation.
Layout words by section: person=editorial split / summary=plain text beside the globe.
Scores: design 6.5 · usability 7 · creativity 8 · content 8.5 → capped overall 6.0 because the initial inspector had failures.
Caps applied: initial inspection failures and the generic four-picture threshold.
Top three problems (most visible first), each with screenshot and fix:
1. `before/desktop-fold.jpg`: 78×94px portrait has insufficient presence; enlarge the one authentic photo rather than adding more.
2. `before/mobile-fold.jpg`: small, low-contrast controls; raise labels to 13px, improve contrast and preserve comfortable touch targets.
3. All before widths: repeated separators and zero-padded progress add interface noise; use space, active name weight and plain functional progress.

ROUND 2
Seen in one second: the actual student and a large softly colored Earth.
Idea (one sentence): the student's own places make the backdrop for their own short introduction.
Live thing: each name selects the same complete story and globe state.
Layout words by section: person=portrait-led editorial split / phone=globe then full story / summary=reading sequence.
Scores: design 6.5 · usability 8 · creativity 8 · content 8.5 → overall 7.5, a conservative self-review, not an external rating.
Caps applied: the general skill’s four-picture design cap is acknowledged; the user intentionally requires one portrait per scene.
Top three problems addressed:
1. Portrait prominence: all six enlarged crops were opened and reviewed.
2. Contrast and framing: final inspection reports no contrast or off-centre warning; phone header now shares both outer margins.
3. Reading while browsing: phone stories scroll naturally, with enough trailing space to bring the final line above the fixed controls.

## Functional browser checks

Custom Chrome checks covered all six photos, unchanged facts, one complete student screen, the final shared summary, geographic point alignment, Next/Back, keyboard controls, serial camera transitions, and reduced motion. Desktop text fits without clipping. Phone checks at 390×844, 320×568 and 430×932 confirmed natural page scrolling, no horizontal overflow, 44px navigation targets, readable final lines above fixed controls and scroll reset when selecting the next student.

The skill’s final fold and full-page screenshots for all three widths were opened. Its local JSON reports and image sheets remain under `.taste-skill/` (ignored by Git); the user-facing site contains no audit labels or implementation notes.
