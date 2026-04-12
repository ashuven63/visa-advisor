import { test, expect } from '@playwright/test';

/**
 * Visa Advisor Form - Basic Functionality Tests
 *
 * Tests the core functionality of the visa form including:
 * - Form rendering
 * - Country selection
 * - Trip purpose toggle
 * - Form submission with valid data
 */

test.describe('Visa Form - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the visa form with all required elements', async ({ page }) => {
    // Check page title and heading
    await expect(page).toHaveTitle(/Visa Advisor/);
    await expect(page.getByRole('heading', { name: /Do you need a visa/i })).toBeVisible();

    // Verify all form fields are present
    await expect(page.locator('#destination')).toBeVisible();
    await expect(page.locator('#residence')).toBeVisible();
    await expect(page.locator('#passport')).toBeVisible();
    await expect(page.locator('#days')).toBeVisible();
    await expect(page.locator('#heldVisas')).toBeVisible();

    // Verify trip purpose buttons
    await expect(page.getByRole('button', { name: 'Tourism' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Airport transit' })).toBeVisible();

    // Verify submit button
    await expect(page.getByRole('button', { name: 'Check my visa' })).toBeVisible();

    // Verify disclaimer is present
    await expect(page.getByText(/Important — read this first/i)).toBeVisible();
  });

  test('should have correct default values', async ({ page }) => {
    // Destination dropdown should show placeholder
    const destination = page.locator('#destination');
    await expect(destination).toHaveValue('');

    // Residence dropdown should show placeholder
    const residence = page.locator('#residence');
    await expect(residence).toHaveValue('');

    // Passport dropdown should show placeholder
    const passport = page.locator('#passport');
    await expect(passport).toHaveValue('');

    // Days should default to 7
    const days = page.locator('#days');
    await expect(days).toHaveValue('7');

    // Tourism should be selected by default
    const tourismButton = page.getByRole('button', { name: 'Tourism' });
    await expect(tourismButton).toHaveAttribute('aria-pressed', 'true');

    // Airport transit should not be selected
    const transitButton = page.getByRole('button', { name: 'Airport transit' });
    await expect(transitButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('should select destination country from dropdown', async ({ page }) => {
    const destination = page.locator('#destination');

    await destination.selectOption('FR');
    await expect(destination).toHaveValue('FR');

    await destination.selectOption('JP');
    await expect(destination).toHaveValue('JP');
  });

  test('should select residence country from dropdown', async ({ page }) => {
    const residence = page.locator('#residence');

    await residence.selectOption('US');
    await expect(residence).toHaveValue('US');

    await residence.selectOption('GB');
    await expect(residence).toHaveValue('GB');
  });

  test('should select passport country from dropdown', async ({ page }) => {
    const passport = page.locator('#passport');

    await passport.selectOption('CA');
    await expect(passport).toHaveValue('CA');

    await passport.selectOption('AU');
    await expect(passport).toHaveValue('AU');
  });

  test('should toggle between Tourism and Airport transit', async ({ page }) => {
    const tourismButton = page.getByRole('button', { name: 'Tourism' });
    const transitButton = page.getByRole('button', { name: 'Airport transit' });

    // Initially Tourism is selected
    await expect(tourismButton).toHaveAttribute('aria-pressed', 'true');
    await expect(transitButton).toHaveAttribute('aria-pressed', 'false');

    // Click Airport transit
    await transitButton.click();
    await expect(tourismButton).toHaveAttribute('aria-pressed', 'false');
    await expect(transitButton).toHaveAttribute('aria-pressed', 'true');

    // Click Tourism again
    await tourismButton.click();
    await expect(tourismButton).toHaveAttribute('aria-pressed', 'true');
    await expect(transitButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('should accept text input for held visas', async ({ page }) => {
    const heldVisas = page.locator('#heldVisas');

    await heldVisas.fill('US B1/B2, Schengen');
    await expect(heldVisas).toHaveValue('US B1/B2, Schengen');

    // Clear and enter new value
    await heldVisas.clear();
    await heldVisas.fill('UK Visitor Visa');
    await expect(heldVisas).toHaveValue('UK Visitor Visa');
  });

  test('should submit form with all valid data', async ({ page }) => {
    // Fill in all required fields
    await page.locator('#destination').selectOption('FR');
    await page.locator('#residence').selectOption('US');
    await page.locator('#passport').selectOption('US');
    await page.locator('#days').fill('14');
    await page.locator('#heldVisas').fill('Schengen, UK');

    // Click submit button
    const submitButton = page.getByRole('button', { name: 'Check my visa' });
    await submitButton.click();

    // Wait for potential navigation or loading state
    // Note: Add specific assertions based on expected behavior after submission
    await page.waitForTimeout(1000);
  });

  test('should handle country dropdown with all countries available', async ({ page }) => {
    const destination = page.locator('#destination');

    // Check that dropdown has multiple options
    const options = await destination.locator('option').count();
    expect(options).toBeGreaterThan(190); // There are ~195 countries

    // Verify specific countries exist
    await expect(destination.locator('option[value="US"]')).toHaveText('United States');
    await expect(destination.locator('option[value="GB"]')).toHaveText('United Kingdom');
    await expect(destination.locator('option[value="JP"]')).toHaveText('Japan');
    await expect(destination.locator('option[value="IN"]')).toHaveText('India');
  });
});
