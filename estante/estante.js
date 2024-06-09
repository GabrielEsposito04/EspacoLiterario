document.addEventListener('DOMContentLoaded', function(event) {
    const livroLista = document.getElementById('livros-lista');
    const modal = document.getElementById('livro-modal');
    const botaoFecharModal = document.querySelector('.fechar ');
    const lerLivroGoogleBotao = document.getElementById('ler-google');
    const downloadLivroBotao = document.getElementById('download-livro');
    let selectedBook;

    function loadBooks() {
        const token = sessionStorage.getItem('googleAccessToken');
        if (!token) {
            alert('Por favor, faça login para ver sua estante de livros.');
            return;
        }

        fetch('https://www.googleapis.com/books/v1/mylibrary/bookshelves/7/volumes', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.items) {
                livroLista.innerHTML = ''; 
                data.items.forEach(item => {
                    const livro = document.createElement('div');
                    livro.className = 'livro';

                    const titulo = document.createElement('h3');
                    titulo.textContent = truncateString(item.volumeInfo.title, 20);

                    const autor = document.createElement('p');
                    autor.textContent = item.volumeInfo.authors ? truncateString(item.volumeInfo.authors.join(', '), 20) : 'Autor desconhecido';

                    const miniatura = document.createElement('img');
                    miniatura.src = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : '/imagens/indisponivel.png';

                    livro.addEventListener('click', () => {
                        selectedBook = item;
                        document.getElementById('livro-titulo').textContent = item.volumeInfo.title;
                        document.getElementById('livro-sinopse').textContent = item.volumeInfo.description || 'Descrição não disponível';
                        modal.style.display = 'block';
                    });

                    livro.appendChild(miniatura);
                    livro.appendChild(titulo);
                    livro.appendChild(autor);
                    livroLista.appendChild(livro);
                });
            } else {
                const noBooks = document.createElement('p');
                noBooks.textContent = 'Nenhum livro encontrado na sua estante.';
                livroLista.appendChild(noBooks);
            }
        })
        .catch(error => {
            console.error('Erro ao buscar livros:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Ocorreu um erro ao buscar seus livros. Por favor, tente novamente mais tarde.';
            livroLista.appendChild(errorMessage);
        });
    }

    function truncateString(str, maxLength) {
        return str.length > maxLength ? str.slice(0, maxLength) + '' : str;
    }

    if (botaoFecharModal) {
        botaoFecharModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    if (lerLivroGoogleBotao) {
        lerLivroGoogleBotao.addEventListener('click', () => {
            if (selectedBook && selectedBook.accessInfo && selectedBook.accessInfo.webReaderLink) {
                window.open(selectedBook.accessInfo.webReaderLink, '_blank');
            } else {
                alert('Link de leitura não disponível para este livro.');
            }
        });
    }

    if (downloadLivroBotao) {
        downloadLivroBotao.addEventListener('click', () => {
            if (selectedBook && selectedBook.accessInfo && selectedBook.accessInfo.pdf && selectedBook.accessInfo.pdf.downloadLink) {
                window.open(selectedBook.accessInfo.pdf.downloadLink, '_blank');
            } else {
                alert('Link de download não disponível para este livro.');
            }
        });
    }

    if (modal) {
        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    }

    loadBooks();
});
