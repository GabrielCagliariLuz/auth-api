import { request } from '../services/api.js';
import { authStorage } from '../utils/auth.js';
import { exibirMensagem, limparMensagem } from '../utils/alerts.js';

// 1. Route Guard: Bloqueia acesso sem credenciais ativas
authStorage.protegerRota();

// Elementos de Apresentação e Feedback
const feedbackContainer = document.getElementById('mensagem-feedback');
const displayNome = document.getElementById('display-nome');
const displayEmail = document.getElementById('display-email');
const avatarIniciais = document.getElementById('avatar-iniciais');
const navSaudacao = document.getElementById('nav-saudacao');

// Formulário de Edição
const formEditarPerfil = document.getElementById('form-editar-perfil');
const inputNome = document.getElementById('input-nome');
const inputEmail = document.getElementById('input-email');
const btnSalvar = document.getElementById('btn-salvar');

// Ações Globais
const btnExcluir = document.getElementById('btn-excluir');
const btnLogout = document.getElementById('btn-logout');

/**
 * Extrai as iniciais do nome para o avatar (ex: "Gabriel Cagliari Luz" -> "GL")
 */
function extrairIniciais(nome) {
    if (!nome) return '--';
    const partes = nome.trim().split(/\s+/);
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

/**
 * Atualiza o DOM e a barra de navegação com os dados mais recentes
 */
function renderizarPerfil(usuario) {
    if (!usuario) return;

    displayNome.textContent = usuario.nome || 'Usuário';
    displayEmail.textContent = usuario.email || '';
    avatarIniciais.textContent = extrairIniciais(usuario.nome);

    if (navSaudacao) {
        const primeiroNome = usuario.nome ? usuario.nome.trim().split(' ')[0] : 'Usuário';
        navSaudacao.textContent = `Olá, ${primeiroNome}`;
    }

    inputNome.value = usuario.nome || '';
    inputEmail.value = usuario.email || '';
}

/**
 * Busca o estado sincronizado do usuário diretamente no banco via GET /usuarios/{id}
 */
async function inicializarDados() {
    const usuarioSessao = authStorage.obterUsuario();

    if (!usuarioSessao || !usuarioSessao.id) {
        authStorage.limparSessao();
        window.location.href = './index.html';
        return;
    }

    // Hidratação rápida com dados em cache local
    renderizarPerfil(usuarioSessao);

    try {
        const dadosAtualizados = await request(`/usuarios/${usuarioSessao.id}`, {
            method: 'GET'
        });

        authStorage.salvarSessao(authStorage.obterToken(), dadosAtualizados);
        renderizarPerfil(dadosAtualizados);
    } catch (error) {
        exibirMensagem(
            feedbackContainer, 
            error.message || 'Não foi possível carregar os dados mais recentes.', 
            'erro'
        );
    }
}

inicializarDados();

/**
 * Submissão do Formulário: Atualização de Nome (PUT /usuarios/{id})
 */
formEditarPerfil.addEventListener('submit', async (event) => {
    event.preventDefault();
    limparMensagem(feedbackContainer);

    const usuario = authStorage.obterUsuario();
    const novoNome = inputNome.value.trim();

    if (novoNome === usuario.nome) {
        exibirMensagem(feedbackContainer, 'Nenhuma alteração detectada.', 'erro');
        return;
    }

    btnSalvar.disabled = true;
    const textoOriginal = btnSalvar.textContent;
    btnSalvar.textContent = 'Salvando...';

    try {
        // Envia apenas os dados mutáveis conforme DTO de entrada
        const usuarioAtualizado = await request(`/usuarios/${usuario.id}`, {
            method: 'PUT',
            body: JSON.stringify({ nome: novoNome })
        });

        authStorage.salvarSessao(authStorage.obterToken(), usuarioAtualizado);
        renderizarPerfil(usuarioAtualizado);

        exibirMensagem(feedbackContainer, 'Perfil atualizado com sucesso!', 'sucesso');
    } catch (error) {
        exibirMensagem(feedbackContainer, error.message || 'Erro ao atualizar o perfil.', 'erro');
    } finally {
        btnSalvar.disabled = false;
        btnSalvar.textContent = textoOriginal;
    }
});

/**
 * Exclusão Lógica de Conta (DELETE /usuarios/{id})
 */
btnExcluir.addEventListener('click', async () => {
    const confirmou = window.confirm(
        'Atenção: Tem certeza de que deseja excluir sua conta permanentemente? Esta ação não pode ser revertida.'
    );

    if (!confirmou) return;

    limparMensagem(feedbackContainer);
    btnExcluir.disabled = true;

    try {
        const usuario = authStorage.obterUsuario();
        await request(`/usuarios/${usuario.id}`, {
            method: 'DELETE'
        });

        authStorage.limparSessao();
        alert('Sua conta foi encerrada com sucesso.');
        window.location.href = './index.html';
    } catch (error) {
        exibirMensagem(feedbackContainer, error.message || 'Erro ao excluir conta.', 'erro');
        btnExcluir.disabled = false;
    }
});

/**
 * Encerramento de Sessão
 */
btnLogout.addEventListener('click', () => {
    authStorage.limparSessao();
    window.location.href = './index.html';
});