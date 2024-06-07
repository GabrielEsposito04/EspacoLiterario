document.addEventListener('DOMContentLoaded', () => {
    let paginaAtual = 1;
    buscarMaisVendidos(paginaAtual);

    const modal = document.getElementById('livroDetalhes');
    const botaoFechar = document.querySelector('.botaoFechar');

    botaoFechar.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', event => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    document.getElementById('AnteriorBotao').addEventListener('click', () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            buscarMaisVendidos(paginaAtual);
        }
    });

    document.getElementById('ProximoBotao').addEventListener('click', () => {
        paginaAtual++;
        buscarMaisVendidos(paginaAtual);
    });
});

function buscarMaisVendidos(pagina) {
    const startIndex = (pagina - 1) * 10;
    const maxResults = 24;
    const url = `https://www.googleapis.com/books/v1/volumes?q=best%20sellers&orderBy=relevance&startIndex=${startIndex}&maxResults=${maxResults}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const bestSellers = data.items || [];
            displayMaisVendidos(bestSellers);
            updateBotaoPaginacao(data.totalItems, maxResults, pagina);
        })
        .catch(error => {
            console.error('Erro ao buscar livros mais vendidos:', error);
        });
}

function displayMaisVendidos(books) {
    const bookListDiv = document.getElementById('todosLivros');
    bookListDiv.innerHTML = '';

    books.forEach((livro, index) => {
        const livroDiv = document.createElement('div');
        livroDiv.classList.add('livro');
        livroDiv.setAttribute('data-index', index);

        const img = document.createElement('img');
        img.src = livro.volumeInfo.imageLinks ? livro.volumeInfo.imageLinks.thumbnail : '/imagens/indisponivel.png';
        img.alt = `Capa do livro ${livro.volumeInfo.titulo}`;
        livroDiv.appendChild(img);

        const titulo = document.createElement('h3');
        titulo.textContent = trucarTexto(livro.volumeInfo.title || 'Título não disponível', 15);
        livroDiv.appendChild(titulo);

        const autor = document.createElement('p');
        autor.textContent = `Autor: ${trucarTexto(livro.volumeInfo.authors ? livro.volumeInfo.authors.join(', ') : 'Desconhecido', 20)}`;
        livroDiv.appendChild(autor);

        const avaliacao = document.createElement('div');
       avaliacao.classList.add('avaliacao');
        const classificaAvaliacao = livro.volumeInfo.averageRating || 0;
        for (let i = 1; i <= 5; i++) {
            const estrela = document.createElement('span');
            estrela.classList.add('estrela');
            estrela.innerHTML = '&#9733;'; 
            if (i <= classificaAvaliacao) {
                estrela.classList.add('gold');
            } else {
                estrela.classList.add('gray');
            }
           avaliacao.appendChild(estrela);
        }
        livroDiv.appendChild(avaliacao);

        const livroPreco = document.createElement('div');
        livroPreco.classList.add('livro-preco');
        livroPreco.textContent = livro.saleInfo.listPrice ? `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(livro.saleInfo.listPrice.amount)}` 
        : 'indisponivel';
        livroDiv.appendChild(livroPreco);

        const comprarBotao = document.createElement('button');
        if (livro.saleInfo.buyLink) {
            comprarBotao.textContent = 'Comprar';
            comprarBotao.onclick = () => {
                window.open(livro.saleInfo.buyLink, '_blank');
            };
        } else {
            comprarBotao.textContent = 'Indisponível';
            comprarBotao.classList.add('indisponivel');
            comprarBotao.disabled = true;
        }
        livroDiv.appendChild(comprarBotao);

        bookListDiv.appendChild(livroDiv);

        livroDiv.addEventListener('click', () => {
            mostrarDetalhes(livro);
        });
    });
}

function updateBotaoPaginacao(totalItems, maxResults, paginaAtual) {
    const totalPaginas = Math.ceil(totalItems / maxResults);
    document.getElementById('AnteriorBotao').disabled = paginaAtual === 1;
    document.getElementById('ProximoBotao').disabled = paginaAtual === totalPaginas;
}

function mostrarDetalhes(livro) {
    const modal = document.getElementById('livroDetalhes');
    const titulo = document.getElementById('livroTitulo');
    const autor = document.getElementById('livroAutor');
    const descricao = document.getElementById('livroDescricao');
    const linkCompra = document.getElementById('linkCompra');
    const Indisponivel = document.getElementById('Indisponivel');

    titulo.textContent = livro.volumeInfo.title;
    autor.textContent = `Autores: ${livro.volumeInfo.authors ? livro.volumeInfo.authors.join(', ') : 'Desconhecido'}`;
    descricao.textContent = livro.volumeInfo.description || 'Descrição não disponível.';

    if (livro.saleInfo.buyLink) {
        linkCompra.href = livro.saleInfo.buyLink;
        linkCompra.textContent = 'Comprar';
        linkCompra.style.display = 'inline-block';
        Indisponivel.style.display = 'none';
    } else {
        linkCompra.href = '#';
        linkCompra.textContent = 'Não disponível para compra';
        linkCompra.style.display = 'none';
        Indisponivel.style.display = 'inline-block';
    }

    modal.style.display = 'flex';
}

function trucarTexto(text, maxLength) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
}
