const url = "https://www.swapi.tech/api/";
const type_endpoint = [
  "people/",
  "species/",
  "films/",
  "planets/",
  "starships/",
  "vehicles/",
];

const peliculas = [
  "Episode 1: The Phantom Menace",
  "Episode 2: Attack of the Clones",
  "Episode 3: Revenge of the Sith",
  "Episode 4: A New Hope",
  "Episode 5: The Empire Strikes Back",
  "Episode 6: Return of the Jedi",
];

const planetas = document.getElementById("listPlanets");
const comparacion = document.getElementById("compararPlanetas");

//Cargar datos desde la API
async function uploadData(endpoint = 0, value = "") {
  try {
    const response = await fetch(url + type_endpoint[endpoint] + value);
    const data = await response.json();
    return value === "" ? data : data.result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

//Buscar información de API en específico
async function buscarElementoApi(api) {
  try {
    const response = await fetch(api);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Función para crear una carta con la información del planeta
function createPlanetCard(planet) {
  return `
    <div class="card">
      <div class="card-content">
        <h3 class="card-title">${planet.name}</h3>
        <p class="card-description">El planeta ${planet.name} tiene un diámetro de ${planet.diameter} unidades, con un clima ${planet.climate} y un terreno compuesto por ${planet.terrain}.</p>
      </div>
    </div>
  `;
}

// Función para listar planetas en formato de cartas
async function listaPlanetas() {
  const datos_planetas = await uploadData(3);
  const planetas = datos_planetas.results;
  const cardsContainer = document.getElementById("planets-cards");
  let cardsHTML = '';

  if (!planetas || planetas.length === 0) {
    console.log("No se encontraron planetas.\n");
    return;
  }

  // Realiza todas las solicitudes en paralelo
  const planetasInfo = await Promise.all(
    planetas.map(planeta => buscarElementoApi(planeta.url))
  );

  // Construye el contenido de las cartas
  planetasInfo.forEach(planeta_especifico => {
    const planet = planeta_especifico.result.properties;
    cardsHTML += createPlanetCard({
      name: planet.name,
      diameter: planet.diameter,
      climate: planet.climate,
      terrain: planet.terrain
    });
  });

  cardsContainer.innerHTML = cardsHTML;
}

// Función para mostrar la comparación de planetas en formato de cartas
async function comparacionPlanetas(planetas) {
  const cardsContainer = document.getElementById("planets-compare-cards");
  let cardsHTML = '';

  // Realiza todas las solicitudes en paralelo
  const planetasInfo = await Promise.all(
    planetas.map(planeta => buscarElementoApi(planeta.url))
  );

  // Construye el contenido de las cartas
  planetasInfo.forEach(infoPlanet => {
    const caracteristicaEspecifica = infoPlanet.result.properties;
    const poblacion =
      caracteristicaEspecifica.population === "unknown"
        ? "Desconocida"
        : caracteristicaEspecifica.population;

    cardsHTML += `
      <div class="card">
        <div class="card-content">
          <h3 class="card-title">${caracteristicaEspecifica.name}</h3>
          <p class="card-description">Diámetro: ${caracteristicaEspecifica.diameter} unidades</p>
          <p class="card-description">Población: ${poblacion}</p>
          <p class="card-description">Clima: ${caracteristicaEspecifica.climate}</p>
          <p class="card-description">Gravedad: ${caracteristicaEspecifica.gravity}</p>
        </div>
      </div>
    `;
  });

  cardsContainer.innerHTML = cardsHTML;
}

// Eventos
planetas.addEventListener("click", async () => {
  await listaPlanetas();
});

comparacion.addEventListener("click", async () => {
  const datos_planetas = await uploadData(3);
  const planetas = datos_planetas.results;

  await comparacionPlanetas(planetas);
});
