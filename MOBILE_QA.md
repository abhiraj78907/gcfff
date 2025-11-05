Mobile QA Checklist (240–480px)

Viewports
- Test widths: 240, 320, 360, 375, 390, 414, 428, 480.
- Confirm no horizontal page scrolling on any route.

Layout & Scrolling
- Each page uses a single vertical scroll; no nested scroll boxes.
- Full-height pages use 100svh with min-h-0 on inner flex containers.
- No empty half-screen gaps on doctor Active Consultation; content stacks on small screens.

Typography & Touch Targets
- Body text >= text-sm; primary content text-base on mobile.
- Tap targets (buttons, inputs, selects) >= 44px height.
- Labels remain visible; focus states are obvious.

Navigation & Sidebars
- Sidebar trigger is finger-friendly; sidebar opens as sheet on mobile.
- Active route indicators are clear and consistent.

Tables & Lists
- Large tables are wrapped in overflow-x-auto within cards.
- No page-level horizontal scroll when tables overflow.

Performance & Accessibility
- Heavy charts/components are deferred or lazy-loaded as needed.
- ARIA labels on interactive elements; keyboard focus order logical.

Device Tests
- Android small devices (Pixel 4, Moto G) at narrow widths.
- iPhone SE/mini (320–375px), iPhone 12/13/14/15 (390–428px).

Screenshots
- Capture: Login, Register User (all accordions closed/open), Doctor Dashboard, Active Consultation, Pharmacy Dashboard, Inventory, Procurement, Lab Dashboard.

Notes for maintainers
- Do not change desktop styles; guard mobile changes via responsive utilities or isMobile state.
- Prefer min-h-[100svh] and min-h-0 to avoid iOS address bar sizing issues.


