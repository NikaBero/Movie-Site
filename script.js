document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    burger.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('active')) {
        nav.classList.remove('active');
        burger.classList.remove('active');
      }
    });
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const header = document.getElementById('header');
  const stickyOffset = header.offsetTop;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > stickyOffset) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  });

  let movies = [];

  const movieSection = document.getElementById('movie-section');
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');

  function renderMovies(movieList) {
    movieSection.innerHTML = '';
    movieList.forEach((movie, index) => {
      const card = document.createElement('article');
      card.className = 'movie-card';
      card.style.animationDelay = `${index * 0.1}s`;
      card.tabIndex = 0;
      card.innerHTML = `
        <img src="${movie.poster}" alt="Poster of ${movie.title}" loading="lazy" />
        <div class="movie-info">
          <h3 class="movie-title">${movie.title}</h3>
          <p class="movie-description">${movie.description}</p>
          <p class="movie-rating">Rating: ${movie.rating} ⭐</p>
          <ul class="movie-reviews">
            ${movie.reviews.map(review => `<li>${review}</li>`).join('')}
          </ul>
        </div>
      `;
      movieSection.appendChild(card);
    });
  }

  function filterMovies() {
    const searchTerm = searchInput.value.toLowerCase();
    let filtered = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.description.toLowerCase().includes(searchTerm)
    );
    return filtered;
  }

  function sortMovies(movieList) {
    const sortValue = sortSelect.value;
    if (sortValue === 'title-asc') {
      movieList.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortValue === 'title-desc') {
      movieList.sort((a, b) => b.title.localeCompare(a.title));
    }
    return movieList;
  }

  function updateMovies() {
    let filtered = filterMovies();
    let sorted = sortMovies(filtered);
    renderMovies(sorted);
    addMovieCardClickListeners(sorted);
  }

  searchInput.addEventListener('input', updateMovies);
  sortSelect.addEventListener('change', updateMovies);

  let modal = null;

  function openModal(movie) {
    modal = document.createElement('div');
    modal.className = 'modal';

    modal.innerHTML = `
      <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button class="modal-close" aria-label="Close modal">&times;</button>
        <img src="${movie.poster}" alt="Poster of ${movie.title}" />
        <h3 id="modal-title">${movie.title}</h3>
        <p>${movie.description}</p>
        <p><strong>Rating:</strong> ${movie.rating} ⭐</p>
        <ul>
          ${movie.reviews.map(review => `<li>${review}</li>`).join('')}
        </ul>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', handleEscape);
  }

  function closeModal() {
    if (modal) {
      document.body.removeChild(modal);
      modal = null;
      document.removeEventListener('keydown', handleEscape);
    }
  }

  function handleEscape(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  function addMovieCardClickListeners(movieList) {
    const cards = document.querySelectorAll('.movie-card');
    cards.forEach((card, index) => {
      card.addEventListener('click', () => {
        openModal(movieList[index]);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(movieList[index]);
        }
      });
    });
  }

  fetch('movies.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      movies = data;
      updateMovies();
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });

  const darkModeToggle = document.getElementById('dark-mode-toggle');
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });


  const originalTitle = document.title;
  const messages = [
    '👋 Come back!',
    '🎬 We miss you!',
    '🍿 More movies await!',
    '✨ Don\'t miss out!',
    '🎥 Your cinema is here!'
  ];
  let messageIndex = 0;
  let titleInterval;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      titleInterval = setInterval(() => {
        document.title = messages[messageIndex];
        messageIndex = (messageIndex + 1) % messages.length;
      }, 2000); 
    } else {
      clearInterval(titleInterval);
      document.title = originalTitle;
      messageIndex = 0;
    }
  });
});
