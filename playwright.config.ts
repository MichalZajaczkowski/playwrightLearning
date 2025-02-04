import { defineConfig } from "@playwright/test";
import os from "os";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000, // 30 sekund na test
  expect: {
    timeout: 5000, // 5 sekund na oczekiwanie elementów
  },
  reporter: [
    ["list"],
    ["allure-playwright"], // Generowanie raportu Allure
  ],
  workers: process.env.CI ? 2 : Math.max(1, os.cpus().length - 1),
  fullyParallel: true, // Pozwala na pełną równoległość testów
  globalSetup: require.resolve("./global-setup"), // Ustawienie raportowania w katalogach
  use: {
    headless: true, // Testy w trybie headless
    screenshot: "only-on-failure",
    trace: "on",
    launchOptions: {
      slowMo: 0, // Wyłącza spowolnienie testów
    },
    contextOptions: {
      viewport: { width: 1280, height: 720 }, // Ustawienie rozmiaru okna
    },
    browserName: "chromium", // Możesz zmienić przeglądarkę, jeśli potrzebujesz
  },
});
