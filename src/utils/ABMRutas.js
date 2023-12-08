const agregarRuta = (nuevaRuta, puntosMapa) => {
    //nuevaRuta tiene el orden de los puntos, pero solo provee las coordenadas. Ademas, el ultimo punto es igual al primero
    //puntosMapa tiene los puntos seleccionados (no ordenados), ademas de tener las coordendas tiene el nombre del lugar

    let puntosMapaOrdenados = [];

    for (let index = 0; index < nuevaRuta.length - 1; index++) {
        const element = nuevaRuta[index];
        puntosMapa.forEach(element2 => {
            if(element.lat == element2[0] && element.lng == element2[1]){
                puntosMapaOrdenados.push(element2);
            }
        })
    }
    
    const historialDeRutas = JSON.parse(localStorage.getItem('historialDeRutas')) || [];
    // Agregar el nuevo objeto al array
    historialDeRutas.push(puntosMapaOrdenados);
    // Guardar el array actualizado en localStorage
    localStorage.setItem('historialDeRutas', JSON.stringify(historialDeRutas));
}

const eliminarRuta = ruta => {
    let rutas = JSON.parse(localStorage.getItem('historialDeRutas'));
    let indiceAEliminar = rutas.findIndex(current => JSON.stringify(current) === JSON.stringify(ruta));

    console.log(rutas);
    console.log(ruta);
    console.log(indiceAEliminar);
  // Si se encuentra el índice, elimina el array de rutas
    if (indiceAEliminar !== -1) {
        rutas.splice(indiceAEliminar, 1);
    }

    localStorage.setItem('historialDeRutas', JSON.stringify(rutas));
}

const leerHistorial = () => {
    return JSON.parse(localStorage.getItem('historialDeRutas')).reverse() || [];
}

module.exports = {
    agregarRuta: agregarRuta,
    leerHistorial: leerHistorial,
    eliminarRuta: eliminarRuta
}