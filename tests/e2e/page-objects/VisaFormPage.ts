import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Visa Advisor Form
 *
 * Encapsulates all locators and actions for the visa form page.
 * This improves test maintainability by centralizing element selectors
 * and common operations.
 */
export class VisaFormPage {
  readonly page: Page;

  // Form field locators
  readonly destinationDropdown: Locator;
  readonly residenceDropdown: Locator;
  readonly passportDropdown: Locator;
  readonly daysInput: Locator;
  readonly heldVisasInput: Locator;

  // Button locators
  readonly tourismButton: Locator;
  readonly airportTransitButton: Locator;
  readonly submitButton: Locator;

  // Content locators
  readonly heading: Locator;
  readonly disclaimer: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize form field locators
    this.destinationDropdown = page.locator('#destination');
    this.residenceDropdown = page.locator('#residence');
    this.passportDropdown = page.locator('#passport');
    this.daysInput = page.locator('#days');
    this.heldVisasInput = page.locator('#heldVisas');

    // Initialize button locators
    this.tourismButton = page.getByRole('button', { name: 'Tourism' });
    this.airportTransitButton = page.getByRole('button', { name: 'Airport transit' });
    this.submitButton = page.getByRole('button', { name: 'Check my visa' });

    // Initialize content locators
    this.heading = page.getByRole('heading', { name: /Do you need a visa/i });
    this.disclaimer = page.getByText(/Important — read this first/i);
  }

  /**
   * Navigate to the visa form page
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * Fill the complete visa form with provided data
   */
  async fillForm(data: {
    destination: string;
    residence: string;
    passport: string;
    days: string;
    heldVisas?: string;
    tripPurpose?: 'tourism' | 'transit';
  }) {
    await this.destinationDropdown.selectOption(data.destination);
    await this.residenceDropdown.selectOption(data.residence);
    await this.passportDropdown.selectOption(data.passport);
    await this.daysInput.fill(data.days);

    if (data.heldVisas) {
      await this.heldVisasInput.fill(data.heldVisas);
    }

    if (data.tripPurpose === 'transit') {
      await this.selectAirportTransit();
    }
    // Tourism is selected by default
  }

  /**
   * Select Tourism as trip purpose
   */
  async selectTourism() {
    await this.tourismButton.click();
  }

  /**
   * Select Airport Transit as trip purpose
   */
  async selectAirportTransit() {
    await this.airportTransitButton.click();
  }

  /**
   * Submit the visa form
   */
  async submit() {
    await this.submitButton.click();
  }

  /**
   * Get the current value of destination dropdown
   */
  async getDestination(): Promise<string> {
    return await this.destinationDropdown.inputValue();
  }

  /**
   * Get the current value of residence dropdown
   */
  async getResidence(): Promise<string> {
    return await this.residenceDropdown.inputValue();
  }

  /**
   * Get the current value of passport dropdown
   */
  async getPassport(): Promise<string> {
    return await this.passportDropdown.inputValue();
  }

  /**
   * Get the current value of days input
   */
  async getDays(): Promise<string> {
    return await this.daysInput.inputValue();
  }

  /**
   * Get the current value of held visas input
   */
  async getHeldVisas(): Promise<string> {
    return await this.heldVisasInput.inputValue();
  }

  /**
   * Check if Tourism is currently selected
   */
  async isTourismSelected(): Promise<boolean> {
    const ariaPressed = await this.tourismButton.getAttribute('aria-pressed');
    return ariaPressed === 'true';
  }

  /**
   * Check if Airport Transit is currently selected
   */
  async isAirportTransitSelected(): Promise<boolean> {
    const ariaPressed = await this.airportTransitButton.getAttribute('aria-pressed');
    return ariaPressed === 'true';
  }

  /**
   * Clear all form fields
   */
  async clearForm() {
    await this.destinationDropdown.selectOption('');
    await this.residenceDropdown.selectOption('');
    await this.passportDropdown.selectOption('');
    await this.daysInput.clear();
    await this.heldVisasInput.clear();
    await this.selectTourism(); // Reset to default
  }

  /**
   * Get count of available countries in dropdown
   */
  async getCountryCount(dropdown: 'destination' | 'residence' | 'passport'): Promise<number> {
    let locator: Locator;
    switch (dropdown) {
      case 'destination':
        locator = this.destinationDropdown;
        break;
      case 'residence':
        locator = this.residenceDropdown;
        break;
      case 'passport':
        locator = this.passportDropdown;
        break;
    }
    return await locator.locator('option').count();
  }

  /**
   * Check if a specific country exists in dropdown
   */
  async hasCountry(dropdown: 'destination' | 'residence' | 'passport', countryCode: string): Promise<boolean> {
    let locator: Locator;
    switch (dropdown) {
      case 'destination':
        locator = this.destinationDropdown;
        break;
      case 'residence':
        locator = this.residenceDropdown;
        break;
      case 'passport':
        locator = this.passportDropdown;
        break;
    }
    const option = locator.locator(`option[value="${countryCode}"]`);
    return await option.count() > 0;
  }
}
