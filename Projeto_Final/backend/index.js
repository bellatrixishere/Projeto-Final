/**
 * BACKEND — API de Estoque de Hardware
 *
 * Servidor Express simples (sem banco de dados real — usa array em memória).
 * Toda vez que o servidor reinicia, o estoque volta ao estado inicial.
 *
 * Rotas:
 *   GET    /produtos       → lista todos os produtos
 *   POST   /produtos       → cria um novo produto
 *   PUT    /produtos/:id   → atualiza um produto existente
 *   DELETE /produtos/:id   → remove um produto
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// cors libera o frontend (que roda em outra porta) a chamar essa API
app.use(cors());
// permite que o express leia JSON do corpo da requisição
app.use(express.json());

// "BANCO DE DADOS" em memória — apenas para fins didáticos
let estoque = [
  { id: 1, nome: 'RTX 5070', quantidade: 8, preco: 3500 },
  { id: 2, nome: 'RAM 16GB DDR5', quantidade: 15, preco: 1500 },
];

// contador auto-incremental para IDs dos novos produtos
let proximoId = 3;

/**
 * Função utilitária de validação reutilizada por POST e PUT.
 * Retorna { ok: true } se passou, ou { ok: false, status, erro } se falhou.
 */
function validarProduto({ nome, quantidade, preco }) {
  if (!nome || quantidade === undefined || preco === undefined) {
    return { ok: false, status: 400, erro: 'Por favor, preencha todos os campos obrigatórios.' };
  }
  if (nome.trim().length < 3) {
    return { ok: false, status: 400, erro: 'O nome do produto precisa ter pelo menos 3 caracteres.' };
  }
  if (Number(quantidade) < 0) {
    return { ok: false, status: 422, erro: 'A quantidade em estoque não pode ser negativa.' };
  }
  if (Number(preco) < 0) {
    return { ok: false, status: 422, erro: 'O preço não pode ser negativo.' };
  }
  return { ok: true };
}

// GET /produtos → retorna todo o estoque
app.get('/produtos', (req, res) => {
  return res.status(200).json(estoque);
});

// POST /produtos → cria novo produto
app.post('/produtos', (req, res) => {
  const { nome, quantidade, preco } = req.body;

  const validacao = validarProduto({ nome, quantidade, preco });
  if (!validacao.ok) {
    return res.status(validacao.status).json({ erro: validacao.erro });
  }

  // impede que dois produtos tenham o mesmo nome (case-insensitive)
  const nomeJaExiste = estoque.some(
    (item) => item.nome.toLowerCase() === nome.trim().toLowerCase()
  );
  if (nomeJaExiste) {
    return res.status(409).json({ erro: 'Já existe um produto cadastrado com esse nome.' });
  }

  const novoProduto = {
    id: proximoId++,
    nome: nome.trim(),
    quantidade: Number(quantidade),
    preco: Number(preco),
  };

  estoque.push(novoProduto);
  return res.status(201).json(novoProduto);
});

// PUT /produtos/:id → atualiza produto existente
app.put('/produtos/:id', (req, res) => {
  const idProcurado = Number(req.params.id);
  const { nome, quantidade, preco } = req.body;

  const produto = estoque.find((item) => item.id === idProcurado);
  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado no estoque.' });
  }

  const validacao = validarProduto({ nome, quantidade, preco });
  if (!validacao.ok) {
    return res.status(validacao.status).json({ erro: validacao.erro });
  }

  // ao editar, também valida nome duplicado — ignorando o próprio produto
  const nomeJaExiste = estoque.some(
    (item) =>
      item.id !== idProcurado &&
      item.nome.toLowerCase() === nome.trim().toLowerCase()
  );
  if (nomeJaExiste) {
    return res.status(409).json({ erro: 'Já existe outro produto com esse nome.' });
  }

  produto.nome = nome.trim();
  produto.quantidade = Number(quantidade);
  produto.preco = Number(preco);

  return res.status(200).json(produto);
});

// DELETE /produtos/:id → remove produto
app.delete('/produtos/:id', (req, res) => {
  const idProcurado = Number(req.params.id);
  const index = estoque.findIndex((item) => item.id === idProcurado);

  if (index === -1) {
    return res.status(404).json({ erro: 'Produto não existe para ser deletado.' });
  }

  estoque.splice(index, 1);
  return res.status(200).json({ mensagem: 'Produto removido com sucesso!' });
});

app.listen(PORT, () => {
  console.log(`API de estoque rodando em http://localhost:${PORT}`);
});
