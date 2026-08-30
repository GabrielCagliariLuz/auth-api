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

        if (response.status === 204) {
            return null;
        }

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                authStorage.limparSessao();
                
                // Trata tanto rotas tradicionais (.html) quanto clean URLs da Vercel
                const path = window.location.pathname.toLowerCase();
                const isRotaPublica = path === '/' || 
                                      path.includes('index') || 
                                      path.includes('cadastro');

                if (!isRotaPublica) {
                    window.location.href = './index.html';
                }
            }

            const mensagemErro = data?.mensagem || data?.error || `Erro HTTP: ${response.status}`;
            throw new Error(mensagemErro);
        }

        return data;
    } catch (error) {
        // Intercepta queda de conexão ou cold start da JVM no Render
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error('Serviço temporariamente indisponível. A API pode estar acordando na nuvem, tente novamente em 30 segundos.');
        }
        throw error;
    }
}