// pages/DemoQaPage.ts
import { Page, Locator } from "@playwright/test";

export class DemoQaPage {
  // Deklaracja pól klasy, które będą reprezentować elementy na stronie
  readonly page: Page;
  readonly userNameInput: Locator;
  readonly userEmailInput: Locator;
  readonly currentAddressInput: Locator;
  readonly permanentAddressInput: Locator;
  readonly submitButton: Locator;
  readonly outputName: Locator;

  // Konstruktor inicjalizuje obiekt Page oraz ustawia locatory elementów
  constructor(page: Page) {
    this.page = page;
    this.userNameInput = page.locator("#userName"); // Pole imienia
    this.userEmailInput = page.locator("#userEmail"); // Pole email
    this.currentAddressInput = page.locator("#currentAddress"); // Pole adresu aktualnego
    this.permanentAddressInput = page.locator("#permanentAddress"); // Pole adresu stałego
    this.submitButton = page.locator("#submit"); // Przycisk wysyłania formularza
    this.outputName = page.locator("#name"); // Element, w którym pojawia się weryfikowany wynik
  }

  // Metoda do nawigacji do strony formularza Text Box
  async navigateToTextBoxPage() {
    await this.page.goto("https://demoqa.com/text-box");
  }

  // Metoda do wypełniania formularza
  async fillTextBoxForm(
    name: string,
    email: string,
    currentAddress: string,
    permanentAddress: string
  ) {
    await this.userNameInput.fill(name);
    await this.userEmailInput.fill(email);
    await this.currentAddressInput.fill(currentAddress);
    await this.permanentAddressInput.fill(permanentAddress);
  }

  // Metoda do wysłania formularza
  async submitForm() {
    await this.submitButton.click();
  }
}
