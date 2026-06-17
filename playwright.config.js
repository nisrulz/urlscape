const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 15000,
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:8765',
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: 'python3 -m http.server 8765',
    port: 8765,
    timeout: 10000,
    reuseExistingServer: !process.env.CI,
  },
});
