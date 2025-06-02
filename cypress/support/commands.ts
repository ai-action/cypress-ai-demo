/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import { PromptTemplate } from '@langchain/core/prompts';
import { Ollama } from '@langchain/ollama';
import { sanitize } from 'dompurify';
import { resolve } from 'path';

const llm = new Ollama({
  model: 'qwen2.5-coder',
  numCtx: 16384, // truncating input prompt limit=4096
});

const template = `
You're a QA engineer writing an E2E test step with Cypress

Rules:
1. Return raw JavaScript code with "cy" commands without "describe" and "it"
2. Write the minimum number of "cy" commands
3. Don't perform an action or assertion unless the element is visible in the DOM
4. Prefer locating with text or accessible label
5. Ensure selectors are unique and specific enough to select 1 element

Task: {task}

DOM:
\`\`\`html
{html}
\`\`\`
`;

const prompt = PromptTemplate.fromTemplate(template.trim());
const chain = prompt.pipe(llm);

function minutesToMilliseconds(minutes: number) {
  return 1000 * 60 * minutes;
}

function getGeneratedFilePath(): string {
  return resolve(
    Cypress.spec.absolute,
    `../__generated__/${Cypress.spec.name}.json`,
  );
}

const noop = () => {};

function readGeneratedFile() {
  return cy.readFile(getGeneratedFilePath(), { log: false }).should(noop);
}

function getTestKey(): string {
  return Cypress.currentTest.titlePath.join(' ');
}

function saveGeneratedCode(task: string, code: string) {
  readGeneratedFile().then((contents) => {
    contents = contents || {};

    const key = getTestKey();
    contents[key] = contents[key] || {};
    contents[key][task] = code;

    cy.writeFile(getGeneratedFilePath(), JSON.stringify(contents, null, 2), {
      log: false,
    });
  });
}

Cypress.Commands.add('ai', (task) => {
  Cypress.log({ displayName: 'ai', message: task });

  return readGeneratedFile().then((json) => {
    try {
      const code = json[getTestKey()][task];

      if (code) {
        return eval(code);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (error) {}

    cy.document({ log: false }).then(
      { timeout: minutesToMilliseconds(2) },
      async (doc) => {
        const response = await chain.invoke({
          task,
          // html: sanitize(doc.documentElement.outerHTML),
          html: sanitize(doc.body.innerHTML),
        });
        // console.log(response)

        const error = "I'm sorry, but I can't assist with that request.";
        if (response.includes(error)) {
          throw new Error(error);
        }

        const code = response
          .match(/```(javascript|js)?([\s\S]+?)```/)?.[2]
          ?.trim();
        if (code) {
          eval(code);
          saveGeneratedCode(task, code);
        }
      },
    );
  });
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      ai(task: string): Chainable<void>;
    }
  }
}

export {};
