// ============================================================
//  Práctica 2 - Parte 1: Javascript y APIs
//  Servicios Telemáticos Avanzados - Grupo 1
// ============================================================

// --- Punto 1 de la práctica: comprobar que el JS se carga ---
console.log("🎬 script.js cargado correctamente. ¡Que empiece la película!");

// --- Punto 2: clave de la API de OMDb ---
// Consíguela gratis en https://www.omdbapi.com/apikey.aspx (plan FREE)
// y pega aquí el valor que te llegue por correo.
const API_KEY = "8adf8e63";
const API_URL = "https://www.omdbapi.com/";

// --- Referencias a los elementos del DOM ---
const form = document.querySelector("#search-form");
const input = document.querySelector("#movie-input");
const result = document.querySelector("#result");

/**
 * Pide a OMDb la información de una película por su título.
 * @param {string} title - Título que ha escrito el usuario.
 * @returns {Promise<Object>} Respuesta JSON de la API.
 */
async function fetchMovie(title) {
  // encodeURIComponent evita que los espacios y acentos rompan la URL
  const url = `${API_URL}?apikey=${API_KEY}&t=${encodeURIComponent(title)}&plot=short`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`La API respondió con un error HTTP ${response.status}`);
  }

  return response.json();
}

/** Muestra un mensaje simple dentro de la tarjeta de resultados. */
function showMessage(text, isError = false) {
  result.className = isError ? "result error" : "result";
  result.innerHTML = `<p class="msg">${text}</p>`;
}

/** Pinta en pantalla los datos de la película. */
function showMovie(movie) {
  const hasPoster = movie.Poster && movie.Poster !== "N/A";

  result.className = "result";
  result.innerHTML = `
    <h2>${movie.Title}</h2>
    ${hasPoster ? `<img class="poster" src="${movie.Poster}" alt="Cartel de ${movie.Title}">` : ""}
    <ul class="datos">
      <li><strong>🎬 Director:</strong> ${movie.Director}</li>
      <li><strong>📅 Año:</strong> ${movie.Year}</li>
      <li><strong>🎭 Reparto:</strong> ${movie.Actors}</li>
      <li><strong>⭐ Nota IMDb:</strong> ${movie.imdbRating}</li>
    </ul>
    <p class="sinopsis">${movie.Plot}</p>
  `;
}

// --- Punto 3: integración con la web ---
form.addEventListener("submit", async (event) => {
  // Evitamos que el formulario recargue la página
  event.preventDefault();

  const title = input.value.trim();

  if (title === "") {
    showMessage("Escribe el título de una película 😉", true);
    return;
  }

  showMessage("Buscando en el archivo... 🍿");

  try {
    const movie = await fetchMovie(title);

    // OMDb no devuelve error HTTP si no encuentra la peli:
    // manda un 200 con { "Response": "False", "Error": "Movie not found!" }
    if (movie.Response === "False") {
      showMessage(`No hemos encontrado nada: ${movie.Error}`, true);
      return;
    }

    console.log("Respuesta de OMDb:", movie);
    showMovie(movie);
  } catch (error) {
    console.error(error);
    showMessage("No se ha podido contactar con la API. Revisa tu conexión o la API key.", true);
  }
});
