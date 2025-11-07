# UI/UX Architecture and Component Guide

This document describes the current UI/UX architecture, visual design rules, component responsibilities, interaction patterns, accessibility expectations, and responsiveness strategy across the repository with a focus on the Patient experience (`apps/health-buddy-vibe`) and shared shell (`src`). Use it as a living reference for feature work and QA.

## Design System Overview

- Foundations
  - Color: Tailwind tokens (e.g., `bg-background`, `bg-card`, `text-foreground`, semantic states: `primary`, `success`, `destructive`, `warning`, `muted`, `border`).
  - Typography: mobile-first with responsive sizes (e.g., `text-sm`, `text-base`, `text-lg`, `md:text-xl`). Prefer fluid scale via `clamp()` for headings when needed.
  - Spacing: `px-4 md:px-8`, `gap-4 md:gap-6` patterns for lists/grids.
  - Corners & Shadows: rounded (`rounded-md`, `rounded-lg`) and subtle shadows on interactive elevations.
- Layout Primitives
  - Fixed `header` top with `sticky` and backdrop blur for context; `BottomNav` for patient app; scrollable main content (`min-h-0`, `overflow-auto`).
  - Grid: single column on mobile → 2/3 columns on `md/lg`. Use `items-stretch` to align card baselines and `max-h`+`overflow-auto` for tall columns.

## Shared Shell (src)

- `src/components/MainLayout.tsx`
  - Purpose: Application frame for non-admin roles; provides sidebar, top-bar controls, and content outlet.
  - Anatomy: `SidebarProvider` + `AppSidebar` (when authenticated and non-public routes), header with `SidebarTrigger`, `RoleSwitcher`, `SubEntrySwitcher`, `UserProfileDropdown`, entity indicator; `Outlet` for route content.
  - Interactions: Toggles sidebar; switches roles/entities; profile dropdown for profile/settings/logout.
  - Accessibility: Header controls have `aria-label`; focus-visible styles inherit from UI kit.

- `src/components/AppSidebar.tsx`
  - Purpose: Left navigation with role-aware menus (e.g., Pharmacy sections).
  - Behavior: Collapsible at smaller widths via `Sheet`; shows current route highlighting.

- Routing Guards
  - `src/components/ProtectedRoute.tsx`: Redirects unauthenticated users (uses `useAuth`).
  - `src/components/RoleRoute.tsx`: Asserts active role before rendering child routes.

- UI Kit (shadcn-based)
  - Path: `src/components/ui/*` (cards, buttons, inputs, dropdowns, table, etc.).
  - Styling: Tailwind utility classes; states (`hover`, `focus-visible`, `data-*`) consistent across components.

## Patient App (apps/health-buddy-vibe)

### App Frame

- Navigation
  - `components/BottomNav.tsx`: Persistent bottom navigation with icons and labels; mobile-first; desktop shows as secondary nav. Uses `cn` helper for active state.
  - Top Header (per page): `header.bg-card.sticky` with title and optional subtext.

- Layout Rules
  - Containers: `container mx-auto px-4 md:px-8` for consistent gutters.
  - Scroll: `pb-20` space to avoid overlapping BottomNav; desktop can reduce to `md:pb-0`.
  - Columns: `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6`; use `items-stretch` to align columns.

### Patient Components

- `components/ProgressRing.tsx`
  - What: SVG-based circular progress indicator (centered numeric % + caption).
  - Why: Quick glance of medicine intake adherence.
  - Props: `progress` (number), `size` (px), `strokeWidth` (px), `className`.
  - UX: Smooth `strokeDashoffset` transition; keep centered with `inline-flex` parent.

- `components/MedicineCard.tsx`
  - What: Rich card for a medicine schedule item.
  - Why: Communicate status and allow quick actions.
  - Props: `name`, `dosage`, `instructions`, `status` (taken|due|missed), `imageUrl`, `time`, `withFood`, `onMarkTaken`, `onSnooze`, `size` (default|compact).
  - UX: Compact variant enforces minimum height; actions bottom-aligned (`mt-auto`) for consistent alignment; responsive typography and images; `break-words` avoids overflow.

- `components/TimelineSection.tsx`
  - What: Section wrapper with optional timeline visual (dot+line).
  - Why: Group medicines by day parts (Morning/Afternoon/Night).
  - Props: `title`, `icon`, `showGuides` (toggle timeline visuals), `className`.

- `components/QuickActionButton.tsx`
  - What: CTA to mark all due medicines as taken.
  - Why: Speed up repeated actions.
  - Props: `onMarkAllTaken`, `dueCount`.

- `components/VoiceButton.tsx`
  - What: Floating action mic button to start/stop voice control.
  - Why: Accessibility and convenience.
  - Props: `isListening`, `onStart`, `onStop`, `isSupported`.

- `components/HelpButton.tsx`
  - What: Quick access to FAQ/Support via alert-dialog.
  - Why: Reduce friction for assistance.

### Patient Pages

- `pages/Home.tsx`
  - Hero: `ProgressRing` with centered percentage; daily count summary.
  - Actions: `QuickActionButton` for bulk mark taken.
  - Tracker Grid: Three columns (Morning/Afternoon/Night) in `md/lg`, single column on mobile; each column scroll-constrained on desktop to align heights; compact `MedicineCard`s.
  - Voice & Help: Floating `VoiceButton`, persistent `HelpButton`.

- `pages/Medicines.tsx`
  - Grid of medicine detail cards.
  - Each card shows image, name/generic, dosage/strength badges, instructions, optional warning, date range, and a reminders `Switch`.
  - Responsive: Image `w-20 md:w-24`; grid scales to 2/3 columns.

- `pages/Prescriptions.tsx`
  - Two groups: Current and Past prescriptions.
  - Card content: Date/Doctor/Hospital, diagnosis, medicines list. Actions: View/Download.
  - Responsive grids with consistent spacing; table-like medicine display for clarity.

- `pages/Appointments.tsx`
  - Upcoming and Past appointments in responsive grids.
  - `AppointmentCard`: Date/time status, doctor/hospital info, reason, and actions (Call/Directions/Reschedule for upcoming).

- `pages/Settings.tsx`
  - Sections: Personal Info, Caregiver Mode, Notifications, Language, Backup & Sync, Help & Support, Logout.
  - Language persists via `localStorage` and updates `document.documentElement.lang`.

### Interaction & Motion

- Transitions: Subtle `transition-colors` and layout `transition-all` for interactive states.
- Focus: `focus-visible` outlines on actionable elements per UI kit.
- Hover: Distinct on desktop; mobile avoids hover dependencies.

### Accessibility

- Semantics: Headings follow logical levels; sections labeled clearly.
- ARIA: Buttons include `aria-label` where icon-only; dialogs/sheets provide roles.
- Contrast: Uses semantic tokens; verify with Lighthouse.
- Keyboard: All actions accessible via keyboard focus.

### Responsiveness Strategy

- Mobile-first classes; scale up at `md`, `lg`, `xl`.
- Avoid horizontal scroll; wrap long text with `break-words` and constrain columns with `max-h` + `overflow-auto` on desktop.
- Ensure touch targets ≥ 44px (e.g., `h-11`, padding on buttons).

### Error Handling

- `src/components/ErrorBoundary.tsx` wraps the root app providing a user-friendly fallback with reload and go-home options, showing error + stack info when available.
- Toasts/Toaster (`ui/toaster`, `ui/sonner`) provide non-blocking feedback for actions like downloads/exports.

### Data & State

- `AuthContext`: Authentication state and active role.
- `SubEntryContext`: Active entity/sub-entry selection; drives entity-aware data getters.
- `lib/mockData`: Mock generators and entity-scoped selectors for demo.

### Performance

- Image assets are local; use `object-cover` and sized containers to avoid layout shift.
- Lists/cards render with reasonable defaults; consider virtualization if lists grow.
- Lazy-load heavy/secondary sections where applicable (future enhancement).

### Theming & Tokens

- Theme tokens are applied via CSS variables (e.g., progress ring colors). Changing the theme should cascade through the UI kit classes.

## Coding Guidelines (UI)

- Keep components small & focused; prefer composition over complex props.
- Use descriptive prop names; avoid abbreviations.
- Keep obvious comments minimal; document only non-trivial rationale/constraints.
- Guard clauses > deeply nested conditionals.

## QA & Testing Checklist

- Responsive Layout
  - Mobile: no horizontal scroll; BottomNav not overlapping tappable content.
  - Tablet/Desktop: Columns align; headers remain sticky; scrollable sections behave.
- Accessibility
  - Tab order logical; focus outlines visible; labels on icons.
  - Sufficient contrast per Lighthouse.
- Performance
  - No layout shifts on image load; fast interactions.
- Functional
  - Buttons trigger expected actions (view, download, mark taken, toggle reminders).
  - Navigation links route correctly.

## Roadmap / Nice-to-haves

- i18n integration for runtime language switching beyond persisted select.
- Virtualized lists for very large datasets.
- Server-driven feature flags for role-based modules.

---

For questions or proposed UI/UX changes, add a section to this file and reference exact files and components (use backticks for paths). Keep examples minimal and focused.


