const main = document.querySelector(".movie-container");
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const API_URL =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=32cbe30c98a65556dd3287854d57b28a";
const SEARCH_API =
  'https://api.themoviedb.org/3/search/movie?api_key=32cbe30c98a65556dd3287854d57b28a&query="';
const tags = document.querySelector("#tags");

const prev = document.querySelector("#prev");
const next = document.querySelector("#next");
const current = document.querySelector("#current");

let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = "";
let totalPages = 100;

const GENRES = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

class UI {
  static async getMovie(url) {
    lastUrl = url;
    const res = await fetch(url);
    const data = await res.json();

    if (data.results.length !== 0) {
      this.showMovies(data.results);
      currentPage = data.page;
      nextPage = currentPage + 1;
      prevPage = currentPage - 1;
      totalPages = data.total_pages;

      current.innerText = currentPage;

      if (currentPage <= 1) {
        prev.classList.add("disabled");
        next.classList.remove("disabled");
      } else if (currentPage >= totalPages) {
        prev.classList.remove("disabled");
        next.classList.add("disabled");
      } else {
        prev.classList.remove("disabled");
        next.classList.remove("disabled");
      }

      tags.scrollIntoView({ behavior: "smooth" });
    } else main.innerHTML = `<h1>No Results</h1>`;
  }

  static showMovies(movies) {
    main.innerHTML = "";
    movies.forEach((movie) => {
      const { title, poster_path, vote_average, overview } = movie;
      const movieEl = document.createElement("div");
      movieEl.classList.add("movie");
      movieEl.innerHTML = `
          <img src="${
            poster_path
              ? IMG_PATH + poster_path
              : "http://via.placeholder.com/1080x1580"
          }" />
            <div class="movie-info">
              <h4>${title}</h4>
              <span class="rate ${this.getColor(
                vote_average
              )}">${vote_average}</span>
            </div>
            <div class="overview">
              <h3>Overview</h3>
              ${overview}
            </div>
       `;
      main.append(movieEl);
    });
  }
  static getColor(average) {
    if (average >= 8) return "green";
    else if (average >= 5) return "orange";
    else return "red";
  }

  static setGenre() {
    tags.innerHTML = "";

    GENRES.forEach((genre) => {
      const div = document.createElement("div");
      div.classList.add("tag");
      div.id = genre.id;
      div.innerText = genre.name;

      tags.append(div);
    });
  }

  static highlightSelection() {
    const tags = document.querySelectorAll(".tag");
    tags.forEach((tag) => {
      tag.classList.remove("highlight");
    });
    this.clearGenre();
    if (selectedGenre.length != 0) {
      selectedGenre.forEach((id) => {
        const highlighted = document.getElementById(id);
        highlighted.classList.add("highlight");
      });
    }
  }

  static clearGenre() {
    let clearBtn = document.getElementById("clear");

    if (clearBtn) {
      clearBtn.classList.add("highlight");
    } else {
      const clear = document.createElement("div");
      clear.classList.add("highlight");
      clear.id = "clear";
      clear.innerText = "CLEAR";
      clear.addEventListener("click", () => {
        selectedGenre = [];
        this.setGenre();
        this.getMovie(API_URL);
      });
      tags.append(clear);
    }
  }
  static pageCall(page) {
    let urlSplit = lastUrl.split("?");
    let queryParams = urlSplit[1].split("&");
    let key = queryParams[queryParams.length - 1].split("=");

    if (key[0] != "page") {
      let url = lastUrl + "&page=" + page;

      this.getMovie(url);
    } else {
      key[1] = page.toString();
      let a = key.join("=");
      queryParams[queryParams.length - 1] = a;
      let b = queryParams.join("&");
      let url = urlSplit[0] + "?" + b;
      this.getMovie(url);
    }
  }
}

const SEARCH = document.querySelector("#search");
const FORM = document.querySelector("#form");

let selectedGenre = [];
tags.addEventListener("click", (e) => {
  if (e.target.classList.contains("tag")) {
    if (selectedGenre.length === 0) selectedGenre.push(e.target.id);
    else {
      if (selectedGenre.includes(e.target.id)) {
        selectedGenre.forEach((id, index) => {
          if (id === e.target.id) selectedGenre.splice(index, 1);
        });
      } else selectedGenre.push(e.target.id);
    }
    UI.getMovie(API_URL + "&with_genres=" + encodeURI(selectedGenre.join(",")));
    UI.highlightSelection();
  }
});

FORM.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = SEARCH.value;
  selectedGenre = [];
  UI.setGenre();
  if (searchTerm && searchTerm !== "") {
    UI.getMovie(SEARCH_API + searchTerm);
    SEARCH.value = "";
  } else {
    UI.getMovie(API_URL);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  UI.setGenre();
  UI.getMovie(API_URL);
});

next.addEventListener("click", () => {
  if (nextPage <= totalPages) {
    UI.pageCall(nextPage);
  }
});

prev.addEventListener("click", () => {
  if (prevPage > 0) {
    UI.pageCall(prevPage);
  }
});

const toTop = document.querySelector(".to-top");
const header = document.querySelector("header");
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 100) toTop.classList.add("active");
  else toTop.classList.remove("active");
});

toTop.addEventListener("click", () => {
  header.scrollIntoView({ behavior: "smooth" });
});
