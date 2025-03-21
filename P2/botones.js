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
    const cancion_final = new Audio("FNAF_6AM.mp3")

    let juegoIniciado = false; // Controla si el juego ha comenzado
    let intentos = 10; // Número de intentos que tenemos para adivinar la clave
    let inicio_cancion = true
    let victoria = false
    
    cancion_inicio.play()

    setTimeout(() => alert('¿Quieres jugar a un juego?'), 1000);
    setTimeout(() => alert('Tienes que desactivar la bomba adivinando su código, si no morirás'), 3000);
    setTimeout(() => alert('JAJAJAJAJAJAJA!!!!!'), 5000);
    
    // Función para reproducir un sonido cada vez que se pulsa un botón
    function reproducirSonido() {
        let sonido = new Audio("boton.mp3"); // Ruta del archivo de sonido
        sonido.play();
    }

    // Función para ir actualizando el número de intentos
    function actualizar_intentos() {
        intentos -= 1
        document.getElementById("contador_intentos").innerHTML = intentos
    }

    function resetear_intentos() {
        intentos = 10
        document.getElementById("contador_intentos").innerHTML = intentos
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

        console.log("Claves generadas:", clave);

        // Eliminar eventos anteriores para evitar duplicaciones
        botones.forEach(boton => {
            boton.replaceWith(boton.cloneNode(true)); // Clona el botón y reemplaza el original
        });

        // Seleccionar nuevamente los botones clonados
        botones = document.querySelectorAll(".numero");

        // Evento para los botones numéricos
        botones.forEach(boton => {
            boton.addEventListener("click", function() {

                if (intentos === 0 ) return;

                reproducirSonido()
                actualizar_intentos()

                let numeroPresionado = this.getAttribute("data-numero");

                if (!juegoIniciado && intentos !== 0) {
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
                    vicotria = true
                    cronometro.stop()
                    cancion_inicio.pause()
                    inicio_cancion = false
                    cancion_final.play()
                    alert('Vaya, parece que has desactivado la bomba, bien jugado...')
                }

                if (intentos === 0 && victoria === false) {
                    cronometro.stop()
                    juegoIniciado = false
                    if (perdido = false) {
                        alert('HAS MUERTO, JAJAJAJAJAJAJA!!!!')
                    }
                    
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
            intentos = 10; // Reiniciamos los intentos
            resetear_intentos()
            vicotria = false
            if (inicio_cancion === false) {
                cancion_inicio.play()
            }
        });
    } else {
        console.error("El botón reset no existe en el DOM.");
    }
});
