import { request } from '../services/api.js';
import { authStorage } from '../utils/auth.js';
import { exibirMensagem, limparMensagem } from '../utils/alerts.js';

authStorage.redirecionarSeAutenticado();

const formLogin = document.getElementById('form-login');
const btnSubmit = formLogin.querySelector('button[type="submit"]');
const feedbackContainer = document.getElementById('mensagem-feedback');

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

formLogin.addEventListener('submit', async (event) =>{
    event.preventDefault();
    limparMensagem(feedbackContainer);

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    btnSubmit.disabled = true;
    const textoOriginal = btnSubmit.textContent;
    btnSubmit.textContent = 'Entrando...';

    try{
        const response = await request('/login', {
            method: 'POST',
            body: JSON.stringify({ email, senha })
        });
        authStorage.salvarSessao(response.token, response.usuario || { email });

        exibirMensagem(feedbackContainer, 'Login realizado com sucesso! Redirecionando...', 'sucesso');

        setTimeout(() => {
            window.location.href = './perfil.html';
        }, 1200);

    } catch (error) {
        const mensagem = error.message.includes('401') || error.message.includes('403')
        ? 'E-mail ou senha incorretos.'
        :(error.message || 'Erro ao realizar login. Tente novamente.')

        exibirMensagem(feedbackContainer, mensagem, 'erro');
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = textoOriginal;
    }
});