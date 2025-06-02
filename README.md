# Cypress AI Demo

[![cypress](https://github.com/ai-action/cypress-ai-demo/actions/workflows/cypress.yml/badge.svg)](https://github.com/ai-action/cypress-ai-demo/actions/workflows/cypress.yml)

[Cypress AI](https://github.com/ai-action/cy-ai) demo.

## Prerequisites

[Node.js](https://nodejs.org/):

```sh
brew install node
```

[Ollama](https://ollama.com/):

```sh
brew install ollama
```

## Install

Clone the repository:

```sh
git clone https://github.com/ai-action/cypress-ai-demo.git
cd cypress-ai-demo
```

Install the dependencies:

```sh
npm install
```

## Run

Start Ollama server:

```sh
ollama serve
```

Download the [LLM](https://ollama.com/library/qwen2.5-coder):

```sh
ollama pull qwen2.5-coder
```

Open Cypress:

```sh
npx cypress open
```

## License

[MIT](LICENSE)
