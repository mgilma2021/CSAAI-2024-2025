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

    const cancion_inicio = new Audio("intro_saw.mp3")
    const cancion_final = new Audio("FNAF_6AM.pm3")

    let juegoIniciado = false; // Controla si el juego ha comenzado

    cancion_inicio.play()
    
    // Función para reproducir un sonido cada vez que se pulsa un botón
    function reproducirSonido() {
        let sonido = new Audio("boton.mp3"); // Ruta del archivo de sonido
        sonido.play();
    }

    // Función para generar la clave y asignarla a las secciones
    function iniciar_clave() {
        let secciones = document.querySelectorAll(".seccion");
        let botones = document.querySelectorAll(".numero");
        let aciertos = 0;

        // Generar clave aleatoria para cada sección
        let clave = Array.from({ length: secciones.length }, () => Math.floor(Math.random() * 10));

        // Asignar la clave a cada sección como atributo oculto y resetear su estado
        secciones.forEach((seccion, index) => {
            seccion.setAttribute("data-clave", clave[index]);
            seccion.textContent = "*"; // Restaurar asteriscos
            seccion.style.color = ""; // Restaurar color de fondo
        });

        console.log("Claves generadas:", clave); // Para depuración

        // Eliminar eventos anteriores para evitar duplicaciones
        botones.forEach(boton => {
            boton.replaceWith(boton.cloneNode(true)); // Clona el botón y reemplaza el original
        });

        // Seleccionar nuevamente los botones clonados
        botones = document.querySelectorAll(".numero");

        // Evento para los botones numéricos
        botones.forEach(boton => {
            boton.addEventListener("click", function() {
                reproducirSonido()

                let numeroPresionado = this.getAttribute("data-numero");

                if (!juegoIniciado) {
                    juegoIniciado = true
                    cronometro.start()
                }

                // Recorrer secciones en orden y revelar solo la primera coincidencia
                for (let seccion of secciones) {
                    if (seccion.textContent === "*" && seccion.getAttribute("data-clave") === numeroPresionado) {
                        seccion.textContent = numeroPresionado; // Revela el número
                        seccion.style.color = "green"; // Cambia el color al acertar
                        aciertos += 1;
                        break; // Detiene el bucle para que solo cambie la primera coincidencia
                    }
                }

                if (aciertos === 4) {
                    cronometro.stop()
                    cancion_inicio.stop()
                    cancion_final.play()
                }
            });
        });
    }

    iniciar_clave(); // Genera la clave al cargar la página

    let reset = document.getElementById("reset");
    let start = document.getElementById('inicio')
    
    if (start) {
        start.addEventListener("click", function() {
            juegoIniciado = true; // Ahora el usuario puede adivinar la clave
            console.log("¡Juego iniciado! Ahora puedes revelar números.");
        });
    
    } else {
        console.error("El botón Start no existe en el DOM.");
    }

    if (reset) {
        reset.addEventListener("click", function() {
            juegoIniciado = false; // Se bloquea otra vez el pad numérico
            iniciar_clave(); // Reinicia la clave y los asteriscos
        });
    } else {
        console.error("El botón reset no existe en el DOM.");
    }
});