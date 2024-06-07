// Importe a função handleDropdownToggle do arquivo autenticacao.js
import { handleDropdownToggle } from './autenticacao.js';

// Obtenha a referência para o botão com o ID 'botaoGoogle'
const botaoGoogle = document.getElementById('botaoGoogle');

// Verifica se a referência do botão é válida antes de atribuir o evento onclick
if (botaoGoogle) {
    // Se o botão existe, defina o evento onclick
    botaoGoogle.onclick = () => {
        // Verifica se a função handleDropdownToggle está definida e é uma função
        if (typeof handleDropdownToggle === 'function') {
            handleDropdownToggle();
        } else {
            // Se não estiver definida, chama a função handleLogin ou qualquer outra ação desejada
            handleLogin();
        }
    };
}
