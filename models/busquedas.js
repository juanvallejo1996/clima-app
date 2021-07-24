const axios = require('axios');

class Busquedas {

    historial = [ 'Tegucigalpa', 'Madrid', 'San josé', 'Bogotá' ];

    constructor(){
        // TODO: leer db si existe
    }


    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': process.env.LENGUAGUE
        }
    }

    get paramsOpenWeather(){

        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': process.env.LENGUAGUE
        }

    }

    async ciudad( lugar = '' ){
        
        //Petición http
        //console.log( 'Ciudad: ', lugar );

        try {
            
            //Petición http
            
            const instance = axios.create({

                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox

            });

            const respuesta = await instance.get();
            //const respuesta = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/BOGOTA.json');
            return respuesta.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));


        } catch (error) {

            return []; //Retornar los lugares
            
        }
        
    }

    async climaLugar( lat, lon ){

        try {

            const instance = axios.create({

                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeather, lat, lon }

            });
            //console.log( instance );

            const respuesta = await instance.get();
            
            const { weather, main } = respuesta.data;


            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
            }


        } catch (error) {

            console.log(error);
            
        }

    }

}

module.exports = Busquedas;