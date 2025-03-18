document.addEventListener("DOMContentLoaded", function() {
    // Obtener elementos del DOM
    let display = document.getElementById("display");
    let startBtn = document.getElementById("inicio");
    let stopBtn = document.getElementById("stop");
    let resetBtn = document.getElementById("reset");

    // Crear una instancia de Crono
    let cronometro = new Crono(display);

    // Asignar eventos a los botones
    startBtn.addEventListener("click", () => cronometro.start());
    stopBtn.addEventListener("click", () => cronometro.stop());
    resetBtn.addEventListener("click", () => cronometro.reset());
});

// Función para generar la clave y asignarla a las secciones
function iniciar_clave() {
    let secciones = document.querySelectorAll(".seccion");
    let botones = document.querySelectorAll(".numero");

    // Generar clave aleatoria para cada sección
    let clave = Array.from({ length: secciones.length }, () => Math.floor(Math.random() * 10));

    // Asignar la clave a cada sección como atributo oculto y resetear su estado
    secciones.forEach((seccion, index) => {
        seccion.setAttribute("data-clave", clave[index]);
        seccion.textContent = "*"; // Restaurar asteriscos
        seccion.style.backgroundColor = ""; // Restaurar color de fondo
    });

    console.log("Claves generadas:", clave); // Para depuración

    // Evento para los botones numéricos
    botones.forEach(boton => {
        boton.addEventListener("click", function() {
            let numeroPresionado = this.getAttribute("data-numero");

            // Recorrer secciones en orden y revelar solo la primera coincidencia
            for (let seccion of secciones) {
                if (seccion.textContent === "*" && seccion.getAttribute("data-clave") === numeroPresionado) {
                    seccion.textContent = numeroPresionado; // Revela el número
                    break; // Detiene el bucle para que solo cambie la primera coincidencia
                }
            }
        });
    });
}

// Cuando la página cargue, se ejecuta iniciar_clave y se configura el botón reset
document.addEventListener("DOMContentLoaded", function() {
    iniciar_clave(); // Genera la clave al cargar la página

    let reset = document.getElementById("reset");
    
    if (reset) {
        reset.addEventListener("click", function() {
            iniciar_clave(); // Reinicia la clave y los asteriscos
        });
    }
});
