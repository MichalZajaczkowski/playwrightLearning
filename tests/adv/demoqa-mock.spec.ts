// tests/demoqa-mock.spec.ts
import { test, expect } from "@playwright/test";

test("Mockowanie odpowiedzi API przy użyciu Playwright", async ({ page }) => {
  // Przechwycenie żądania do endpointu /api/data i podmiana odpowiedzi
  await page.route("**/api/data", async (route) => {
    console.log(
      "Przechwycono wywołanie API, wysyłanie podmienionej odpowiedzi"
    );
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: "Test Data" }),
    });
  });

  // Nawigacja do strony, która wykonuje zapytanie do /api/data
  console.log("Nawigacja do https://demoqa.com/mockapi");
  await page.goto("https://demoqa.com/mockapi");

  // Opcjonalnie, czekamy na stabilizację sieci (czyli, gdy nie ma już aktywnych połączeń)
  await page.waitForLoadState("networkidle");

  // Czekamy na pojawienie się elementu z wynikiem
  console.log("Czekam na pojawienie się elementu '#result'");
  const resultLocator = page.locator("#result");
  await resultLocator.waitFor({ timeout: 30000 });

  // Pobieramy tekst z elementu i wypisujemy go do loga
  const resultText = await resultLocator.textContent();
  console.log("Znaleziony tekst: ", resultText);

  expect(resultText).toContain("Test Data");
});
