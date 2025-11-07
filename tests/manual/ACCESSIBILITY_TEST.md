# Accessibility Testing Guide

## Keyboard Navigation

### Tab Order Testing
```bash
# Test Procedure
1. Open page
2. Press Tab repeatedly
3. Verify logical tab order
4. Verify all interactive elements accessible
5. Verify focus indicators visible

# Pages to Test
- [ ] Patient Dashboard
- [ ] Doctor Consultation
- [ ] Lab Upload
- [ ] Pharmacy Dispense
- [ ] Receptionist Registration
- [ ] Settings
```

### Keyboard Shortcuts
```bash
# Test Cases
- Enter key on buttons → Should activate
- Space on checkboxes → Should toggle
- Escape on modals → Should close
- Arrow keys in selects → Should navigate
- Tab to skip non-interactive elements
```

## Screen Reader Testing

### Test with NVDA (Windows) or VoiceOver (Mac)
```bash
# Test Procedure
1. Enable screen reader
2. Navigate through page
3. Verify all content announced
4. Verify form labels read
5. Verify button purposes clear
6. Verify error messages announced

# Pages to Test
- [ ] All dashboards
- [ ] All forms
- [ ] All modals
- [ ] All navigation menus
```

### ARIA Labels
```bash
# Verify
- All icon-only buttons have aria-label
- All form inputs have labels
- All modals have proper roles
- All status messages have roles
- All landmarks properly marked
```

## Color Contrast

### Test with Lighthouse
```bash
# Run Audit
1. Chrome DevTools → Lighthouse
2. Select "Accessibility"
3. Run audit
4. Review contrast issues

# Target
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- Interactive elements: 3:1 contrast ratio
```

### Manual Check
```bash
# Test Cases
- Light text on light background → Should fail
- Dark text on dark background → Should fail
- Verify all text readable
- Verify focus indicators visible
```

## Responsive Design

### Mobile (320px - 768px)
```bash
# Test Cases
- [ ] No horizontal scroll
- [ ] Touch targets ≥ 44px
- [ ] Text readable without zoom
- [ ] Forms usable
- [ ] Navigation accessible
- [ ] Bottom nav works
```

### Tablet (768px - 1024px)
```bash
# Test Cases
- [ ] 2-column layouts work
- [ ] Sidebar collapses correctly
- [ ] Navigation accessible
- [ ] Forms usable
```

### Desktop (1024px+)
```bash
# Test Cases
- [ ] 3-column layouts work
- [ ] Sidebar expands
- [ ] All features accessible
- [ ] Hover states work
```

## Accessibility Checklist

### WCAG 2.1 Level AA Compliance
- [ ] **Perceivable**
  - [ ] Text alternatives for images
  - [ ] Captions for media
  - [ ] Sufficient color contrast
  - [ ] Text resizable up to 200%

- [ ] **Operable**
  - [ ] Keyboard accessible
  - [ ] No seizure-inducing content
  - [ ] Navigable
  - [ ] Input methods

- [ ] **Understandable**
  - [ ] Readable
  - ] Predictable
  - [ ] Input assistance

- [ ] **Robust**
  - [ ] Compatible with assistive technologies
  - [ ] Valid HTML
  - [ ] Proper ARIA usage

## Testing Tools

### Automated
- **Lighthouse** - Accessibility audit
- **axe DevTools** - Browser extension
- **WAVE** - Web accessibility evaluation

### Manual
- **NVDA** - Screen reader (Windows)
- **VoiceOver** - Screen reader (Mac)
- **Keyboard only** - Tab navigation
- **Zoom 200%** - Text scaling

## Common Issues to Fix

1. **Missing Labels**
   - Add `aria-label` to icon buttons
   - Add `<label>` to form inputs

2. **Poor Contrast**
   - Adjust color values
   - Use semantic color tokens

3. **Keyboard Traps**
   - Ensure Escape closes modals
   - Ensure Tab order logical

4. **Missing Focus Indicators**
   - Add visible focus styles
   - Ensure all interactive elements focusable

5. **Missing ARIA**
   - Add roles to landmarks
   - Add aria-live for dynamic content

