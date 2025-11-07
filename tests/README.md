# MediChain Testing Framework

Comprehensive testing suite covering authentication, role-based access, real-time sync, CRUD operations, navigation, performance, multilingual, security, and accessibility.

## Test Structure

```
tests/
├── unit/              # Unit tests for utilities and hooks
├── integration/       # Integration tests for Firestore operations
├── e2e/              # End-to-end workflow tests
├── manual/           # Manual testing checklists
├── utils/            # Test utilities and helpers
└── fixtures/         # Mock data and test fixtures
```

## Running Tests

### Unit & Integration Tests
```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### E2E Tests
```bash
npm run test:e2e      # Run E2E tests
```

### Manual Testing
Follow checklists in `tests/manual/` directory.

## Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: All Firestore operations
- **E2E Tests**: Critical user workflows
- **Manual Tests**: UI/UX validation

## Prerequisites

1. Firebase emulator suite (for local testing)
2. Test user accounts for each role
3. Sample data seeded in Firestore

