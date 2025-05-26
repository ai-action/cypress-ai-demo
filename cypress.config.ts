import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  // don't block CORS for LLM request
  chromeWebSecurity: false,
});
