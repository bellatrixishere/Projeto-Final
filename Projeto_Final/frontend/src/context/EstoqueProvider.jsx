import { EstoqueContext } from './EstoqueContext';
import { useEstoque } from '../hooks/useEstoque';

/**
 * Provider que disponibiliza o estoque para qualquer componente filho.
 *
 * Antes, Dashboard e Gestão chamavam useEstoque() separadamente — isso fazia
 * DOIS fetches simultâneos pro backend, e os estados ficavam dessincronizados.
 *
 * Agora o Provider chama useEstoque() UMA vez e compartilha o mesmo estado
 * com todas as páginas via useEstoqueContext().
 */
export function EstoqueProvider({ children }) {
  const estoque = useEstoque();
  return (
    <EstoqueContext.Provider value={estoque}>{children}</EstoqueContext.Provider>
  );
}
