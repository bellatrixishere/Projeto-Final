import { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS } from '../services/api';

/**
 * Hook customizado que encapsula toda a comunicação com o backend.
 *
 * Expõe:
 *   - dados (array de produtos)
 *   - carregando (boolean, indica fetch em andamento)
 *   - erro (string com mensagem, ou null)
 *   - criarProduto, atualizarProduto, deletarProduto (ações)
 *   - recarregar (refaz o GET manualmente)
 */
export function useEstoque() {
  const [dados, setDados] = useState([]);
  // Inicia já como "carregando" porque o primeiro fetch dispara assim que o
  // componente monta (no useEffect logo abaixo).
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // useCallback mantém a função com referência estável entre renders.
  const buscarProdutos = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const resposta = await fetch(ENDPOINTS.produtos);
      const dadosConvertidos = await resposta.json();
      setDados(dadosConvertidos);
    } catch {
      setErro('Não foi possível conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  }, []);

  // Ao montar, busca a primeira vez (o estado "carregando" já está true,
  // então não disparamos cascade render — atendendo à regra do React 19).
  useEffect(() => {
    let ativo = true;

    (async () => {
      try {
        const resposta = await fetch(ENDPOINTS.produtos);
        const dadosConvertidos = await resposta.json();
        if (ativo) setDados(dadosConvertidos);
      } catch {
        if (ativo) setErro('Não foi possível conectar ao servidor.');
      } finally {
        if (ativo) setCarregando(false);
      }
    })();

    // se o componente desmontar antes do fetch terminar, ignoramos o resultado
    return () => {
      ativo = false;
    };
  }, []);

  async function criarProduto(novoItem) {
    setCarregando(true);
    setErro(null);
    try {
      const resposta = await fetch(ENDPOINTS.produtos, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoItem),
      });
      const resultado = await resposta.json();
      if (!resposta.ok) {
        setErro(resultado.erro);
        return false;
      }
      await buscarProdutos();
      return true;
    } catch {
      setErro('Erro ao tentar cadastrar o produto.');
      return false;
    } finally {
      setCarregando(false);
    }
  }

  async function atualizarProduto(id, itemAtualizado) {
    setCarregando(true);
    setErro(null);
    try {
      const resposta = await fetch(ENDPOINTS.produto(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemAtualizado),
      });
      const resultado = await resposta.json();
      if (!resposta.ok) {
        setErro(resultado.erro);
        return false;
      }
      await buscarProdutos();
      return true;
    } catch {
      setErro('Erro ao tentar atualizar o produto.');
      return false;
    } finally {
      setCarregando(false);
    }
  }

  async function deletarProduto(id) {
    setCarregando(true);
    setErro(null);
    try {
      const resposta = await fetch(ENDPOINTS.produto(id), { method: 'DELETE' });
      const resultado = await resposta.json();
      if (!resposta.ok) {
        setErro(resultado.erro);
        return false;
      }
      await buscarProdutos();
      return true;
    } catch {
      setErro('Erro ao tentar deletar o produto.');
      return false;
    } finally {
      setCarregando(false);
    }
  }

  return {
    dados,
    carregando,
    erro,
    criarProduto,
    atualizarProduto,
    deletarProduto,
    recarregar: buscarProdutos,
  };
}
