import { request } from '../services/api.js';
import { authStorage } from '../utils/auth.js';
import {
    exibirMensagem,
    limparMensagem,
    marcarCampoErro,
    limparCampoErro,
    monitorarLimpezaDeErros
} from '../utils/alerts.js';

// Route Guard: Redireciona para o perfil caso já exista sessão ativa
authStorage.redirecionarSeAutenticado();

// Seleção de Nós do DOM
const formLogin = document.getElementById('form-login');
const inputEmail = document.getElementById('email');
const inputSenha = document.getElementById('senha');
const feedbackContainer = document.getElementById('mensagem-feedback');
const btnSubmit = formLogin ? formLogin.querySelector('button[type="submit"]') : null;

// Ativa a limpeza reativa da borda vermelha ao digitar
if (inputEmail && inputSenha) {
    monitorarLimpezaDeErros([inputEmail, inputSenha]);
}

/**
 * Alternador de Visibilidade de Senha
 */
function setupTogglePassword(toggleIconId, inputId) {
    const toggleIcon = document.getElementById(toggleIconId);
    const input = document.getElementById(inputId);

    if (!toggleIcon || !input) return;

    toggleIcon.addEventListener('click', () => {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';

        toggleIcon.classList.toggle('fa-eye-slash', !isPassword);
        toggleIcon.classList.toggle('fa-eye', isPassword);
    });
}
setupTogglePassword('toggle-senha', 'senha');

/**
 * Handler de Submissão do Formulário de Autenticação
 */
if (formLogin) {
    formLogin.addEventListener('submit', async (event) => {
        // Interrompe o reload tradicional do navegador e evita vazamento de dados via GET
        event.preventDefault();
        limparMensagem(feedbackContainer);

        const email = inputEmail ? inputEmail.value.trim() : '';
        const senha = inputSenha ? inputSenha.value : '';

        let possuiErroValidacao = false;

        // 1. Validação Fail-Fast Client-Side
        if (!email) {
            marcarCampoErro(inputEmail);
            possuiErroValidacao = true;
        } else {
            limparCampoErro(inputEmail);
        }

        if (!senha) {
            marcarCampoErro(inputSenha);
            possuiErroValidacao = true;
        } else {
            limparCampoErro(inputSenha);
        }

        if (possuiErroValidacao) {
            exibirMensagem(feedbackContainer, 'Preencha todos os campos obrigatórios.', 'erro');
            return;
        }

        // 2. Bloqueio de UI contra múltiplos disparos (Loading State)
        const textoOriginal = btnSubmit ? btnSubmit.textContent : 'Entrar';
        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Entrando...';
        }

        try {
            // 3. Consumo da API Backend (Spring Boot)
            const response = await request('/login', {
                method: 'POST',
                body: JSON.stringify({ email, senha })
            });

            // Persiste JWT e dados no LocalStorage
            authStorage.salvarSessao(response.token, response.usuario);
            exibirMensagem(feedbackContainer, 'Login realizado com sucesso! Redirecionando...', 'sucesso');

            // Redirecionamento após feedback visual
            setTimeout(() => {
                window.location.href = './perfil.html';
            }, 1000);

        } catch (error) {
            const isCredencialInvalida = error.message.includes('401') || error.message.includes('403');

            if (isCredencialInvalida) {
                marcarCampoErro(inputEmail);
                marcarCampoErro(inputSenha);
            }

            const mensagemExibicao = isCredencialInvalida
                ? 'E-mail ou senha incorretos.'
                : (error.message || 'Erro ao realizar login. Tente novamente.');

            exibirMensagem(feedbackContainer, mensagemExibicao, 'erro');
        } finally {
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.textContent = textoOriginal;
            }
        }
    });
}