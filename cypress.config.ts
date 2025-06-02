import { defineConfig } from 'cypress';

export default defineConfig({
  // don't block CORS for LLM request
  chromeWebSecurity: false,

  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
