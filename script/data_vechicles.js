const url = "https://www.swapi.tech/api/";
const type_endpoint = [
  "people/",
  "species/",
  "films/",
  "planets/",
  "starships/",
  "vehicles/",
];

const listVehicle = document.getElementById("listVehicle");
const listModels = document.getElementById("listModels");

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

// Mostrar vehículos en cartas
async function listaVehiculos() {
  const vehiculo = await uploadData(5);
  const vehiculos_lista = vehiculo.results;
  const container = document.getElementById("vehicle-cards");
  let elemento = ``;

  if (!vehiculos_lista || vehiculos_lista.length === 0) {
    console.log("No se encontraron vehículos.\n");
    return;
  }

  for (let vehiculo of vehiculos_lista) {
    const vehiculo_url = vehiculo.url;
    const caracteristicaEspecifica = await buscarElementoApi(vehiculo_url);
    elemento += `
      <div class="card">
        <h4>${caracteristicaEspecifica.result.properties.name}</h4>
        <p><strong>Costo en Créditos:</strong> ${caracteristicaEspecifica.result.properties.cost_in_credits}</p>
        <p><strong>Consumible:</strong> ${caracteristicaEspecifica.result.properties.consumables}</p>
        <p><strong>Clase:</strong> ${caracteristicaEspecifica.result.properties.vehicle_class}</p>
        <p><strong>Pasajeros:</strong> ${caracteristicaEspecifica.result.properties.passengers}</p>
      </div>
    `;
  }

  container.innerHTML = elemento;
}

// Mostrar modelos en cartas
async function mostrarModelosVehiculos() {
  try {
    const vehiculos = await uploadData(5);
    const vehiculos_modelos = vehiculos.results;
    const container = document.getElementById("model-cards");
    let elemento = ``;

    for (let vehiculo of vehiculos_modelos) {
      const vehiculo_url = vehiculo.url;
      const caracteristicaEspecifica = await buscarElementoApi(vehiculo_url);
      elemento += `
        <div class="card">
          <h4>${caracteristicaEspecifica.result.properties.name}</h4>
          <p><strong>Modelo:</strong> ${caracteristicaEspecifica.result.properties.model}</p>
        </div>
      `;
    }

    container.innerHTML = elemento;
  } catch (error) {
    console.error("Error al cargar:", error);
  }
}

// Eventos
listVehicle.addEventListener("click", listaVehiculos);
listModels.addEventListener("click", mostrarModelosVehiculos);

