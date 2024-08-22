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

//Listar Planetas
async function listaPlanetas() {
  const datos_planetas = await uploadData(3);
  const planetas = datos_planetas.results;
  const tablePlanets = document.getElementById("planetas");
  let elementTable = ``;

  if (!planetas || planetas.length === 0) {
    console.log("No se encontraron planetas.\n");
    return;
  }

  // Realiza todas las solicitudes en paralelo
  const planetasInfo = await Promise.all(
    planetas.map(planeta => buscarElementoApi(planeta.url))
  );

  // Construye el contenido HTML
  planetasInfo.forEach(planeta_especifico => {
    const descripcion = `El planeta ${planeta_especifico.result.properties.name} tiene un diámetro de ${planeta_especifico.result.properties.diameter} unidades, con un clima ${planeta_especifico.result.properties.climate} y un terreno compuesto por ${planeta_especifico.result.properties.terrain}.`;

    elementTable += `
      <tr>
        <td>${planeta_especifico.result.properties.name}</td>
        <td>${descripcion}</td>
      </tr>
    `;
  });

  tablePlanets.innerHTML = elementTable;
}

//Muestra la comparación de las características de los planetas
async function comparacionPlanetas(planetas) {
  const tablePlanets = document.getElementById("comparaPlanetas");
  let element = "";

  // Realiza todas las solicitudes en paralelo
  const planetasInfo = await Promise.all(
    planetas.map(planeta => buscarElementoApi(planeta.url))
  );

  planetasInfo.forEach(infoPlanet => {
    const caracteristicaEspecifica = infoPlanet.result.properties;
    const poblacion =
      caracteristicaEspecifica.population === "unknown"
        ? "Desconocida"
        : caracteristicaEspecifica.population;

    element += `
      <tr>
        <td>${caracteristicaEspecifica.name}</td>
        <td>Diámetro: ${caracteristicaEspecifica.diameter} unidades</td>
        <td>Población: ${poblacion}</td>
        <td>Clima: ${caracteristicaEspecifica.climate}</td>
        <td>Gravedad: ${caracteristicaEspecifica.gravity}</td>
      </tr>
    `;
  });

  tablePlanets.innerHTML = element;
}

//Eventos
planetas.addEventListener("click", async () => {
  await listaPlanetas();
});

comparacion.addEventListener("click", async () => {
  const datos_planetas = await uploadData(3);
  const planetas = datos_planetas.results;

  await comparacionPlanetas(planetas);
});
