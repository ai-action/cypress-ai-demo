# Cypress AI Demo

[Cypress](https://www.cypress.io/) AI Demo.

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

Start Ollama:

```sh
ollama serve
```

Download [model](https://ollama.com/library/qwen2.5-coder):

```sh
ollama pull qwen2.5-coder
```

Open Cypress:

```sh
npx cypress open
```

## License

[MIT](LICENSE)
