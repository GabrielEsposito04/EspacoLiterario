document.addEventListener('DOMContentLoaded', () => {
    fetchRecommendedBooks();

    document.getElementById('ProximoRecomendado').addEventListener('click', () => shiftSlide('Recomendados', 1));
    document.getElementById('AnteriorRecomendado').addEventListener('click', () => shiftSlide('Recomendados', -1));
});

function fetchRecommendedBooks() {
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
    .then(data => displayBooks(data.items || [], 'Recomendados'))
    .catch(error => console.error('Erro ao buscar livros recomendados:', error));
}

function displayBooks(livros, carrocelId) {
    const carrossel = document.getElementById(carrocelId);
    carrossel.innerHTML = '';

    livros.forEach((livro, index) => {
        const livroDiv = document.createElement('div');
        livroDiv.classList.add('livro');
        livroDiv.setAttribute('data-index', index);

        const img = document.createElement('img');
        img.src = livro.volumeInfo.imageLinks ? livro.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150';
        img.alt = `Capa do livro ${livro.volumeInfo.title}`;

        const livroInfo = document.createElement('div');
        livroInfo.classList.add('livro-info');

        const livroTitulo = document.createElement('div');
        livroTitulo.classList.add('livro-titulo');
        livroTitulo.textContent = truncateText(livro.volumeInfo.title || 'Título não disponível', 20);
        const livroAutor = document.createElement('div');
        livroAutor.classList.add('livro-autor');
        livroAutor.textContent = livro.volumeInfo.authors ? livro.volumeInfo.authors.join(', ') : 'Autor Desconhecido';

        const livroAvaliacao = document.createElement('div');
        livroAvaliacao.classList.add('livroAvaliacao');
        const averageRating = livro.volumeInfo.averageRating || 0;
        for (let i = 1; i <= 5; i++) {
            const estrela = document.createElement('span');
            estrela.classList.add('estrela');
            estrela.innerHTML = '&#9733;';
            if (i <= averageRating) {
                estrela.classList.add('gold');
            }
            livroAvaliacao.appendChild(estrela);
        }

        const livroPreco = document.createElement('div');
        livroPreco.classList.add('livro-preco');
        livroPreco.textContent = livro.saleInfo.listPrice ? `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(livro.saleInfo.listPrice.amount)}` 
        : 'Preço não disponível';
        const linkCompra = document.createElement('a');
        linkCompra.href = livro.saleInfo.buyLink || '#';
        linkCompra.target = '_blank';
        linkCompra.textContent = 'Comprar';
        linkCompra.classList.add('botao-compra');

        livroInfo.appendChild(livroTitulo);
        livroInfo.appendChild(livroAutor);
        livroInfo.appendChild(livroAvaliacao);
        livroInfo.appendChild(livroPreco);
        livroInfo.appendChild(linkCompra);
        livroDiv.appendChild(img);
        livroDiv.appendChild(livroInfo);
        carrossel.appendChild(livroDiv);
    });

    shiftSlide(carrocelId, 0);
}

const indicesSlidesAtuais = {
    Recomendados: 0,
};

function shiftSlide(carrocelId, direcao) {
    const carrossel = document.getElementById(carrocelId);
    const livros = carrossel.querySelectorAll('.livro');
    const livrosPorSlide = 5;
    const totalSlides = Math.ceil(livros.length / livrosPorSlide);

    indicesSlidesAtuais[carrocelId] = (indicesSlidesAtuais[carrocelId] + direcao + totalSlides) % totalSlides;

    livros.forEach((livro, i) => {
        livro.style.display = (i >= indicesSlidesAtuais[carrocelId] * livrosPorSlide && i < (indicesSlidesAtuais[carrocelId] + 1) * livrosPorSlide) ? 'block' : 'none';
    });
}
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
}