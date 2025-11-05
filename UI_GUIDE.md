# Medichain UI Guide

## Design tokens
- Typography: Tailwind `font-sans`; sizes: `text-sm`, `text-base`, `text-lg`, `text-2xl`, `text-3xl`.
- Spacing: Tailwind scale; common gaps 2–6; gutters `px-4 md:px-6`.
- Radius: `rounded`, `rounded-md` (shadcn defaults in `components/ui/*`).
- Colors: CSS vars (primary, secondary, accent, muted, destructive, success, warning, info). Theme via root vars and `tailwind.config.ts`.

## Breakpoints
- `sm` ≥ 640px: 2‑column lists.
- `md` ≥ 768px: side‑by‑side forms; 50% charts.
- `lg` ≥ 1024px: 3–4 column dashboards.
- `xl` ≥ 1280px: increased gutters.

Patterns:
- Grids: `grid gap-4 md:grid-cols-2 lg:grid-cols-3`.
- Containers: `container mx-auto px-4`.
- Keep headings scalable; avoid fixed pixels.

## Accessibility
- Use `aria-label` on icon buttons; `aria-describedby` where needed.
- Keyboard: ensure `focus-visible` styling (use Tailwind ring utilities as needed).
- Contrast: use tokens; avoid raw hex.
- Landmarks: semantic `main`, meaningful headings.

## Components
- Use shadcn primitives in `src/components/ui/*` for consistency.
- Layout
  - Sidebar: collapsible; trigger has `aria-label`.
  - Header: role switcher, sub-entry switcher, active entity label.
  - Content: `main.flex-1.p-6` with responsive grids.

## Responsive patterns
- Sidebar collapses on small viewports; content stacks.
- Cards/lists: single column → grid at `md`/`lg`.
- Use accordions for dense forms (onboard/register).

## Performance
- Prefer route‑level code splitting for heavy pages/charts.
- Memoize large lists; avoid unnecessary re-renders.
- Defer non‑critical work where possible.

## Entity‑scoped data
- Active entity: `useSubEntry().currentEntityId`.
- Data getters (from `src/lib/mockData.ts`):
  - Pharmacy: `getMedicinesByEntity`, `getPrescriptionsByEntity`, `getSalesByEntity`, `getTopMedicinesByEntity`, `getDoctorPrescriptionsByEntity`.
  - Lab: `getLabWeeklyByEntity`, `getLabRecentUrgentByEntity`.
  - Patients: `getPatientsByEntity`.
  - Receptionist: `getReceptionQueueByEntity`.

## Adding a new page
1. Scaffold with `container mx-auto px-4 py-6` and semantic structure.
2. Compose using `components/ui/*` primitives.
3. Use responsive grids (`md`, `lg`) and consistent spacing.
4. Bind data via entity getters.
5. Add aria to icon-only buttons; ensure `focus-visible` styles.

## Theming
- Colors derive from CSS vars (shadcn). Update in `tailwind.config.ts` and root theme.

## Testing checklist
- Mobile (≤ 375px): sidebar collapsed; no horizontal scroll; tap targets ≥ 44px.
- Tablet (768–1024px): two‑column grids; charts readable.
- Desktop (≥ 1280px): 3–4 column dashboards; balanced whitespace.
- Keyboard: tab order logical; focus visible.
- Screen reader: labels present; headings coherent.
- Entity isolation: switch entities via Demo Login; verify different data on Dashboard, Pharmacy (Inventory/Prescriptions/Procurement), Analytics, Lab Dashboard.

