import { useState, useEffect } from 'react';

export function useEstoque() {

  const [dados, setDados] = useState([]); //ista de produtos
  const [carregando, setCarregando] = useState(false); // carregando
  const [erro, setErro] = useState(null); // erro

  const urlBackend = 'http://localhost:3001/produtos';

  //FUNÇÃO PARA BUSCAR TODOS OS PRODUTOS
  async function buscarProdutos() {
    setCarregando(true);
    setErro(null);
    try {
      const resposta = await fetch(urlBackend);
      const dadosConvertidos = await resposta.json();
      setDados(dadosConvertidos);
    } catch (err) {
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarProdutos();
  }, []);

  //FUNÇÃO PARA CRIAR UM NOVO PRODUTO
  async function criarProduto(novoItem) {
    setCarregando(true);
    setErro(null);
    try {
      const resposta = await fetch(urlBackend, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoItem)
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        setErro(resultado.erro);
        return false;
      }

      await buscarProdutos();
      return true;
    } catch (err) {
      setErro("Erro ao tentar cadastrar o produto.");
      return false;
    } finally {
      setCarregando(false);
    }
  }

  //FUNÇÃO PARA EDITAR UM PRODUTO EXISTENTE
  async function atualizarProduto(id, itemAtualizado) {
    setCarregando(true);
    setErro(null);
    try {
      const resposta = await fetch(`${urlBackend}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemAtualizado)
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        setErro(resultado.erro);
        return false;
      }

      await buscarProdutos();
      return true;
    } catch (err) {
      setErro("Erro ao tentar atualizar o produto.");
      return false;
    } finally {
      setCarregando(false);
    }
  }

  //FUNÇÃO PARA DELETAR UM PRODUTO
  async function deletarProduto(id) {
    setCarregando(true);
    setErro(null);
    try {
      const resposta = await fetch(`${urlBackend}/${id}`, {
        method: 'DELETE'
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        setErro(resultado.erro);
        return false;
      }

      await buscarProdutos();
      return true;
    } catch (err) {
      setErro("Erro ao tentar deletar o produto.");
      return false;
    } finally {
      setCarregando(false);
    }
  }

  return { dados, carregando, erro, criarProduto, atualizarProduto, deletarProduto };
}