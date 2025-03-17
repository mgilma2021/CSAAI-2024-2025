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