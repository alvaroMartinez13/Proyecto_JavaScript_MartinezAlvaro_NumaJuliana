const url = "https://www.swapi.tech/api/";
const type_endpoint = [
  "people/",
  "species/",
  "films/",
  "planets/",
  "starships/",
  "vehicles/",
];

const listaNave = document.getElementById("listNaves");
const listaModelo = document.getElementById("listModelos");
const listPilotos = document.getElementById("listPilotos");
const listSpeeds = document.getElementById("listSpeeds");

// Cargar datos desde la API
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

// Buscar información de API en específico
async function buscarElementoApi(api) {
  try {
    const response = await fetch(api);
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Listar naves espaciales
async function listaNaves() {
  const naves = await uploadData(4);
  const naves_lista = naves.results;

  if (!naves_lista || naves_lista.length === 0) {
    console.log("No se encontraron naves espaciales.\n");
    return;
  }

  // Obtener todos los detalles en paralelo
  const navesDetalles = await Promise.all(
    naves_lista.map((nave) => buscarElementoApi(nave.url))
  );
  return navesDetalles.map((nave) => nave.properties);
}

// Mostrar los modelos de las naves
async function mostrarModelos() {
  const navesDetalles = await listaNaves();
  const tableModel = document.getElementById("Modelos");
  let elemento = ``;

  for (let nave of navesDetalles) {
    elemento += `
      <tr>
        <td>${nave.name}</td>
        <td>${nave.model}</td>
      </tr>
    `;
  }

  tableModel.innerHTML = elemento;
}

// Mostrar los pilotos de las naves
async function mostrarPilotos() {
  const navesDetalles = await listaNaves();
  const tablePilot = document.getElementById("pilotos");
  let elemento = ``;

  for (let nave of navesDetalles) {
    const pilotosPromises = nave.pilots.map((pilotUrl) =>
      buscarElementoApi(pilotUrl)
    );
    const pilotos = await Promise.all(pilotosPromises);

    pilotos.forEach((piloto) => {
      elemento += `
        <tr>
          <td>${nave.name}</td>
          <td>${piloto.properties.name}</td>
        </tr>
      `;
    });
  }

  tablePilot.innerHTML = elemento;
}

// Mostrar las velocidades atmosféricas de las naves
async function mostrarVelocidad() {
  const navesDetalles = await listaNaves();
  const tableSpeed = document.getElementById("velocidad");
  let elemento = ``;

  for (let nave of navesDetalles) {
    elemento += `
      <tr>
        <td>${nave.name}</td>
        <td>${nave.max_atmosphering_speed}</td>
      </tr>
    `;
  }

  tableSpeed.innerHTML = elemento;
}

// Eventos
listaNave.addEventListener("click", async () => {
  const naves = await listaNaves();
  const tableListaNave = document.getElementById("Nave");
  let elemento = ``;

  for (let nave of naves) {
    elemento += `
    <tr>
      <td>${nave.name}</td>
      <td>${nave.cost_in_credits}</td>
      <td>${nave.consumables}</td>
      <td>${nave.MGLT}</td>
    </tr>
    `;
  }

  tableListaNave.innerHTML = elemento;
});

listaModelo.addEventListener("click", mostrarModelos);
listPilotos.addEventListener("click", mostrarPilotos);
listSpeeds.addEventListener("click", mostrarVelocidad);
