const resDiv = document.querySelector('#results');
const nextBtn = document.querySelector('#next');
const prevBtn = document.querySelector('#prev');
const totalPages = document.querySelector('#total');
const pageDisplay = document.querySelector('#page');
const searchForm = document.querySelector('#search');
const searchQuery = document.querySelector('#query');
const openOverlay = document.querySelectorAll('#open');
const overlay = document.querySelector('.Overlay');
const closeBtn = document.querySelector('#closeOverlay');
const infoDiv = document.querySelector('.info');





let current_page = 1;
pageDisplay.innerHTML = current_page;

nextBtn.addEventListener('click', () => {
  current_page++;
  pageDisplay.innerHTML = current_page;
  getMovies();
});

prevBtn.addEventListener('click', () => {
  current_page--;
  pageDisplay.innerHTML = current_page;

  if (current_page < 1) {
    current_page = 1;
    alert("You already on page 1");
    pageDisplay.innerHTML = current_page;
  }

  getMovies();
})



window.onload = () => {
  getMovies();
}



window.addEventListener('online', () => {
  getMovies();
});

window.addEventListener('offline', () => {
  resDiv.innerHTML = "No internet connection, check your wifi or cable and try again";
});



searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const pagination = document.querySelector('#pagination');

  const searchHeading = document.querySelector('#searchHeading');
  const movieTerm = searchQuery.value;

  if (movieTerm !== "") {

    searchMovie(movieTerm);
    searchHeading.style.display = "block";
    searchHeading.innerHTML = `Searching For: <span>${movieTerm}</span>`;

  } else {
    alert('Enter any keyword..');
    return false;
  }

  pagination.style.display = "none";
  prevBtn.style.display = "none";
  nextBtn.style.display = "none";






});



const searchMovie = (movie) => {

  fetch(`https://yts.mx/api/v2/list_movies.json?query_term=${movie}`)
    .then(response => {
      return response.json();
    })
    .then(movieData => {
      const movieObj = movieData.data;
      let Output = '';
      let total = Math.round(movieObj.movie_count / movieObj.limit);
      totalPages.innerHTML = total;
      if (movieObj.movie_count !== 0) {

        movieObj.movies.forEach(movieInfo => {
          Output += `
          <div class="movie">
            <h2 class="movie-title" title="${movieInfo.title}">${movieInfo.title_english}</h2>
            <img src="${movieInfo.medium_cover_image}" alt="${movieInfo.title}">
            <input type="hidden" value="${movieInfo.id}">
            <div>
            <button id="open" class="open">Download Movie </button>
            </div>
          </div>
        `;
        });

        document.querySelector('#errors').innerHTML = "";

      } else {
        document.querySelector('#errors').innerHTML = `<h1>No movie Found: ${movie}</h1>`;

      }


      resDiv.innerHTML = Output;


    })
    .catch(error => {
      console.log(`There is an Error: ${error}`);
    });

}

const getMovies = () => {

  fetch(`https://yts.mx/api/v2/list_movies.json?page=${current_page}`)
    .then(response => {
      return response.json();
    })
    .then(movieData => {
      const movieObj = movieData.data;
      let Output = '';

      let total = Math.round(movieObj.movie_count / movieObj.limit);
      totalPages.innerHTML = total;

      movieObj.movies.forEach(movieInfo => {
        Output += `
          <div class="movie">
            <h2 class="movie-title" title="${movieInfo.title}">${movieInfo.title_english}</h2>
            <img src="${movieInfo.medium_cover_image}" alt="${movieInfo.title}">
            <input type="hidden" value="${movieInfo.id}">
            <div>
            <button id="open" class="open">Download Movie </button>
            </div>
          </div>
         
        `;
      });

      resDiv.innerHTML = Output;


    })
    .catch(error => {
      console.log(`There is an Error: ${error}`);
    });


}




closeBtn.addEventListener('click', () => {
  overlay.style.display = 'none';
  document.body.setAttribute('style', 'overflow:auto');
});



resDiv.addEventListener('click', (e) => {

  if (e.target.className == "open") {
    const movieID = e.target.parentElement.parentElement.children[2].value;
    document.body.setAttribute('style', 'overflow:hidden');
    overlay.style.display = 'block';

    getMovieById(movieID);
  }

});

const getMovieById = (id) => {

  fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
    .then(response => {
      return response.json();
    })
    .then(movieData => {
      const movieObj = movieData.data.movie;
      let Output = '';


      Output += `

          <div class="movie-thumbnail">
            <img src="${movieObj.medium_cover_image}" alt="${movieObj.title}">
          </div>

          <div class="movie-details">
            <h1 title="${movieObj.title}">${movieObj.title_english}</h1> 
            <p>${movieObj.description_full}</p>

            <ul>
            ${movieObj.torrents.map(torrent => `
            <li>Download: <a href="${torrent.url}">${torrent.url}</a></li>
            <li>Quality: ${torrent.quality} | Type: ${torrent.type} | Size: ${torrent.size} | Seeds: ${torrent.seeds} | Peers: ${torrent.peers}</li>
            <hr>

            `).join('')}
            </ul>

            <h2>Movie Trailer</h2>
            <div class="trailer">
            
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${movieObj.yt_trailer_code}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          </div>
        
        `;


      infoDiv.innerHTML = Output;


    })
    .catch(error => {
      console.log(`There is an Error: ${error}`);
    });


}











