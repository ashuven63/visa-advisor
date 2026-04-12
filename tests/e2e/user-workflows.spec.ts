import { test, expect } from '@playwright/test';

/**
 * Visa Advisor Form - User Workflow Tests
 *
 * Tests realistic user workflows and scenarios:
 * - Common travel scenarios
 * - Different trip purposes
 * - Various country combinations
 */

test.describe('Visa Form - User Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('US citizen traveling to France for tourism', async ({ page }) => {
    // Select destination
    await page.locator('#destination').selectOption('FR');
    await expect(page.locator('#destination')).toHaveValue('FR');

    // Select residence
    await page.locator('#residence').selectOption('US');
    await expect(page.locator('#residence')).toHaveValue('US');

    // Select passport
    await page.locator('#passport').selectOption('US');
    await expect(page.locator('#passport')).toHaveValue('US');

    // Enter trip duration
    await page.locator('#days').fill('14');
    await expect(page.locator('#days')).toHaveValue('14');

    // Tourism is already selected by default
    await expect(page.getByRole('button', { name: 'Tourism' }))
      .toHaveAttribute('aria-pressed', 'true');

    // No held visas needed
    await page.locator('#heldVisas').clear();

    // Submit form
    await page.getByRole('button', { name: 'Check my visa' }).click();
  });

  test('Indian citizen with Schengen visa traveling to France', async ({ page }) => {
    await page.locator('#destination').selectOption('FR');
    await page.locator('#residence').selectOption('IN');
    await page.locator('#passport').selectOption('IN');
    await page.locator('#days').fill('10');
    await page.locator('#heldVisas').fill('Schengen Type C');

    await page.getByRole('button', { name: 'Check my visa' }).click();
  });

  test('Airport transit scenario - short layover', async ({ page }) => {
    await page.locator('#destination').selectOption('DE');
    await page.locator('#residence').selectOption('IN');
    await page.locator('#passport').selectOption('IN');
    await page.locator('#days').fill('1');

    // Select Airport transit
    await page.getByRole('button', { name: 'Airport transit' }).click();
    await expect(page.getByRole('button', { name: 'Airport transit' }))
      .toHaveAttribute('aria-pressed', 'true');

    await page.getByRole('button', { name: 'Check my visa' }).click();
  });

  test('Canadian traveling to Japan with multiple held visas', async ({ page }) => {
    await page.locator('#destination').selectOption('JP');
    await page.locator('#residence').selectOption('CA');
    await page.locator('#passport').selectOption('CA');
    await page.locator('#days').fill('21');
    await page.locator('#heldVisas').fill('US B1/B2, UK Visitor, Schengen');

    await page.getByRole('button', { name: 'Check my visa' }).click();
  });

  test('Long-term stay scenario - maximum days', async ({ page }) => {
    await page.locator('#destination').selectOption('TH');
    await page.locator('#residence').selectOption('AU');
    await page.locator('#passport').selectOption('AU');
    await page.locator('#days').fill('365');

    await page.getByRole('button', { name: 'Check my visa' }).click();
  });

  test('Weekend trip - minimum days', async ({ page }) => {
    await page.locator('#destination').selectOption('MX');
    await page.locator('#residence').selectOption('US');
    await page.locator('#passport').selectOption('US');
    await page.locator('#days').fill('3');

    await page.getByRole('button', { name: 'Check my visa' }).click();
  });

  test('Dual citizenship scenario - different residence and passport', async ({ page }) => {
    // US citizen living in Canada, traveling to UK
    await page.locator('#destination').selectOption('GB');
    await page.locator('#residence').selectOption('CA');
    await page.locator('#passport').selectOption('US');
    await page.locator('#days').fill('14');

    await page.getByRole('button', { name: 'Check my visa' }).click();
  });

  test('Business trip with various visas', async ({ page }) => {
    await page.locator('#destination').selectOption('SG');
    await page.locator('#residence').selectOption('IN');
    await page.locator('#passport').selectOption('IN');
    await page.locator('#days').fill('7');
    await page.locator('#heldVisas').fill('US B1/B2, Australia ETA');

    // For business trip, we'll use Tourism (as there's no separate business option)
    await page.getByRole('button', { name: 'Check my visa' }).click();
  });

  test('Change mind workflow - modify selections before submit', async ({ page }) => {
    // Initial selection
    await page.locator('#destination').selectOption('IT');
    await page.locator('#residence').selectOption('US');
    await page.locator('#passport').selectOption('US');

    // Change mind - different destination
    await page.locator('#destination').selectOption('ES');
    await expect(page.locator('#destination')).toHaveValue('ES');

    // Change trip duration multiple times
    await page.locator('#days').fill('10');
    await page.locator('#days').fill('7');
    await expect(page.locator('#days')).toHaveValue('7');

    // Toggle trip purpose back and forth
    await page.getByRole('button', { name: 'Airport transit' }).click();
    await page.getByRole('button', { name: 'Tourism' }).click();
    await expect(page.getByRole('button', { name: 'Tourism' }))
      .toHaveAttribute('aria-pressed', 'true');

    // Final submission
    await page.getByRole('button', { name: 'Check my visa' }).click();
  });

  test('Form completion with all fields including optional', async ({ page }) => {
    await page.locator('#destination').selectOption('AE');
    await page.locator('#residence').selectOption('PK');
    await page.locator('#passport').selectOption('PK');
    await page.locator('#days').fill('30');
    await page.locator('#heldVisas').fill('Schengen, UK Visitor, US B1/B2 (valid until 2026)');

    await page.getByRole('button', { name: 'Check my visa' }).click();
  });

  test('Quick form fill - speed user', async ({ page }) => {
    // Simulate a user who knows exactly what they want
    await page.locator('#destination').selectOption('GB');
    await page.locator('#residence').selectOption('US');
    await page.locator('#passport').selectOption('US');
    await page.locator('#days').fill('10');

    // Verify all values were set correctly before submission
    await expect(page.locator('#destination')).toHaveValue('GB');
    await expect(page.locator('#residence')).toHaveValue('US');
    await expect(page.locator('#passport')).toHaveValue('US');
    await expect(page.locator('#days')).toHaveValue('10');

    // Submit form
    await page.getByRole('button', { name: 'Check my visa' }).click();
  });

  test('Regional variations - Asian countries', async ({ page }) => {
    await page.locator('#destination').selectOption('CN');
    await page.locator('#residence').selectOption('KR');
    await page.locator('#passport').selectOption('KR');
    await page.locator('#days').fill('15');

    await page.getByRole('button', { name: 'Check my visa' }).click();
  });

  test('Regional variations - European countries', async ({ page }) => {
    await page.locator('#destination').selectOption('CH');
    await page.locator('#residence').selectOption('DE');
    await page.locator('#passport').selectOption('DE');
    await page.locator('#days').fill('5');

    await page.getByRole('button', { name: 'Check my visa' }).click();
  });

  test('Regional variations - African countries', async ({ page }) => {
    await page.locator('#destination').selectOption('ZA');
    await page.locator('#residence').selectOption('KE');
    await page.locator('#passport').selectOption('KE');
    await page.locator('#days').fill('20');

    await page.getByRole('button', { name: 'Check my visa' }).click();
  });

  test('Regional variations - South American countries', async ({ page }) => {
    await page.locator('#destination').selectOption('BR');
    await page.locator('#residence').selectOption('AR');
    await page.locator('#passport').selectOption('AR');
    await page.locator('#days').fill('14');

    await page.getByRole('button', { name: 'Check my visa' }).click();
  });

  test('Same country travel - citizen returning home', async ({ page }) => {
    await page.locator('#destination').selectOption('CA');
    await page.locator('#residence').selectOption('CA');
    await page.locator('#passport').selectOption('CA');
    await page.locator('#days').fill('1');

    await page.getByRole('button', { name: 'Check my visa' }).click();
  });
});
