document.addEventListener('DOMContentLoaded', function () {
    const headerHTML = `
        <header>
            <a href="/Home/home.html" class="logo"><img src="/imagens/logo-removebg-preview.png" alt="Logo"></a>
            <nav id="navMenu">
                <a href="/Home/home.html">Home</a>
                <a href="/Pesquisar/pesquisar.html">Pesquisar</a>
                <a href="/Estante/estante.html">Biblioteca</a>
                <a href="/Sobre/sobre.html">Sobre</a>
                <div class="suspenso">
                    <button id="botaoGoogle"><img src="/imagens/google.png" alt="Google Sign-In"></button>
                    <div id="menuSuspenso" class="suspenso-content">
                        <button id="botaoLogin">Login</button>
                        <button id="botaoLogout" style="display:none;">Logout</button>
                    </div>
                </div>
            </nav>
            <div class="hamburger" id="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </header>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

 
    const botaoGoogle = document.getElementById('botaoGoogle');
    const menuSuspenso = document.getElementById('menuSuspenso');

    botaoGoogle.onclick = () => {
        menuSuspenso.style.display = menuSuspenso.style.display === 'flex' ? 'none' : 'flex';
    };
});
