import { test, expect } from "@playwright/test";

test("Wybór opcji z dropdown na DemoQA", async ({ page }) => {
  await page.goto("https://demoqa.com/select-menu");

  // Znajdź i wybierz opcję po wartości
  await page.selectOption("#oldSelectMenu", { value: "4" });

  // Sprawdź, czy opcja została wybrana
  const selectedOption = await page.locator("#oldSelectMenu").inputValue();
  expect(selectedOption).toBe("4");
});

test("Obsługa checkboxów i radio buttonów na DemoQA", async ({ page }) => {
  await page.goto("https://demoqa.com/checkbox");

  // Rozwiń drzewo katalogów, klikając w strzałkę obok "Home"
  await page.click('button[title="Toggle"]');

  // Kliknij checkbox "Documents"
  await page.click('label[for="tree-node-documents"]');

  // Sprawdź, czy checkbox został zaznaczony
  const isChecked = await page.isChecked("#tree-node-documents");
  expect(isChecked).toBeTruthy();

  // Przejdź do strony radio button
  await page.goto("https://demoqa.com/radio-button");

  // Kliknij radio button "Yes"
  await page.click('label[for="yesRadio"]');

  // Sprawdź, czy radio button "Yes" jest zaznaczony
  const isRadioChecked = await page.isChecked("#yesRadio");
  expect(isRadioChecked).toBeTruthy();
});

test("Obsługa alertów na DemoQA", async ({ page }) => {
  await page.goto("https://demoqa.com/alerts");

  // Obsłuż alert (OK)
  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toBe("You clicked a button");
    await dialog.accept();
  });
  await page.click("#alertButton");
});

import path from "path";

test("Upload pliku na DemoQA", async ({ page }) => {
  await page.goto("https://demoqa.com/upload-download");

  // Ścieżka do pliku testowego
  const filePath = path.resolve(__dirname, "../test-files/sample.txt");

  // Załaduj plik
  await page.setInputFiles("#uploadFile", filePath);

  // Sprawdź, czy plik został załadowany
  const uploadedFile = await page.locator("#uploadedFilePath").textContent();
  expect(uploadedFile).toContain("sample.txt");
});

test("Obsługa iframe na DemoQA", async ({ page }) => {
  await page.goto("https://demoqa.com/frames");

  // Przejdź do iframe
  const frame = page.frameLocator("#frame1");

  // Sprawdź tekst wewnątrz iframe
  const text = await frame.locator("h1").textContent();
  expect(text).toBe("This is a sample page");
});
