const characters = [
  {
    img: "img/Villano1.png",
    nombre: "Veynar el Desgarrador",
    clase: "Caballero Abismal",
    raza: "Humano corrompido",
    edad: 47,
    reino: "Fortaleza de Ebonreach",
    alineacion: "Caótico Maligno",
    nivel: 72,
    armaFavorita: "Hoja del Abismo",
    historia:
      "Antaño un paladín de la Orden de la Llama Eterna, Veynar fue traicionado y dejado a morir en las ruinas de su fe. Su alma, consumida por la oscuridad, fue reclamada por las sombras del Abismo. Ahora, envuelto en un humo profano y armado con una espada forjada en relámpagos púrpura, comanda las legiones del vacío, buscando borrar toda luz que aún resista.",
    poderes: [
      { nombre: "Hoja del Abismo", icon: "img/Iconos/Espada3.webp" },
      { nombre: "Descarga Umbría", icon: "img/Iconos/Exclusivas4.webp" },
      { nombre: "Maldición Carmesí", icon: "img/Iconos/Espada6.webp" },
      { nombre: "Velo del Vacío", icon: "img/Iconos/Exclusivas8.webp" },
      { nombre: "Ruptura de la Luz", icon: "img/Iconos/Espada9.webp" },
    ],
    stats: {
      fuerza: 92,
      magia: 70,
      defensa: 83,
      velocidad: 58,
      corrupcion: 98,
      vitalidad: 85,
      mana: 55,
    },
  },
  {
    img: "img/Villano4.png",
    nombre: "Gorthar el Devorador",
    clase: "Engendro Primigenio",
    raza: "Abominación del Vacío",
    edad: "Incalculable",
    reino: "Fauces del Vacío",
    alineacion: "Pura Entropía",
    nivel: 85,
    armaFavorita: "Garras del Vacío",
    historia:
      "Forjado en las profundidades del Abismo, Gorthar no fue creado, sino exhalado por el propio caos. Su cuerpo, hecho de sombras líquidas y carne mutante, se retuerce con cada respiración. No conoce la piedad ni el razonamiento: solo la necesidad de devorar lo que respira. Donde camina, la realidad se fragmenta y la esperanza se marchita.",
    poderes: [
      { nombre: "Garras del Vacío", icon: "img/Iconos/Dagas7.webp" },
      { nombre: "Alarido de Pesadilla", icon: "img/Iconos/Arco4.webp" },
      { nombre: "Regeneración Profana", icon: "img/Iconos/Exclusivas9.webp" },
      { nombre: "Sangre Corruptora", icon: "img/Iconos/Dagas1.webp" },
      { nombre: "Oscuridad Viviente", icon: "img/Iconos/Espada10.webp" },
    ],
    stats: {
      fuerza: 97,
      magia: 45,
      defensa: 75,
      velocidad: 88,
      corrupcion: 100,
      vitalidad: 95,
      mana: 35,
    },
  },
  {
    img: "img/Villano3.png",
    nombre: "Tharion el Guardián Dorado",
    clase: "Sacerdote de la Luz Marchita",
    raza: "Humano consagrado",
    edad: 62,
    reino: "Santuario de Ardenthal",
    alineacion: "Legal Neutral",
    nivel: 78,
    armaFavorita: "Lanza Solar",
    historia:
      "Tharion fue un devoto guardián del antiguo templo de Ardenthal, jurando proteger la pureza de la Luz. Sin embargo, los siglos de guerra y corrupción le revelaron una verdad amarga: la luz también puede cegar. Ahora, envuelto en una fe distorsionada, utiliza su poder divino para imponer equilibrio a través del dominio y la purga.",
    poderes: [
      { nombre: "Lanza Solar", icon: "img/Iconos/Exclusivas1.webp" },
      { nombre: "Juicio del Fénix", icon: "img/Iconos/Exclusivas2.webp" },
      { nombre: "Pacto de la Fe", icon: "img/Iconos/Espada7.webp" },
      { nombre: "Escudo del Alba", icon: "img/Iconos/Dagas6.webp" },
      { nombre: "Luz Purificadora", icon: "img/Iconos/Exclusivas10.webp" },
    ],
    stats: {
      fuerza: 65,
      magia: 90,
      defensa: 80,
      velocidad: 55,
      corrupcion: 40,
      vitalidad: 75,
      mana: 95,
    },
  },
  {
    img: "img/Villano2.png",
    nombre: "Draegor el Rey del Abismo",
    clase: "Señor Oscuro",
    raza: "Humano corrompido",
    edad: "Desconocida",
    reino: "Trono de Nox’Arath",
    alineacion: "Caótico Maligno",
    nivel: 81,
    armaFavorita: "Espada del Eclipse",
    historia:
      "Antiguo monarca de un reino perdido, Draegor vendió su alma al vacío para desafiar a la muerte. Su armadura es una prisión de sombras y su espada canaliza el poder de los astros muertos. Donde pisa, la noche se alza y la esperanza se desvanece. Su ambición no es conquistar… sino extinguir toda luz que aún respire.",
    poderes: [
      { nombre: "Espada del Eclipse", icon: "img/Iconos/Espada2.webp" },
      { nombre: "Manto del Vacío", icon: "img/Iconos/Exclusivas7.webp" },
      { nombre: "Desgarro Estelar", icon: "img/Iconos/Espada8.webp" },
      { nombre: "Dominio Sombrío", icon: "img/Iconos/Dagas5.webp" },
      { nombre: "Juicio Nocturno", icon: "img/Iconos/Exclusivas3.webp" },
    ],
    stats: {
      fuerza: 95,
      magia: 85,
      defensa: 90,
      velocidad: 55,
      corrupcion: 100,
      vitalidad: 100,
      mana: 70,
    },
  },
  {
    img: "img/Villano5.png",
    nombre: "Grumak Rompecráneos",
    clase: "Señor de la Guerra Orco",
    raza: "Orco de las Montañas Negras",
    edad: 41,
    reino: "Bastión de Khar’Drum",
    alineacion: "Caótico Neutral",
    nivel: 76,
    armaFavorita: "Maza de Guerra",
    historia:
      "Forjado en los campos de sangre de Khar’Drum, Grumak ascendió como campeón tras aplastar a sus rivales con pura brutalidad. Su fuerza no proviene de la magia, sino del odio y la supervivencia. Se dice que cada golpe de su maza contiene el eco de los enemigos que ha destrozado. Su ambición es sencilla: destruir, conquistar y oír el crujir de los huesos bajo sus pies.",
    poderes: [
      { nombre: "Golpe Atronador", icon: "img/Iconos/Exclusivas6.webp" },
      { nombre: "Ira del Coloso", icon: "img/Iconos/Arco3.webp" },
      { nombre: "Embate Salvaje", icon: "img/Iconos/Exclusivas5.webp" },
      { nombre: "Rugido de Guerra", icon: "img/Iconos/Dagas2.webp" },
      { nombre: "Aplastamiento Brutal", icon: "img/Iconos/Espada5.webp" },
    ],
    stats: {
      fuerza: 100,
      magia: 25,
      defensa: 90,
      velocidad: 60,
      corrupcion: 65,
      vitalidad: 110,
      mana: 20,
    },
  },
];

const container = document.getElementById("scene");
const modal = document.getElementById("modalPersonaje");
const closeModal = document.getElementById("closeModal");

container.innerHTML = characters
  .map(
    (c, i) => `
  <div class="hero hero${i + 1}" tabindex="0" role="button" aria-label="${c.nombre}">
    <img src="${c.img}" alt="${c.nombre}">
    
    <!-- 🌟 Partículas épicas -->
<div class="particles">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <!-- Agrega más spans hasta llegar a 15 -->
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>

  </div>`
  )
  .join("");


const fixedX = window.innerWidth * 0.48;
const fixedY = window.innerHeight * 0.50;




document.querySelectorAll(".hero").forEach((hero, index) => {
  hero.addEventListener("click", () => {

    if (modal.classList.contains("show")) return;

    const char = characters[index];

    document.querySelectorAll(".hero").forEach((h) => {
      h.classList.remove("active-hero");
      if (h !== hero) h.classList.add("hide");
      else h.classList.remove("hide");
    });

    const rect = hero.getBoundingClientRect();
    const moveX = fixedX - (rect.left + rect.width / 2);
    const moveY = fixedY - (rect.top + rect.height / 2);

    gsap.to(hero, {
      duration: 2,
      ease: "power3.inOut",
      x: moveX,
      y: moveY,
      scale: 1.4,
      zIndex: 999999,
      onComplete: () => {
        hero.classList.add("active-hero");
        modal.classList.add("show");
      },
    });

    document.getElementById("charName").textContent = char.nombre;
    document.getElementById("charClass").textContent = char.clase;
    document.getElementById("charStory").textContent = char.historia;
    document.getElementById("charRace").textContent = char.raza;
    document.getElementById("charAge").textContent = char.edad;
    document.getElementById("charRealm").textContent = char.reino;
    document.getElementById("charAlign").textContent = char.alineacion;
    document.getElementById("charWeapon").textContent = char.armaFavorita;
    document.getElementById("charLevel").textContent = char.nivel;

    const setStat = (id, percentId, value) => {
      const bar = document.getElementById(id);
      const percent = document.getElementById(percentId);
      gsap.to(bar, {
        width: `${value}%`,
        duration: 1.4,
        ease: "power2.out",
      });
      let counter = { val: 0 };
      gsap.to(counter, {
        val: value,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => {
          percent.textContent = `${Math.round(counter.val)}%`;
        },
      });
    };

    const stats = char.stats;
    setStat("statStrength", "percentStrength", stats.fuerza);
    setStat("statMagic", "percentMagic", stats.magia);
    setStat("statDefense", "percentDefense", stats.defensa);
    setStat("statSpeed", "percentSpeed", stats.velocidad);
    setStat("statCorruption", "percentCorruption", stats.corrupcion);
    setStat("statVitality", "percentVitality", stats.vitalidad);
    setStat("statMana", "percentMana", stats.mana);

    const powersContainer = document.getElementById("charPowers");
    powersContainer.innerHTML = char.poderes
      .map(
        (p) =>
          `<img src="${p.icon}" alt="${p.nombre}" title="${p.nombre}" class="power-icon">`
      )
      .join("");

    gsap.fromTo(
      ".power-icon",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: "power2.out" }
    );
  });
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("show");

  document.querySelectorAll(".hero").forEach((h) => {
    h.classList.remove("hide", "active-hero");
    gsap.to(h, {
      duration: 2,
      ease: "power3.inOut",
      x: 0,
      y: 0,
      scale: 0.5,
      onComplete: () => gsap.set(h, { clearProps: "all" }),
    });
  });
});
