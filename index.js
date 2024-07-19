import dotenv from "dotenv";
import Busquedas from "./models/busquedas.js";
import {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
} from "./helpers/inquirer.js";

dotenv.config();

const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        // mostar mensaje
        const termino = await leerInput("Ciudad: ");
        const lugares = await busquedas.ciudad(termino);
        const id = await listarLugares(lugares);
        if (id === "0") continue;

        const lugarSel = lugares.find((l) => l.id === id);
        //Guardar en DB
        busquedas.agregarHisotiral(lugarSel.nombre);

        const clima = await busquedas.climaCiudad(lugarSel.lat, lugarSel.lng);
        console.log(clima);

        // buscar los lugares

        // seleccionar el lugar

        // datos regresados del clima

        // mostrar los resultados

        console.log("Informacion de la ciudad\n".blue);
        console.log("Ciudad:", lugarSel.nombre);
        console.log("Lat:", lugarSel.lat);
        console.log("Long:", lugarSel.lng);
        console.log("Temperatura:", clima.temp);
        console.log("Minima:", clima.min);
        console.log("Maxima:", clima.max);
        console.log("Como esta el clima:", clima.desc);
        break;
      case 2:
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx}. ${lugar}`);
        });
        break;
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
