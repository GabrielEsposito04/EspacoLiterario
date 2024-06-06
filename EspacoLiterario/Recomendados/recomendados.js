document.addEventListener('DOMContentLoaded', () => {
    buscarLivrosRecomendados();

    document.querySelectorAll('.fechar').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').style.display = 'none';
        });
    });
});

function buscarLivrosRecomendados() {
    const token = sessionStorage.getItem('googleAccessToken');
    if (!token) {
        alert('Por favor, faça login para ver os livros recomendados.');
        return;
    }

    fetch('https://www.googleapis.com/books/v1/mylibrary/bookshelves/8/volumes', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
        if (!response.ok) throw new Error(`Erro na requisição: ${response.statusText}`);
        return response.json();
    })
    .then(data => {
        displayLivrosRecomendados(data.items || []);
    })
    .catch(error => console.error('Erro ao buscar livros recomendados:', error));
}

function displayLivrosRecomendados(livros) {
    const listLivros = document.getElementById('recommendedBooks');
    listLivros.innerHTML = '';

    livros.forEach(livro => {
        const livroDiv = createBookElement(livro);
        listLivros.appendChild(livroDiv);
    });

    const paginacaoDiv = document.querySelector('.paginacao');
    if (livros.length > 20) {
        paginacaoDiv.style.display = 'flex';
    } else {
        paginacaoDiv.style.display = 'none';
    }
}

function createBookElement(livro) {
    const livroDiv = document.createElement('div');
    livroDiv.classList.add('livro');

    const img = document.createElement('img');
    img.src = livro.volumeInfo.imageLinks ? livro.volumeInfo.imageLinks.thumbnail : '/imagens/indisponivel.png';
    img.alt = `Capa do livro ${livro.volumeInfo.titulo}`;
    livroDiv.appendChild(img);

    const titulo = document.createElement('h3');
    titulo.textContent = truncateText(livro.volumeInfo.title || 'Título não disponível', 15);
    livroDiv.appendChild(titulo);

    const autor = document.createElement('p');
    autor.textContent = `Autor: ${truncateText(livro.volumeInfo.authors ? livro.volumeInfo.authors.join(', ') : 'Desconhecido', 10)}`;
    livroDiv.appendChild(autor);

    const avaliacao = document.createElement('div');
    avaliacao.classList.add('avaliacao');
    const averageRating = livro.volumeInfo.averageRating || 0;
    for (let i = 1; i <= 5; i++) {
        const estrela = document.createElement('span');
        estrela.classList.add('estrela');
        estrela.innerHTML = '&#9733;';
        if (i <= averageRating) {
            estrela.classList.add('gold');
        }
        avaliacao.appendChild(estrela);
    }
    livroDiv.appendChild(avaliacao);

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
    livroDiv.addEventListener('click', () => {
        showSynopsis(livro.volumeInfo.description || 'Sinopse indisponível', livro.saleInfo.buyLink || '#');
    });

    return livroDiv;
}

function showSynopsis(sinopse) {
    const modal = document.getElementById('sinopseModal');
    document.getElementById('sinopseTexto').innerText = sinopse;
    modal.style.display = "flex";
}

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
}
