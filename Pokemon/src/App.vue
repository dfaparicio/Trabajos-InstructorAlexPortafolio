<template>
  <div class="contendorprincipal">
    <header class="encabezado">
      <div class="imagen"><img :src="Logo" alt="Logo" /></div>
      <div class="opciones">

        <div class="buscar">
          <input type="search" v-model="busqueda" @keyup.enter="buscarPokemon" placeholder="Ingresa nombre o ID" />
          <div class="lupa">
            <img :src="Lupa" alt="" @click="buscarPokemon">
          </div>
        </div>
      </div>
    </header>

    <main class="contenedor1">
      <div class="info1">
        <div class="pokemon">
          <h1>{{ nombre ? nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase() : '' }}</h1>
          <div class="pokemonimg"><img :src="imagenP" alt="" /></div>
          <div class="pokemini">


            <div v-for="(img, index) in extraimagenes" :key="index">
              <div class="pokeminiimg"><img :src="img" alt="Imagen Pokémon" /></div>
            </div>


          </div>

        </div>
        <div class="informacion">

          <h1>Información</h1>

          <div class="idtipo">

            <h1>#{{ id }}</h1>

            <div class="tipos">
              <div>
                <h2>Tipo</h2>
              </div>
              <div class="infotipos">
                <div v-for="(tipo, index) in tipos" :key="index">
                  <p>{{ tipo.type.name.toUpperCase() }}</p>
                </div>
              </div>
            </div>

          </div>

          <div class="altupeso">
            <div>
              <h2>Altura</h2>
              <p>{{ altura }} M</p>
            </div>
            <div>
              <h2>Peso</h2>
              <p>{{ peso }} kg</p>
            </div>
          </div>

          <div class="debilidades">
            <div>
              <h2>Debilidades</h2>
            </div>
            <div class="debi">
              <p>HOLA</p>
              <p>HOLA</p>
              <p>HOLA</p>
              <p>HOLA</p>
              <p>HOLA</p>
            </div>
          </div>

        </div>

        <div class="informacion1">

          <div class="movimientos">

            <div>
              <h1>Movimientos</h1>
            </div>

            <div class="infomovimiento">
              <div v-for="(mov, index) in detallesmovimientos.slice(0, 6)" :key="index">
                <h3>{{ mov.nombre.toUpperCase() }}</h3>
                <p>Poder: {{ mov.poder }}</p>
                <p>Precisión: {{ mov.precision }}</p>
                <p>Tipo: {{ mov.tipom }}</p>
              </div>
            </div>

          </div>

        </div>

      </div>

      <div class="informacion2">
        <h1>Estadisticas</h1>
        <div class="estadisticas">
          <div class="stat" v-for="(stat, index) in stats" :class="stat.name" :key="index">
            <div class="label"><span>{{ stat.label }}</span><span>{{ stat.value }} / {{ stat.max }}</span></div>
            <div class="bar">
              <div class="fill" :class="stat.name" :style="`--value: ${stat.value};`"></div>
            </div>
          </div>
        </div>


        <div>
          <div class="evolucion">
            <div class="evolucion">
              <div>
                <h1>Evolución</h1>
              </div>
              <div class="pokeevo">
                <div v-for="(evo, index) in resultadoevoluciones" :key="index">
                  <div class="logoevo">
                    <div class="imgevo">
                      <img :src="evo.image ? evo.image : imagenP" :alt="evo.name ? evo.name : nombre"
                        @error="e => e.target.src = imagenP" />
                      {{ evo.name ? evo.name.charAt(0).toUpperCase() + evo.name.slice(1).toLowerCase()
                        : nombre ? nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase() : 'Desconocida' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </main>

  </div>
</template>




<script setup>
import axios from "axios";
import { ref } from "vue";

import Logo from '@/assets/Logo.png'
import Lupa from '@/assets/Lupa.png'

const busqueda = ref('');
const id = ref('');
const nombre = ref('');
const imagenP = ref('');
const extraimagenes = ref([]);
const stats = ref([]);

const MAX_STATS = {
  hp: 255,
  attack: 190,
  defense: 230,
  special_attack: 194,
  special_defense: 230,
  speed: 200
};
const tipos = ref([]);
const altura = ref('');
const peso = ref('');
const movimientos = ref([]);
const detallesmovimientos = ref([]);
const resultadoevoluciones = ref([]);




async function buscarPokemon() {
  try {
    const informacion = await axios.get(`https://pokeapi.co/api/v2/pokemon/${busqueda.value.toLowerCase()}`);
    console.log(informacion);

    id.value = informacion.data.id;
    nombre.value = informacion.data.name;
    imagenP.value = informacion.data.sprites.other.home.front_default;
    altura.value = informacion.data.height / 10;
    peso.value = informacion.data.weight / 10;

    extraimagenes.value = [
      informacion.data.sprites.back_default,
      informacion.data.sprites.front_shiny,
      informacion.data.sprites.back_shiny,
    ].filter(img => img);

    stats.value = informacion.data.stats.map(stats => ({
      name: stats.stat.name.replace("special-", "sp"),
      label: stats.stat.name.toUpperCase(),
      value: stats.base_stat,
      max: MAX_STATS[stats.stat.name] || 255
    }));

    tipos.value = informacion.data.types || "Desconocido";
    movimientos.value = informacion.data.moves;

    const detalles = await Promise.all(
      movimientos.value.map(async (movimiento) => {
        const info = await axios.get(movimiento.move.url);
        const data = info.data;
        return {
          id: data.id,
          nombre: data.name,
          tipom: data.type?.name || "Desconocido",
          poder: data.power,
          precision: data.accuracy,
        };
      })
    );
    detallesmovimientos.value = detalles;



    const infoevolucion = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id.value || nombre.value.toLowerCase()}`);
    const url = infoevolucion.data.evolution_chain.url;
    const evolucion = await axios.get(url.trim());

    const nombresevo = [];
    let current = evolucion.data.chain;
    while (current) {
      nombresevo.push(current.species.name);
      current = current.evolves_to.length ? current.evolves_to[0] : null;
    }

    const resultadoevo = await Promise.all(
      nombresevo.map(async (name) => {
        try {
          const pokeRes = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
          return {
            name: name,
            image: pokeRes.data.sprites.other["official-artwork"].front_default || imagenP
          };
        } catch {
          return {
            name: name || nombre,
            image: imagenP
          };
        }
      })
    );

    resultadoevoluciones.value = resultadoevo;



  } catch (error) {
    console.error("Error en la consulta:", error);
  }
}

buscarPokemon();

</script>




<style>
@import url("https://fonts.cdnfonts.com/css/pokemon-solid");

/* ===================== GLOBAL ===================== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Pokemon Solid", sans-serif;
  letter-spacing: 2px;
  color: #ffffff;
}

html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  background-color: white;
}

#app,
.contenedorprincipal {
  width: 100%;
  max-width: 1920px;
  height: 100vh;
  overflow-y: auto;
  padding: 0;

  background-image: url('./assets/Fondo.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;

  position: relative;
}

#app::before,
.contenedorprincipal::before {
  content: "";
  position: absolute;
  inset: 0;

  background: linear-gradient(180deg,
      rgba(0, 0, 30, 0.8) 0%,
      rgba(0, 0, 0, 0.4) 40%,
      rgba(0, 0, 0, 0.8) 100%);

  pointer-events: none;
  z-index: 1;
}


#app>*,
.contenedorprincipal>* {
  position: relative;
  z-index: 2;
}



main {
  width: 100%;
  max-width: 1920px;
  height: auto;
  margin: 0 auto;
}

/* ===================== ENCABEZADO ===================== */
.encabezado {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px 40px 10px 40px;
  flex-wrap: wrap;
  gap: 1rem;
}

.imagen img {
  width: clamp(100px, 15vw, 100px);
  height: auto;
}

.opciones {
  display: flex;
  gap: clamp(0.5rem, 2vw, 1.5rem);
  align-items: center;
  flex-wrap: wrap;
}

.opciones a {
  text-decoration: none;
  cursor: pointer;
}

.buscar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.buscar input {
  text-align: center;
  width: clamp(150px, 25vw, 350px);
  height: 40px;
  cursor: pointer;
  padding: 0.5rem;


  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(12px) saturate(1.3);
  -webkit-backdrop-filter: blur(12px) saturate(1.3);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.12);


}

.buscar input::-ms-clear {
  display: none;
}

input::placeholder {
  color: rgb(255, 255, 255);
}


input[type="search"]:focus {
  outline: none;
  box-shadow: none;
}

.lupa {
  cursor: pointer;
  padding-left: 5px;
}

.lupa img {
  width: clamp(40px, 8vw, 70px);
  height: auto;
}

/* ===================== ESTRUCTURA ===================== */
main {
  overflow-y: hidden;
  box-sizing: border-box;
}

.contenedor1 {
  display: flex;
  justify-content: center;
  gap: 50px;
  padding: 0 20px 0 20px;
  box-shadow: none;
  background-color: none;
}

/* ===================== BLOQUE IZQUIERDO ===================== */
.info1 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(clamp(250px, 40vw, 500px), 1fr));
  width: 100%;
  gap: 30px;
}

.pokemon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  padding: 10px;


  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(12px) saturate(1.3);
  -webkit-backdrop-filter: blur(12px) saturate(1.3);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.12);
}

.pokemon h1 {
  padding-bottom: 30px;
}


/* ===================== IMAGEN PRINCIPAL ===================== */
.pokemonimg {
  display: flex;
  justify-content: center;
  align-items: center;
  width: clamp(140px, 25vw, 300px);
  height: clamp(140px, 25vw, 300px);
}

.pokemonimg img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 8px 15px rgba(1, 160, 253, 0.596));
  animation: float 4s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

/* ===================== IMAGENES SECUNDARIAS PEQUEÑAS ===================== */
.pokemini {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.pokeminiimg {
  max-width: clamp(100px, 30vw, 250px);
  max-height: clamp(100px, 30vw, 250px);
  object-fit: contain;
}

.pokeminiimg img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 8px 15px rgba(255, 255, 0, 0.2));
  animation: float 4s ease-in-out infinite;
}

/* ===================== BLOQUE IZQUIERDA INFORMACION ===================== */
.informacion {
  display: flex;
  flex-direction: column;
  gap: 30px;
  height: auto;
  padding: 20px;

  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(12px) saturate(1.3);
  -webkit-backdrop-filter: blur(12px) saturate(1.3);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.12);
}

.informacion h2 {
  padding-bottom: 10px;
}

.informacion p {
  text-align: left;
}


/* ===================== ID Y TIPO ===================== */
.idtipo {
  display: flex;
  justify-content: space-around;
}


/* ===================== TIPOS ===================== */
.tipos {
  display: flex;
  flex-direction: column;
}

.infotipos {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
}

/* ===================== ALTURA Y PESO ===================== */
.altupeso {
  display: flex;
  justify-content: space-around;
}

.altupeso p {
  text-align: center;
}


/* ===================== DEBILIDADES ===================== */
.debilidades {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.debi {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}


/* ===================== BLOQUE HORIZONTAL ===================== */
.informacion1 {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: auto;
  gap: 20px;
  box-sizing: border-box;
  grid-column: 1 / 3;
  padding: 20px;

  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(12px) saturate(1.3);
  -webkit-backdrop-filter: blur(12px) saturate(1.3);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.12);
}

/* ===================== MOVIMIENTOS ===================== */
.movimientos {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}


.infomovimiento {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.infomovimiento h3 {
  text-align: center;
  padding-bottom: 10px;
}

.infomovimiento p {
  text-align: left;
}


/* ===================== ESTADISTICAS ===================== */
.estadisticas {
  width: 100%;
  max-width: clamp(300px, 50vw, 600px);
  border-radius: 15px;
  padding: clamp(10px, 2vw, 20px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: clamp(10px, 1.5vw, 12px);
  color: #2a5298;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.label span:first-child {
  font-weight: bold;
}

.bar {
  background: #ffffff;
  border-radius: 8px;
  height: 12px;
  overflow: hidden;
  position: relative;
}

.fill {
  position: relative;
  height: 100%;
  border-radius: 5px;
  background: gray;
  width: 0;
  transition: width 0.5s ease;
  animation: fillBar 1s forwards;
  overflow: hidden;
}

@keyframes fillBar {
  to {
    width: var(--width-final);
  }
}

.fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  animation: shine 2s infinite;
  pointer-events: none;
}

@keyframes shine {
  0% {
    left: -50%;
  }

  50% {
    left: 100%;
  }

  100% {
    left: 100%;
  }
}

.hp .fill {
  --color-start: #ff3b3b;
  --color-end: #d90000;
  --max: 255;
  --width-final: min(calc((var(--value) / var(--max)) * 100%), 100%);
  background: linear-gradient(90deg, var(--color-start), var(--color-end));
  width: var(--width-final);
}

.attack .fill {
  --color-start: #ffa64d;
  --color-end: #ff6600;
  --max: 190;
  --width-final: min(calc((var(--value) / var(--max)) * 100%), 100%);
  background: linear-gradient(90deg, var(--color-start), var(--color-end));
  width: var(--width-final);
}

.defense .fill {
  --color-start: #6fa8ff;
  --color-end: #2b6dff;
  --max: 230;
  --width-final: min(calc((var(--value) / var(--max)) * 100%), 100%);
  background: linear-gradient(90deg, var(--color-start), var(--color-end));
  width: var(--width-final);
}

.spattack .fill {
  --color-start: #ff66a3;
  --color-end: #e60073;
  --max: 194;
  --width-final: min(calc((var(--value) / var(--max)) * 100%), 100%);
  background: linear-gradient(90deg, var(--color-start), var(--color-end));
  width: var(--width-final);
}

.spdefense .fill {
  --color-start: #8ae66b;
  --color-end: #4cb32f;
  --max: 230;
  --width-final: min(calc((var(--value) / var(--max)) * 100%), 100%);
  background: linear-gradient(90deg, var(--color-start), var(--color-end));
  width: var(--width-final);
}

.speed .fill {
  --color-start: #ffe066;
  --color-end: #ffb700;
  --max: 200;
  --width-final: min(calc((var(--value) / var(--max)) * 100%), 100%);
  background: linear-gradient(90deg, var(--color-start), var(--color-end));
  width: var(--width-final);
}




/* ===================== BLOQUE DERECHO ===================== */
.informacion2 {
  width: 100%;
  max-width: clamp(300px, 35vw, 450px);
  height: auto;
  padding: clamp(10px, 2vw, 40px);

  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(12px) saturate(1.3);
  -webkit-backdrop-filter: blur(12px) saturate(1.3);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.12);
}

/* ===================== EVOLUCION ===================== */
.evolucion {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
}

.pokeevo {
  display: flex;
}

.logoevo {
  max-width: clamp(50px, 10vw, 150px);
  max-height: clamp(50px, 10vw, 200px);
  object-fit: contain;
}

.logoevo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  padding: 0;
}

.imgevo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
</style>
