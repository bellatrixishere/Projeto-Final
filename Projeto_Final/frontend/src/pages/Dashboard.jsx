import React from 'react';
import { useEstoque } from '../hooks/useEstoque';

export function Dashboard() {
  const { dados, carregando, erro } = useEstoque();

  // contas
  const totalProdutosDistintos = dados.length;

  // soma todos os preço x quantidade
  const valorTotalEstoque = dados.reduce((soma, produto) => {
    return soma + (produto.preco * produto.quantidade);
  }, 0);

  //produtos estão com menos de 3 unidades
  const produtosCriticos = dados.filter(produto => produto.quantidade < 3).length;

  //último produto que foi cadastrado (o último item do array)
  const ultimoCadastrado = dados.length > 0 ? dados[dados.length - 1] : null;


  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Dashboard</h2>
      <p style={{ color: '#666' }}>Visão geral em tempo real da saúde do seu depósito de hardware.</p>

      {carregando && <p style={{ color: 'blue', fontWeight: 'bold' }}>Atualizando</p>}
      {erro && (
        <div style={{ padding: '10px', backgroundColor: '#fcd3d3', color: '#991b1b', borderRadius: '5px', marginBottom: '15px' }}>
          <strong>Erro:</strong> {erro}
        </div>
      )}


      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
        
        {/* CARD 1: Valor Total */}
        <div style={{ flex: '1', minWidth: '200px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1e40af' }}>valor em estoque</h4>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#1e3a8a' }}>
            R$ {valorTotalEstoque.toFixed(2)}
          </p>
          <span style={{ fontSize: '12px', color: '#60a5fa' }}>soma de (preço x qtd)</span>
        </div>

        {/* total de coisas */}
        <div style={{ flex: '1', minWidth: '200px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#166534' }}>variedade de itens</h4>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#14532d' }}>
            {totalProdutosDistintos} modelos
          </p>
          <span style={{ fontSize: '12px', color: '#4ade80' }}>Produtos cadastrados</span>
        </div>

        {/* POucos itens*/}
        <div style={{ 
          flex: '1', 
          minWidth: '200px', 
          backgroundColor: produtosCriticos > 0 ? '#fef2f2' : '#f8fafc', 
          border: produtosCriticos > 0 ? '1px solid #fecaca' : '1px solid #e2e8f0', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: produtosCriticos > 0 ? '#991b1b' : '#475569' }}>Estoque Baixo</h4>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: produtosCriticos > 0 ? '#7f1d1d' : '#334155' }}>
            {produtosCriticos} {produtosCriticos === 1 ? 'item' : 'itens'}
          </p>
          <span style={{ fontSize: '12px', color: produtosCriticos > 0 ? '#f87171' : '#94a3b8' }}>Com menos de 3 unidades</span>
        </div>

      </div>

      {/* Ultimo registro */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#334155' }}>Última Entrada no Sistema</h3>
        {ultimoCadastrado ? (
          <p style={{ margin: '0', color: '#475569' }}>
            O último componente adicionado ou modificado foi: <strong>{ultimoCadastrado.nome}</strong>, com o preço de <strong>R$ {ultimoCadastrado.preco.toFixed(2)}</strong>.
          </p>
        ) : (
          <p style={{ margin: '0', color: '#94a3b8' }}>Nenhuma atividade registrada no momento.</p>
        )}
      </div>

    </div>
  );
}