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

// Mostrar naves espaciales en cartas
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

// Mostrar las cartas de naves
async function mostrarNaves() {
  const navesDetalles = await listaNaves();
  const container = document.getElementById("navesContainer");
  let elemento = ``;

  for (let nave of navesDetalles) {
    elemento += `
      <div class="card">
        <h4>${nave.name}</h4>
        <p><strong>Costo:</strong> ${nave.cost_in_credits}</p>
        <p><strong>Consumible:</strong> ${nave.consumables}</p>
        <p><strong>MGLT:</strong> ${nave.MGLT}</p>
      </div>
    `;
  }

  container.innerHTML = elemento;
}

// Mostrar los modelos de las naves en cartas
async function mostrarModelos() {
  const navesDetalles = await listaNaves();
  const container = document.getElementById("modelsContainer");
  let elemento = ``;

  for (let nave of navesDetalles) {
    elemento += `
      <div class="card">
        <h4>${nave.name}</h4>
        <p><strong>Modelo:</strong> ${nave.model}</p>
      </div>
    `;
  }

  container.innerHTML = elemento;
}

// Mostrar los pilotos en cartas
async function mostrarPilotos() {
  const navesDetalles = await listaNaves();
  const container = document.getElementById("pilotsContainer");
  let elemento = ``;

  for (let nave of navesDetalles) {
    const pilotosPromises = nave.pilots.map((pilotUrl) =>
      buscarElementoApi(pilotUrl)
    );
    const pilotos = await Promise.all(pilotosPromises);

    pilotos.forEach((piloto) => {
      elemento += `
        <div class="card">
          <h4>${nave.name}</h4>
          <p><strong>Piloto:</strong> ${piloto.properties.name}</p>
        </div>
      `;
    });
  }

  container.innerHTML = elemento;
}

// Mostrar la velocidad en cartas
async function mostrarVelocidades() {
  const navesDetalles = await listaNaves();
  const container = document.getElementById("speedContainer");
  let elemento = ``;

  for (let nave of navesDetalles) {
    elemento += `
      <div class="card">
        <h4>${nave.name}</h4>
        <p><strong>Velocidad Atmosférica:</strong> ${nave.max_atmosphering_speed}</p>
      </div>
    `;
  }

  container.innerHTML = elemento;
}

// Función principal para mostrar datos según la sección activa
function showSection(sectionId) {
  const sections = document.querySelectorAll('.content');
  sections.forEach((section) => {
    if (section.id === sectionId) {
      section.classList.remove('hidden');
    } else {
      section.classList.add('hidden');
    }
  });

  switch (sectionId) {
    case 'starship-list':
      mostrarNaves();
      break;
    case 'starship-models':
      mostrarModelos();
      break;
    case 'starship-pilot':
      mostrarPilotos();
      break;
    case 'starship-speed':
      mostrarVelocidades();
      break;
  }
}
