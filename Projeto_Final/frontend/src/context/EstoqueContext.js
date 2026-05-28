import { createContext } from 'react';

/**
 * Context que vai carregar o estado do estoque.
 *
 * O valor real é injetado pelo <EstoqueProvider> (ver EstoqueProvider.jsx)
 * e consumido pelas páginas via useEstoqueContext() (ver hooks/).
 */
export const EstoqueContext = createContext(null);
