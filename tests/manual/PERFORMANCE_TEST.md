# Performance Testing Guide

## Load Testing Scenarios

### 1. Large Dataset Performance

#### Test: 1000+ Lab Requests
```bash
# Setup
1. Seed 1000 lab requests in Firestore
2. Navigate to Lab Test Requests page
3. Measure load time
4. Test pagination
5. Test filtering
6. Test status updates

# Expected Results
- Initial load: < 2 seconds
- Pagination: < 500ms per page
- Filter: < 1 second
- Status update: < 500ms
```

#### Test: 500+ Patient Queue
```bash
# Setup
1. Seed 500 patients in queue
2. Open Receptionist Queue page
3. Test scrolling performance
4. Test search functionality

# Expected Results
- Smooth scrolling (60fps)
- Search: < 1 second
- No memory leaks
```

### 2. Concurrent User Testing

#### Test: Multiple Roles Simultaneous Actions
```bash
# Setup
1. Open 5 browser windows:
   - Window 1: Doctor creating consultation
   - Window 2: Lab-tech updating status
   - Window 3: Pharmacist dispensing
   - Window 4: Receptionist registering
   - Window 5: Patient viewing medicines

2. Perform actions simultaneously
3. Verify real-time sync works
4. Verify no conflicts

# Expected Results
- All updates sync correctly
- No data conflicts
- Performance remains stable
```

### 3. Network Condition Testing

#### Test: Slow 3G Connection
```bash
# Chrome DevTools → Network → Throttling → Slow 3G
1. Test page loads
2. Test form submissions
3. Test real-time updates
4. Verify graceful degradation

# Expected Results
- Loading indicators show
- Timeouts handled gracefully
- User feedback provided
```

#### Test: Offline Mode
```bash
# Chrome DevTools → Network → Offline
1. Navigate to pages
2. Try to perform actions
3. Reconnect network
4. Verify sync

# Expected Results
- Cached data shows
- Offline indicator appears
- Changes sync on reconnect
```

## Performance Metrics

### Page Load Times
- **Dashboard:** < 2s
- **List Pages:** < 1s
- **Form Pages:** < 500ms
- **Modal Dialogs:** < 200ms

### Action Response Times
- **Save Consultation:** < 1s
- **Update Status:** < 500ms
- **Dispense Prescription:** < 2s
- **Upload Lab Results:** < 3s

### Real-Time Update Latency
- **Firestore Listener:** < 100ms
- **UI Update:** < 200ms
- **Cross-Role Sync:** < 500ms

## Memory Usage

### Baseline
- **Initial Load:** < 50MB
- **After 1 hour:** < 100MB
- **After 100 actions:** < 150MB

### Memory Leak Detection
```bash
# Chrome DevTools → Memory → Take Heap Snapshot
1. Take snapshot before actions
2. Perform 50 actions
3. Take snapshot after
4. Compare snapshots
5. Verify no significant growth
```

## Lighthouse Audit

### Run Lighthouse
```bash
# Chrome DevTools → Lighthouse
1. Select "Performance", "Accessibility", "Best Practices"
2. Run audit
3. Review scores

# Target Scores
- Performance: > 80
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 80
```

### Common Issues to Fix
- Large bundle size → Code splitting
- Unused CSS → Purge CSS
- Slow images → Optimize/compress
- Blocking scripts → Defer/async

## Load Testing Tools

### Recommended Tools
1. **Lighthouse CI** - Automated performance audits
2. **WebPageTest** - Detailed performance analysis
3. **Chrome DevTools** - Built-in performance profiling
4. **React DevTools Profiler** - Component performance

### Setup Lighthouse CI
```bash
npm install -g @lhci/cli
lhci autorun
```

## Performance Budget

| Metric | Budget | Current | Status |
|--------|--------|---------|--------|
| Initial Load | < 2s | ___ | ⚠️ |
| Time to Interactive | < 3s | ___ | ⚠️ |
| First Contentful Paint | < 1s | ___ | ⚠️ |
| Bundle Size | < 500KB | ___ | ⚠️ |
| Memory Usage | < 100MB | ___ | ⚠️ |

## Optimization Checklist

- [ ] Code splitting implemented
- [ ] Images optimized and lazy-loaded
- [ ] CSS purged of unused styles
- [ ] Fonts optimized (subset, preload)
- [ ] API calls debounced/throttled
- [ ] Virtual scrolling for long lists
- [ ] Memoization for expensive computations
- [ ] Service worker for offline support
- [ ] CDN for static assets
- [ ] Gzip/Brotli compression enabled

