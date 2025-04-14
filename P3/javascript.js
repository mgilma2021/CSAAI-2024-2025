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

// Puntuación de la partida
let puntos = 0;

// Canción de fondo derante las naes enemigas
const musica_fondo = new Audio('duel_of_fates.mp3');
musica_fondo.loop = true;
musica_fondo.volume = 0.75;

// Canción de victoria
const cancion_victoria = new Audio('cancion_victoria.mp3');
cancion_victoria.loop = true;
cancion_victoria.volume = 0.75;

// Canción de derrota
const cancion_derrota = new Audio('cancion_derrota.mp3');
cancion_derrota.loop = true;
cancion_derrota.volume = 0.75;

// Nave del piloto
const nave = new Image();
nave.src = 'x_wing.png';

// Disparos láser
const bala = new Image();
bala.src = 'laser.png';

// Sonido al disparar
const sonido_disparo = new Audio('disparo_laser.mp3');
sonido_disparo.volume = 0.25;

// Cooldaown entre disparos
const tiempo_cooldown = 500; // 500ms
let ultimo_disparo = 0;

// Explosiones al impactar
const explosion = new Image();
explosion.src = 'explosion.png';
explosion.volume = 0.01;

// Imagen del nave final
const nave_vader = new Image();
nave_vader.src = 'nave_vader.png';

// Parametros del jefe final
let jefe_final = null;
let jefe_visible = false;
let jefe_vida = 20; 
let tiempo_ultimo_disparo_jefe = 0;
let intervalo_disparo_jefe = 500; // Inervalo entre disparos en ms
let tiempo_ultimo_cambio_direccion = 0;
let intervalo_cambio_direccion = 1000; // Intervalo que tiene que esperar el jefe antes de cambiar de dirección

// Sonido de las explosiones
const sonido_explosion = new Audio('explosion.mp3');

// Creación de los enemigos
const nave_imperio1 = new Image();
nave_imperio1.src = 'nave_imperio1.png';
const enemigos = [];
const filas = 3;
const columnas = 8;
const ancho_enemigo = canvas.width * 0.05;
const alto_enemigo = canvas.height * 0.05;
let velocidad_enemigos = 2;
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
      ultimo_disparo_enemigo: 0,
      visible: true
    });
  }
}

// Posición incial
const ancho_nave = canvas.width * 0.1;
const alto_nave = canvas.height * 0.1;

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
    ancho: 20,
    alto: 40,
    velocidad: 5,
    origen: 'jugador'
  };
  balas.push(bala); // Agregar la bala al array

  // Actualizar el tiempo del último disparo
  ultimo_disparo = Date.now();
}

// Función para que los enemigos de la última fila disparen
function disparo_enemigos() {
  const ahora = Date.now();
  const enemigos_disponibles = [];

  for (let col = 0; col < columnas; col++) {
    const index = 0 * columnas + col; // Fila 0 (la de más arriba)
    const enemigo = enemigos[index];

    if (enemigo && enemigo.visible) {
      enemigos_disponibles.push(enemigo);
    }
  }

  if (enemigos_disponibles.length > 0) {
    const enemigo_aleatorio = enemigos_disponibles[Math.floor(Math.random() * enemigos_disponibles.length)];

    if (ahora - enemigo_aleatorio.ultimo_disparo_enemigo > tiempo_cooldown && Math.random() < 0.01) {
      let bala_enemigo = {
        x: enemigo_aleatorio.x + ancho_enemigo / 2 - 10,
        y: enemigo_aleatorio.y + alto_enemigo,
        ancho: 20,
        alto: 40,
        velocidad: 5,
        origen: 'enemigo'
      };

      balas.push(bala_enemigo);
      enemigo_aleatorio.ultimo_disparo_enemigo = ahora;
    }
  }
}

// Función para los disparos del jefe
function disparo_jefe() {
  let ahora = Date.now();

  if (ahora - tiempo_ultimo_disparo_jefe > intervalo_disparo_jefe) {
    tiempo_ultimo_disparo_jefe = ahora;

    // 60% de probabilidad de disparar
    if (Math.random() < 0.6) {
      let bala_jefe = {
        x: jefe_final.x + jefe_final.ancho / 2 - 10,
        y: jefe_final.y + jefe_final.alto,
        ancho: 20,
        alto: 40,
        velocidad: 5,
        origen: 'enemigo'
      };

      balas.push(bala_jefe);
      jefe_final.ultimo_disparo = ahora;
    };
  }
}

// Función para las explosiones
let explosiones = [];

function agregar_explosion(x, y) {
  explosiones.push({ x: x, y: y, tiempo: Date.now() });
  sonido_explosion.currentTime = 0;
  sonido_explosion.play();
}

function dibujar_explosiones(ctx) {
  const ahora = Date.now();
  explosiones = explosiones.filter(e => ahora - e.tiempo < 300); // Mostrar por 300 ms

  for (let i = 0; i < explosiones.length; i++) {
    ctx.drawImage(explosion, explosiones[i].x, explosiones[i].y, 40, 40); // Tamaño de la explosión
  }
}

let vida_jugador = 10; // Número de golpes que tiene la nave antes de perder

function update() {
  // Actualizar la posición de la nave
  if (izquierda_presionada) x -= velocidad;
  if (derecha_presionada) x += velocidad;
  if (x < 0) x = 0;
  if (x + ancho_nave > canvas.width) x = canvas.width - ancho_nave;
  y = canvas.height - alto_nave - 55;

  // Mover las balas
  for (let i = 0; i < balas.length; i++) {
    if (balas[i].origen === 'enemigo') {
      balas[i].y += balas[i].velocidad;
    } else {
      balas[i].y -= balas[i].velocidad;
    }

    if (balas[i].y > canvas.height || balas[i].y < 0) {
      balas.splice(i, 1);
      i--;
    }
  }

  // Mover los enemigos
  let cambiar_direccion = false;
  for (let i = 0; i < enemigos.length; i++) {
    enemigos[i].x += velocidad_enemigos * direccion_enemigos;
    if (enemigos[i].x + enemigos[i].ancho > canvas.width || enemigos[i].x < 0) {
      cambiar_direccion = true;
    }
  }

  if (cambiar_direccion) {
    direccion_enemigos *= -1;
    velocidad_enemigos += 0.5;
    for (let j = 0; j < enemigos.length; j++) {
      enemigos[j].y += descenso_enemigos;
    }
  }

  disparo_enemigos();

  // Colisión enemigos con la nave
  for (let i = 0; i < enemigos.length; i++) {
    if (!enemigos[i].visible) continue; // Evita enemigos ya eliminados

    if (enemigos[i].y + enemigos[i].alto >= y) {
      musica_fondo.pause();
      cancion_derrota.play();
      alert("¡Flordeliz, responde Flordeliz!");
      alert('¡NOOOOOOOOO!');
      alert('GAME OVER!');
      return;
    }
  }

  // Colisión balas del jugador con enemigos
  for (let i = 0; i < balas.length; i++) {
    let bala = balas[i];
    if (bala.origen === 'jugador') {
      for (let j = 0; j < enemigos.length; j++) {
        let enemigo = enemigos[j];
        if (enemigo.visible &&
            bala.x < enemigo.x + enemigo.ancho &&
            bala.x + bala.ancho > enemigo.x &&
            bala.y < enemigo.y + enemigo.alto &&
            bala.y + bala.alto > enemigo.y) {
          agregar_explosion(enemigo.x, enemigo.y);
          enemigo.visible = false;
          balas.splice(i, 1);
          i--;
          puntos+= 10;
          break;
        }
      }
    }
  }

  // Colisión balas de enemigo con la nave
  for (let i = 0; i < balas.length; i++) {
    let bala = balas[i];
    if (bala.origen === 'enemigo' &&
        bala.x < x + ancho_nave &&
        bala.x + bala.ancho > x &&
        bala.y < y + alto_nave &&
        bala.y + bala.alto > y) {
      agregar_explosion(x, y);
      balas.splice(i, 1);
      i--;
      vida_jugador--;
      if (vida_jugador <= 0) {
        musica_fondo.pause();
        cancion_derrota.play();
        alert("¡Flordeliz, responde Flordeliz!");
        alert('¡NOOOOOOOOO!');
        alert('GAME OVER!');
        return;
      }
    }
  }

  // Colisión balas del jugador con el jefe
  if (jefe_visible && jefe_final) {
    for (let i = 0; i < balas.length; i++) {
      let b = balas[i];
      if (b.origen === 'jugador' &&
          b.x < jefe_final.x + jefe_final.ancho &&
          b.x + b.ancho > jefe_final.x &&
          b.y < jefe_final.y + jefe_final.alto &&
          b.y + b.alto > jefe_final.y) {
        jefe_vida--;
        agregar_explosion(b.x, b.y);
        balas.splice(i, 1);
        i--;
        puntos += 20;
        if (jefe_vida <= 0) {
          puntos += 500;
          musica_fondo.pause()
          cancion_victoria.play();
          jefe_visible = false;
          alert('¡Enhorabuena Flordeliz!');
          alert('¡La galaxia vuele a estar a salvo!')
          return;
        }
      }
    }
  }

  // Limpieza del canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar nave
  if (nave.complete) {
    ctx.drawImage(nave, x, y, ancho_nave, alto_nave);
  }

  // Dibujar balas
  for (let i = 0; i < balas.length; i++) {
    ctx.drawImage(bala, balas[i].x, balas[i].y, balas[i].ancho, balas[i].alto);
  }

  // Dibujar enemigos
  for (let i = 0; i < enemigos.length; i++) {
    if (enemigos[i].visible) {
      ctx.drawImage(nave_imperio1, enemigos[i].x, enemigos[i].y, enemigos[i].ancho, enemigos[i].alto);
    }
  }

  dibujar_explosiones(ctx);

  // Hacer aparecer al jefe cuando no quedan enemigos
  if (!enemigos.some(e => e.visible) && !jefe_visible) {
    jefe_final = {
      x: canvas.width / 2 - 100,
      y: 50,
      ancho: 200,
      alto: 150,
      velocidad: 2,
      direccion: 1
    };
    jefe_visible = true;
    jefe_vida = 20;
    tiempo_ultimo_cambio_direccion = Date.now();
    tiempo_ultimo_disparo_jefe = Date.now();
    alert('¿Que es eso?');
    alert('¡Es la nave de Vader!');
    alert('¡Tienes que derrotarlo Flordeliz!');
  }

  // Movimiento, disparo y barra de vida del jefe
  if (jefe_visible && jefe_final) {
    let tiempo_actual = Date.now();

    if (tiempo_actual - tiempo_ultimo_cambio_direccion > intervalo_cambio_direccion) {
      jefe_final.direccion = Math.random() < 0.5 ? -1 : 1;
      tiempo_ultimo_cambio_direccion = tiempo_actual;
    }

    jefe_final.x += jefe_final.velocidad * jefe_final.direccion;
    if (jefe_final.x < 0) jefe_final.x = 0;
    if (jefe_final.x + jefe_final.ancho > canvas.width) jefe_final.x = canvas.width - jefe_final.ancho;

    ctx.drawImage(nave_vader, jefe_final.x, jefe_final.y, jefe_final.ancho, jefe_final.alto);

    disparo_jefe();

    ctx.fillStyle = 'gray';
    ctx.fillRect(canvas.width - 220, 50, 200, 20);
    ctx.fillStyle = 'red';
    ctx.fillRect(canvas.width - 220, 50, 200 * (jefe_vida / 20), 20);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(canvas.width - 220, 50, 200, 20);
  }

  // Barra de vida de la nave
  ctx.fillStyle = 'red';
  ctx.fillRect(canvas.width - 120, 20, 100, 20);
  ctx.fillStyle = 'green';
  ctx.fillRect(canvas.width - 120, 20, 100 * (vida_jugador / 10), 20);
  ctx.strokeStyle = 'white';
  ctx.strokeRect(canvas.width - 120, 20, 100, 20);

  // Marcador de puntos
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Puntos: ${puntos}`, 20, 20);  

  requestAnimationFrame(update);
}


// Iniciamos el video de introducción antes de iniciar el juego
const pantalla_inicio = document.getElementById('pantalla_inicio');
const video = document.getElementById('video_intro');

document.getElementById('btn_intro').addEventListener('click', () => {
  pantalla_inicio.style.display = 'none';
  video.style.display = 'block';
  video.muted = false;
  video.play();
});

document.getElementById('btn_saltar').addEventListener('click', () => {
  pantalla_inicio.style.display = 'none';
  canvas.style.display = 'block';
  musica_fondo.play();
  update();
});

// Cuando termine el video, ocultamos y arrancamos el juego
video.addEventListener('ended', () => {
  video.style.display = 'none';
  canvas.style.display = 'block';
  musica_fondo.play();
  update();
});
