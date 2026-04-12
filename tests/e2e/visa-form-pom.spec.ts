import { test, expect } from '@playwright/test';
import { VisaFormPage } from './page-objects/VisaFormPage';

/**
 * Visa Advisor Form Tests using Page Object Model
 *
 * These tests demonstrate the use of the VisaFormPage POM
 * for cleaner, more maintainable test code.
 */

test.describe('Visa Form - Using Page Object Model', () => {
  let visaForm: VisaFormPage;

  test.beforeEach(async ({ page }) => {
    visaForm = new VisaFormPage(page);
    await visaForm.goto();
  });

  test('should fill and submit complete form using POM', async ({ page }) => {
    await visaForm.fillForm({
      destination: 'FR',
      residence: 'US',
      passport: 'US',
      days: '14',
      heldVisas: 'Schengen, UK',
      tripPurpose: 'tourism'
    });

    // Verify form was filled correctly before submission
    expect(await visaForm.getDestination()).toBe('FR');
    expect(await visaForm.getResidence()).toBe('US');
    expect(await visaForm.getPassport()).toBe('US');
    expect(await visaForm.getDays()).toBe('14');
    expect(await visaForm.getHeldVisas()).toBe('Schengen, UK');
    expect(await visaForm.isTourismSelected()).toBe(true);

    // Submit form
    await visaForm.submit();
  });

  test('should handle airport transit scenario using POM', async ({ page }) => {
    await visaForm.fillForm({
      destination: 'DE',
      residence: 'IN',
      passport: 'IN',
      days: '1',
      tripPurpose: 'transit'
    });

    expect(await visaForm.isAirportTransitSelected()).toBe(true);
    expect(await visaForm.isTourismSelected()).toBe(false);

    await visaForm.submit();
  });

  test('should toggle trip purpose using POM methods', async ({ page }) => {
    // Initially tourism should be selected
    expect(await visaForm.isTourismSelected()).toBe(true);

    // Select airport transit
    await visaForm.selectAirportTransit();
    expect(await visaForm.isAirportTransitSelected()).toBe(true);
    expect(await visaForm.isTourismSelected()).toBe(false);

    // Switch back to tourism
    await visaForm.selectTourism();
    expect(await visaForm.isTourismSelected()).toBe(true);
    expect(await visaForm.isAirportTransitSelected()).toBe(false);
  });

  test('should clear form using POM', async ({ page }) => {
    // Fill form first
    await visaForm.fillForm({
      destination: 'JP',
      residence: 'CA',
      passport: 'CA',
      days: '21',
      heldVisas: 'US B1/B2'
    });

    // Clear form
    await visaForm.clearForm();

    // Verify all fields are cleared
    expect(await visaForm.getDestination()).toBe('');
    expect(await visaForm.getResidence()).toBe('');
    expect(await visaForm.getPassport()).toBe('');
    expect(await visaForm.getDays()).toBe('');
    expect(await visaForm.getHeldVisas()).toBe('');
    expect(await visaForm.isTourismSelected()).toBe(true);
  });

  test('should verify country availability using POM', async ({ page }) => {
    // Check if specific countries exist
    expect(await visaForm.hasCountry('destination', 'US')).toBe(true);
    expect(await visaForm.hasCountry('destination', 'GB')).toBe(true);
    expect(await visaForm.hasCountry('destination', 'FR')).toBe(true);
    expect(await visaForm.hasCountry('destination', 'INVALID')).toBe(false);

    // Verify country count
    const count = await visaForm.getCountryCount('destination');
    expect(count).toBeGreaterThan(190);
  });

  test('should handle multiple form submissions using POM', async ({ page }) => {
    // First submission
    await visaForm.fillForm({
      destination: 'IT',
      residence: 'US',
      passport: 'US',
      days: '10'
    });
    await visaForm.submit();

    // Wait a bit (in real scenario, you'd wait for response/navigation)
    await page.waitForTimeout(500);

    // Navigate back and submit again with different data
    await visaForm.goto();
    await visaForm.fillForm({
      destination: 'ES',
      residence: 'CA',
      passport: 'CA',
      days: '7'
    });
    await visaForm.submit();
  });

  test('should verify page elements using POM', async ({ page }) => {
    // Check main elements are visible
    await expect(visaForm.heading).toBeVisible();
    await expect(visaForm.disclaimer).toBeVisible();
    await expect(visaForm.submitButton).toBeVisible();
    await expect(visaForm.tourismButton).toBeVisible();
    await expect(visaForm.airportTransitButton).toBeVisible();
  });

  test('should handle edge case: minimum days using POM', async ({ page }) => {
    await visaForm.fillForm({
      destination: 'MX',
      residence: 'US',
      passport: 'US',
      days: '1'
    });

    expect(await visaForm.getDays()).toBe('1');
    await visaForm.submit();
  });

  test('should handle edge case: maximum days using POM', async ({ page }) => {
    await visaForm.fillForm({
      destination: 'TH',
      residence: 'AU',
      passport: 'AU',
      days: '365'
    });

    expect(await visaForm.getDays()).toBe('365');
    await visaForm.submit();
  });

  test('should handle long held visas text using POM', async ({ page }) => {
    const longVisaList = 'US B1/B2 (2023-2025), Schengen Type C, UK Visitor, Australia ETA, Canada eTA, Japan Tourist, Singapore';

    await visaForm.fillForm({
      destination: 'SG',
      residence: 'IN',
      passport: 'IN',
      days: '14',
      heldVisas: longVisaList
    });

    expect(await visaForm.getHeldVisas()).toBe(longVisaList);
    await visaForm.submit();
  });

  test('should maintain state during interaction using POM', async ({ page }) => {
    // Fill partial form
    await visaForm.destinationDropdown.selectOption('FR');
    await visaForm.residenceDropdown.selectOption('US');

    // Toggle trip purpose
    await visaForm.selectAirportTransit();

    // Complete form
    await visaForm.passportDropdown.selectOption('US');
    await visaForm.daysInput.fill('5');

    // Verify all selections maintained
    expect(await visaForm.getDestination()).toBe('FR');
    expect(await visaForm.getResidence()).toBe('US');
    expect(await visaForm.getPassport()).toBe('US');
    expect(await visaForm.getDays()).toBe('5');
    expect(await visaForm.isAirportTransitSelected()).toBe(true);
  });
});
