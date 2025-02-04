import { test, expect } from "@playwright/test";

test("Sprawdzenie tytułu strony DemoQA", async ({ page }) => {
  // Otwórz stronę
  await page.goto("https://demoqa.com");

  // Pobierz tytuł strony
  const pageTitle = await page.title();

  // Sprawdź, czy tytuł jest poprawny
  expect(pageTitle).toBe("DEMOQA");
});

test("Wypełnienie formularza Text Box na DemoQA", async ({ page }) => {
  // Przejdź na stronę
  await page.goto("https://demoqa.com/text-box");

  // Wpisz dane w pola formularza
  await page.fill("#userName", "Michał Zając");
  await page.fill("#userEmail", "michal@example.com");
  await page.fill("#currentAddress", "Kraków, Polska");
  await page.fill("#permanentAddress", "Warszawa, Polska");

  // Kliknij przycisk Submit
  await page.click("#submit");

  // Sprawdź, czy dane się wyświetliły w sekcji output
  const outputName = await page.locator("#name").textContent();
  expect(outputName).toContain("Michał Zając");
});
