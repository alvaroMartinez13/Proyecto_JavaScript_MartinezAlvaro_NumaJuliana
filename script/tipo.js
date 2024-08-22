//Menú hamburguesa
const menuToggle = document.getElementById("menu-toggle");
const fullscreenMenu = document.getElementById("fullscreen-menu");
const closeBtn = document.getElementById("close-btn");

menuToggle.addEventListener("click", () => {
  fullscreenMenu.classList.toggle("active");
});

closeBtn.addEventListener("click", () => {
  fullscreenMenu.classList.remove("active");
});

// Muestra la sección
function showSection(id, otro = null) {
  const busqueda = document.getElementById("search");
  
  // Oculta todas las secciones
  document.querySelectorAll(".content").forEach((el) => el.classList.add("hidden"));

  if (busqueda) {
    busqueda.classList.remove("hidden");
  }

  if (otro) {
    showInput(otro);
  } else {
    if (busqueda) {
      busqueda.classList.add("hidden");
    }
    document.getElementById(id).classList.remove("hidden");
  }
}


//Muestra el Input
function showInput(id) {
  document.getElementById(id).classList.remove("hidden");
}
