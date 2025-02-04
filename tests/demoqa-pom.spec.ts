// tests/demoqa-pom.spec.ts
import { test, expect } from "@playwright/test";
import { DemoQaPage } from "../pages/DemoQaPage";

test("Test formularza Text Box przy użyciu Page Object Model", async ({
  page,
}) => {
  // Inicjalizacja obiektu reprezentującego stronę DemoQA
  const demoQaPage = new DemoQaPage(page);

  // Nawigacja do strony z formularzem
  await demoQaPage.navigateToTextBoxPage();

  // Wypełnienie formularza danymi testowymi
  await demoQaPage.fillTextBoxForm(
    "Michał Zając",
    "michal@example.com",
    "Kraków",
    "Warszawa"
  );

  // Wysłanie formularza
  await demoQaPage.submitForm();

  // Weryfikacja: sprawdzamy, czy w wynikach pojawiło się imię "Michał Zając"
  const outputNameText = await demoQaPage.outputName.textContent();
  expect(outputNameText).toContain("Michał Zając");
});
