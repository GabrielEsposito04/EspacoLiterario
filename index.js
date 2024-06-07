import { handleDropdownToggle } from 'autenticacao.js';

const botaoGoogle = document.getElementById('botaoGoogle');

botaoGoogle.onclick = () => {
    // Verifica se a função handleDropdownToggle está definida
    if (typeof handleDropdownToggle === 'function') {
        handleDropdownToggle();
    } else {
        // Se não estiver definida (neste contexto, no index), chama a função handleLogin
        handleLogin();
    }
};

