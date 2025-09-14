// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests',
  use: { baseURL: 'http://localhost:4173', headless: true },
  webServer: {
    command: 'npx http-server . -p 4173 -c-1',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  },
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']]
});
