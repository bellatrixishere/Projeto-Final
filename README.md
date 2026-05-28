# Projeto Final — Sistema de Gestão de Estoque de Hardware

Sistema **full-stack** simples para gerenciar um estoque de peças de hardware
(placas de vídeo, memórias RAM, etc.). Permite **cadastrar**, **listar**,
**editar** e **excluir** produtos, e oferece um **Dashboard** com métricas
em tempo real do estoque.

> Projeto feito como exercício acadêmico — usa banco de dados **em memória**
> (sem persistência real). Toda vez que o backend reinicia, os dados voltam
> ao estado inicial.

---

## Stack utilizada

**Backend**
- [Node.js](https://nodejs.org/) (v22+ recomendado)
- [Express 5](https://expressjs.com/) — framework HTTP
- [CORS](https://www.npmjs.com/package/cors) — libera acesso do frontend

**Frontend**
- [React 19](https://react.dev/) com [Vite](https://vitejs.dev/) (bundler/dev server)
- [React Router 7](https://reactrouter.com/) — navegação entre páginas
- **Context API** — compartilhamento de estado entre páginas
- **Custom Hook** (`useEstoque`) — encapsula chamadas HTTP

---

## Estrutura do projeto

```
Projeto-Final/
├── README.md                  ← você está aqui
└── Projeto_Final/
    ├── backend/
    │   ├── index.js           ← servidor Express com 4 rotas REST
    │   └── package.json
    │
    └── frontend/
        ├── index.html
        ├── vite.config.js
        └── src/
            ├── main.jsx        ← ponto de entrada (renderiza <App />)
            ├── App.jsx         ← roteamento + EstoqueProvider
            ├── App.css         ← estilos da navegação
            ├── index.css       ← estilos globais
            ├── context/
            │   └── EstoqueContext.jsx   ← Provider que compartilha estado
            ├── hooks/
            │   └── useEstoque.js        ← chamadas HTTP ao backend
            ├── services/
            │   └── api.js               ← URL do backend centralizada
            └── pages/
                ├── Gestao.jsx           ← CRUD (criar/editar/excluir)
                └── Dashboard.jsx        ← métricas (valor total, etc.)
```

---

## Como rodar o projeto

> Você precisa ter o [Node.js](https://nodejs.org/) instalado (versão **22 ou superior**).

O projeto tem **duas partes** (backend e frontend) que precisam rodar **ao mesmo tempo**,
cada uma em um **terminal separado**.

### 1. Backend (terminal 1)

```bash
cd Projeto_Final/backend
npm install          # baixa as dependências (só na primeira vez)
npm run dev          # inicia o servidor em modo watch (reinicia ao salvar)
```

Servidor sobe em `http://localhost:3001`.
Você deve ver no terminal: `API de estoque rodando em http://localhost:3001`.

> Alternativa: `npm start` (sem auto-reload).

### 2. Frontend (terminal 2)

```bash
cd Projeto_Final/frontend
npm install          # baixa as dependências (só na primeira vez)
npm run dev          # inicia o Vite
```

O Vite mostra no terminal um endereço tipo `http://localhost:5173`.
Abra esse endereço no navegador.

---

## Rotas da API (backend)

Base: `http://localhost:3001`

| Método | Rota              | O que faz                          |
|--------|-------------------|------------------------------------|
| GET    | `/produtos`       | Lista todos os produtos do estoque |
| POST   | `/produtos`       | Cadastra um novo produto           |
| PUT    | `/produtos/:id`   | Atualiza um produto existente      |
| DELETE | `/produtos/:id`   | Remove um produto pelo ID          |

### Formato de um produto (JSON)

```json
{
  "id": 1,
  "nome": "RTX 5070",
  "quantidade": 8,
  "preco": 3500
}
```

### Validações do backend

- **Nome obrigatório**, com no mínimo 3 caracteres
- **Quantidade e preço** não podem ser negativos
- **Nome único** (não permite dois produtos com o mesmo nome)

Códigos HTTP retornados:
- `200` — sucesso (GET / PUT / DELETE)
- `201` — produto criado (POST)
- `400` — falta de campos ou nome curto
- `404` — produto inexistente (PUT / DELETE)
- `409` — nome já cadastrado
- `422` — valor negativo (quantidade ou preço)

---

## Rotas do frontend

| Caminho     | Página     | O que mostra                                   |
|-------------|------------|------------------------------------------------|
| `/`         | Gestão     | Formulário de cadastro/edição + tabela de produtos |
| `/dashboard`| Dashboard  | Cards com valor total, variedade, estoque baixo |

---

## Como o frontend conversa com o backend

```
[Páginas] → useEstoqueContext() → useEstoque() → fetch(API_BASE_URL) → [Backend Express]
```

- `services/api.js` define a URL do backend em **um lugar só**.
- `hooks/useEstoque.js` encapsula `fetch` + estados (`carregando`, `erro`, `dados`).
- `context/EstoqueContext.jsx` compartilha esse estado entre **Gestão** e **Dashboard**
  (assim só fazemos UM `GET /produtos` para as duas páginas).
- `App.jsx` envelopa tudo com `<EstoqueProvider>`.

---

## Para a apresentação

Pontos que vale destacar ao apresentar o projeto:

1. **Separação backend/frontend** — duas aplicações independentes que se comunicam via HTTP/JSON.
2. **REST** — uso correto dos verbos HTTP (GET/POST/PUT/DELETE) e códigos de status.
3. **Validação no servidor** — nunca confie só no formulário do cliente.
4. **Custom Hook (`useEstoque`)** — abstração que esconde detalhes de `fetch`.
5. **Context API** — evita "prop drilling" e centraliza o estado do estoque.
6. **React Router** — navegação SPA (sem reload de página).
7. **Validação de UX** — confirmação antes de excluir, mensagens de erro claras.
