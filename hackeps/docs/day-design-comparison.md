# Day design comparison

Reference: four Figma screenshots supplied by the project owner on 2026-09-16.
These are scaled screenshots, not inspectable frames or a mobile specification;
measurements are proportional, not a pixel-perfect certification.

## Corrected sizing

- Increased the desktop mentor/hacker illustrations from a 336 px cap to 560 px,
  keeping the existing stacked mobile layout and bounded image widths.
- Grouped countdown numbers with their labels and added responsive spacing.
  Each unit stays together and the complete countdown fits at 320 px.
- Moved desktop hero clouds inside the page, matching the reference composition.
- Reduced the excessive heading-to-calendar gap from 176 px to 40 px on desktop,
  with smaller spacing on mobile.

## Remaining reference differences

- The reference places the introductory text below the role illustrations on
  Home. The implementation places it on Dates. The text still describes the
  2025 edition, so it was not duplicated or promoted as current information.
- Dates has no Web Live section between the calendar and schedule, unlike the
  reference. This is a composition difference, separate from the spacing fix.
- The footer lacks the reference's tree illustrations and uses a smaller tower.
- Contact uses a much wider form column than the supplied reference, with the
  submit button inside that column rather than spanning both columns.
- FAQ preserves the reference's dark background and orange accordion treatment;
  its height differs because it contains more real questions.
- The schedule's blue dashed outlines in the screenshot may be Figma selection
  guides. They were not reproduced as website decoration without design evidence.
- Gallery photographs, sponsor identities and unfinished copy remain pending.
  Empty content was not replaced with invented content to match the screenshots.
- The dark backgrounds in the supplied form/FAQ frames are part of this reference;
  they were not interpreted as the separate night theme.

## Verification

- Browser inspection at 1440 px; Home and Dates also checked at 320 and 768 px.
- No document-level horizontal overflow at the checked mobile/tablet widths.
- Existing countdown regression suite: 3 tests passed.
- Production build passed with existing project warnings.
