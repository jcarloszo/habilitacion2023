import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import '@geoapify/leaflet-address-search-plugin';
import { useEffect, useState } from 'react';
import './Mapa.css'

const Mapa = (props) => {
    const [mapa, setMapa] = useState();
    const [marcadores, setMarcadores] = useState();

    let IsLoaded = false;

    useEffect (() => {
        if(IsLoaded) return;
        IsLoaded = true;
        let map = L.map('map').setView([-26.83261080003296, -65.19707679748537], 13);
        setMarcadores(L.layerGroup());
        setMapa(map);
    }, [])

    useEffect(()=>{
        if(mapa == undefined) return;

        for(let layer in mapa._layers){
            if(mapa._layers[layer] instanceof L.Marker){
                mapa.removeLayer(mapa._layers[layer]);
            }
        }

        props.puntos.forEach((punto)=>{
            let lat = punto[0];
            let lon = punto[1];
            L.marker([lat, lon]).addTo(mapa);
        })
    }, [props.puntos, mapa])

    useEffect(() => {
        if(mapa == undefined) return;
        var marker = null;

        var myAPIKey = "38bf763b78744c80bb5671ef040b927c"; // Get an API Key on https://myprojects.geoapify.com
        var mapURL = L.Browser.retina
            ? `https://maps.geoapify.com/v1/tile/{mapStyle}/{z}/{x}/{y}.png?apiKey=${myAPIKey}`
            : `https://maps.geoapify.com/v1/tile/{mapStyle}/{z}/{x}/{y}@2x.png?apiKey=${myAPIKey}`;

        // Add map tiles layer. Set 20 as the maximal zoom and provide map data attribution.
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Powered by Geoapify | © OpenMapTiles © OpenStreetMap contributors',
            apiKey: myAPIKey,
            mapStyle: "osm-bright-smooth", // More map styles on https://apidocs.geoapify.com/docs/maps/map-tiles/
            maxZoom: 19
        }).addTo(mapa);
     
        mapa.on('click', function(e) {
            var latLng = e.latlng;
            var lat = latLng.lat;
            var lng = latLng.lng;    
            props.agregarPunto([lat, lng]);    
          });
        
          // Add Geoapify Address Search control
        const addressSearchControl = L.control.addressSearch(myAPIKey, {
            position: 'topleft',
            resultCallback: (address) => {
                if (marker) {
                    marker.remove();
                }

                if (!address) {
                    return;
                }

                marker = L.marker([address.lat, address.lon]).addTo(mapa);
                if (address.bbox && address.bbox.lat1 !== address.bbox.lat2 && address.bbox.lon1 !== address.bbox.lon2) {
                    mapa.fitBounds([[address.bbox.lat1, address.bbox.lon1], [address.bbox.lat2, address.bbox.lon2]], { padding: [100, 100] })
                } else {
                    mapa.setView([address.lat, address.lon], 15);
                }
            },
            suggestionsCallback: (suggestions) => {
                console.log(suggestions);
            }
        });
        mapa.addControl(addressSearchControl);
        L.control.zoom({ position: 'bottomright' }).addTo(mapa);
    }, [mapa])

    return (
        <>
            <div id='map'></div>
        </>
    )
}

export default Mapa;