class EasyHTTP {
  async get(url) {
    const response = await fetch(url);
    const resData = await response.json();
    return resData;
  }
}

const main = document.querySelector(".movie-container");
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const http = new EasyHTTP();

http
  .get(
    "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=32cbe30c98a65556dd3287854d57b28a"
  )
  .then((movie) => {
    movie.results.forEach((movie) => {
      const { title, poster_path, vote_average, overview } = movie;
      const movieEl = document.createElement("div");
      movieEl.classList.add("movie");

      movieEl.innerHTML = `
         <img src="${IMG_PATH + poster_path}" />
          <div class="movie-info">
            <h4>${title}</h4>
            <span class="rate green">${vote_average}</span>
          </div>
          <div class="overview">
            <h3>Overview</h3>
            ${overview}
          </div>
    `;
      main.append(movieEl);
    });
  })
  .catch((err) => console.log(err));

// const API_URL =
//   "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=32cbe30c98a65556dd3287854d57b28a";

// const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
// // const SEARCH_API =
// //   'https://api.themoviedb.org/3/search/movie?api_key=32cbe30c98a65556dd3287854d57b28a&query="';

// // const form = document.querySelector("#form");
// // const search = document.querySelector("#search");
// const main = document.querySelector(".movie-container");

// getMovies(API_URL);
// async function getMovies(url) {
//   const res = await fetch(url);
//   const data = await res.json();

//   showMovies(data.results);
// }
// function showMovies(movies) {
//   movies.forEach((movie) => {
//     const { title, poster_path, vote_average, overview } = movie;

//     const movieEl = document.createElement("div");
//     movieEl.classList.add("movie");

//     movieEl.innerHTML = `
//     <img src="${IMG_PATH + poster_path}" />
//             <div class="movie-info">
//               <h4>${title}</h4>
//               <span class="rate green">${vote_average}</span>
//             </div>
//             <div class="overview">
//               <h3>Overview</h3>
//               ${overview}
//             </div>
//     `;

//     main.append(movieEl);
//   });
// }

// function getClassByRate(vote) {
//   if (vote >= 8) {
//     return "green";
//   } else if (vote >= 5) {
//     return "orange";
//   } else {
//     return "red";
//   }
// }

// form.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const searchTerm = search.value;

//   if (searchTerm && searchTerm !== "") {
//     getMovies(SEARCH_API + searchTerm);
//     search.value = "";
//   } else {
//     console.log("hello");
//   }
// });
