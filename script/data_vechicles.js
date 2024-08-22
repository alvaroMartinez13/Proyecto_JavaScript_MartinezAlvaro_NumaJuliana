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

// Listar vehículos
async function listaVehiculos() {
  const vehiculo = await uploadData(5);
  const vehiculos_lista = vehiculo.results;
  const tableVehicle = document.getElementById("vehiculos");

  if (!vehiculos_lista || vehiculos_lista.length === 0) {
    console.log("No se encontraron vehículos.\n");
    return;
  }

  const promesas = vehiculos_lista.map(async (vehiculo) => {
    const vehiculo_url = vehiculo.url;
    const caracteristicaEspecifica = await buscarElementoApi(vehiculo_url);
    return `
      <tr>
        <td>${caracteristicaEspecifica.result.properties.name}</td>
        <td>${caracteristicaEspecifica.result.properties.cost_in_credits}</td>
        <td>${caracteristicaEspecifica.result.properties.consumables}</td>
        <td>${caracteristicaEspecifica.result.properties.vehicle_class}</td>
        <td>${caracteristicaEspecifica.result.properties.passengers}</td>
      </tr>
    `;
  });

  const elementos = await Promise.all(promesas);
  tableVehicle.innerHTML = elementos.join("");
}

//Mostrar los modelos de los vehículos
async function mostrarModelosVehiculos() {
  try {
    const naves = await uploadData(5);
    const vehiculos_modelos = naves.results;
    const tableModels = document.getElementById("modelo");

    const promesas = vehiculos_modelos.map(async (vehiculo) => {
      const vehiculo_url = vehiculo.url;
      const caracteristicaEspecifica = await buscarElementoApi(vehiculo_url);
      return `
        <tr>
          <td>${caracteristicaEspecifica.result.properties.name}</td>
          <td>${caracteristicaEspecifica.result.properties.model}</td>
        </tr>
      `;
    });

    const elementos = await Promise.all(promesas);
    tableModels.innerHTML = elementos.join("");
  } catch (error) {
    console.error("Error al cargar:", error);
  }
}

//Eventos
listVehicle.addEventListener("click", listaVehiculos);
listModels.addEventListener("click", mostrarModelosVehiculos);
