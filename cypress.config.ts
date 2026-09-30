import { defineConfig } from 'cypress';
export default defineConfig({
  video: true,
  allowCypressEnv: false,
  screenshotOnRunFailure: true,
  retries: { runMode: 1, openMode: 0 },
  reporter: 'junit',
  reporterOptions: { mochaFile: 'reports/junit/results-[hash].xml', toConsole: true },
  viewportWidth: 1440,
  viewportHeight: 1000,
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://jaxencreekdroneservices.com',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 90000,
    requestTimeout: 20000,
    responseTimeout: 30000,
  },
});
