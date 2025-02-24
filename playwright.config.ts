import { defineConfig } from "@playwright/test";
import os from "os";

export default defineConfig({
  testDir: "./src/tests",
  timeout: 45000,
  expect: {
    timeout: 5000,
  },
  retries: process.env.CI ? 2 : 0,

  reporter: [
    ['list'],
    ['allure-playwright', {
      detail: true,
      outputFolder: "allure-results",
      suiteTitle: false
    }]
  ],

  workers: process.env.CI ? 2 : Math.max(1, os.cpus().length - 1),
  fullyParallel: true,
  globalSetup: require.resolve("./global-setup"),

  use: {
    baseURL: 'https://www.globalsqa.com',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    launchOptions: {
      slowMo: process.env.SLOWMO ? parseInt(process.env.SLOWMO) : 0,
    },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        viewport: { width: 2560, height: 1440 },
      },
    },
  ],
});
