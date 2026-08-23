import { request } from '../services/api.js';
import { authStorage } from '../utils/auth.js';
import { exibirMensagem, limparMensagem } from '../utils/alerts.js';

authStorage.redirecionarSeAutenticado();

const formCadastro = document.getElementById('form-cadastro');
const btnSubmit = document.querySelector('button[type="submit"]');
const feedbackContainer = document.getElementById('mensagem-feedback');

formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault();
    limparMensagem(feedbackContainer);

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (senha !== confirmarSenha) {
        exibirMensagem(feedbackContainer, 'As senhas não coincidem.', 'erro');
        return;
    }

    btnSubmit.disabled = true;
    const textoOriginal = btnSubmit.textContent;
    btnSubmit.textContent = 'Cadastrando...';

    try {
        await request('/usuarios', {
            method: 'POST',
            body: JSON.stringify({nome, email, senha, confirmarSenha })
        });

        exibirMensagem(feedbackContainer, 'Conta criada com sucesso! Redirecionando...', 'sucesso');
        formCadastro.reset();

        setTimeout(() => {
            window.location.href = './index.html';
        }, 1500);
    } catch (error) {
        exibirMensagem(feedbackContainer, error.message || 'Erro ao realizar cadastro.', 'erro');
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = textoOriginal;
    }
});

function setupTogglePassword(toggleIconId, inputId) {
    const toggleIcon = document.getElementById(toggleIconId);
    const input = document.getElementById(inputId);

    if(!toggleIcon || !input) return;

    toggleIcon.addEventListener('click', () => {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';

        if (isPassword) {
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        } else {
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        }
    });
}

setupTogglePassword('toggle-senha', 'senha');
setupTogglePassword('toggle-confirmarSenha', 'confirmarSenha');