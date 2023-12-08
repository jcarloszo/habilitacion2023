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


const Mapa = () => {
  const myAPIKey = "38bf763b78744c80bb5671ef040b927c";
  const navigate = useNavigate();
  const [puntosMapa, setPuntosMapa] = useState([]);
  const [mapa, setMapa] = useState();
  const [marcadores, setMarcadores] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  // Icono parques
var iconGeneral = L.icon({
  iconUrl: imageGeneral,
  iconSize: [32, 32], 
  iconAnchor: [16, 32], 
  popupAnchor: [0, -32]
});


  // Icono parques
var iconPark = L.icon({
  iconUrl: imagePark,
  iconSize: [32, 32], 
  iconAnchor: [16, 32], 
  popupAnchor: [0, -32]
});

// Icono parques
var iconFacultad = L.icon({
  iconUrl: imageFacultad,
  iconSize: [32, 32], 
  iconAnchor: [16, 32], 
  popupAnchor: [0, -32]
});

// Icono parques
var iconHospital = L.icon({
  iconUrl: imageHospital,
  iconSize: [32, 32], 
  iconAnchor: [16, 32], 
  popupAnchor: [0, -32]
});

// Icono parques
var iconMuseo = L.icon({
  iconUrl: imageMuseo,
  iconSize: [32, 32], 
  iconAnchor: [16, 32], 
  popupAnchor: [0, -32]
});

  //Inicializacion de variable
  ///Plazas y Parques
  var puntosReferencia = L.marker([-26.790243511964967, -65.23856217265528],{ icon: iconPark }).bindPopup('Paque Municipal'),
  parque1 = L.marker([-26.804953184078016, -65.25229508260033],{ icon: iconPark }).bindPopup('Parque Centenario'),
  parque2 = L.marker([-26.818435374265096, -65.26087815131599],{ icon: iconPark }).bindPopup('Parque Guillermina'),
  parque3 = L.marker([-26.81200089258952, -65.20045334755777],{ icon: iconPark }).bindPopup('Plaza Urquiza'),
  parque4 = L.marker([-26.812613716104533, -65.22929245844237],{ icon: iconPark }).bindPopup('Parque Avellaneda'),
  parque5 = L.marker([-26.818128978658486, -65.18260056462921],{ icon: iconPark }).bindPopup('El Rosedal'),
  parque6 = L.marker([-26.823950353535427, -65.21882111460927],{ icon: iconPark }).bindPopup('Plaza de la fundación Parque Avellaneda'),
  parque7 = L.marker([-26.82854596455796, -65.21950776010652],{ icon: iconPark }).bindPopup('Plazoleta Dr. Miguel Lillo'),
  parque8 = L.marker([-26.826707742518103, -65.2035432522954],{ icon: iconPark }).bindPopup('Plaza Independencia'),
  parque9 = L.marker([-26.825941807865334, -65.19084031059623],{ icon: iconPark }).bindPopup('Parque 9 de Julio'),
  parque10 = L.marker([-26.833754098354653, -65.2061181729101],{ icon: iconPark }).bindPopup('Plaza Hipólito Yrigoyen'),
  parque11 = L.marker([-26.841565850018316, -65.20800644802755],{ icon: iconPark }).bindPopup('Parque de la Memoria');

  var parks = L.layerGroup([puntosReferencia,parque1,parque2,parque3,parque4,parque5,parque6,parque7,parque8,parque9,parque10,parque11]);

  //Facultades
  var facultad1 = L.marker([-26.815018887359532, -65.19845402317024],{ icon: iconFacultad }).bindPopup('Universidad Tecnológica Nacional - Facultad Regional Tucumán'),
  facultad2 = L.marker([-26.829076646535174, -65.22116922455552],{ icon: iconFacultad }).bindPopup('Facultad de Ciencias Naturales e IML - UNT'),
  facultad3 = L.marker([-26.837308430767344, -65.23379304842736],{ icon: iconFacultad }).bindPopup('Facultad De Medicina (Sede Quinta Agronomica) - Universidad Nacional De Tucuman'),
  facultad4 = L.marker([-26.83936628334042, -65.231729538756],{ icon: iconFacultad }).bindPopup('Facultad de Agronomía, Zootecnia y Veterinaria - UNT'),
  facultad5 = L.marker([-26.842906356650495, -65.23165531201974],{ icon: iconFacultad }).bindPopup('Facultad de Ciencias Económicas - UNT'),
  facultad6 = L.marker([-26.838973736247997, -65.2100226957361],{ icon: iconFacultad }).bindPopup('Facultad de Artes UNT'),
  facultad7 = L.marker([-26.832661026848193, -65.18062617318375],{ icon: iconFacultad }).bindPopup('Facultad de filosofia y letras'),
  facultad8 = L.marker([-26.823918003938463, -65.20237557154601],{ icon: iconFacultad }).bindPopup('Facultad de Derecho UNT');

  var facultades = L.layerGroup([facultad1,facultad2,facultad3,facultad4,facultad5,facultad6,facultad7,facultad8]);

  //Hospitales
  var hospital1 = L.marker([-26.825619666702558, -65.2211006948956],{ icon: iconHospital }).bindPopup('Instituto de Maternidad y Ginecología Nuestra Señora de las Mercedes'),
  hospital2 = L.marker([-26.832541995826094, -65.22232554046182],{ icon: iconHospital }).bindPopup('Hospital de dia Doctor Juan María Obarrio.'),
  hospital3 = L.marker([-26.82195853296367, -65.19535081564679],{ icon: iconHospital }).bindPopup('Centro de Salud Dr. Zenón J. Santillán'),
  hospital4 = L.marker([-26.827441373335386, -65.19782862894266],{ icon: iconHospital }).bindPopup('Hospital de Día Pte. Néstor C. Kirchner'),
  hospital5 = L.marker([-26.840598789282744, -65.21109644159156],{ icon: iconHospital }).bindPopup('Hospital del Niño Jesús'),
  hospital6 = L.marker([-26.793552837668244, -65.19537893787142],{ icon: iconHospital }).bindPopup('Hospital Nuestra Señora del Carmen Servicio de Urgencias');

  var hospitales = L.layerGroup([hospital1,hospital2,hospital3,hospital4,hospital5,hospital6]);

  //Museos
  var museo1 = L.marker([-26.825066041137234, -65.22045019629368],{ icon: iconMuseo }).bindPopup('INSTITUTO DE ARQUEOLOGIA Y MUSEO'),
  museo2 = L.marker([-26.830657288214308, -65.22165182595566],{ icon: iconMuseo }).bindPopup('Museo Miguel Lillo de Ciencias Naturales'),
  museo3 = L.marker([-26.8210830666559, -65.2090347133843],{ icon: iconMuseo }).bindPopup('Casa Museo de la Ciudad SMT'),
  museo4 = L.marker([-26.825908575447237, -65.20388487202962],{ icon: iconMuseo }).bindPopup('Instituto De Arqueología Y Museo - America Indigena, Diversidad Cultural Y Tecnología Antigua'),
  museo5 = L.marker([-26.829899672047777, -65.20588905614306],{ icon: iconMuseo }).bindPopup('Museo Folklórico Provincial'),
  museo6 = L.marker([-26.829626423859285, -65.20451110484754],{ icon: iconMuseo }).bindPopup('Museo Casa Padilla'),
  museo7 = L.marker([-26.831185179807978, -65.20476976909815],{ icon: iconMuseo }).bindPopup('Museo Provincial de Bellas Artes Timoteo E. Navarro'),
  museo8 = L.marker([-26.831606425010104, -65.19987741981122],{ icon: iconMuseo }).bindPopup('Museo Provincial Escultor Juan Carlos Iramain'),
  museo9 = L.marker([-26.83287015121705, -65.20382563151647],{ icon: iconMuseo }).bindPopup('Casa Histórica - Museo Nacional de la Independencia'),
  museo10 = L.marker([-26.837580279223168, -65.2181164412757],{ icon: iconMuseo }).bindPopup('Casa Belgraniana Solar Historico');

  var museos = L.layerGroup([museo1,museo2,museo3,museo4,museo5,museo6,museo7,museo8,museo9,museo10]);

  var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 10,
      attribution: '© OpenStreetMap'
    });

    var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 10,
      attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
    });

    var openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 10,
    attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)'
});

  var baseMaps = {
    "OpenStreetMap": osm,
    "<span style='color: red'>OpenStreetMap.HOT</span>": osmHOT,
    "OpenTopoMap": openTopoMap
};

var overlayMaps = {
    "Plazas y Parques": parks,
    "Facultades":facultades,
    "Hospitales:":hospitales,
    "Museos": museos
};

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


  function encontrarHospitalMasCercano(posicionInicial) {
    var hospitalMasCercano = null;
    var distanciaMinima = Infinity;
  
    hospitales.eachLayer(function (hospital) {
      var latitudHospital = hospital.getLatLng().lat;
      var longitudHospital = hospital.getLatLng().lng;
  
      // Calcular la distancia usando la fórmula de distancia euclidiana
      var distancia = Math.sqrt(
        Math.pow(latitudHospital - posicionInicial[0], 2) +
        Math.pow(longitudHospital - posicionInicial[1], 2)
      );
  
      // Actualizar el hospital más cercano si la distancia es menor
      if (distancia < distanciaMinima) {
        distanciaMinima = distancia;
        hospitalMasCercano = hospital.getLatLng();
      }
    });

    
  
    return hospitalMasCercano;
  }

  //  // Ejemplo de uso
  //  var posicionInicial = [-26.844376277499133, -65.21252507534979];  // Cambia esto por la posición inicial deseada
  //  var hospitalCercano = encontrarHospitalMasCercano(posicionInicial);
   
  //  if (hospitalCercano) {
  //    console.log('Posición del hospital más cercano:', hospitalCercano);
  //  } else {
  //    console.log('No se encontraron hospitales.');
  //  }

  //Funcion para obtener coordenadas de los puntos
  function agregarEventoClicDerecho(capa) {
    capa.eachLayer(function (elemento) {
      elemento.on('contextmenu', async function (evento) {
        var latitudClic = evento.latlng.lat;
        var longitudClic = evento.latlng.lng;
        let name = await getNombreByCoordenadas(latitudClic, longitudClic);
        agregarPuntos([latitudClic, longitudClic, name]);
      });
    });
  }
  

  // Uso de la función para cada capa
  agregarEventoClicDerecho(parks);
  agregarEventoClicDerecho(facultades);
  agregarEventoClicDerecho(hospitales);
  agregarEventoClicDerecho(museos);


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

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const clearRoute = () => {
    try {
      if (routingControl) {
        //console.log("Limpio");
        routingControl.getPlan().setWaypoints([]);
        mapa.removeControl(routingControl);
        //routingControl = null;
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

      console.log(test);

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
        15,
        [osm, parks, hospitales, facultades, museos]
      );
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
    if (mapa == undefined) return;

    var mapURL = L.Browser.retina
      ? `https://maps.geoapify.com/v1/tile/{mapStyle}/{z}/{x}/{y}.png?apiKey=${myAPIKey}`
      : `https://maps.geoapify.com/v1/tile/{mapStyle}/{z}/{x}/{y}@2x.png?apiKey=${myAPIKey}`;

    
    var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 10,
      attribution: '© OpenStreetMap'
    });

    var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 10,
      attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
    });

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


    //Buscador
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


  function obtencionEventsRadioButton (mapa){

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
  }


  function agregarMarcador(coordenadas, nombre) {
    agregarPuntos([coordenadas.lat,coordenadas.lng,nombre])
  }

  const mostrarHospital = async () => {
    var hospitalCercano = encontrarHospitalMasCercano(puntosMapa[0]);
    if (hospitalCercano) {
      let name = await getNombreByCoordenadas(hospitalCercano.lat, hospitalCercano.lng);

      agregarMarcador(hospitalCercano,name);
    } else {
      console.log('No se encontraron hospitales.');
    }
  };

  

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

          {/* Check box de la cabecera */}
          <div className="col text-white flex space-x-4 py-2 justify-between">
            <div>
              <label className="flex items-center space-x-2 py-2 px-4 border rounded border-blue-500">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-500"
                  disabled={puntosMapa[0]==undefined}
                  onChange={mostrarHospital}
                />
                <span className="text-blue-500">Hospital mas cercano</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2 py-2 px-4 border rounded border-green-500">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-green-500"
                  disabled={puntosMapa[0]==undefined}
                />
                <span className="text-green-500">Museo mas cercano</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2 py-2 px-4 border rounded border-green-500">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-green-500"
                  disabled={puntosMapa[0]==undefined}
                />
                <span className="text-green-500">Facultad mas cercana</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2 py-2 px-4 border rounded border-green-500">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-green-500"
                  disabled={puntosMapa[0]==undefined}
                />
                <span className="text-green-500">Parque o plaza mas cercana</span>
              </label>
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
