import axios from "axios";
import fs from "fs";

class Busquedas {
  historial = [];
  dbPath = "./db/database.json";

  constructor() {
    //Todo: leer DB si existe
    this.leerDB();
  }

  get historialCapitalizado() {
    return this.historial.map((lugar) => {
      let palabras = lugar.split(" ");
      palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1));

      return palabras.join(" ");
    });
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  get paramsWeather() {
    return {
      appid: process.env.OPENWATHER_KEY,
      units: "metric",
      lang: "es",
    };
  }

  async ciudad(lugar = "") {
    //peticion http
    // console.log("ciudad", lugar);

    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/search/geocode/v6/forward?q=${lugar}`,
        params: this.paramsMapbox,
      });
      const resp = await instance.get();

      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.properties.full_address,
        lng: lugar.properties.coordinates.longitude,
        lat: lugar.properties.coordinates.latitude,
      }));
    } catch (error) {
      return [];
    }

    return []; //retornar ciudades
  }

  async climaCiudad(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsWeather, lat, lon },
      });
      const resp = await instance.get();

      return {
        temp: resp.data.main.temp,
        max: resp.data.main.temp_max,
        min: resp.data.main.temp_min,
        desc: resp.data.weather[0].description,
      };
      console.log(resp);
    } catch (error) {
      console.error(error);
    }
  }

  agregarHisotiral(lugar = "") {
    //prevenir duplicados
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return;
    }
    this.historial = this.historial.slice(0, 5);

    this.historial.unshift(lugar);

    //grabar en DB
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerDB() {
    //Debe de existir la db
    if (!fs.existsSync(this.dbPath)) return;

    const info = fs.readFileSync(this.dbPath, { encoding: "utf8" });

    const data = JSON.parse(info);

    this.historial = data.historial;
  }
}

export default Busquedas;
