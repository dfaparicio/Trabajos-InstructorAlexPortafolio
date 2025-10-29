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
                <div v-for="(tipo, index) in tipos" :key="index" :class="['type', `type-${tipo.type.name}`]">
                  <p>{{ tipo.type.name.toUpperCase() }}</p>
                </div>
              </div>
            </div>

          </div>

          <div class="altupeso">

            <div class="altura">
              <div>
                <h2>Altura</h2>
              </div>
              <div>
                <p>{{ altura }} M</p>
              </div>
            </div>

            <div class="peso">
              <div>
                <h2>Peso</h2>
              </div>
              <div>
                <p>{{ peso }}  M</p>
              </div>
            </div>

          </div>

          <div class="debilidades">
            <div>
              <h2>Debilidades</h2>
            </div>
            <div class="infodebil">
              <div class="infodebilidad" v-for="(deb, index) in debilidades" :key="index">
                <p v-for="(debilidad, index) in deb.debilidades" :key="index" :class="['type', `type-${debilidad}`]">
                  {{ debilidad.toUpperCase() }}
                </p>
              </div>
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
import Logo from "./assets/Logo.png";
import Lupa from "./assets/Lupa.png";


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
const debilidades = ref([]);


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

    tipos.value = informacion.data.types || [];

    const detallesdebil = await Promise.all(
      tipos.value.map(async (tipo) => {
        const jsontipo = await axios.get(tipo.type.url);
        const data = jsontipo.data;
        return {
          debilidades: data.damage_relations?.double_damage_from?.map(d => d.name) || []
        }
      })
    )
    debilidades.value = detallesdebil;


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
            name,
            image: pokeRes.data.sprites.other["official-artwork"].front_default || imagenP,
          };
        } catch {
          console.warn(`No se encontró información para ${name}`);
          return {
            name,
            image: imagenP,
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
  overflow-x: hidden;
  background-color: white;
  margin: 0;
  padding: 0;
}

/* ---------- CONTENEDOR PRINCIPAL ---------- */
#app,
.contenedorprincipal {
  width: 100%;
  max-width: 1920px;
  height: 100vh;
  overflow-y: auto;
  background-image: url('./assets/Fondo.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  padding: 0;
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

/* ---------- ENCABEZADO ---------- */
.encabezado {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  padding: 20px 40px 10px 40px;
}

.imagen img {
  width: clamp(100px, 15vw, 100px);
  height: auto;
}

.opciones {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(0.5rem, 2vw, 1.5rem);
}

.buscar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.buscar input {
  width: clamp(150px, 25vw, 350px);
  height: 40px;
  text-align: center;
  padding: 0.5rem;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(12px) saturate(1.3);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.12);
}

input::placeholder {
  color: #fff;
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

main {
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  overflow-y: hidden;
  box-sizing: border-box;
}

.contenedor1 {
  display: flex;
  justify-content: center;
  gap: 50px;
  padding: 0 20px;
}

/* ---------- BLOQUE IZQUIERDO---------- */
.info1 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(clamp(250px, 40vw, 500px), 1fr));
  gap: 30px;
  width: 100%;
}

/* ---------- DIV POKEMON ---------- */
.pokemon {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(12px) saturate(1.3);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.12);
}

.pokemon h1 {
  padding-bottom: 30px;
}

/* ---------- IMAGEN PRINCIPAL ---------- */
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
  filter: drop-shadow(0 8px 15px rgba(1, 160, 253, 0.6));
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

/* ---------- MINI IMAGINES ---------- */
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
}

.pokeminiimg img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 8px 15px rgba(255, 255, 0, 0.2));
  animation: float 4s ease-in-out infinite;
}

/* ---------- INFORMACION ---------- */
.informacion {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(12px) saturate(1.3);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.12);
}

.idtipo {
  display: flex;
  justify-content: space-around;
}

.tipos {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 30px;
}

.infotipos {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
}

/* ---------- ALTURA Y PESO---------- */
.altupeso {
  display: flex;
  justify-content: space-around;
}

.altupeso p {
  text-align: center;
}

.altura, .peso{
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}

.debilidades {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

.infodebil {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
}

.infodebilidad {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

/* ---------- Movimientos ---------- */
.informacion1 {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(12px) saturate(1.3);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.12);
  grid-column: 1 / 3;
}

.movimientos {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.infomovimiento {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
}

.infomovimiento h3 {
  text-align: center;
  padding-bottom: 10px;
}

.infomovimiento p {
  text-align: left;
}

/* ---------- BLOQUE DERECHO ---------- */
.informacion2 {
  width: 100%;
  max-width: clamp(300px, 35vw, 450px);
  padding: clamp(10px, 2vw, 40px);
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(12px) saturate(1.3);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.12);
}

/* ---------- Estadísticas ---------- */
.estadisticas {
  width: 100%;
  max-width: clamp(300px, 50vw, 600px);
  padding: clamp(10px, 2vw, 20px);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.label {
  display: flex;
  justify-content: space-between;
  font-size: clamp(10px, 1.5vw, 12px);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.bar {
  background: #fff;
  border-radius: 8px;
  height: 12px;
  overflow: hidden;
}

.fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.5s ease;
  position: relative;
  background: gray;
  width: 0;
  animation: fillBar 1s forwards;
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
}

@keyframes fillBar {
  to {
    width: var(--width-final);
  }
}

@keyframes shine {
  0% {
    left: -50%;
  }

  50%,
  100% {
    left: 100%;
  }
}

/* ---------- COLORES PARA CADA UNA DE LAS STAST ---------- */
.hp .fill {
  --color-start: #ff3b3b;
  --color-end: #d90000;
  --max: 255;
  --width-final: min(calc((var(--value)/var(--max))*100%), 100%);
  background: linear-gradient(90deg, var(--color-start), var(--color-end));
  width: var(--width-final);
}

.attack .fill {
  --color-start: #ffa64d;
  --color-end: #ff6600;
  --max: 190;
  --width-final: min(calc((var(--value)/var(--max))*100%), 100%);
  background: linear-gradient(90deg, var(--color-start), var(--color-end));
  width: var(--width-final);
}

.defense .fill {
  --color-start: #6fa8ff;
  --color-end: #2b6dff;
  --max: 230;
  --width-final: min(calc((var(--value)/var(--max))*100%), 100%);
  background: linear-gradient(90deg, var(--color-start), var(--color-end));
  width: var(--width-final);
}

.spattack .fill {
  --color-start: #ff66a3;
  --color-end: #e60073;
  --max: 194;
  --width-final: min(calc((var(--value)/var(--max))*100%), 100%);
  background: linear-gradient(90deg, var(--color-start), var(--color-end));
  width: var(--width-final);
}

.spdefense .fill {
  --color-start: #8ae66b;
  --color-end: #4cb32f;
  --max: 230;
  --width-final: min(calc((var(--value)/var(--max))*100%), 100%);
  background: linear-gradient(90deg, var(--color-start), var(--color-end));
  width: var(--width-final);
}

.speed .fill {
  --color-start: #ffe066;
  --color-end: #ffb700;
  --max: 200;
  --width-final: min(calc((var(--value)/var(--max))*100%), 100%);
  background: linear-gradient(90deg, var(--color-start), var(--color-end));
  width: var(--width-final);
}

/* ---------- Evolución ---------- */
.evolucion {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
}

.pokeevo {
  display: flex;
}

.logoevo {
  max-width: clamp(50px, 10vw, 150px);
  max-height: clamp(50px, 10vw, 200px);
}

.logoevo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.imgevo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}













/* ---------- COLORES PARA TIPOS Y ---------- */
.type {
  position: relative;
  display: inline-block;
  padding: 10px;
  border-radius: 20px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.3s;
}

.type::after {
  content: '';
  position: absolute;
  top: 0;
  left: -75%;
  width: 50%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transform: skewX(-25deg);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    left: -75%;
  }

  50% {
    left: 125%;
  }

  100% {
    left: 125%;
  }
}

.type:hover {
  transform: scale(1.08);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
}


.type-normal {
  background: linear-gradient(135deg, #A8A77A, #C6C4A1);
}

.type-fire {
  background: linear-gradient(135deg, #EE8130, #F5AF19);
}

.type-water {
  background: linear-gradient(135deg, #6390F0, #74c0fc);
}

.type-electric {
  background: linear-gradient(135deg, #F7D02C, #FFD43B);
}

.type-grass {
  background: linear-gradient(135deg, #7AC74C, #9bdc65);
}

.type-ice {
  background: linear-gradient(135deg, #96D9D6, #b8f1ee);
}

.type-fighting {
  background: linear-gradient(135deg, #C22E28, #E13C30);
}

.type-poison {
  background: linear-gradient(135deg, #A33EA1, #C76CD0);
}

.type-ground {
  background: linear-gradient(135deg, #E2BF65, #C99846);
}

.type-flying {
  background: linear-gradient(135deg, #A98FF3, #C6B7F5);
}

.type-psychic {
  background: linear-gradient(135deg, #F95587, #ff8ab6);
}

.type-bug {
  background: linear-gradient(135deg, #A6B91A, #c6da3c);
}

.type-rock {
  background: linear-gradient(135deg, #B6A136, #d6c04c);
}

.type-ghost {
  background: linear-gradient(135deg, #735797, #9f80c7);
}

.type-dragon {
  background: linear-gradient(135deg, #6F35FC, #8757ff);
}

.type-dark {
  background: linear-gradient(135deg, #705746, #8a6b5c);
}

.type-steel {
  background: linear-gradient(135deg, #B7B7CE, #D1D1E0);
}

.type-fairy {
  background: linear-gradient(135deg, #D685AD, #f0a8cc);
}
</style>
