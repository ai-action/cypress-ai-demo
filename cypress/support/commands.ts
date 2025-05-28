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

import { Ollama } from '@langchain/ollama'
import { PromptTemplate } from '@langchain/core/prompts'
import sanitizeHtml from 'sanitize-html';

const llm = new Ollama({
  model: 'llama3',
  temperature: 0,
  maxRetries: 2,
  numCtx: 8192, // fix truncating input prompt limit=4096
})

const template = `
Task: {input}

You're a QA engineer writing a single E2E test step with Cypress.

Rules:
1. You must return raw JavaScript code with "cy" commands without "describe" and "it"
2. Write the minimum number of "cy" commands and do not test more than necessary
3. Do not perform an action or assertion unless the element exists and is visible in the DOM
4. Prefer locating with text or an accessible label
5. You must locate an element first before performing actions like click, type, etc.
6. When creating selectors, ensure they're unique and specific enough to select only 1 element, even if there are multiple elements of the same type (e.g., multiple "h1" elements)

DOM snapshot:
\`\`\`html
{html}
\`\`\`
`

const prompt = PromptTemplate.fromTemplate(template.trim())
const chain = prompt.pipe(llm)

Cypress.Commands.add('ai', (input, options) => {
  cy.document().then({ timeout: 60000 }, async (doc) => {
    const response = await chain.invoke({
      input,
      // doc.documentElement.outerHTML
      html: sanitizeHtml(doc.body.innerHTML),
    })

    Cypress.log({ message: response })

    const code = response.match(/```(js|javascript)?([\s\S]+?)```/)?.[2]
    console.log(code)
    if (code) {
      eval(code)
    }
  })
})

declare global {
  namespace Cypress {
    interface Chainable {
      ai(input: string, options?: object): Chainable<void>
    }
  }
}

export {}
