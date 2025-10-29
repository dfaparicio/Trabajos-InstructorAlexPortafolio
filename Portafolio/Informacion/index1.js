document.addEventListener("DOMContentLoaded", async () => {
  const id = parseInt(new URLSearchParams(location.search).get("id"));


  const localData = localStorage.getItem("LugaresData");
  const lugares = localData
    ? JSON.parse(localData)
    : (await axios.get("../Informacion/lugares.json")).data;

  const lugar = lugares.find(t => t.id === id);

  document.body.style.background=`radial-gradient(${lugar.categoria.colorPrimario}, ${lugar.categoria.colorSecundario})`

  document.getElementById("ContenedorGeneral").innerHTML = `


  <div class="Encabezado">

  <div class="NombreT"><h1 style="color: ${lugar.categoria.colorSecundario};">${lugar.nombre}</h1></div>
  
  <div class="Imagen"><img src="${lugar.url_imagen}" alt="${lugar.nombre}"></div>

  </div>

    <div class="TodaInformacion" >

    <div class="DatosBasicos">
      <h1 style="color: ${lugar.categoria.colorSecundario};">Datos Básicos</h1>
      <h3>Pais: ${lugar.pais}</h3>
      <h4>Ciudad: ${lugar.ciudad}</h4>
      <h5>Descripcion: ${lugar.descripcion}</h5>
    </div>

    <div class="Ubicacion">
      <h1 style="color: ${lugar.categoria.colorSecundario};">Coordenadas</h1>
      <p>Latitud: ${lugar.coordenadas.latitud}</p>
      <p>Longitud: ${lugar.coordenadas.longitud}</p>
    </div>

    <div class="DatosInteresantes">
      <h1 style="color: ${lugar.categoria.colorSecundario};">Datos Interesantes</h1>
      <ul>
        <li>${lugar.datosInteresantes[0].titulo}: ${lugar.datosInteresantes[0].valor}</li>
        <li>${lugar.datosInteresantes[1].titulo}: ${lugar.datosInteresantes[1].valor}</li>
        <li>${lugar.datosInteresantes[2].titulo}: ${lugar.datosInteresantes[2].valor}</li>
      </ul>
    </div>

    <div class="ActividadesRecomendadas">
      <h1 style="color: ${lugar.categoria.colorSecundario};">Actividades Recomendadas</h1>
      <ul>
        <li>${lugar.actividadesRecomendadas[0]}</li>
        <li>${lugar.actividadesRecomendadas[1]}</li>
        <li>${lugar.actividadesRecomendadas[2]}</li>
      </ul>
    </div>

    <div class="Volver">
      <a href="../Lugares/index.html">← Volver</a>
    </div>

    </div>
  `;

});

