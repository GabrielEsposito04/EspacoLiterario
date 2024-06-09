const maxResults = 8;
let startIndex = 0;
let todosLivros = [];
let genero = "";

function PesquisarLivros(query, pagina = 0) {
    const startIndex = pagina * maxResults;
    const precoFiltro = document.getElementById('FiltroPreco').value;
    const idiomaFiltro = document.getElementById('FiltroIdioma').value;

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=40`)
    .then(response => response.json())
    .then(data => {
        if (data.items) {
            todosLivros = data.items
                .filter(livro => filtrarPorPreco(livro, precoFiltro))
                .filter(livro => filtrarPorIdioma(livro, idiomaFiltro))
                .sort((a, b) => {
                    const estrelaA = a.volumeInfo.averageRating || 0;
                    const estrelaB = b.volumeInfo.averageRating || 0;
                    return estrelaB - estrelaA;
                });

            if (todosLivros.length > 0) {
                displayLivros(todosLivros.slice(0, maxResults));
                displayPagination(todosLivros.length, pagina);
            } else {
                if (idiomaFiltro) {
                    displayMensagemIndisponível("Não possuímos o livro que você procura nesse idioma.");
                } else if (precoFiltro) {
                    displayMensagemIndisponível("Não possuímos o livro que você procura nesse preço.");
                } else {
                    displayMensagemIndisponível("Nenhum livro encontrado.");
                }
            }
        } else {
            displayMensagemIndisponível("Nenhum livro encontrado.");
        }
    })
    .catch(error => {
        console.error("Erro ao buscar livros:", error);
        displayMensagemIndisponível("Erro ao buscar livros. Tente novamente mais tarde.");
    });
}

function PesquisarNome() {
    const searchInput = document.getElementById('searchInput').value;
    if (!searchInput.trim()) {
        displayMensagemIndisponível("Por favor, insira um termo de busca.");
        return;
    }
    PesquisarLivros(searchInput);
}

function PesquisarGenero() {
    const generoSelect = document.getElementById('generoSelect').value;
    if (!generoSelect.trim()) {
        displayMensagemIndisponível("Por favor, selecione um gênero.");
        return;
    }
    genero = generoSelect;
    PesquisarLivros(`subject:${genero}`);
}

function filtrarPorPreco(livro, precoFiltro) {
    if (!precoFiltro) return true;

    const preco = livro.saleInfo.retailPrice ? livro.saleInfo.retailPrice.amount : null;

    switch (precoFiltro) {
        case 'free':
            return livro.saleInfo.saleability === 'FREE';
        case '50':
            return preco !== null && preco <= 50;
        case '100':
            return preco !== null && preco <= 100;
        case 'over100':
            return preco !== null && preco > 100;
        default:
            return true;
    }
}

function filtrarPorIdioma(livro, idiomaFiltro) {
    if (!idiomaFiltro) return true;

    return livro.volumeInfo.language === idiomaFiltro;
}

function displayLivros(books) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '';
    books.forEach(livro => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('livro');

        const capa = livro.volumeInfo.imageLinks ? livro.volumeInfo.imageLinks.thumbnail : '/imagens/indisponivel.png';
        bookElement.innerHTML = `
            <img src="${capa}" alt="${livro.volumeInfo.title}">
            <div class="livro-info">
                <h2>${livro.volumeInfo.title}</h2>
                <p><strong>Autor:</strong> ${livro.volumeInfo.authors ? livro.volumeInfo.authors.join(', ') : 'Autor desconhecido'}</p>
                <p><strong>Língua:</strong> ${getIdioma(livro.volumeInfo.language)}</p>
                <p><strong>Data de publicação:</strong> ${livro.volumeInfo.publishedDate ? livro.volumeInfo.publishedDate : 'Data de publicação desconhecida'}</p>
                <div class="avaliacao">${getStarRating(livro.volumeInfo.averageRating)}</div>
                <p><strong>Sinopse:</strong> ${livro.volumeInfo.description ? livro.volumeInfo.description : 'Sinopse não disponível'}</p>
                <p><strong>Preço:</strong> ${livro.saleInfo.retailPrice ? `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(livro.saleInfo.listPrice.amount)}` : 'Preço não disponível'}</p>
                ${livro.saleInfo.buyLink ? `<a href="${livro.saleInfo.buyLink}" target="_blank" class="buy-button">Comprar</a>` : '<span class="unavailable-button">Indisponível</span>'}
            </div>
        `;
        resultadoDiv.appendChild(bookElement);
    });
}

function getStarRating(avaliacao) {
    const estrelaCheia = '<span class="star gold">&#9733;</span>';
    const estrelaVazia = '<span class="star gray">&#9733;</span>';

    if (!avaliacao) {
        return estrelaVazia.repeat(5);
    } else {
        return estrelaCheia.repeat(Math.floor(avaliacao)) + estrelaVazia.repeat(5 - Math.floor(avaliacao));
    }
}

function getIdioma(code) {
    const linguas = {
        en: 'Inglês',
        pt: 'Português',
        fr: 'Francês',
    };
    return linguas[code] || '';
}

function displayPagination(totalItems, pagina) {
    const anteriorBotao = document.getElementById('anteriorBotao');
    const proximoBotao = document.getElementById('proximoBotao');

    anteriorBotao.disabled = pagina === 0;
    proximoBotao.disabled = (pagina + 1) * maxResults >= totalItems;

    anteriorBotao.onclick = () => {
        if (pagina > 0) {
            startIndex--;
            scrollToTop();
            if (genero) {
                PesquisarLivros(`subject:${genero}`, startIndex);
            } else {
                const searchInput = document.getElementById('searchInput').value;
                PesquisarLivros(searchInput, startIndex);
            }
        }
    };

    proximoBotao.onclick = () => {
        if ((pagina + 1) * maxResults < totalItems) {
            startIndex++;
            scrollToTop();
            if (genero) {
                PesquisarLivros(`subject:${genero}`, startIndex);
            } else {
                const searchInput = document.getElementById('searchInput').value;
                PesquisarLivros(searchInput, startIndex);
            }
        }
    };
}

function displayMensagemIndisponível(message) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `<p class="unavailable-message">${message}</p>`;
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Eventos de busca
document.getElementById('searchButton').onclick = PesquisarNome;
document.getElementById('generoSelect').onchange = PesquisarGenero;
document.getElementById('FiltroPreco').onchange = () => {
    const generoSelect = document.getElementById('generoSelect').value;
    if (generoSelect.trim()) {
        PesquisarLivros(`subject:${generoSelect}`);
    } else {
        const searchInput = document.getElementById('searchInput').value;
        if (searchInput.trim()) {
            PesquisarLivros(searchInput);
        }
    }
};
document.getElementById('FiltroIdioma').onchange = () => {
    const generoSelect = document.getElementById('generoSelect').value;
    if (generoSelect.trim()) {
        PesquisarLivros(`subject:${generoSelect}`);
    } else {
        const searchInput = document.getElementById('searchInput').value;
        if (searchInput.trim()) {
            PesquisarLivros(searchInput);
        }
    }
};
