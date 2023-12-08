import React, { useEffect, useState } from "react";
import { leerHistorial, eliminarRuta } from "../../utils/ABMRutas";
import '../HistorialRutas/HistorialRutas.css'

const HistorialRutas = (props) => {

    const [historialRutas, setHistorialRutas] = useState(leerHistorial);

    const eliminar = (ruta) => {
        eliminarRuta(ruta);
        setHistorialRutas(leerHistorial);
    }

    const visualizar = (ruta) => {
        ruta.push(ruta[0]); //La ruta comienza y termina en el mismo lugar
        console.log(ruta);
        props.visualizarRuta(ruta);
    }

    return (<>
        <div className="historialContainer">
            <h2>Historial de rutas optimizadas</h2>
            <hr />
            {
                historialRutas.map((ruta, index) => {
                    return (<>
                        <br />
                        <div className="flex items-center justify-space-around">
                            <h4 className="">Ruta #{index + 1}</h4>
                            
                            {/* <button
                                className="bg-green-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                onClick={e => visualizar(ruta)}
                            >Visualizar en mapa</button> */}
                            <button
                                className="bg-red-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                onClick={e => eliminar(ruta)}
                            >Eliminar</button>
                        </div>
                        <ul className="list-group">
                            {
                                ruta.map((punto) => {
                                    return (<li className="list-group-item">{punto[2]}</li>)
                                })
                            }
                        </ul>
                    </>)
                })
            }
        </div>
    </>)
}

export default HistorialRutas;