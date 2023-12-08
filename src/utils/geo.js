const obtenerUbicacion = () => {
    return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            function (position) {
              const latitud = position.coords.latitude;
              const longitud = position.coords.longitude;
              console.log({latitud, longitud});
              resolve({ latitud, longitud });
            },
            function (error) {
              reject(`Error al obtener la ubicación: ${error.message}`);
            }
          );
        } else {
          reject('Geolocalización no es compatible en este navegador.');
        }
      });
  }

  export default obtenerUbicacion;