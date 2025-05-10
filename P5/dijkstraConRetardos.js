function dijkstraConRetardos(nodos, origen, destino) {
    const dist = {};
    const prev = {};
    const visitados = new Set();
    const pq = [];

    // Inicializamos las distancias y los nodos previos
    nodos.forEach(n => {
        dist[n.id] = Infinity;
        prev[n.id] = null;
    });

    // Inicializamos la distancia del nodo origen con su delay
    dist[origen.id] = origen.delay;
    pq.push({ id: origen.id, costo: origen.delay });

    while (pq.length > 0) {
        pq.sort((a, b) => a.costo - b.costo); // prioridad mínima
        const actual = pq.shift();
        const nodoActual = nodos.find(n => n.id === actual.id);

        // Si ya hemos visitado el nodo, lo ignoramos
        if (!nodoActual || visitados.has(nodoActual.id)) continue;

        visitados.add(nodoActual.id);

        // Recorremos las conexiones del nodo actual
        nodoActual.conexiones.forEach(({ nodo: vecino, peso }) => {
            // Calculamos el nuevo costo solo si el vecino es parte de la ruta
            const nuevoCosto = dist[nodoActual.id] + peso + vecino.delay;

            // Si encontramos una ruta más corta, la actualizamos
            if (nuevoCosto < dist[vecino.id]) {
                dist[vecino.id] = nuevoCosto;
                prev[vecino.id] = nodoActual.id;
                pq.push({ id: vecino.id, costo: nuevoCosto });
            }
        });
    }

    // Reconstruimos la ruta más corta
    const ruta = [];
    let actualId = destino.id;
    while (actualId !== null) {
        ruta.unshift(actualId);
        actualId = prev[actualId];
    }

    // Acumulamos solo el retardo de los nodos en la ruta
    let totalDelay = 0;
    for (let i = 0; i < ruta.length; i++) {
        const nodo = nodos.find(n => n.id === ruta[i]);
        if (nodo) {
            totalDelay += nodo.delay;
        }
    }

    // Retornamos la ruta y el costo total
    return { ruta, totalDelay };
}
