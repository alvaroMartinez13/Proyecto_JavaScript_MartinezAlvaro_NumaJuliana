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

const info = document.getElementById("infoFilms");
const character = document.getElementById("filmCharacters");
const planets = document.getElementById("filmPlanets");
const starships = document.getElementById("filmStarShips");
const vehicles = document.getElementById("filmVehicles");

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

//Mostrar información del episodio
function informacionEpisodio(info) {
  try {
    let elemento = ``;
    elemento += `
    <tr>
        <td>${peliculas[info.episode_id - 1]}</td>
        <td>${info.release_date}</td>
        <td>${info.director}
    </tr>
    `;

    return elemento;
  } catch (error) {
    console.error(error);
  }
}

// Mostrar personajes de las película
async function cacteristicaEpisodio(info, opcion) {
  const caracteristicas = [
    "Personajes",
    "Planetas",
    "Naves espaciales",
    "Vehículos",
  ];

  let i = 0;
  let listaCaracteristicas = [];

  switch (opcion) {
    case 0:
      listaCaracteristicas = info.characters;
      break;
    case 1:
      listaCaracteristicas = info.planets;
      break;
    case 2:
      listaCaracteristicas = info.starships;
      break;
    case 3:
      listaCaracteristicas = info.vehicles;
      break;
    default:
      console.error("Opción no válida");
      return;
  }

  while (i < listaCaracteristicas.length) {
    const urlCaracteristica = listaCaracteristicas[i];

    try {
      const caracteristicaEspecifica = await buscarElementoApi(
        urlCaracteristica
      );

      return `
        <tr>
            <td>${caracteristicaEspecifica.result.properties.name}</td>
            <td> ${info.episode_id}</td>
        </tr>
        `;
    } catch (error) {
      console.error("Error al cargar:", error);
    }

    i++;
  }
}

//Eventos

info.addEventListener("click", async () => {
  const peliculas = await uploadData(2);
  const peliculas_propiedades = peliculas.result;
  console.log(peliculas_propiedades);
  const tablaInfo = document.getElementById("info-films");
  let elementTable = ``;

  for (let i = 0; i < peliculas_propiedades.length; i++) {
    const infoPelicula = peliculas_propiedades[i].properties;
    elementTable += informacionEpisodio(infoPelicula);
  }
  tablaInfo.innerHTML = elementTable;
});

character.addEventListener("click", async () => {
  const peliculas = await uploadData(2);
  const peliculas_propiedades = peliculas.result;
  const tablaPersonaje = document.getElementById("info-characters");
  let elementTable = ``;

  for (let i = 0; i < peliculas_propiedades.length; i++) {
    const infoPelicula = peliculas_propiedades[i].properties;
    elementTable += await cacteristicaEpisodio(infoPelicula, 0);
  }

  tablaPersonaje.innerHTML = elementTable;
});

planets.addEventListener("click", async () => {
  const peliculas = await uploadData(2);
  const peliculas_propiedades = peliculas.result;
  const tablaPlanetas = document.getElementById("info-planets");
  let elementTable = ``;

  for (let i = 0; i < peliculas_propiedades.length; i++) {
    const infoPlanetas = peliculas_propiedades[i].properties;
    elementTable += await cacteristicaEpisodio(infoPlanetas, 1);
  }

  tablaPlanetas.innerHTML = elementTable;
});

starships.addEventListener("click", async () => {
  const peliculas = await uploadData(2);
  const peliculas_propiedades = peliculas.result;
  const tablaNaves = document.getElementById("info-starship");
  let elementTable = ``;

  for (let i = 0; i < peliculas_propiedades.length; i++) {
    const infoNaves = peliculas_propiedades[i].properties;
    elementTable += await cacteristicaEpisodio(infoNaves, 2);
  }

  tablaNaves.innerHTML = elementTable;
});

vehicles.addEventListener('click', async () => {
    const peliculas = await uploadData(2);
    const peliculas_propiedades = peliculas.result;
    const tablaVehiculo = document.getElementById("info-vehicles");
    let elementTable = ``;
  
    for (let i = 0; i < peliculas_propiedades.length; i++) {
      const infoNaves = peliculas_propiedades[i].properties;
      elementTable += await cacteristicaEpisodio(infoNaves, 3);
    }
  
    tablaVehiculo.innerHTML = elementTable;
});