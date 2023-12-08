import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@geoapify/leaflet-address-search-plugin";
import { useEffect, useState, useContext } from "react";
import "./Mapa.css";
import axios from "axios";
import Header from "../Header/header.tsx";
import ListaPuntos from "../ListaPuntos/ListaPuntos";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { SesionContext } from "../../models/Sesion/Sesion.tsx";
import { useNavigate } from "react-router-dom";
import HistorialRutas from "../HistorialRutas/HistorialRutas.jsx";
import { agregarRuta } from "../../utils/ABMRutas.js";
import Modal from "../Modal/Modal.tsx";
import obtenerUbicacion from "../../utils/geo.js";

const Mapa = () => {
  const myAPIKey = "38bf763b78744c80bb5671ef040b927c";
  const navigate = useNavigate();
  const [puntosMapa, setPuntosMapa] = useState([]);
  const [mapa, setMapa] = useState();
  const [marcadores, setMarcadores] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const { user, cerrarSesion } = useContext(SesionContext);

  let routingControl;
  let distanciaMinima = 1000000000;
  let rutaSeleccionada;

  var defaultIcon = L.icon({
    iconUrl: 'https://i.imgur.com/kiI0PYh.png',
    shadowUrl: 'https://i.imgur.com/VW9Cwx2.png',

    iconSize: [25, 41], // size of the icon
    shadowSize: [41, 41], // size of the shadow
    iconAnchor: [12, 40], // point of the icon which will correspond to marker's location
    shadowAnchor: [10, 42],  // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  const agregarPuntos = (punto) => {
    setPuntosMapa((puntosMapa) => [...puntosMapa, punto]);
  };

  function eliminarPunto(punto) {
    clearRoute();
    let aux = [];

    puntosMapa.forEach((puntoActual) => {
      if (puntoActual[0] != punto[0] || puntoActual[1] != punto[1]) {
        aux.push(puntoActual);
      }
    });

    setPuntosMapa(aux);
  }

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate("/");
  };

  const limpiarPuntos = () => {
    clearRoute();
    setPuntosMapa([]);
  };

  const verHistorial = () => {
    setModalVisible(true);
  }

  const getNombreByCoordenadas = async (latitud, longitud) => {
    let response = await axios.get(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${latitud}&lon=${longitud}&format=json&apiKey=${myAPIKey}`
    );
    return (
      response.data.results[0].address_line1 +
      " " +
      response.data.results[0].address_line2
    );
  };

  const permutator = (inputArr) => {
    let result = [];

    const permute = (arr, m = []) => {
      if (arr.length === 0) {
        result.push(m);
      } else {
        for (let i = 0; i < arr.length; i++) {
          let curr = arr.slice();
          let next = curr.splice(i, 1);
          permute(curr, m.concat(next));
        }
      }
    };

    permute(inputArr);
    return result;
  };

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const compararDistancias = (combinacionesPosibles, indice) => {
    if (indice == combinacionesPosibles.length) {
      //console.log("Distacia minima encontrada " +  distanciaMinima + "km");

      routingControl = L.Routing.control({
        waypoints: rutaSeleccionada,
      }).addTo(mapa);

      agregarRuta(rutaSeleccionada, puntosMapa);
      return;
    }

    //console.log(indice);

    let aux = combinacionesPosibles[indice].map(([lat, lng]) =>
      L.latLng(lat, lng)
    );

    routingControl = L.Routing.control({
      waypoints: aux,
    }).addTo(mapa);

    routingControl.on("routesfound", function (e) {
      var routes = e.routes;
      var summary = routes[0].summary;
      // alert distance and time in km and minutes

      if (summary.totalDistance / 1000 < distanciaMinima) {
        distanciaMinima = summary.totalDistance / 1000;
        rutaSeleccionada = aux;
      }

      //console.log('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
      clearRoute();

      compararDistancias(combinacionesPosibles, indice + 1);
    });
  };

  const rutaTest = () => {
    clearRoute();

    let puntoInicial = puntosMapa[0];
    let combinacionesPosibles = permutator(puntosMapa);

    let combinacionesPosiblesFiltradas = combinacionesPosibles.filter(
      (combinacionPuntos) => {
        return (
          combinacionPuntos[0][0] == puntoInicial[0] &&
          combinacionPuntos[0][1] == puntoInicial[1]
        );
      }
    );

    combinacionesPosiblesFiltradas.forEach((combinacionPuntos) => {
      return combinacionPuntos.push(combinacionPuntos[0]);
    });

    compararDistancias(combinacionesPosiblesFiltradas, 0);
  };

  const visualizarRutaSeleccionada = (ruta) => {
    clearRoute();
    limpiarPuntos();
    setModalVisible(false);

    setPuntosMapa(ruta);

    let aux = ruta.map(([lat, lng]) =>
      L.latLng(lat, lng)
    );
    
    routingControl = L.Routing.control({
      waypoints: aux,
    }).addTo(mapa);
  }

  useEffect(() => {
  }, [puntosMapa]);

  const clearRoute = () => {
    try {
      if (routingControl) {
        //console.log("Limpio");
        routingControl.getPlan().setWaypoints([]);
        mapa.removeControl(routingControl);
        routingControl = null;
        const routingContainer = document.getElementsByClassName(
          "leaflet-routing-container"
        )[0];
        if (routingContainer) {
          routingContainer.remove();
        }
      }
    } catch (error) {
      
    }
  };

  let IsLoaded = false;

  useEffect(() => {
    if (IsLoaded) return;
    IsLoaded = true;
    
    obtenerUbicacion()
    .then(coordenadas => {
      let map = L.map("map").setView(
        [coordenadas.latitud, coordenadas.longitud],
        15
      );
      setMarcadores(L.layerGroup());
      setMapa(map);
    })
    .catch(error => {
      let map = L.map("map").setView(
        [-26.83261080003296, -65.19707679748537],
        15
      );
      setMarcadores(L.layerGroup());
      setMapa(map);
    });
  }, []);

  useEffect(() => {
    if (mapa == undefined) return;

    for (let layer in mapa._layers) {
      if (mapa._layers[layer] instanceof L.Marker) {
        mapa.removeLayer(mapa._layers[layer]);
      }
    }

    puntosMapa.forEach((punto) => {
      let lat = punto[0];
      let lon = punto[1];
      L.marker([lat, lon], {icon: defaultIcon}).addTo(mapa);
    });
  }, [puntosMapa, mapa]);

  useEffect(() => {
    //console.log(user)
    if (mapa == undefined) return;
    var marker = null;

    // Get an API Key on https://myprojects.geoapify.com
    var mapURL = L.Browser.retina
      ? `https://maps.geoapify.com/v1/tile/{mapStyle}/{z}/{x}/{y}.png?apiKey=${myAPIKey}`
      : `https://maps.geoapify.com/v1/tile/{mapStyle}/{z}/{x}/{y}@2x.png?apiKey=${myAPIKey}`;

    //https://tile.openstreetmap.org/{z}/{x}/{y}.png
    // Add map tiles layer. Set 20 as the maximal zoom and provide map data attribution.
    L.tileLayer(mapURL, {
      attribution: "Powered by Los Pibes del Barrio",
      apiKey: myAPIKey,
      mapStyle: "osm-bright-smooth", // More map styles on https://apidocs.geoapify.com/docs/maps/map-tiles/
      maxZoom: 19,
    }).addTo(mapa);

    mapa.on("click", async function (e) {
      var latLng = e.latlng;
      var lat = latLng.lat;
      var lng = latLng.lng;

      let name = await getNombreByCoordenadas(lat, lng);

      agregarPuntos([lat, lng, name]);
    });

    // Add Geoapify Address Search control
    const addressSearchControl = L.control.addressSearch(myAPIKey, {
      position: "topleft",
      resultCallback: (address) => {
        if (marker) {
          marker.remove();
        }

        if (!address) {
          return;
        }

        agregarPuntos([
          address.lat,
          address.lon,
          address.address_line1 + " " + address.address_line2,
        ]);
        //marker = L.marker([address.lat, address.lon]).addTo(mapa);
        if (
          address.bbox &&
          address.bbox.lat1 !== address.bbox.lat2 &&
          address.bbox.lon1 !== address.bbox.lon2
        ) {
          mapa.fitBounds(
            [
              [address.bbox.lat1, address.bbox.lon1],
              [address.bbox.lat2, address.bbox.lon2],
            ],
            { padding: [100, 100] }
          );
        } else {
          mapa.setView([address.lat, address.lon], 15);
        }
      },
      suggestionsCallback: (suggestions) => {
        // console.log(suggestions);
      },
    });
    mapa.addControl(addressSearchControl);
    L.control.zoom({ position: "bottomright" }).addTo(mapa);
  }, [mapa]);

  return (
    <>
      <div className="bg-black flex" style={{zIndex: 0}}>
        <div className="col">
          <div className="row text-white justify-center flex p-2 text-xl">
            <div className="">
              <div className="col text-center">
                <h1>RouteOptimizer</h1>
              </div>
              <div className="col text-sm text-center text-red-500">
                <h1>
                  Bienvenid@{" "}
                  {user.firstName + " Inicio de sesion: " + user.date}
                </h1>
              </div>
            </div>
          </div>
          <div className="row">
            <div id="map"></div>
          </div>
          <div className="row justify-center">
            <div className="flex space-x-4 justify-between p-2">
              <button
                onClick={limpiarPuntos}
                className="bg-blue-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                <h1 className="text-white">Limpiar Puntos</h1>
              </button>

              <button
                onClick={verHistorial}
                className="bg-yellow-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                <h1 className="text-white">Historial Rutas</h1>
              </button>

              <button
                onClick={rutaTest}
                className="bg-green-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                <h1 className="text-white">Optimizar Ruta</h1>
              </button>

              <button
                onClick={handleCerrarSesion}
                className="bg-red-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                <h1 className="text-white">Cerrar Sesion</h1>
              </button>
            </div>
          </div>
        </div>
        <div className="col text-white">
          <ListaPuntos
            eliminar={eliminarPunto}
            puntos={puntosMapa}
          ></ListaPuntos>
        </div>
      </div>
      <Modal visible={modalVisible} setModalVisible={setModalVisible}>
      <HistorialRutas visualizarRuta={visualizarRutaSeleccionada}></HistorialRutas>
      </Modal>

    </>
  );
};

export default Mapa;
