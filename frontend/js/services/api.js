import { authStorage } from '../utils/auth.js';

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
);

const API_BASE_URL = isLocalhost 
    ? 'http://localhost:8080' 
    : 'https://auth-api-yvqt.onrender.com';
    
export async function request(endpoint, options = {}) {
    const token = authStorage.obterToken();

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Retorno 204 (No Content) comum em DELETE/PUT
        if (response.status === 204) {
            return null;
        }

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            // Sessão inválida ou expirada em rotas privadas
            if (response.status === 401 || response.status === 403) {
                authStorage.limparSessao();
                if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('cadastro.html')) {
                    window.location.href = './index.html';
                }
            }

            const mensagemErro = data?.mensagem || data?.error || `Erro HTTP: ${response.status}`;
            throw new Error(mensagemErro);
        }

        return data;
    } catch (error) {
        throw error;
    }
}