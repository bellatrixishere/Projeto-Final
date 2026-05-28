/**
 * Configuração central da API.
 *
 * Se algum dia o backend mudar de porta/host, só esse arquivo precisa ser alterado.
 */

export const API_BASE_URL = 'http://localhost:3001';

export const ENDPOINTS = {
  produtos: `${API_BASE_URL}/produtos`,
  produto: (id) => `${API_BASE_URL}/produtos/${id}`,
};
