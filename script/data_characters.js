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

const tabla = document.getElementById("info");
const busqueda = document.getElementById("busqueda");
const buttonListPeople = document.getElementById("listaPersonajes");
const buttonListSpecies = document.getElementById("listaEspecies");
const tablaPersonaje = document.getElementById("character-info");

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

//Introduce la información en la tabla
async function fillTable(data, number) {
  const tableBodyPersonajes = document.getElementById("personajes");
  const tableBodyEspecies = document.getElementById("especie");
  const tableBodyPersonaje = document.getElementById("persona");

  let allCharactersHtml = "";

  switch (number) {
    case "1":
      const characterPromises = data.map(personaje => characterSearch(personaje.uid));
      allCharactersHtml = (await Promise.all(characterPromises)).join("");
      tableBodyPersonajes.innerHTML = allCharactersHtml;
      break;

    case "2":
      allCharactersHtml = await characterSearch(data.uid);
      tableBodyPersonaje.innerHTML = allCharactersHtml;
      break;

    case "3":
      tableBodyEspecies.innerHTML = data;
      break;
  }
}

//Personajes

//Listar personajes
async function listCharacters() {
  try {
    const personajes = await uploadData(0);
    const personajes_propiedades = personajes.results;

    if (!personajes_propiedades || personajes_propiedades.length === 0) {
      console.log("No se encontraron personajes.\n");
      return [];
    }

    return personajes_propiedades;
  } catch (error) {
    console.error(error);
    return [];
  }
}

//Busca un personaje en específico
async function characterSearch(uid) {
  const personajes = await uploadData(0, uid);
  const personajes_propiedades = personajes.properties;
  const url = personajes_propiedades.homeworld;

  const parts = url.split("/");
  const number = parts[parts.length - 1];

  const planeta = await planetSearch(number);

  return `
    <div class="card">
      <div class="card-header">
        <h3>${personajes_propiedades.name}</h3>
      </div>
      <div class="card-body">
        <p><strong>Género:</strong> ${personajes_propiedades.gender}</p>
        <p><strong>Estatura:</strong> ${personajes_propiedades.height}</p>
        <p><strong>Año de nacimiento:</strong> ${personajes_propiedades.birth_year}</p>
        <p><strong>Planeta de origen:</strong> ${planeta}</p>
      </div>
    </div>
  `;
}

//Buscar personaje por nombre
async function characterNameSearch(name) {
  const personajes = await listCharacters();
  return personajes.find(personaje => personaje.name === name) || null;
}

//Listar Especies
async function listSpecies() {
  const especies = await uploadData(1);
  const especies_propiedades = especies.results;

  return especies_propiedades.map(especie => `
    <div class="card">
      <div class="card-header">
        <h3>${especie.name}</h3>
      </div>

    </div>
  `).join("");
}

//Planetas

//Listar planetas
async function listPlanets() {
  const planets = await uploadData(3);
  const planets_propiedades = planets.results;

  if (!planets_propiedades || planets_propiedades.length === 0) {
    console.log("No se encontraron planetas.\n");
    return;
  }

  const planetPromises = planets_propiedades.map(planet => planetSearch(planet.uid));
  const allPlanetsHtml = (await Promise.all(planetPromises)).join("");

  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = allPlanetsHtml;
}

//Busca un planeta en específico
async function planetSearch(uid) {
  const planeta = await uploadData(3, uid);
  return planeta.properties.name;
}

//Eventos

//Busqueda del personaje
busqueda.addEventListener("click", async () => {
  const buscador = document.getElementById("search-character").value;

  if (buscador === "") {
    return alert("Campo obligatorio");
  }

  const muestra = await characterNameSearch(buscador);

  if (tablaPersonaje.classList.contains("hidden")) {
    tablaPersonaje.classList.remove("hidden");
  }

  if (muestra) {
    await fillTable(muestra, "2");
  }
});

//Lista los personajes
buttonListPeople.addEventListener("click", async () => {
  const lista = await listCharacters();
  await fillTable(lista, "1");
});

//Listar especies
buttonListSpecies.addEventListener("click", async () => {
  const especies = await listSpecies();
  await fillTable(especies, "3");
});
