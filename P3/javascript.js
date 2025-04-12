console.log('Ejecutando JS...');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function ajustarCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Llamar al cargar y cada vez que se cambie el tamaño
window.addEventListener('resize', ajustarCanvas);
ajustarCanvas();

// Nave del piloto
const nave = new Image();
nave.src = 'x_wing.png'

// Disparos láser
const bala = new Image();
bala.src = 'laser.png'

// Sonido al disparar
const sonido_disparo = new Audio('disparo_laser.mp3');

// Cooldaown entre disparos
const tiempo_cooldown = 500; // 500ms
let ultimo_disparo = 0;

// Creación de los enemigos
const nave_imperio1 = new Image();
nave_imperio1.src = 'nave_imperio1.png';
const enemigos = [];
const filas = 5;
const columnas = 8;
const ancho_enemigo = 70;
const alto_enemigo = 40;
const velocidad_enemigos = 2;
let direccion_enemigos = 1; // 1 para derecha, -1 para izquierda
let descenso_enemigos = 30; // Cuánto bajan los enemigos al llegar al borde

// Calcular posición inicial centrada de los enemigos
const espacio_horizontal = 10; // Espacio entre enemigos horizontalmente
const espacio_vertical = 10; // Espacio entre enemigos verticalmente
const inicio_x = (canvas.width - (columnas * ancho_enemigo + (columnas - 1) * espacio_horizontal)) / 2;
const inicio_y = (canvas.height - (filas * alto_enemigo + (filas - 1) * espacio_vertical)) / 2;

// Posicionamiento de los enemigos
for (let fila = 0; fila < filas; fila++) {
  for (let col = 0; col < columnas; col++) {
    enemigos.push({
      x: inicio_x + col * (ancho_enemigo + espacio_horizontal), // Posición horizontal centrada
      y: fila * (alto_enemigo + 10) + 50, // Espaciado vertical
      ancho: ancho_enemigo,
      alto: alto_enemigo,
      ultimo_disparo_enemigo: 0
    });
  }
}

// Posición incial
const ancho_nave = 120;
const alto_nave = 80;

let x = (canvas.width - ancho_nave) / 2;
let y = canvas.height - alto_nave - 55;

// Velocidad de la nave
let velocidad = 4;
let izquierda_presionada = false;
let derecha_presionada = false;

// Array para las balas
let balas = [];

// Detección de las teclas
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') izquierda_presionada = true;
    if (e.key === 'ArrowRight') derecha_presionada = true;
    if (e.key === ' ' && (Date.now() - ultimo_disparo > tiempo_cooldown)) {
      disparar(); // Solo disparar si ha pasado el cooldown
    }
  });
  
  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') izquierda_presionada = false;
    if (e.key === 'ArrowRight') derecha_presionada = false;
  });

// Función para disparar
function disparar() {
  sonido_disparo.play();
  // Crear una nueva bala
  let bala = {
    x: x + ancho_nave / 2 - 5, // Centrar la bala con respecto a la nave
    y: y,
    ancho: 10,
    alto: 20,
    velocidad: 7
  };
  balas.push(bala); // Agregar la bala al array

  // Actualizar el tiempo del último disparo
  ultimo_disparo = Date.now();
}

// Función para que los enemigos de la última fila disparen
function disparo_enemigos() {
  const ahora = Date.now();

  // Número de enemigos por fila (columnas)
  const columnas = 8;  // 8 columnas en este caso
  const filas = 5;     // 5 filas de enemigos
  
  // Determinamos el rango de la última fila (desde el final del array)
  const ultima_fila_start = columnas - enemigos.length;  // Primer enemigo de la última fila
  const ultima_fila_end = enemigos.length;               // Último enemigo de la última fila
  
  // Crear una lista de enemigos de la última fila
  const ultima_fila = enemigos.slice(ultima_fila_start, ultima_fila_end);

  // Elegir un enemigo aleatorio que pueda disparar
  const enemigos_que_pueden_disparar = ultima_fila.filter(enemigo => ahora - enemigo.ultimo_disparo_enemigo > tiempo_cooldown);

  // Si hay enemigos disponibles para disparar
  if (enemigos_que_pueden_disparar.length > 0) {
    // Elegir un enemigo aleatorio de los que pueden disparar
    const enemigo_aleatorio = enemigos_que_pueden_disparar[Math.floor(Math.random() * enemigos_que_pueden_disparar.length)];

    // Crear la bala para el enemigo
    if (Math.random() < 0.025) { // Ajusta el 0.5 para cambiar la probabilidad
      // Crear la bala para el enemigo
      let bala_enemigo = {
        x: enemigo_aleatorio.x + ancho_enemigo / 2 - 10, // Centrado horizontalmente
        y: enemigo_aleatorio.y + alto_enemigo,           // Justo debajo del enemigo
        ancho: 20,
        alto: 40,
        velocidad: 5
      };

      // Añadir la bala al array de balas
      balas.push(bala_enemigo);

      // Actualizar el tiempo de disparo para el enemigo
      enemigo_aleatorio.ultimo_disparo_enemigo = ahora;
    }
  }
}


// Función para la animación de movimiento
function update() {
  // Actualizar la posición de la nave
  if (izquierda_presionada) x -= velocidad;
  if (derecha_presionada) x += velocidad;

  if (x < 0) x = 0;
  if (x + ancho_nave > canvas.width) x = canvas.width - ancho_nave;

  y = canvas.height - alto_nave - 55;

  // Mover las balas hacia arriba
  for (let i = 0; i < balas.length; i++) {
    // Si la bala es del enemigo (es decir, el ancho es mayor a 10, ajusta según el tamaño de tus balas)
    if (balas[i].alto > 20) {
      balas[i].y += balas[i].velocidad; // Mover hacia abajo
    } else {
      balas[i].y -= balas[i].velocidad; // Mover hacia arriba para las balas de la nave
    }
  
    // Eliminar las balas que salen del canvas
    if (balas[i].y > canvas.height || balas[i].y < 0) {
      balas.splice(i, 1);
      i--; // Ajustar el índice al eliminar una bala
    }
  }

  // Mover los enemigos de manera conjunta
  let cambiar_direccion = false;
  for (let i = 0; i < enemigos.length; i++) {
    enemigos[i].x += velocidad_enemigos * direccion_enemigos;

    // Comprobar si algún enemigo ha tocado el borde
    if (enemigos[i].x + enemigos[i].ancho > canvas.width || enemigos[i].x < 0) {
      cambiar_direccion = true;
    }
  }

  // Si algún enemigo llegó al borde, cambiamos dirección y bajamos todos los enemigos
  if (cambiar_direccion) {
    direccion_enemigos *= -1; // Cambiar dirección
    for (let j = 0; j < enemigos.length; j++) {
      enemigos[j].y += descenso_enemigos; // Todos bajan un nivel
    }
  }

  // Disparos de los enemigos
  disparo_enemigos();

  // Comprobar si algún enemigo llega a la nave (game over)
  for (let i = 0; i < enemigos.length; i++) {
    if (enemigos[i].y + enemigos[i].alto >= y) {
      alert("¡Game Over!");
      return; // Detener la ejecución del juego
    }
  }

  // Limpiar el canvas y redibujar todo
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar la nave
  if (nave.complete) {
    ctx.drawImage(nave, x, y, ancho_nave, alto_nave);
  }

  // Dibujar las balas usando la imagen de la bala
  for (let i = 0; i < balas.length; i++) {
    ctx.drawImage(bala, balas[i].x, balas[i].y, balas[i].ancho, balas[i].alto);
  }

  // Dibujar los enemigos (cuadrados rojos)
  for (let i = 0; i < enemigos.length; i++) {
    if (nave_imperio1.complete) {  // Comprobar si la imagen ha cargado
      ctx.drawImage(nave_imperio1, enemigos[i].x, enemigos[i].y, ancho_enemigo, alto_enemigo);
    }
  }

  requestAnimationFrame(update);
}


update();
