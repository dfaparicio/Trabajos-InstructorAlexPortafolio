//////////////////////// ELEMENTOS DOM ////////////////////////
const introContainer = document.getElementById('intro-container');
const usernameInput = document.getElementById('username');
const diceBtn = document.getElementById('dice-btn');
const acceptBtn = document.getElementById('accept-btn');
const warningText = document.getElementById('warning-text');

const bienvenida = document.getElementById('bienvenida');
const introVideo = document.getElementById('intro-video');
const skipText = document.getElementById('skip-text');

const portada = document.querySelector('.Portada');
const contenedor = document.getElementById('Informacion');
const bgMusic = document.getElementById('bg-music');

let playerName = "";

//////////////////////// VERIFICAR SI YA HAY USUARIO ////////////////////////
window.addEventListener('DOMContentLoaded', () => {
  const storedName = localStorage.getItem('playerName');
  const introVisto = localStorage.getItem('introVisto') === 'true';

  if (storedName && storedName.trim() !== "") {
    playerName = storedName;

    if (introVisto) {
      // Si ya se vio la intro, ir directo al menú
      introContainer.style.display = 'none';
      showPortada();
    } else {
      // Mostrar bienvenida + video intro
      introContainer.style.display = 'none';
      bienvenida.style.display = 'flex';

      setTimeout(() => {
        bienvenida.style.display = 'none';
        introVideo.style.display = 'block';
        skipText.style.display = 'block';
        introVideo.play();
      }, 5000);
    }
  } else {
    // No hay nombre guardado, pedirlo
    introContainer.style.display = 'flex';
  }
});


//////////////////////// CLICK ACEPTAR ////////////////////////
acceptBtn.addEventListener('click', () => {
  playerName = usernameInput.value.trim();

  if (playerName === "") {
    warningText.style.display = 'block';
    return;
  }

  warningText.style.display = 'none';

  // Guardar nombre en localStorage
  localStorage.setItem('playerName', playerName);

  // Ocultar intro e iniciar
  introContainer.style.display = 'none';
  bienvenida.style.display = 'flex';

  setTimeout(() => {
    bienvenida.style.display = 'none';
    introVideo.style.display = 'block';
    skipText.style.display = 'block';
    introVideo.play();
  }, 5000);
});

//////////////////////// TERMINA VIDEO INTRO ////////////////////////
introVideo.addEventListener('ended', () => {
  showPortada();
});

//////////////////////// SKIP INTRO ////////////////////////
skipText.addEventListener('click', () => {
  introVideo.pause();
  showPortada();
});

//////////////////////// MOSTRAR PORTADA FINAL ////////////////////////
function showPortada() {
  localStorage.setItem('introVisto', 'true');
  
  introVideo.style.display = 'none';
  skipText.style.display = 'none';
  portada.style.display = 'flex';

  contenedor.innerHTML = `
    <div id="Logo">
      <img src="img/Logo.png" alt="Logo del juego">
    </div>

    <div id="Opciones" aria-label="Menú principal">
      <button class="EditOpciones">INICIAR NUEVA PARTIDA</button>
      <button class="EditOpciones">PERFIL 🛡️ ${playerName}</button>
      <button class="EditOpciones">INVENTARIO</button>
      <button class="EditOpciones">OPCIONES</button>

      <!-- BLOQUE: Evento / noticia dentro de Opciones -->
      <div id="eventoRotativo" class="EditOpciones" role="button" tabindex="0" aria-live="polite" aria-label="Evento destacado">
        <div class="evento-media">
          <img id="eventoImagen" src="" alt="Evento destacado">
        </div>
        <div class="eventoTexto">
          <h3 id="eventoTitulo"></h3>
          <p id="eventoDescripcion"></p>
          <div class="evento-icons" aria-hidden="true">
            <span class="icon" title="Mapa"><img src="img/mapa.png" alt="Mapa"></span>
            <span class="icon" title="Castillo"><img src="img/castillo.png" alt="Castillo"></span>
            <span class="icon" title="Experiencia"><img src="img/xp.png" alt="Experiencia"></span>
            <span class="icon" title="Espadas"><img src="img/espadas.png" alt="Espadas"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalle -->
    <div id="modalEvento" class="modal hidden" role="dialog" aria-modal="true" aria-hidden="true">
      <div class="modal-content">
        <img id="modalImagen" src="" alt="Imagen del evento">
        <h3 id="modalTitulo"></h3>
        <p id="modalDescripcion"></p>
        <button id="volverBtn" class="volver-btn">Volver</button>
      </div>
    </div>
  `;

  //////////////////////// EVENTOS RPG ////////////////////////
  const imagenesRPG = [
    {
      nombre: "1.jpg",
      descripcion: "Fortaleza helada sitiada por hordas enemigas; una vista épica desde las murallas mientras guerreros se preparan para la batalla."
    },
    {
      nombre: "2.jpg",
      descripcion: "Combate feroz contra orcos y monstruos mientras un guerrero monta un dragón que escupe fuego en pleno asalto."
    },
    {
      nombre: "3.jpg",
      descripcion: "Un gigantesco monstruo de aspecto demoníaco lidera a bestias salvajes en un terreno montañoso y sombrío."
    },
    {
      nombre: "4.jpg",
      descripcion: "Héroe infunde su poder místico sobre un orco enemigo, absorbiendo su esencia o dominando su voluntad."
    },
    {
      nombre: "5.jpg",
      descripcion: "Guerrero y su espíritu espectral combaten juntos contra una multitud de enemigos en un estrecho pasillo de piedra."
    },
    {
      nombre: "6.jpg",
      descripcion: "Escena de batalla en un campamento orco; un guerrero se enfrenta a un salto sorpresivo de un enemigo armado."
    }
  ];

  //////////////////////// ELEMENTOS DEL EVENTO ////////////////////////
  const eventoRotativo = document.getElementById('eventoRotativo');
  const eventoImagen = document.getElementById('eventoImagen');
  const eventoTitulo = document.getElementById('eventoTitulo');
  const eventoDescripcion = document.getElementById('eventoDescripcion');

  //////////////////////// MODAL ////////////////////////
  const modal = document.getElementById('modalEvento');
  const modalImagen = document.getElementById('modalImagen');
  const modalTitulo = document.getElementById('modalTitulo');
  const modalDescripcion = document.getElementById('modalDescripcion');
  const volverBtn = document.getElementById('volverBtn');

  let indice = 0;
  let intervaloId = null;
  let pausado = false;

  function cargarEvento(i, doAnimate = true) {
    const evento = imagenesRPG[i];
    eventoImagen.src = `img/${evento.nombre}`;
    eventoImagen.alt = `Evento ${i + 1}`;
    eventoTitulo.textContent = `Evento ${i + 1}`;
    eventoDescripcion.textContent = evento.descripcion;

    if (doAnimate) {
      eventoRotativo.classList.remove('fade');
      void eventoRotativo.offsetWidth;
      eventoRotativo.classList.add('fade');
    }
  }

  function siguienteEvento() {
    indice = (indice + 1) % imagenesRPG.length;
    cargarEvento(indice);
  }

  // Primera carga
  cargarEvento(indice, false);

  // Inicia rotación automática
  function iniciarRotacion() {
    if (intervaloId) clearInterval(intervaloId);
    intervaloId = setInterval(() => {
      if (!pausado) siguienteEvento();
    }, 3000);
  }
  iniciarRotacion();

  // Pausa en hover / focus
  eventoRotativo.addEventListener('mouseenter', () => { pausado = true; });
  eventoRotativo.addEventListener('mouseleave', () => { pausado = false; });
  eventoRotativo.addEventListener('focus', () => { pausado = true; });
  eventoRotativo.addEventListener('blur', () => { pausado = false; });

  // Abrir modal
  function abrirModal() {
    const evento = imagenesRPG[indice];
    modalImagen.src = `img/${evento.nombre}`;
    modalImagen.alt = `Detalle evento ${indice + 1}`;
    modalTitulo.textContent = `Evento ${indice + 1}`;
    modalDescripcion.textContent = evento.descripcion + " — Más información y recompensas disponibles.";
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    volverBtn.focus();
    pausado = true;
  }

  // Cerrar modal
  function cerrarModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    volverBtn.blur();
    document.activeElement.blur();
    pausado = false;
  }

  eventoRotativo.addEventListener('click', abrirModal);
  eventoRotativo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      abrirModal();
    }
  });
  volverBtn.addEventListener('click', cerrarModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) cerrarModal();
  });

  // Reproducir música
  bgMusic.play().catch(() => {
    console.log("El navegador requiere interacción para iniciar la música.");
  });

  inicializarMenuOpciones(playerName);
}

//////////////////////// NOMBRES ALEATORIOS ////////////////////////
const posiblesNombres = ["Guerrero", "Orco", "Paladín", "Mago", "Elfo", "Dragón", "Sombrío", "Caballero"];
diceBtn.addEventListener('click', () => {
  const randomBase = posiblesNombres[Math.floor(Math.random() * posiblesNombres.length)];
  const randomNum = Math.floor(Math.random() * 1000);
  usernameInput.value = `${randomBase}#${randomNum}`;
});
