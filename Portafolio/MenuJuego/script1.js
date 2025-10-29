//////////////////////// LÓGICA DE MENÚ OPCIONES ////////////////////////

function inicializarMenuOpciones(playerName) {
  const botones = document.querySelectorAll("#Opciones .EditOpciones");
  const claves = ["nuevaPartida", "perfil", "inventario", "opciones"];

  const contenidoModales2 = {
    nuevaPartida: `
  <h3>Elige tu Destino</h3>
  <p>Selecciona entre los valientes Héroes o los temidos Villanos para comenzar tu travesía.</p>

<div class="selector-personaje">

  <a href="../Personajes/Heroes/index.html" class="personajes heroes">
    <h4>HÉROES</h4>
    <img src="img/Heroes.png" alt="Héroes del Reino">
  </a>

  <a href="../Personajes/Villanos/index.html" class="personajes villanos">
    <h4>VILLANOS</h4>
    <img src="img/Villanos.png" alt="Villanos del Abismo">
  </a>

</div>


`
    ,

    perfil: `
<div class="perfil-container">
  <div class="perfil-panel">

    <!-- EQUIPO -->
    <div class="perfil-equipo">
      <div class="slot">
        <h4>RANGED</h4>
        <div class="OrdenArmas">
        <div class="item"><span>Lv 23</span><img src="img/Flechas1.png"><p>QLT 58</p></div>
        <div class="item"><span>Lv 22</span><img src="img/Bara1.png"><p>QLT 56</p></div>
        </div>
        
      </div>

      <div class="perfil-personaje">
        <img src="img/Perfil.png" class="perfil-guerrero">
        <div class="nivel">LVL 25</div>
      </div>

      <div class="slot">
        <h4>MELEE</h4>
        <div class="OrdenArmas">
        <div class="item"><span>Lv 23</span><img src="img/Espada1.png"><p>QLT 58</p></div>
        <div class="item"><span>Lv 18</span><img src="img/Martillo1.png"><p>QLT 49</p></div></div>
      </div>
    </div>

    <!-- INFO -->
    <div class="perfil-info">
      <h3>DRAGÓN #429</h3>

      <div class="stats-grid">
        <div class="stat">
          <label>⚔️ Ataque</label>
          <div class="bar-container"><div class="bar-fill" style="width: 82%;"></div></div>
          <small>338</small>
        </div>

        <div class="stat">
          <label>🛡️ Defensa</label>
          <div class="bar-container"><div class="bar-fill" style="width: 64%;"></div></div>
          <small>163</small>
        </div>

        <div class="stat">
          <label>❤️ Salud</label>
          <div class="bar-container"><div class="bar-fill" style="width: 95%; background: linear-gradient(90deg, #ff3c3c, #ff8888);"></div></div>
          <small>1656</small>
        </div>

        <div class="stat">
          <label>⚡ Energía</label>
          <div class="bar-container"><div class="bar-fill" style="width: 74%; background: linear-gradient(90deg, #00f2ff, #5effa1);"></div></div>
          <small>92</small>
        </div>
      </div>

      <div class="xp-bar" style="margin-top:1rem;">
        <span>Experiencia</span>
        <div class="xp-container"><div class="xp-fill" style="width: 52%;"></div></div>
        <small>4,910 / 9,400 XP</small>
      </div>
    </div>
  </div>
</div>

    `,

    inventario: `
<section class="inventario">
  <h1 class="titulo">INVENTARIO</h1>
  <p class="subtitulo">Runas legendarias y reliquias de poder ancestral.</p>

  <div class="contenedor">

    <!-- ACHARN -->
    <div class="bloque acharn">
      <h2>⚔️ ACHARN – Dagas</h2>
      <div class="grid">
        <div class="carta"><img src="img/Iconos/Dagas1.webp" alt=""><span>Fell Voices</span></div>
        <div class="carta"><img src="img/Iconos/Dagas2.webp" alt=""><span>Oathbreaker</span></div>
        <div class="carta"><img src="img/Iconos/Dagas3.webp" alt=""><span>Favor of the Lady</span></div>
        <div class="carta"><img src="img/Iconos/Dagas4.webp" alt=""><span>Bare as Bones</span></div>
        <div class="carta"><img src="img/Iconos/Dagas5.webp" alt=""><span>Rule Through Fear</span></div>
        <div class="carta"><img src="img/Iconos/Dagas6.webp" alt=""><span>Choking Horror</span></div>
        <div class="carta"><img src="img/Iconos/Dagas7.webp" alt=""><span>Lure of Power</span></div>
        <div class="carta"><img src="img/Iconos/Dagas8.webp" alt=""><span>Worm’s Tooth</span></div>
        <div class="carta"><img src="img/Iconos/Dagas9.webp" alt=""><span>Reckless Hate</span></div>
        <div class="carta"><img src="img/Iconos/Dagas10.webp" alt=""><span>Balefire</span></div>
      </div>
    </div>

    <!-- AZKÂR -->
    <div class="bloque azkar">
      <h2>🏹 AZKÂR – Arco</h2>
      <div class="grid">
        <div class="carta"><img src="img/Iconos/Arco1.webp" alt=""><span>Bow Master</span></div>
        <div class="carta"><img src="img/Iconos/Arco2.webp" alt=""><span>Stand Fast</span></div>
        <div class="carta"><img src="img/Iconos/Arco3.webp" alt=""><span>Wrath of the Eldar</span></div>
        <div class="carta"><img src="img/Iconos/Arco4.webp" alt=""><span>Sylvan Arrow</span></div>
        <div class="carta"><img src="img/Iconos/Arco5.webp" alt=""><span>Knight of Eregion</span></div>
        <div class="carta"><img src="img/Iconos/Arco6.webp" alt=""><span>Howling Storm</span></div>
        <div class="carta"><img src="img/Iconos/Arco7.webp" alt=""><span>Fire Storm</span></div>
        <div class="carta"><img src="img/Iconos/Arco8.webp" alt=""><span>Ascendant</span></div>
        <div class="carta"><img src="img/Iconos/Arco9.webp" alt=""><span>Will of the West</span></div>
        <div class="carta"><img src="img/Iconos/Arco10.webp" alt=""><span>Unbreakable Bond</span></div>
      </div>
    </div>

    <!-- URFAEL -->
    <div class="bloque urfael">
      <h2>🗡️ URFAEL – Espada</h2>
      <div class="grid">
        <div class="carta"><img src="img/Iconos/Espada1.webp" alt=""><span>Stand and Fight</span></div>
        <div class="carta"><img src="img/Iconos/Espada2.webp" alt=""><span>Blade Master</span></div>
        <div class="carta"><img src="img/Iconos/Espada3.webp" alt=""><span>The Undying</span></div>
        <div class="carta"><img src="img/Iconos/Espada4.webp" alt=""><span>Blade of Gondolin</span></div>
        <div class="carta"><img src="img/Iconos/Espada5.webp" alt=""><span>Evenstar</span></div>
        <div class="carta"><img src="img/Iconos/Espada6.webp" alt=""><span>Storm of Battle</span></div>
        <div class="carta"><img src="img/Iconos/Espada7.webp" alt=""><span>Ruination</span></div>
        <div class="carta"><img src="img/Iconos/Espada8.webp" alt=""><span>Elven Grace</span></div>
        <div class="carta"><img src="img/Iconos/Espada9.webp" alt=""><span>Life for Death</span></div>
        <div class="carta"><img src="img/Iconos/Espada10.webp" alt=""><span>For Vengeance</span></div>
      </div>
    </div>

    <!-- EXCLUSIVAS Y LORD OF THE HUNT -->
    <div class="bloque exclusivas">
      <h2>🐺 EXCLUSIVAS Y LORD OF THE HUNT</h2>
      <div class="grid">
        <div class="carta"><img src="img/Iconos/Exclusivas1.webp" alt=""><span>Defiant to the End</span></div>
        <div class="carta"><img src="img/Iconos/Exclusivas2.webp" alt=""><span>Flame of Anor</span></div>
        <div class="carta"><img src="img/Iconos/Exclusivas3.webp" alt=""><span>Orc Slayer</span></div>
        <div class="carta"><img src="img/Iconos/Exclusivas4.webp" alt=""><span>Gravewalker</span></div>
        <div class="carta"><img src="img/Iconos/Exclusivas5.webp" alt=""><span>Stinging Blade</span></div>
        <div class="carta"><img src="img/Iconos/Exclusivas6.webp" alt=""><span>Orc Hunter</span></div>
        <div class="carta"><img src="img/Iconos/Exclusivas7.webp" alt=""><span>Burning Blood</span></div>
        <div class="carta"><img src="img/Iconos/Exclusivas8.webp" alt=""><span>Consuming</span></div>
        <div class="carta"><img src="img/Iconos/Exclusivas9.webp" alt=""><span>Gorging</span></div>
        <div class="carta"><img src="img/Iconos/Exclusivas10.webp" alt=""><span>Renewed Dominion</span></div>
      </div>
    </div>

  </div>
</section>



`,

    opciones: `
<div class="OpOpOpciones">
<h3>Opciones del Juego</h3>
      <div class="opciones-config">
        <label for="volumen">Volumen General</label>
        <input type="range" id="volumen" min="0" max="100" value="80">
        
        <label for="musica">Música</label>
        <input type="range" id="musica" min="0" max="100" value="70">

        <label for="fx">Efectos de Sonido</label>
        <input type="range" id="fx" min="0" max="100" value="60">

        <label for="dificultad">Dificultad</label>
        <select id="dificultad">
          <option value="facil">Fácil</option>
          <option value="normal" selected>Normal</option>
          <option value="dificil">Difícil</option>
          <option value="pesadilla">Pesadilla</option>
        </select>
      </div>
<button class="Config-Gaurdar" onclick="guardarConfiguracion()">Guardar Configuración</button>

</div>
    `
  };

  botones.forEach((btn, i) => {
    const key = claves[i];
    if (!key) return;

    btn.addEventListener("click", () => {
      const html = contenidoModales2[key];
      if (html) {
        const modal2 = document.getElementById('modalEvento2');
        const modalBody2 = document.getElementById('modalBody2');
        const volverBtn2 = document.getElementById('volverBtn2');

        modalBody2.innerHTML = html;
        modal2.classList.add('active');
        modal2.setAttribute('aria-hidden', 'false');
        volverBtn2.focus();

        volverBtn2.onclick = () => {
          modal2.classList.remove('active');
          modal2.setAttribute('aria-hidden', 'true');
        };

        // Si es el modal de opciones, cargar y aplicar configuración
        if (key === "opciones") {
          setTimeout(() => {
            cargarConfiguracion();

            const bgMusic = document.getElementById("bg-music");
            const musicaSlider = document.getElementById("musica");
            if (bgMusic && musicaSlider) {
              musicaSlider.addEventListener("input", () => {
                bgMusic.volume = musicaSlider.value / 100;
              });
            }

          }, 100);
        }
      }
    });
  });
}

window.inicializarMenuOpciones = inicializarMenuOpciones;




//////////////////////// GUARDAR Y APLICAR CONFIGURACIÓN ////////////////////////
const configuracionPorDefecto = {
  volumenGeneral: 80,
  volumenMusica: 70,
  volumenFx: 60,
  dificultad: "normal"
};

function cargarConfiguracion() {
  const guardado = localStorage.getItem("configJuego");
  const config = guardado ? JSON.parse(guardado) : configuracionPorDefecto;

  // Aplicar valores al DOM si existen inputs
  if (document.getElementById("volumen")) {
    document.getElementById("volumen").value = config.volumenGeneral;
    document.getElementById("musica").value = config.volumenMusica;
    document.getElementById("fx").value = config.volumenFx;
    document.getElementById("dificultad").value = config.dificultad;
  }

  const bgMusic = document.getElementById('bg-music');
  if (bgMusic) {
    bgMusic.volume = config.volumenMusica / 100;
  }

  // Guardar en window para acceso global
  window.configJuego = config;
}

function guardarConfiguracion() {
  const config = {
    volumenGeneral: parseInt(document.getElementById("volumen").value),
    volumenMusica: parseInt(document.getElementById("musica").value),
    volumenFx: parseInt(document.getElementById("fx").value),
    dificultad: document.getElementById("dificultad").value
  };

  localStorage.setItem("configJuego", JSON.stringify(config));
  window.configJuego = config;

  const bgMusic = document.getElementById("bg-music");
  if (bgMusic) {
    bgMusic.volume = config.volumenMusica / 100;
  }

  alert("Configuración guardada correctamente.");
}




//////////////////////// VOLVER DESDE PERSONAJES ////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  const volverModal = localStorage.getItem("volverModal");

  if (volverModal === "nuevaPartida") {
    setTimeout(() => {
      const btnNuevaPartida = document.querySelector("#Opciones .EditOpciones:nth-child(1)");

      if (btnNuevaPartida) {
        btnNuevaPartida.click(); 
      }
      localStorage.removeItem("volverModal");
    }, 500);
  }
});

