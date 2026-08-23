const TOKEN_KEY = '@AuthApp:token';
const USER_KEY = '@AuthApp:user';

export const authStorage = {
    salvarSessao(token, usuario) {
        if (!token) return;
        localStorage.setItem(TOKEN_KEY, token);
        if (usuario) {
            localStorage.setItem(USER_KEY, JSON.stringify(usuario));
        }
    },

    obterToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    obterUsuario() {
        const usuario = localStorage.getItem(USER_KEY);
        try {
            return usuario ? JSON.parse(usuario) : null;
        } catch (error) {
            console.error('Erro ao fazer parse dos dados do usuário:', error);
            return null;
        }
    },

    estaAutenticado() {
        return !!this.obterToken();
    },

    limparSessao() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    protegerRota() {
        if (!this.estaAutenticado()) {
            window.location.href = './index.html';
        }
    },

    redirecionarSeAutenticado() {
        if (this.estaAutenticado()) {
            window.location.href = './perfil.html';
        }
    }
}