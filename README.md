# Simulador de Entrevista AI 🤖

Um simulador de entrevistas técnicas interativo construído com React e a API do Google Gemini. Cole a descrição de uma vaga de emprego e seja entrevistado por um "Desenvolvedor Sênior Ranzinza" que fará perguntas técnicas focadas nos requisitos da vaga, avaliará suas respostas em tempo real e dará dicas valiosas.

## 🚀 Funcionalidades

- **Entrevistador Contextualizado:** As perguntas são geradas dinamicamente com base na descrição da vaga fornecida pelo usuário.
- **Avaliação em Tempo Real:** A IA avalia se a sua resposta está correta, fornece dicas e engata na próxima pergunta.
- **Suporte a Markdown e Código:** As respostas da IA suportam formatação Markdown, exibindo blocos de código com highlight de forma nativa.
- **Interface Fluida:** Chat responsivo com auto-scroll integrado e feedback visual de carregamento.

## 🛠️ Tecnologias Utilizadas

Este projeto foi desenvolvido com as seguintes tecnologias:

- **[React 19](https://react.dev/)** + **[Vite](https://vitejs.dev/)**: Para a construção e empacotamento rápido da interface.
- **[Tailwind CSS](https://tailwindcss.com/)**: Para estilização rápida e responsiva utilizando classes utilitárias.
- **[@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai)**: SDK oficial para integração com o modelo Gemini (utilizando o `gemini-3-flash-preview`).
- **[react-markdown](https://github.com/remarkjs/react-markdown)**: Para renderizar as respostas da IA com suporte a blocos de código.

## ⚙️ Como rodar o projeto localmente

Para rodar este projeto na sua máquina, você precisará do [Node.js](https://nodejs.org/) instalado e de uma chave de API do Google Gemini.

1. **Clone o repositório:**

   ```bash
   git clone [https://github.com/jose-eduardo-00/simulador-entrevista.git](https://github.com/jose-eduardo-00/simulador-entrevista.git)

   cd simulador-entrevista

   Instale as dependências:
   npm install
   ou
   yarn install

   Crie um arquivo .env na raiz do projeto e adicione a sua chave de API do Gemini:

   VITE_GEMINI_API_KEY=sua_chave_de_api_aqui

   Inicie o servidor de desenvolvimento:
   npm run dev
   ou
   yarn dev
   ```
