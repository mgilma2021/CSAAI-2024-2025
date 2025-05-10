// Variables de trabajo
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

let redAleatoria;
let nodoOrigen = 0, nodoDestino = 0;
let rutaMinimaConRetardos;

const nodeRadius = 40;
const numNodos = 5;
const nodeConnect = 2;
const nodeRandomDelay = 1000;
const pipeRandomWeight = 100;

const mensajeElem = document.getElementById("mensaje");
const tiempoTotalElem = document.getElementById("tiempoTotal");

const btnCNet = document.getElementById("btnCNet");
const btnMinPath = document.getElementById("btnMinPath");

class Nodo {
  constructor(id, x, y, delay) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.delay = delay;
    this.conexiones = [];
  }

  conectar(nodo, peso) {
    this.conexiones.push({ nodo, peso });
  }

  isconnected(idn) {
    return this.conexiones.some(({ nodo }) => nodo.id === idn);
  }

  node_distance(nx, ny) {
    let a = nx - this.x;
    let b = ny - this.y;
    return Math.floor(Math.sqrt(a * a + b * b));
  }

  far_node(nodos) {
    let distn = 0, cnode = this.id, distaux = 0, pos = 0, npos = 0;
    for (let nodo of nodos) {
      distaux = this.node_distance(nodo.x, nodo.y);
      if (distaux !== 0 && distaux > distn) {
        distn = distaux;
        cnode = nodo.id;
        npos = pos;
      }
      pos++;
    }
    return { pos: npos, id: cnode, distance: distn };
  }

  close_node(nodos) {
    let far = this.far_node(nodos);
    let cnode = far.id, distn = far.distance, distaux = 0, pos = 0, npos = 0;
    for (let nodo of nodos) {
      distaux = this.node_distance(nodo.x, nodo.y);
      if (distaux !== 0 && distaux <= distn) {
        distn = distaux;
        cnode = nodo.id;
        npos = pos;
      }
      pos++;
    }
    return { pos: npos, id: cnode, distance: distn };
  }
}

function crearRedAleatoriaConCongestion(numNodos, numConexiones) {
  const nodos = [];
  let x = 0, y = 0, delay = 0;
  const xs = Math.floor(canvas.width / numNodos);
  const ys = Math.floor(canvas.height / 2);
  const xr = canvas.width - nodeRadius;
  const yr = canvas.height - nodeRadius;
  let xp = nodeRadius;
  let yp = nodeRadius;
  let xsa = xs;
  let ysa = ys;

  for (let i = 0; i < numNodos; i++) {
    if (Math.random() < 0.5) {
      yp = nodeRadius;
      ysa = ys;
    } else {
      yp = ys;
      ysa = yr;
    }

    x = randomNumber(xp, xsa);
    y = randomNumber(yp, ysa);

    xp = xsa;
    xsa += xs;
    if (xsa > xr && xsa <= canvas.width) xsa = xr;
    if (xsa > xr && xsa < canvas.width) {
      xp = nodeRadius;
      xsa = xs;
    }

    delay = generarRetardo();
    nodos.push(new Nodo(i, x, y, delay));
  }

  for (let nodo of nodos) {
    const clonedArray = [...nodos];
    for (let j = 0; j < numConexiones; j++) {
      let close_node = nodo.close_node(clonedArray);
      if (!nodo.isconnected(close_node.id) && !clonedArray[close_node.pos].isconnected(nodo.id)) {
        nodo.conectar(clonedArray[close_node.pos], close_node.distance);
      }
      clonedArray.splice(close_node.pos, 1);
    }
  }

  return nodos;
}

function generarRetardo() {
  return Math.random() * nodeRandomDelay;
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function drawNet(nnodes) {
  nnodes.forEach(nodo => {
    nodo.conexiones.forEach(({ nodo: conexion, peso }) => {
      ctx.beginPath();
      ctx.moveTo(nodo.x, nodo.y);
      ctx.lineTo(conexion.x, conexion.y);
      ctx.stroke();

      ctx.font = '12px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      const pw = "N" + nodo.id + " pw " + peso;
      const midX = Math.floor((nodo.x + conexion.x) / 2);
      const midY = Math.floor((nodo.y + conexion.y) / 2);
      ctx.fillText(pw, midX, midY);
    });
  });

  nnodes.forEach(nodo => {
    ctx.beginPath();
    ctx.arc(nodo.x, nodo.y, nodeRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.stroke();
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    const nodoDesc = "N" + nodo.id + " delay " + Math.floor(nodo.delay);
    ctx.fillText(nodoDesc, nodo.x, nodo.y + 5);
  });
}

function dibujarRutaMinima(nodos, ruta) {
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 4;

  for (let i = 0; i < ruta.length - 1; i++) {
    const nodoA = nodos.find(n => n.id === ruta[i]);
    const nodoB = nodos.find(n => n.id === ruta[i + 1]);

    if (nodoA && nodoB) {
      ctx.beginPath();
      ctx.moveTo(nodoA.x, nodoA.y);
      ctx.lineTo(nodoB.x, nodoB.y);
      ctx.stroke();
    }
  }

  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
}


btnCNet.onclick = () => {
  redAleatoria = crearRedAleatoriaConCongestion(numNodos, nodeConnect);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNet(redAleatoria);
  mensajeElem.textContent = "Red creada";
  tiempoTotalElem.textContent = '0'
  document.getElementById("nodoCount").textContent = redAleatoria.length;
};

// Botón para calcular la ruta mínima
btnMinPath.onclick = () => {
  if (!redAleatoria || redAleatoria.length === 0) {
    mensajeElem.textContent = "Primero cree la red";
    return;
  }

  const nodoOrigen = redAleatoria[0];
  const nodoDestino = redAleatoria[redAleatoria.length - 1];

  const resultado = dijkstraConRetardos(redAleatoria, nodoOrigen, nodoDestino);
  const ruta = resultado.ruta;
  const totalDelay = resultado.totalDelay;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNet(redAleatoria);
  dibujarRutaMinima(redAleatoria, ruta);

  ruta.forEach(id => {
    const nodo = redAleatoria.find(n => n.id === id);
    if (nodo) {
      ctx.beginPath();
      ctx.arc(nodo.x, nodo.y, nodeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = 'green';
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText("N" + nodo.id + " delay " + Math.floor(nodo.delay), nodo.x, nodo.y + 5);
    }
  });

  mensajeElem.textContent = "Ruta calculada";
  tiempoTotalElem.textContent = Math.floor(totalDelay);
};


