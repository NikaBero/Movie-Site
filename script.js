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

  const movies = [
    {
      "title": "Inception",
      "description": "A skilled thief enters dreams to steal secrets.",
      "poster": "Images/Inception.png",
      "rating": 4.8,
      "reviews": [
        "Mind-bending and thrilling!",
        "A masterpiece of modern cinema."
      ]
    },
    {
      "title": "Interstellar",
      "description": "Astronauts travel through a wormhole in space.",
      "poster": "Images/Interstellar.png",
      "rating": 4.7,
      "reviews": [
        "Visually stunning and emotional.",
        "A journey through space and time."
      ]
    },
    {
      "title": "The Matrix",
      "description": "A hacker discovers reality is a simulation.",
      "poster": "Images/The Matrix.png",
      "rating": 4.9,
      "reviews": [
        "Revolutionary sci-fi action.",
        "Philosophical and exciting."
      ]
    },
    {
      "title": "Avatar",
      "description": "A marine explores an alien world called Pandora.",
      "poster": "Images/Avatar.png",
      "rating": 4.5,
      "reviews": [
        "Beautiful world-building.",
        "A visual spectacle."
      ]
    },
    {
      "title": "Joker",
      "description": "A failed comedian turns to madness.",
      "poster": "Images/Joker.png",
      "rating": 4.6,
      "reviews": [
        "Dark and gripping.",
        "Outstanding performance."
      ]
    },
    {
      "title": "Tenet",
      "description": "A spy manipulates time to prevent catastrophe.",
      "poster": "Images/Tenet.png",
      "rating": 4.3,
      "reviews": [
        "Complex and thrilling.",
        "Requires multiple viewings."
      ]
    }
  ];


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
  }

  searchInput.addEventListener('input', updateMovies);
  sortSelect.addEventListener('change', updateMovies);

  // Modal element
  let modal = null;

  function openModal(movie) {
    // Create modal container
    modal = document.createElement('div');
    modal.className = 'modal';

    // Modal content HTML
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

    // Append modal to body
    document.body.appendChild(modal);

    // Close modal on close button click
    modal.querySelector('.modal-close').addEventListener('click', closeModal);

    // Close modal on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close modal on Escape key
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

  // Add click event to movie cards to open modal
  function addMovieCardClickListeners(movieList) {
    const cards = document.querySelectorAll('.movie-card');
    cards.forEach((card, index) => {
      card.addEventListener('click', () => {
        openModal(movieList[index]);
      });
      // Also add keyboard accessibility: open modal on Enter key
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(movieList[index]);
        }
      });
    });
  }

  // Update renderMovies to add click listeners after rendering
  const originalRenderMovies = renderMovies;
  renderMovies = function(movieList) {
    originalRenderMovies(movieList);
    addMovieCardClickListeners(movieList);
  };

  // Initial render
  renderMovies(movies);


  // Dark mode toggle
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
