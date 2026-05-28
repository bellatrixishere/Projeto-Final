import { useContext } from 'react';
import { EstoqueContext } from '../context/EstoqueContext';

/**
 * Atalho para acessar o EstoqueContext em qualquer página filha do Provider.
 *
 * Lança erro se for usado fora do <EstoqueProvider> — assim a gente descobre
 * cedo se esquecer de envolver a árvore com o Provider.
 */
export function useEstoqueContext() {
  const ctx = useContext(EstoqueContext);
  if (!ctx) {
    throw new Error('useEstoqueContext deve ser usado dentro de <EstoqueProvider>.');
  }
  return ctx;
}
