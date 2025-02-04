// tests/demoqa-data-driven.spec.ts
import { test, expect } from "@playwright/test";
import { DemoQaPage } from "../../pages/DemoQaPage";

// Przygotowanie zestawu danych testowych
const testData = [
  {
    name: "Michał Zając",
    email: "michal@example.com",
    currentAddress: "Kraków",
    permanentAddress: "Warszawa",
  },
  {
    name: "Anna Kowalska",
    email: "anna@example.com",
    currentAddress: "Gdańsk",
    permanentAddress: "Sopot",
  },
];

test.describe("Data Driven Tests dla formularza Text Box", () => {
  for (const data of testData) {
    test(`Weryfikacja formularza dla ${data.name}`, async ({ page }) => {
      const demoQaPage = new DemoQaPage(page);
      await demoQaPage.navigateToTextBoxPage();
      await demoQaPage.fillTextBoxForm(
        data.name,
        data.email,
        data.currentAddress,
        data.permanentAddress
      );
      await demoQaPage.submitForm();

      // Weryfikacja, czy wynik zawiera oczekiwane imię
      const outputNameText = await demoQaPage.outputName.textContent();
      expect(outputNameText).toContain(data.name);
    });
  }
});
