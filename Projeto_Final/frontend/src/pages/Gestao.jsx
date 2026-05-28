import React, { useState } from 'react';
import { useEstoque } from '../hooks/useEstoque';

export function Gestao() {
  const { dados, carregando, erro, criarProduto, atualizarProduto, deletarProduto } = useEstoque();

  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [preco, setPreco] = useState('');

  // controlar se estamos editando ou criando um novo produtos
  const [idEmEdicao, setIdEmEdicao] = useState(null);

  //botão de enviar
  async function manipularEnvio(e) {
    e.preventDefault();

    const produtoObjeto = {
      nome: nome,
      quantidade: quantidade,
      preco: preco
    };

    let deuCerto = false;

    if (idEmEdicao) {
      // edicao
      deuCerto = await atualizarProduto(idEmEdicao, produtoObjeto);
    } else {
      // criacao
      deuCerto = await criarProduto(produtoObjeto);
    }

    // Se de certo, limpa o formulário
    if (deuCerto) {
      setNome('');
      setQuantidade('');
      setPreco('');
      setIdEmEdicao(null); // Sai do modo de edição
    }
  }

  // Função de edição
  function iniciarEdicao(produto) {
    setIdEmEdicao(produto.id);
    setNome(produto.nome);
    setQuantidade(produto.quantidade);
    setPreco(produto.preco);
  }

  // Função para cancelar a edição
  function cancelarEdicao() {
    setIdEmEdicao(null);
    setNome('');
    setQuantidade('');
    setPreco('');
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🛠️ Gestão de Estoque de Hardware</h2>
      
      {/*carregando*/}
      {carregando && <p style={{ color: 'blue', fontWeight: 'bold' }}>Processando...</p>}
      
      {/*erros */}
      {erro && (
        <div style={{ padding: '10px', backgroundColor: '#fcd3d3', color: '#991b1b', borderRadius: '5px', marginBottom: '15px' }}>
          ⚠️ <strong>Erro:</strong> {erro}
        </div>
      )}

      {/*cadastro/edicão*/}

      <form onSubmit={manipularEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>{idEmEdicao ? "✏️ Editar Componente" : "Cadastrar Novo Componente"}</h3>
        
        <label>
          nome do item:
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} style={{ width: '100%', padding: '5px', marginTop: '5px' }} placeholder="Ex: Placa de Vídeo RTX 4060" />
        </label>

        <label>
          quantidade em estoque:
          <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} style={{ width: '100%', padding: '5px', marginTop: '5px' }} placeholder="Ex: 5" />
        </label>

        <label>
          Preço Unitário (R$):
          <input type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} style={{ width: '100%', padding: '5px', marginTop: '5px' }} placeholder="Ex: 2300.00" />
        </label>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" style={{ padding: '8px 15px', backgroundColor: idEmEdicao ? '#eab308' : '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {idEmEdicao ? "Salvar Alterações" : "cdastrar hardware"}
          </button>
          
          {idEmEdicao && (
            <button type="button" onClick={cancelarEdicao} style={{ padding: '8px 15px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              cancelar
            </button>
          )}
        </div>
      </form>

          {/* listar produtos */}
      <h3>itens dadastrados no depósito</h3> 
      
      {dados.length === 0 ? (
        <p>Nenhum produto no estoque atualmente.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #d1d5db' }}>ID</th>
              <th style={{ padding: '10px', border: '1px solid #d1d5db' }}>Nome</th>
              <th style={{ padding: '10px', border: '1px solid #d1d5db' }}>Qtd.</th>
              <th style={{ padding: '10px', border: '1px solid #d1d5db' }}>Preço</th>
              <th style={{ padding: '10px', border: '1px solid #d1d5db' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((produto) => (
              <tr key={produto.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px', border: '1px solid #d1d5db' }}>{produto.id}</td>
                <td style={{ padding: '10px', border: '1px solid #d1d5db' }}>{produto.nome}</td>
                <td style={{ padding: '10px', border: '1px solid #d1d5db' }}>{produto.quantidade}</td>
                <td style={{ padding: '10px', border: '1px solid #d1d5db' }}>R$ {produto.preco.toFixed(2)}</td>
                <td style={{ padding: '10px', border: '1px solid #d1d5db', display: 'flex', gap: '5px' }}>
                  <button onClick={() => iniciarEdicao(produto)} style={{ padding: '4px 8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                    Editar
                  </button>
                  <button onClick={() => deletarProduto(produto.id)} style={{ padding: '4px 8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}