document.addEventListener("DOMContentLoaded", async()=>{
    let lugares = await axios.get("../Informacion/lugares.json")
    console.log(lugares);

    localStorage.setItem("LugaresData", JSON.stringify(lugares.data));
    
    
    let contenedor = document.getElementById("ContenedorDeLugares");
    let Divs = document.getElementById("Lugar");

    Divs.style.display = "none";

lugares.data.forEach((item, i) => {

    let copiaDivs = Divs.cloneNode(true);
    copiaDivs.style.display = "block";
    copiaDivs.classList.add("ClasLugar");

    copiaDivs.id = `Lugar${i}`;
    detalleId = i;

    copiaDivs.querySelector("#Nombre h1").textContent = item.nombre;
    copiaDivs.querySelector("#Pais h2").textContent = item.pais;
    copiaDivs.querySelector("#Ciudad h3").textContent = item.ciudad;
    copiaDivs.querySelector("#Imagen img").src = item.url_imagen;
    copiaDivs.querySelector("#Ver a").href =`../Informacion/index1.html?id=${item.id}`;

    copiaDivs.querySelector("#Nombre div h1").style=`${lugar.categoria.colorPrimario}`;
    

    contenedor.appendChild(copiaDivs);
    
});

activeIndex = Math.floor(lugares.data.length / 2);  
updateCarrusel();

});




// Efecto transicion 

let activeIndex = 0;

function updateCarrusel() {
  const Lugares = document.querySelectorAll(".ClasLugar");

  Lugares.forEach((div, i) => {
    const offset = i - activeIndex;  // Cuanto se mueve del centro
    const translateX = offset * 260; // Horizontal 
    const rotateY = offset * 1; // Gira en su eje 
    const scale = 0.8 - Math.abs(offset) * 0.10; // la escala de más lejos a pequeño

    // Aploca las transfomraciones de cada una

    div.style.transform = `
      translateX(${translateX}px)
      scale(${scale})
      rotateY(${rotateY}deg)
    `;
    div.style.zIndex = 150 - Math.abs(offset); //La tarjeta mas cercana al centro
    div.style.opacity = Math.abs(offset) > 3 ? 0 : 1; // Oculta las que estan mas lejos
  });
}



// Botones
// Aumenta el activeIndex pero no mas allá del iltimo

document.getElementById("BotonDerecha").addEventListener("click", () => {
  const Lugares = document.querySelectorAll(".ClasLugar");
  activeIndex = Math.min(Lugares.length - 1, activeIndex + 1);
  updateCarrusel();
});

document.getElementById("BotonIzquierda").addEventListener("click", () => {
  const Lugares = document.querySelectorAll(".ClasLugar");
  activeIndex = Math.max(1, activeIndex - 1);
  updateCarrusel();
});



