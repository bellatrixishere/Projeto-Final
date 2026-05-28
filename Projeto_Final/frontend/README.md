# Frontend — Gestão de Estoque (React + Vite)

Aplicação React que consome a API REST do backend para gerenciar o estoque.

> Para o passo-a-passo de execução completo, veja o
> [README da raiz do projeto](../../README.md).

## Scripts disponíveis

```bash
npm run dev       # inicia o servidor de desenvolvimento (Vite)
npm run build     # gera build de produção em /dist
npm run preview   # serve o build local para verificação
npm run lint      # roda o ESLint
```

## Organização das pastas

```
src/
├── App.jsx                       roteamento + EstoqueProvider
├── App.css                       estilos da navegação
├── main.jsx                      bootstrap (createRoot)
├── index.css                     estilos globais
│
├── pages/
│   ├── Gestao.jsx                CRUD: formulário + tabela
│   └── Dashboard.jsx             métricas do estoque
│
├── hooks/
│   └── useEstoque.js             custom hook com chamadas HTTP
│
├── context/
│   └── EstoqueContext.jsx        compartilha o estoque entre páginas
│
└── services/
    └── api.js                    URL e endpoints do backend
```

## Por que Context API?

Sem o Context, **cada página** chamaria `useEstoque()` por conta própria,
disparando **dois `GET /produtos` simultâneos** e mantendo estados separados
que podiam ficar dessincronizados.

Com o `EstoqueProvider` no topo da árvore, ambas as páginas leem o **mesmo estado**:

```
<EstoqueProvider>            ← faz 1 fetch ao montar
  <BrowserRouter>
    <Routes>
      <Gestao />              ← lê via useEstoqueContext()
      <Dashboard />           ← lê via useEstoqueContext()
    </Routes>
  </BrowserRouter>
</EstoqueProvider>
```
