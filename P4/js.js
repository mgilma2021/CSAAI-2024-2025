console.log('Ejecutando JS...');

document.addEventListener("DOMContentLoaded", () => {
    board = document.getElementById("board");
    sizeSelector = document.getElementById("board-size");
    startBtn = document.getElementById("start-btn");
    resetBtn = document.getElementById("reset-btn");
    movesDisplay = document.getElementById("moves");
    timerDisplay = document.getElementById("timer");

    crono = new Crono(timerDisplay);

    startBtn.addEventListener("click", iniciarJuego);
    resetBtn.addEventListener("click", reiniciarJuego);
});

let crono;
let board;
let sizeSelector;
let startBtn;
let resetBtn;
let movesDisplay;
let timerDisplay;

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let totalPairs = 0;
let moves = 0;

// Musica de fondo
const musica_fondo = new Audio('Dark_souls_III_theme.mp3');
musica_fondo.loop = true;
musica_fondo.volume = 0.2;

function iniciarJuego() {
    musica_fondo.play();
    crono.reset();
    crono.start();
    resetEstadoJuego();

    let size = parseInt(sizeSelector.value);
    generarTablero(size);
}

function reiniciarJuego() {
    crono.stop();
    crono.reset();
    resetEstadoJuego();

    board.innerHTML = "";
}

function resetEstadoJuego() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matchedPairs = 0;
    moves = 0;
    movesDisplay.textContent = "0";
}

function generarTablero(size) {
    let totalCards = size * size;
    totalPairs = totalCards / 2;

    // Crear un pool de valores de imagen del 0 al 17 (o la cantidad que tengas)
    let pool = Array.from({ length: 18 }, (_, i) => i);

    // Mezclar y tomar solo los que necesitemos
    shuffle(pool);
    let selected = pool.slice(0, totalPairs);

    // Duplicar para hacer parejas
    let cardValues = [...selected, ...selected];

    // Barajar de nuevo para mezclarlas
    shuffle(cardValues);

    board.classList.remove("size-2x2", "size-4x4", "size-6x6");
    board.classList.add(`size-${size}x${size}`);

    board.innerHTML = "";
    board.style.gridTemplateColumns = `repeat(${size}, auto)`;

    cardValues.forEach((val) => {
        board.appendChild(crearCarta(val));
    });
}


function crearCarta(valor) {
    const carta = document.createElement("div");
    carta.classList.add("card");
    carta.dataset.value = valor;

    const inner = document.createElement("div");
    inner.classList.add("card-inner");

    const front = document.createElement("div");
    front.classList.add("card-front");

    const back = document.createElement("div");
    back.classList.add("card-back");

    const img = document.createElement("img");
    img.src = `img/${valor}.png`;
    back.appendChild(img);

    inner.appendChild(front);
    inner.appendChild(back);
    carta.appendChild(inner);

    carta.addEventListener("click", () => manejarClickCarta(carta));
    return carta;
}

function manejarClickCarta(carta) {
    if (lockBoard || carta.classList.contains("matched") || carta === firstCard) return;

    if (!carta.classList.contains("flipped")) {
        // Sonido al girar las cartas
        const sonido_giro = new Audio("Sonido.mp3");
        sonido_giro.play();
    }

    carta.classList.add("flipped");

    if (!firstCard) {
        firstCard = carta;
    } else {
        secondCard = carta;
        lockBoard = true;
        moves++;
        movesDisplay.textContent = moves;

        if (firstCard.dataset.value === secondCard.dataset.value) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            matchedPairs++;

            if (matchedPairs === totalPairs) {
                crono.stop();
                mostrarVictoria();
            }

            resetTurno();
        } else {
            setTimeout(() => {
                if (firstCard && secondCard) {
                    firstCard.classList.remove("flipped");
                    secondCard.classList.remove("flipped");
                }
                resetTurno();
            }, 1000);
        }
    }
}

function resetTurno() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function mostrarVictoria() {
    document.getElementById("victory-moves").textContent = moves;

    // Obtener el texto del cronómetro
    const tiempo = timerDisplay.textContent;
    document.getElementById("victory-time").textContent = tiempo;

    document.getElementById("victory-message").classList.remove("hidden");
}

function cerrarVictoria() {
    document.getElementById("victory-message").classList.add("hidden");
}