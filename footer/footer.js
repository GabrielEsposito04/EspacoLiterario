document.addEventListener('DOMContentLoaded', () => {
    const footer = document.createElement('footer');
    footer.innerHTML = `
        <div class="footer-content">
            <ul class="footer-links">
                <li><a href="/Home/home.html">Home</a></li>
                <li><a href="/Pesquisar/pesquisarNome.html">Pesquisar</a></li>
                <li><a href="/Estante/estante.html">Biblioteca</a></li>
            </ul>
            <ul class="footer-links2">
                <li><a href="/TopVendas/todosMaisVendidos.html">Mais Vendidos</a></li>
                <li><a href="/Recomendados/recomendados.html">Recomendados</a></li>
                <li><a href="/Sobre/sobre.html">Sobre</a></li>
            </ul>
            <div class="footer-contact">
                <p>Email: contato@espaco-literal.com</p>
                <p>Telefone: (11) 1234-5678</p>
            </div>
        </div>
    `;
    document.body.appendChild(footer);


    const adjustFooter = () => {
        const body = document.body;
        const html = document.documentElement;
        const footerHeight = footer.offsetHeight;
        const windowHeight = window.innerHeight;
        const contentHeight = html.scrollHeight;

        if (contentHeight < windowHeight) {
            body.style.minHeight = `calc(100vh - ${footerHeight}px)`;
        } else {
            body.style.minHeight = 'auto';
        }
    };

    adjustFooter();
    window.addEventListener('resize', adjustFooter);
});
