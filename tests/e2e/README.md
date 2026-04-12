# Visa Advisor - E2E Test Suite

Comprehensive Playwright test suite for the Visa Advisor application.

## Overview

This test suite validates the complete functionality of the Visa Advisor form, including:
- Form rendering and basic functionality
- Form validation and error handling
- User workflows and realistic scenarios
- Accessibility features
- Edge cases and boundary conditions

## Test Organization

### Test Files

1. **visa-form.spec.ts** - Basic Functionality Tests
   - Form element visibility and rendering
   - Default values verification
   - Country dropdown selections
   - Trip purpose toggle functionality
   - Form submission

2. **form-validation.spec.ts** - Validation Tests
   - Days input validation (1-365 range)
   - Required field validation
   - Edge cases (same country selections, long text, special characters)
   - Keyboard navigation
   - Accessibility (ARIA attributes, labels)

3. **user-workflows.spec.ts** - User Workflow Tests
   - Realistic travel scenarios (US to France, India to Singapore, etc.)
   - Airport transit scenarios
   - Dual citizenship cases
   - Regional variations (Asia, Europe, Africa, South America)
   - Speed user workflows

4. **visa-form-pom.spec.ts** - Page Object Model Tests
   - Demonstrates clean test code using POM pattern
   - Reusable test patterns for form interactions

### Page Objects

**VisaFormPage.ts** - Page Object Model
- Encapsulates all form element locators
- Provides reusable methods for form interactions
- Improves test maintainability

## Running Tests

### Prerequisites

```bash
npm install
```

### Run All Tests

```bash
npm test
```

### Run Tests in Headed Mode (Watch Browser)

```bash
npm run test:headed
```

### Run Tests in UI Mode (Interactive Debugging)

```bash
npm run test:ui
```

### Debug Mode (Step Through Tests)

```bash
npm run test:debug
```

### View Test Report

```bash
npm run test:report
```

### Run Specific Test File

```bash
npx playwright test tests/e2e/visa-form.spec.ts
```

### Run Specific Test by Name

```bash
npx playwright test --grep "should display the visa form"
```

## Test Coverage

### Form Fields Tested

- Destination country dropdown (195+ countries)
- Country of residence dropdown
- Passport country dropdown
- Number of days input (1-365 validation)
- Trip purpose toggle (Tourism/Airport transit)
- Other visas held (optional text input)
- Submit button

### Validation Scenarios

- Required field validation (destination, residence, passport)
- Numeric input validation (min: 1, max: 365)
- Optional field handling
- HTML5 input type enforcement
- Boundary value testing (0, 1, 365, 366, negative values)

### User Scenarios Covered

- Short trips (1-3 days)
- Standard trips (7-14 days)
- Long-term stays (up to 365 days)
- Tourism travel
- Airport transit
- Dual citizenship scenarios
- Multiple held visas
- Regional travel patterns

### Accessibility Testing

- ARIA attributes (aria-pressed on toggle buttons)
- Proper form labels
- Keyboard navigation
- Role attributes

## Test Results Summary

Total Tests: **55**
- Basic Functionality: 9 tests
- Validation: 19 tests
- User Workflows: 16 tests
- Page Object Model: 11 tests

All tests verify:
- Element visibility
- Correct default values
- User input handling
- State management
- Form submission behavior

## Configuration

Tests are configured via `playwright.config.ts` in the project root:

- Test directory: `./tests/e2e`
- Base URL: `http://localhost:3000`
- Browser: Chromium (default)
- Timeout: 30 seconds per test
- Screenshots: On failure
- Videos: On failure
- Traces: On first retry

## CI/CD Integration

The test suite is configured for CI/CD environments:
- Retries failures twice in CI
- Uses single worker in CI for stability
- Starts dev server automatically before tests
- Generates HTML reports

## Best Practices Demonstrated

1. **Clear Test Names** - Descriptive test names that explain what's being tested
2. **Independent Tests** - Each test is isolated and can run independently
3. **Page Object Model** - Centralized element locators and reusable methods
4. **Proper Assertions** - Using Playwright's auto-waiting assertions
5. **Accessibility Focus** - Testing ARIA attributes and keyboard navigation
6. **Edge Case Coverage** - Boundary values, special characters, state management
7. **Realistic Scenarios** - Tests based on actual user workflows

## Extending the Tests

To add new tests:

1. Create test in appropriate spec file or create new one
2. Use `test.describe()` to group related tests
3. Use `test.beforeEach()` for common setup
4. Follow existing selector patterns (prefer data-testid, roles, labels)
5. Add meaningful assertions
6. Consider using the Page Object Model for complex interactions

Example:

```typescript
test('should handle new scenario', async ({ page }) => {
  await page.goto('/');

  // Your test logic here
  await page.locator('#destination').selectOption('FR');

  // Assertions
  await expect(page.locator('#destination')).toHaveValue('FR');
});
```

## Troubleshooting

### Tests Timing Out

- Increase timeout in test or config
- Check if dev server is running
- Verify network connectivity

### Flaky Tests

- Add explicit waits for dynamic content
- Use Playwright's auto-waiting features
- Check for race conditions

### Element Not Found

- Verify selector is correct
- Check if element is in viewport
- Ensure element is not hidden or disabled

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
