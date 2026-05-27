import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001; 
app.use(cors());
app.use(express.json()); 

// BANCO DE DADOS
let estoque = [
  { id: 1, nome: "Placa de Vídeo RTX 5070", quantidade: 8, preco: 3500 },
  { id: 2, nome: "Memória RAM 16GB DDR5", quantidade: 15, preco: 1500 }
];

// contador de id
let proximoId = 3;

// listar produtos
app.get('/produtos', (req, res) => {
  return res.status(200).json(estoque);
});

// criar produtos
app.post('/produtos', (req, res) => {
  const { nome, quantidade, preco } = req.body;

  // http 400 - campos obrigatorios
  if (!nome || quantidade === undefined || preco === undefined) {
    return res.status(400).json({ erro: "Por favor, preencha todos os campos obrigatórios." });
  }

  // http 400 - minimo de caracteres
  if (nome.trim().length < 3) {
    return res.status(400).json({ erro: "O nome do produto precisa ter pelo menos 3 caracteres." });
  }

  // http 422
  if (Number(quantidade) < 0) {
    return res.status(422).json({ erro: "A quantidade em estoque não pode ser negativa." });
  }

  // Scriação dos produtos
  const novoProduto = {
    id: proximoId++,
    nome: nome.trim(),
    quantidade: Number(quantidade),
    preco: Number(preco)
  };

  estoque.push(novoProduto);
  return res.status(201).json(novoProduto);
});

// editar produto
app.put('/produtos/:id', (req, res) => {
  const idProcurado = Number(req.params.id);
  const { nome, quantidade, preco } = req.body;

  const produto = estoque.find(item => item.id === idProcurado);

  // http 404 -produto inexistente
  if (!produto) {
    return res.status(404).json({ erro: "Produto não encontrado no estoque." });
  }

  // Se achou, aplica as mesmas validações antes de alterar
  if (!nome || quantidade === undefined || preco === undefined) {
    return res.status(400).json({ erro: "Campos obrigatórios não preenchidos." });
  }
  if (nome.trim().length < 3) {
    return res.status(400).json({ erro: "O nome precisa ter pelo menos 3 caracteres." });
  }
  if (Number(quantidade) < 0) {
    return res.status(422).json({ erro: "A quantidade não pode ser negativa." });
  }

  // Atualiza os dados do produto na lista
  produto.nome = nome.trim();
  produto.quantidade = Number(quantidade);
  produto.preco = Number(preco);

  return res.status(200).json(produto);
});

// deletar o produto
app.delete('/produtos/:id', (req, res) => {
  const idProcurado = Number(req.params.id);

  // Vê se o produto existe antes de deletar
  const index = estoque.findIndex(item => item.id === idProcurado);

  // http 404 - produto inexistente
  if (index === -1) {
    return res.status(404).json({ erro: "Produto não existe para ser deletado." });
  }

  // Remove o produto da lista
  estoque.splice(index, 1);

  return res.status(200).json({ mensagem: "Produto removido com sucesso!" });
});

// conectando ao localhost
app.listen(PORT, () => {
  console.log(`Cérebro do estoque rodando em http://localhost:${PORT}`);
});