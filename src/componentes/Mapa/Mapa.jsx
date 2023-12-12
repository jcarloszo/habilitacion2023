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
import imagePark from '../../resources/images/parque.png'
import imageFacultad from '../../resources/images/facultad.png'
import imageHospital from '../../resources/images/hospital.png'
import imageMuseo from '../../resources/images/museo.png'
import imageGeneral from '../../resources/images/marcador1.png'
import usePoints from "../repositorio/points.js";
import useLayers from "../repositorio/layers.js";

const Mapa = () => {
  const myAPIKey = "38bf763b78744c80bb5671ef040b927c";

  //Context-----------------------------------------------
  const { user, cerrarSesion } = useContext(SesionContext);
  //------------------------------------------------------

  //Navigate---------------------
  const navigate = useNavigate();
  //-----------------------------
  
  //Hooks generales-------------------------------------------
  const [puntosMapa, setPuntosMapa] = useState([]);
  const [mapa, setMapa] = useState();
  const [marcadores, setMarcadores] = useState();
  //----------------------------------------------------------

  //Hooks modales--------------------------------------------
  const [modalVisible, setModalVisible] = useState(false);
  const [isParkSelected, setIsParkSelected] = useState(false);
  //---------------------------------------------------------
  

  //Declaracion de variables temporales
  let routingControl;
  let distanciaMinima = 1000000000;
  let rutaSeleccionada;
  //-------------------------------------


  //Hooks tipos de mapa------------------------------
  const [osm, setOSM] = useState(null);
  const [osmHOT, setOSMHOT] = useState(null);
  const [openTopoMap, setOPENTOPOMAP] = useState(null);
  const [baseMaps, setBaseMaps] = useState({});
  const [overlayMaps, setOverlayMaps] = useState({});
  //----------------------------------------------------

  //Instancias de repositorios-------------
  const usePointsRepository = usePoints();
  const useLayersRepository = useLayers();
  //-------------------------------------

  //Hooks puntos de referencia-----------------------
  const [facultades, setFacultades] = useState(null);
  const [hospitales, setHospitales] = useState(null);
  const [parks, setParks] = useState(null);
  const [museos, setMuseos] = useState(null);
  //-------------------------------------------------

  // Iconos-----------------------------------------
  var iconGeneral = L.icon({
    iconUrl: imageGeneral,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  var iconPark = L.icon({
    iconUrl: imagePark,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  var iconFacultad = L.icon({
    iconUrl: imageFacultad,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  var iconHospital = L.icon({
    iconUrl: imageHospital,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  var iconMuseo = L.icon({
    iconUrl: imageMuseo,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  var defaultIcon = L.icon({
    iconUrl: 'https://i.imgur.com/kiI0PYh.png',
    shadowUrl: 'https://i.imgur.com/VW9Cwx2.png',

    iconSize: [25, 41], // size of the icon
    shadowSize: [41, 41], // size of the shadow
    iconAnchor: [12, 40], // point of the icon which will correspond to marker's location
    shadowAnchor: [10, 42],  // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  //---------------------------------------------

  //Tipos de mapas-------------------------------
  async function loadLayerTypes() {
    const maxZoom = 15;
    try {
      await useLayersRepository.getLayers().then((layers) => {
        layers.forEach(element => {
          switch (element.type.toLocaleUpperCase()) {
            case 'FISICO':
              setOSM(L.tileLayer(element.url, { maxZoom: maxZoom }));
              break;
            case 'POLITICO':
              setOSMHOT(L.tileLayer(element.url, { maxZoom: maxZoom }));
              break;
            case 'TOPOGRAFICO':
              setOPENTOPOMAP(L.tileLayer(element.url, { maxZoom: maxZoom }));
              break;
            default:
              break;
          }
        });
      })

      setBaseMaps({
        "Fisico": osm,
        "Político": osmHOT,
        "Topográfico": openTopoMap
      })

    } catch (error) {
      console.log("No es posible obtener los tipos de capas:", error.message)
    }

  }
  //--------------------------------------------------

  //Funcion auxiliar para carga de puntos---------------------------------------
  const loadPoints = async (type, icon, repositoryFunction, setLayerGroup) => {
    try {
      const puntosArray = await repositoryFunction();
      const markers = puntosArray.map(element => L.marker([element.punto.latitud, element.punto.longitud], { icon: icon }).bindPopup(element.description));
      const layerGroup = L.layerGroup(markers);
      setLayerGroup(layerGroup);
    } catch (error) {
      console.error(`Error al obtener ${type}:`, error.message);
    }
  }
  //----------------------------------------------------------------------------

  //Carga de puntos de referencia--------------------------------------------
  function load() {
    //Agregar mas tipos si es necesario.
    const arrayTypes = ['facultades', 'museos', 'hospitales', 'parks'];

    arrayTypes.forEach(element => {
      switch (element) {
        case 'facultades':
          loadPoints(element, iconFacultad, usePointsRepository.getFacultades, setFacultades);
          break;
        case 'museos':
          loadPoints(element, iconMuseo, usePointsRepository.getMuseos, setMuseos);
          break;
        case 'hospitales':
          loadPoints(element, iconHospital, usePointsRepository.getHospitales, setHospitales);
          break;
        case 'parks':
          loadPoints(element, iconPark, usePointsRepository.getParks, setParks);
        default:
          break;
      }
    });

    setOverlayMaps({
      "Plazas y Parques": parks,
      "Facultades": facultades,
      "Hospitales:": hospitales,
      "Museos": museos
    })
  }
  //----------------------------------------------------------------------------

  //Encontrar lugar mas cercano-------------------------------------------------
  function encontrarPlaceMasCercano(posicionInicial, places) {
    var placeMasCercano = null;
    var distanciaMinima = Infinity;

    places.eachLayer(function (place) {
      var latitud = place.getLatLng().lat;
      var longitud = place.getLatLng().lng;

      // Calcular la distancia usando la fórmula de distancia euclidiana
      var distancia = Math.sqrt(
        Math.pow(latitud - posicionInicial[0], 2) +
        Math.pow(longitud - posicionInicial[1], 2)
      );

      // Actualizar el lugar más cercano si la distancia es menor
      if (distancia < distanciaMinima) {
        distanciaMinima = distancia;
        placeMasCercano = place.getLatLng();
      }
    });
    return placeMasCercano;
  }
  //-----------------------------------------------------------------------------

  //Agregar popup a cada punto-------------------------------------------------
  function agregarEventoClicDerecho(capa) {
    try {
      capa.eachLayer(function (elemento) {
        elemento.on('contextmenu', async function (evento) {
          var latitudClic = evento.latlng.lat;
          var longitudClic = evento.latlng.lng;
          let name = await getNombreByCoordenadas(latitudClic, longitudClic);
          agregarPuntos([latitudClic, longitudClic, name]);
        });
      });
    } catch (error) {
      console.log(error.message)
    }
  }

  agregarEventoClicDerecho(parks);
  agregarEventoClicDerecho(facultades);
  agregarEventoClicDerecho(hospitales);
  agregarEventoClicDerecho(museos);
  //---------------------------------------------------------------------------

  //Agregar puntos al mapa----------------------------------------
  const agregarPuntos = (punto) => {
    setPuntosMapa((puntosMapa) => [...puntosMapa, punto]);
  };
  //--------------------------------------------------------------


  //Eliminar punto--------------------------------------------------
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
  //------------------------------------------------------------------

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

  //Obtener el nombre por las coordenadas-----------------------------------------------------------------------
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
  //-------------------------------------------------------------------------------------------------------------

  //Permutador---------------------------
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
  //---------------------------------------

  //Comparar distancias-----------------------------------------------
  const compararDistancias = (combinacionesPosibles, indice) => {
    if (indice == combinacionesPosibles.length) {
      routingControl = L.Routing.control({
        waypoints: rutaSeleccionada,
      }).addTo(mapa);

      agregarRuta(rutaSeleccionada, puntosMapa);
      return;
    }
    let aux = combinacionesPosibles[indice].map(([lat, lng]) =>
      L.latLng(lat, lng)
    );

    routingControl = L.Routing.control({
      waypoints: aux,
    }).addTo(mapa);

    routingControl.on("routesfound", function (e) {
      var routes = e.routes;
      var summary = routes[0].summary;

      if (summary.totalDistance / 1000 < distanciaMinima) {
        distanciaMinima = summary.totalDistance / 1000;
        rutaSeleccionada = aux;
      }

      clearRoute();

      compararDistancias(combinacionesPosibles, indice + 1);
    });
  };
  //--------------------------------------------------------------

  //Optimizar ruta---------------------------------------------------
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
  //----------------------------------------------------------------

  //Visualizar ruta seleccionada-----------------------------------
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
  //-------------------------------------------------------------


  useEffect(() => {
    load();
    loadLayerTypes();
  }, [osm, osmHOT, openTopoMap]);


  //Limpiar rutas------------------------------------------------------------------------------
  const clearRoute = () => {
    try {
      if (routingControl) {
        routingControl.getPlan().setWaypoints([]);
        mapa.removeControl(routingControl);
      }
      const routingContainer = document.getElementsByClassName(
        "leaflet-routing-container"
      )[0];
      if (routingContainer) {
        routingContainer.remove();
      }
      const test = document.querySelectorAll("leaflet-pane.leaflet-overlay-pane svg")[0];
      if (test) {
        test.innerHTML = "<g></g>";
      }

    } catch (error) {

    }
    setIsParkSelected(false)
  };
  let IsLoaded = false;
  useEffect(() => {
    if (IsLoaded) return;
    IsLoaded = true;
    getLocation()
  }, []);
  //-------------------------------------------------------------------------------------------

  //Obtener geolocalizacion-----------------------------------------
  const getLocation = () => {
    obtenerUbicacion()
      .then(coordenadas => {
        let map = L.map("map").setView(
          [coordenadas.latitud, coordenadas.longitud],
          15,
          [osm, parks, hospitales, facultades, museos]
        );
        //Una vez que encuentra la direccion la guarda.
        agregarPuntos([coordenadas.latitud, coordenadas.longitud])
        setMarcadores(L.layerGroup());
        setMapa(map);
      })
      .catch(error => {
        let map = L.map("map").setView(
          [-26.83261080003296, -65.19707679748537],
          15,
          [osm, parks, hospitales, facultades, museos]
        );
        setMarcadores(L.layerGroup());
        setMapa(map);
      });
  }
  //-----------------------------------------------------------------


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
      L.marker([lat, lon], { icon: defaultIcon }).addTo(mapa);
    });
  }, [puntosMapa, mapa]);

  useEffect(() => {
    if (mapa == undefined) return;

    loadLayerTypes();

    var mapURL = L.Browser.retina
      ? `https://maps.geoapify.com/v1/tile/{mapStyle}/{z}/{x}/{y}.png?apiKey=${myAPIKey}`
      : `https://maps.geoapify.com/v1/tile/{mapStyle}/{z}/{x}/{y}@2x.png?apiKey=${myAPIKey}`;

    L.tileLayer(mapURL, {
      attribution: "ZuritaOrtiz_ValdezPeralta",
      apiKey: myAPIKey,
      mapStyle: "osm-bright-smooth",
    }).addTo(mapa);

    mapa.on("click", async function (e) {
      var latLng = e.latlng;
      var lat = latLng.lat;
      var lng = latLng.lng;

      let name = await getNombreByCoordenadas(lat, lng);

      agregarPuntos([lat, lng, name]);
    });


    //Buscador de direcciones-----------------------------------------------
    const addressSearchControl = L.control.addressSearch(myAPIKey, {
      resultCallback: (address) => {
        if (!address) {
          return;
        }

        agregarPuntos([
          address.lat,
          address.lon,
          address.address_line1 + " " + address.address_line2,
        ]);

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
    });
    mapa.addControl(addressSearchControl);
    //Captura de radio buttons
    obtencionEventsRadioButton(mapa)
    L.control.zoom({ position: "bottomright" }).addTo(mapa);
  }, [mapa]);
  //-------------------------------------------------------------------------------------


  //Control para poder ver los tipos de mapas y puntos de referencia--------------------------------------------------
  function obtencionEventsRadioButton(mapa) {
    try {
      //Agregar el boton de diversos mapas y capas
      var controlCapas = L.control.layers(baseMaps, overlayMaps);
      controlCapas.addTo(mapa);
      controlCapas.getContainer().classList.add('custom-control-position');

      // Obtener todos los checkboxes dentro del contenedor del control de capas
      var checkboxes = controlCapas.getContainer().querySelectorAll('.leaflet-control-layers-selector');

      checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function (event) {
          var nombreCapa = checkbox.parentElement.querySelector('span').innerText.trim().replace(':', '');
          switch (nombreCapa) {
            case 'Hospitales':
              // Ruta a tu imagen personalizada

              break;
            case 'Plazas y Parques':
              //Agregar logica para cambiar el color del posicionador
              break;
            case 'Facultades':
              //Agregar logica para cambiar el color del posicionador
              break;
            case 'Museos':
              //Agregar logica para cambiar el color del posicionador
              break;
          }
        });
      });
    } catch (error) {
      console.log(error.message)
    }
  }
  //-----------------------------------------------------------------------------------------------------------


  //Agregar marcador----------------------------------------------------------------
  function agregarMarcador(coordenadas, nombre) {
    agregarPuntos([coordenadas.lat, coordenadas.lng, nombre])
  }

  const mostrarPlace = async (places) => {
    var placeCercano = encontrarPlaceMasCercano(puntosMapa[0], places);
    if (placeCercano) {
      let name = await getNombreByCoordenadas(placeCercano.lat, placeCercano.lng);
      agregarMarcador(placeCercano, name);
    } else {
      console.log('No se encontro el lugar.');
    }
  };
  //-----------------------------------------------------------------------------------


  //Manejador de evento para visualizar los puntos de referencia--------------------------
  const handleEvent = (placeType) => (event) => {
    const isChecked = event.target.checked;
    switch (placeType) {
      case 'hospital':
        mostrarPlace(hospitales)
        break;
      case 'museo':
        mostrarPlace(museos)
        break;
      case 'facultad':
        mostrarPlace(facultades)
        break;
      case 'park':
        mostrarPlace(parks)
        break;
      default:
        break;
    }
  };
  //--------------------------------------------------------------------------------------


  return (
    <>
      <div className="bg-black flex" style={{ zIndex: 0 }}>
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

          {/* Check box de la cabecera */}
          <div className="col text-white flex space-x-4 py-2 justify-between">

            <div>
              <button
                className="bg-transparent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded border border-blue-500 inline-flex items-center space-x-2"
                disabled={puntosMapa[0] === undefined}
                onClick={handleEvent('hospital')}
              >
                Hospital mas cercano
              </button>
            </div>

            <div>
              <button
                className="bg-transparent hover:bg-green-600 text-white font-bold py-2 px-4 rounded border border-green-500 inline-flex items-center space-x-2"
                disabled={puntosMapa[0] === undefined}
                onClick={handleEvent('museo')}
              >
                Museo mas cercano
              </button>
            </div>

            <div>
              <button
                className="bg-transparent hover:bg-red-600 text-white font-bold py-2 px-4 rounded border border-red-500"
                disabled={puntosMapa[0] === undefined}
                onClick={handleEvent('facultad')}
              >
                Facultad mas cercana
              </button>
            </div>

            <div>
              <button
                className="bg-transparent hover:bg-red-700 text-white font-bold py-2 px-4 rounded border border-yellow-500"
                disabled={puntosMapa[0] === undefined}
                onClick={handleEvent('park')}
              >
                Parque o plaza mas cercana
              </button>
            </div>


          </div>
          {/* Check box de la cabecera */}


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
