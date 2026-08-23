export function exibirMensagem(elementoAlvo, texto, tipo = 'erro') {
    if (!elementoAlvo) return; 

    elementoAlvo.textContent = texto;
    elementoAlvo.style.display = 'block';
    elementoAlvo.style.padding = '0.75rem 1rem';
    elementoAlvo.style.marginBottom = '1.25rem';
    elementoAlvo.style.borderRadius = '8px';
    elementoAlvo.style.fontSize = '0.875rem';
    elementoAlvo.style.textAlign = 'center';

    if (tipo === 'erro') {
        elementoAlvo.style.backgroundColor = '#EF4444';
        elementoAlvo.style.color = '#FFFFFF';
        elementoAlvo.style.border = '1px solid rgba(239, 68, 68, 0.3)';
    } else {
        elementoAlvo.style.backgroundColor = '#10B981';
        elementoAlvo.style.color = '#ffffff';
        elementoAlvo.style.border = '1px solid rgba(16, 185, 129, 0.3)';
    }
}

export function limparMensagem(elementoAlvo) {
    if (!elementoAlvo) return;
    elementoAlvo.textContent = '';
    elementoAlvo.style.display = 'none';
}