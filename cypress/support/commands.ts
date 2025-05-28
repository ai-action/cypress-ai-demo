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

import debug from 'debug'
import sanitizeHtml from 'sanitize-html'
import { Ollama } from '@langchain/ollama'
import { PromptTemplate } from '@langchain/core/prompts'

const debugLog = debug('cypress:command:ai')

const llm = new Ollama({
  model: 'qwen2.5-coder',
})

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
`

const prompt = PromptTemplate.fromTemplate(template.trim())
const chain = prompt.pipe(llm)

function minutesToMilliseconds(minutes: number) {
  return 1000 * 60 * minutes
}

Cypress.Commands.add('ai', (task, options) => {
  Cypress.log({ displayName: 'ai', message: task })

  cy.document({ log: false }).then({ timeout: minutesToMilliseconds(1) }, async (doc) => {
    const response = await chain.invoke({
      task,
      html: sanitizeHtml(doc.documentElement.outerHTML),
      // html: sanitizeHtml(doc.body.innerHTML),
    })

    debugLog(response)
    const code = response.match(/```(javascript|js)?([\s\S]+?)```/)?.[2]

    if (code) {
      eval(code)
    }
  })
})

declare global {
  namespace Cypress {
    interface Chainable {
      ai(task: string, options?: object): Chainable<void>
    }
  }
}

export {}
