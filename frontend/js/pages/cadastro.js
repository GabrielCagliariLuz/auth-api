import { request } from '../services/api.js';
import { authStorage } from '../utils/auth.js';
import {
    exibirMensagem,
    limparMensagem,
    marcarCampoErro,
    limparCampoErro,
    monitorarLimpezaDeErros
} from '../utils/alerts.js';

authStorage.redirecionarSeAutenticado();

const formCadastro = document.getElementById('form-cadastro');
const btnSubmit = formCadastro.querySelector('button[type="submit"]');
const feedbackContainer = document.getElementById('mensagem-feedback');

const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputSenha = document.getElementById('senha');
const inputConfirmarSenha = document.getElementById('confirmarSenha');

const campos = [inputNome, inputEmail, inputSenha, inputConfirmarSenha];

// Limpa bordas vermelhas dinamicamente conforme digitação
monitorarLimpezaDeErros(campos);

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
setupTogglePassword('toggle-confirmarSenha', 'confirmarSenha');

formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault();
    limparMensagem(feedbackContainer);

    const nome = inputNome.value.trim();
    const email = inputEmail.value.trim();
    const senha = inputSenha.value;
    const confirmarSenha = inputConfirmarSenha.value;

    let possuiCamposVazios = false;

    // 1. Validação de campos obrigatórios
    campos.forEach((input) => {
        if (!input.value.trim()) {
            marcarCampoErro(input);
            possuiCamposVazios = true;
        } else {
            limparCampoErro(input);
        }
    });

    if (possuiCamposVazios) {
        exibirMensagem(feedbackContainer, 'Preencha todos os campos obrigatórios.', 'erro');
        return;
    }

    // 2. Validação de confirmação de senha
    if (senha !== confirmarSenha) {
        marcarCampoErro(inputSenha);
        marcarCampoErro(inputConfirmarSenha);
        exibirMensagem(feedbackContainer, 'As senhas não coincidem.', 'erro');
        return;
    }

    btnSubmit.disabled = true;
    const textoOriginal = btnSubmit.textContent;
    btnSubmit.textContent = 'Cadastrando...';

    try {
        await request('/usuarios', {
            method: 'POST',
            body: JSON.stringify({ nome, email, senha, confirmarSenha })
        });

        exibirMensagem(feedbackContainer, 'Conta criada com sucesso! Redirecionando...', 'sucesso');
        formCadastro.reset();

        setTimeout(() => {
            window.location.href = './index.html';
        }, 1500);
    } catch (error) {
        if (error.message.includes('409') || error.message.toLowerCase().includes('email')) {
            marcarCampoErro(inputEmail);
        }
        exibirMensagem(feedbackContainer, error.message || 'Erro ao realizar cadastro.', 'erro');
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = textoOriginal;
    }
});