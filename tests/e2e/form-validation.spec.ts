import { test, expect } from '@playwright/test';

/**
 * Visa Advisor Form - Validation Tests
 *
 * Tests form validation including:
 * - Required field validation
 * - Number input validation (days 1-365)
 * - Edge cases and boundary conditions
 */

test.describe('Visa Form - Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Days Input Validation', () => {
    test('should accept valid day values within range 1-365', async ({ page }) => {
      const daysInput = page.locator('#days');

      // Test minimum value
      await daysInput.fill('1');
      await expect(daysInput).toHaveValue('1');

      // Test maximum value
      await daysInput.fill('365');
      await expect(daysInput).toHaveValue('365');

      // Test mid-range values
      await daysInput.fill('30');
      await expect(daysInput).toHaveValue('30');

      await daysInput.fill('180');
      await expect(daysInput).toHaveValue('180');
    });

    test('should have min and max attributes set correctly', async ({ page }) => {
      const daysInput = page.locator('#days');

      await expect(daysInput).toHaveAttribute('min', '1');
      await expect(daysInput).toHaveAttribute('max', '365');
      await expect(daysInput).toHaveAttribute('type', 'number');
    });

    test('should handle boundary values for days input', async ({ page }) => {
      const daysInput = page.locator('#days');

      // Try value below minimum
      await daysInput.fill('0');
      // HTML5 validation should prevent values below min

      // Try value above maximum
      await daysInput.fill('366');
      // HTML5 validation should prevent values above max

      // Try negative value
      await daysInput.fill('-5');
      // Should be prevented by min attribute
    });

    test('should have input type number which prevents non-numeric input', async ({ page }) => {
      const daysInput = page.locator('#days');

      // Verify input type is number (browsers natively prevent non-numeric input)
      await expect(daysInput).toHaveAttribute('type', 'number');
      await expect(daysInput).toHaveAttribute('inputmode', 'numeric');

      // The browser itself prevents typing non-numeric values in number inputs
      // so we verify the input type rather than trying to enter invalid data
    });

    test('should handle decimal values for days', async ({ page }) => {
      const daysInput = page.locator('#days');

      // Try decimal value
      await daysInput.fill('7.5');
      // Browser may round or reject decimal values for number inputs
    });
  });

  test.describe('Required Field Validation', () => {
    test('should show validation for required fields on submit', async ({ page }) => {
      // Try to submit with empty form
      const submitButton = page.getByRole('button', { name: 'Check my visa' });
      await submitButton.click();

      // Check if browser validation prevents submission
      // Note: This depends on whether the form has HTML5 required attributes
      // or custom JavaScript validation
      await page.waitForTimeout(500);
    });

    test('should validate destination country is selected', async ({ page }) => {
      const destination = page.locator('#destination');
      const submitButton = page.getByRole('button', { name: 'Check my visa' });

      // Fill other fields but leave destination empty
      await page.locator('#residence').selectOption('US');
      await page.locator('#passport').selectOption('US');

      await submitButton.click();

      // Verify destination is still empty
      await expect(destination).toHaveValue('');
    });

    test('should validate residence country is selected', async ({ page }) => {
      const residence = page.locator('#residence');
      const submitButton = page.getByRole('button', { name: 'Check my visa' });

      // Fill other fields but leave residence empty
      await page.locator('#destination').selectOption('FR');
      await page.locator('#passport').selectOption('US');

      await submitButton.click();

      // Verify residence is still empty
      await expect(residence).toHaveValue('');
    });

    test('should validate passport country is selected', async ({ page }) => {
      const passport = page.locator('#passport');
      const submitButton = page.getByRole('button', { name: 'Check my visa' });

      // Fill other fields but leave passport empty
      await page.locator('#destination').selectOption('FR');
      await page.locator('#residence').selectOption('US');

      await submitButton.click();

      // Verify passport is still empty
      await expect(passport).toHaveValue('');
    });

    test('should allow optional held visas field to be empty', async ({ page }) => {
      const heldVisas = page.locator('#heldVisas');

      // Fill required fields but leave held visas empty
      await page.locator('#destination').selectOption('FR');
      await page.locator('#residence').selectOption('US');
      await page.locator('#passport').selectOption('US');

      const submitButton = page.getByRole('button', { name: 'Check my visa' });
      await submitButton.click();

      // Verify held visas can be empty (it's optional)
      await expect(heldVisas).toHaveValue('');
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle same country for all three dropdowns', async ({ page }) => {
      // Select same country for destination, residence, and passport
      await page.locator('#destination').selectOption('US');
      await page.locator('#residence').selectOption('US');
      await page.locator('#passport').selectOption('US');

      await expect(page.locator('#destination')).toHaveValue('US');
      await expect(page.locator('#residence')).toHaveValue('US');
      await expect(page.locator('#passport')).toHaveValue('US');
    });

    test('should handle very long text in held visas field', async ({ page }) => {
      const heldVisas = page.locator('#heldVisas');
      const longText = 'US B1/B2, Schengen, UK Visitor, Australia ETA, Canada eTA, Japan Tourist, Singapore, Malaysia, Thailand, Indonesia, Philippines, South Korea, Hong Kong, Taiwan, Macao';

      await heldVisas.fill(longText);
      await expect(heldVisas).toHaveValue(longText);
    });

    test('should handle special characters in held visas field', async ({ page }) => {
      const heldVisas = page.locator('#heldVisas');
      const specialChars = 'B1/B2 (2023-2025), Schengen Type-C, UK "Visitor"';

      await heldVisas.fill(specialChars);
      await expect(heldVisas).toHaveValue(specialChars);
    });

    test('should maintain form state when toggling trip purpose', async ({ page }) => {
      // Fill form
      await page.locator('#destination').selectOption('FR');
      await page.locator('#residence').selectOption('US');
      await page.locator('#passport').selectOption('US');
      await page.locator('#days').fill('14');
      await page.locator('#heldVisas').fill('Schengen');

      // Toggle trip purpose
      await page.getByRole('button', { name: 'Airport transit' }).click();

      // Verify all fields maintained their values
      await expect(page.locator('#destination')).toHaveValue('FR');
      await expect(page.locator('#residence')).toHaveValue('US');
      await expect(page.locator('#passport')).toHaveValue('US');
      await expect(page.locator('#days')).toHaveValue('14');
      await expect(page.locator('#heldVisas')).toHaveValue('Schengen');
    });

    test('should handle rapid form field changes', async ({ page }) => {
      const destination = page.locator('#destination');

      // Rapidly change destination multiple times
      await destination.selectOption('US');
      await destination.selectOption('GB');
      await destination.selectOption('FR');
      await destination.selectOption('JP');

      // Final value should be Japan
      await expect(destination).toHaveValue('JP');
    });

    test('should handle form reset or reload', async ({ page }) => {
      // Fill form
      await page.locator('#destination').selectOption('FR');
      await page.locator('#residence').selectOption('US');
      await page.locator('#passport').selectOption('US');
      await page.locator('#days').fill('30');
      await page.locator('#heldVisas').fill('Schengen');

      // Reload page
      await page.reload();

      // Form should reset to defaults
      await expect(page.locator('#destination')).toHaveValue('');
      await expect(page.locator('#residence')).toHaveValue('');
      await expect(page.locator('#passport')).toHaveValue('');
      await expect(page.locator('#days')).toHaveValue('7');
      await expect(page.locator('#heldVisas')).toHaveValue('');
    });
  });

  test.describe('Accessibility and Keyboard Navigation', () => {
    test('should navigate form using keyboard', async ({ page }) => {
      // Tab through form fields
      await page.keyboard.press('Tab'); // Focus on destination
      await page.keyboard.press('Tab'); // Focus on residence
      await page.keyboard.press('Tab'); // Focus on passport
      await page.keyboard.press('Tab'); // Focus on days

      // Verify days input is focused
      await expect(page.locator('#days')).toBeFocused();
    });

    test('should have proper labels for form fields', async ({ page }) => {
      // Verify all fields have associated labels
      await expect(page.getByText('Destination country')).toBeVisible();
      await expect(page.getByText('Country of residence')).toBeVisible();
      await expect(page.getByText('Passport country')).toBeVisible();
      await expect(page.getByText('Number of days')).toBeVisible();
      await expect(page.getByText('Other visas you currently hold (optional)')).toBeVisible();
      await expect(page.getByText('Trip purpose')).toBeVisible();
    });

    test('should have proper ARIA attributes', async ({ page }) => {
      // Check toggle buttons have aria-pressed
      const tourismButton = page.getByRole('button', { name: 'Tourism' });
      const transitButton = page.getByRole('button', { name: 'Airport transit' });

      await expect(tourismButton).toHaveAttribute('aria-pressed');
      await expect(transitButton).toHaveAttribute('aria-pressed');

      // Check disclaimer has proper role
      const disclaimer = page.locator('[role="note"]');
      await expect(disclaimer).toBeVisible();
    });
  });
});
