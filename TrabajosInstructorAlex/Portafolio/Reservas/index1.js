function getDatos() {
  return { reservas: JSON.parse(localStorage.getItem("ReservasData")) || [], mesas: JSON.parse(localStorage.getItem("mesas")) || [], };
}
console.log(getDatos());

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("Padre").innerHTML = `
<div class="Encabezado">
  <h1>Registro de Reservas</h1>
  <div class="Filtros mb-3">
    <div class="Fecha"><label for="filtroFecha"><strong>Filtrar por fecha:</strong></label><input type="date" id="filtroFecha" class="form-control"></div>
    <div class="filtroEstado">
      <label for="filtroEstado"><strong>Filtrar por estado:</strong></label>
      <select id="filtroEstado" class="form-control">
        <option value="">Todos</option>
        <option value="Pendiente">Pendiente</option>
        <option value="Confirmada">Confirmada</option>
        <option value="Cancelada">Cancelada</option>
        <option value="Finalizada">Finalizada</option>
        <option value="No Show">No Show</option>
      </select>
    </div>
    <div><button class="btn btn-secondary" onclick="limpiarFiltros()">Limpiar filtros</button></div>
    <div><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Realizar registro</button></div>
  </div>
</div>
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Nueva Reserva</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="ModalModal"style="display: flex; flex-direction: column; gap: 20px; padding: 10px; box-shadow: 2px 2px 2px 2px gray;">
          <label>ID Reserva:</label>
          <input type="number" id="reservaId" placeholder="ID de la reserva">
          <label>Nombre Cliente:</label>
          <input type="text" id="nombre" placeholder="Digite el nombre">
          <label>Número de Personas:</label>
          <input type="number" id="numeroPersonas" min="1" placeholder="Ingrese número de personas">
          <label>Fecha de Reserva:</label>
          <input type="date" id="fechaReserva">
          <label>Hora de Reserva:</label>
          <input type="time" id="horaReserva" min="08:00" max="20:00">
          <label>Mesa:</label>
          <select id="mesa">
            <option value="">Seleccione una mesa</option>
          </select>
          <label>Ocasión especial:</label>
          <select id="ocasion">
            <option value="">Seleccione una ocasión</option>
            <option value="Cumpleaños">Cumpleaños</option>
            <option value="Aniversario">Aniversario</option>
            <option value="Graduación">Graduación</option>
            <option value="Reunión familiar">Reunión familiar</option>
            <option value="Cena de negocios">Cena de negocios</option>
            <option value="Compromiso">Compromiso</option>
            <option value="Amigos">Amigos</option>
            <option value="Otro">Otro</option>
          </select>
          <label>Notas adicionales (opcional):</label>
          <textarea id="notasAdicionales" placeholder="Escriba alguna nota adicional..."></textarea>
          <label>Estado de la reserva:</label>
          <select id="estadoReserva">
            <option value="Pendiente">Pendiente</option>
            <option value="Confirmada">Confirmada</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Finalizada">Finalizada</option>
            <option value="No Show">No Show</option>
          </select>
        </div>
      </div>
      <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button><button type="button" class="btn btn-primary" onclick="guardar()">Guardar</button></div>
    </div>
  </div>
</div>
<div id="bodyData"></div>
<button type="button" class="btn btn-primary" onclick="window.location.href='../GestionDeMesas/index.html'">← Volver</button>
`;

  const params = new URLSearchParams(window.location.search);
  const abrirModal = params.get("abrirModal");
  const idMesa = params.get("id");
  
  pintarDatos();
  
  cargarMesasDisponibles(idMesa);

  if (abrirModal === "true") {
    const traerModal = document.getElementById("exampleModal");
    const modal = new bootstrap.Modal(traerModal);

    if (idMesa) {
      const selecMesa = document.getElementById("mesa");
      if (selecMesa) 
        selecMesa.value = idMesa;
    }
    modal.show();
  }
  document.getElementById("filtroFecha").addEventListener("change", pintarDatos);
  document.getElementById("filtroEstado").addEventListener("change", pintarDatos);
});

// Funcion Cargar
function cargarMesasDisponibles(mesaActual = null) {
  const datos = getDatos();
  const mesas = datos.mesas || [];
  const select = document.getElementById("mesa");
  if (!select) return;

  select.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Seleccione una mesa";
  select.appendChild(placeholder);

  mesas.forEach(m => {
    const opt = document.createElement("option");
    opt.value = String(m.id);
    opt.textContent = `Mesa #${m.numeroMesa} (${m.cantidadPersonas} personas)`;

    const estado = (m.estado || "").toLowerCase();
    const esMesaActual = String(m.id) === String(mesaActual);

    if ((estado === "ocupada" || estado === "deshabilitada") && !esMesaActual) {
      opt.disabled = true;
    }
    if (esMesaActual) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
}

// Funcion Gaurdar
function guardar() {
  let datos = getDatos();
  let reservas = datos.reservas;

  const nombre = document.getElementById("nombre").value.trim();
  const idReserva = document.getElementById("reservaId").value.trim();
  const numeroPersonas = parseInt(document.getElementById("numeroPersonas").value);
  const fechaReserva = document.getElementById("fechaReserva").value;
  const horaReserva = document.getElementById("horaReserva").value;
  const mesa = document.getElementById("mesa").value;
  const ocasion = document.getElementById("ocasion").value;
  const notasAdicionales = document.getElementById("notasAdicionales").value.trim();
  const estadoReserva = document.getElementById("estadoReserva").value;

  if (!idReserva) {
    Swal.fire({ icon: "error", title: "ID requerido", text: "Por favor ingresa un ID para la reserva.", });
    return;
  }
  const idExistente = reservas.find((r) => r.idReserva === idReserva);
  if (idExistente) {
    Swal.fire({ icon: "error", title: "ID duplicado", text: "Ya existe una reserva con este ID. Usa otro diferente.", });
    return;
  }
  if (!nombre) {
    Swal.fire({ icon: "error", title: "Nombre requerido", text: "Por favor ingresa el nombre del cliente.", });
    return;
  }
  if (!numeroPersonas || numeroPersonas <= 0) {
    Swal.fire({ icon: "error", title: "Número inválido", text: "El número de personas debe ser mayor que 0.", });
    return;
  }
  const hoy = new Date().toISOString().split("T")[0];
  if (!fechaReserva || fechaReserva <= hoy) {
    Swal.fire({ icon: "error", title: "Fecha inválida", text: "La fecha de la reserva debe ser mayor a hoy.", });
    return;
  }
  if (!horaReserva || horaReserva < "08:00" || horaReserva > "20:00") {
    Swal.fire({ icon: "error", title: "Hora fuera de rango", text: "La hora debe estar entre 08:00 y 20:00.", });
    return;
  }
  if (!mesa) {
    Swal.fire({ icon: "error", title: "Mesa requerida", text: "Selecciona una mesa disponible.", });
    return;
  }
  if (!ocasion) {
    Swal.fire({ icon: "error", title: "Ocasión requerida", text: "Selecciona una ocasión especial para la reserva.", });
    return;
  }

  let Reserva = parseInt(localStorage.getItem("ultimaReserva")) || 1;

  let nuevaReserva = {numeroReserva: Reserva, idReserva, nombre, numeroPersonas,
    fechaReserva, horaReserva, mesa, ocasion, notasAdicionales, estadoReserva,
  };

  reservas.push(nuevaReserva);

  localStorage.setItem("ReservasData", JSON.stringify(reservas));

  localStorage.setItem("ultimaReserva", Reserva + 1);

  let mesas = JSON.parse(localStorage.getItem("mesas")) || [];
  let indexMesa = mesas.findIndex((m) => String(m.id) === String(mesa));
  if (indexMesa !== -1) {
    mesas[indexMesa].estado = "Ocupada";
    localStorage.setItem("mesas", JSON.stringify(mesas));
  }

  pintarDatos();

  Swal.fire({
    title: "Registro exitoso.", icon: "success", draggable: true,
  }).then((result) => {
    if (result.isConfirmed) {

      const modalElement = document.getElementById("exampleModal");
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
      limpiarFormularioReserva();

      const botonGuardar = modalElement.querySelector("button.btn-primary");
      botonGuardar.textContent = "Guardar";
      botonGuardar.onclick = guardar;
    }
  });
}

// Funcion Pintar
function pintarDatos() {
  document.getElementById("bodyData").innerHTML = "";

  let datos = getDatos();
  let mesas = datos.mesas;
  let reservas = datos.reservas;

  const filtroFecha = document.getElementById("filtroFecha")?.value || "";
  const filtroEstado = document.getElementById("filtroEstado")?.value || "";

  let reservasFiltradas = reservas.filter((r) => {
    let coincideFecha = filtroFecha ? r.fechaReserva === filtroFecha : true;
    let coincideEstado = filtroEstado ? r.estadoReserva === filtroEstado : true;
    return coincideFecha && coincideEstado;
  });

  if (reservasFiltradas.length === 0) {
    document.getElementById("bodyData").innerHTML = `<div class="alert alert-info">No se encontraron reservas con los filtros aplicados.</div>`;
    return;
  }

  reservasFiltradas.forEach((item, i) => {
    let mesaObj = mesas.find((m) => String(m.id) === String(item.mesa));
    let textoMesa = mesaObj ? `Mesa #${mesaObj.numeroMesa}` : "No asignada";

    let claseEstado = "";
    switch (item.estadoReserva) {
      case "Pendiente": claseEstado = "estadoPendiente"; break;
      case "Confirmada": claseEstado = "estadoConfirmada"; break;
      case "Finalizada": claseEstado = "estadoFinalizado"; break;
      case "Cancelada": claseEstado = "estadoCancelado"; break;
      case "No Show": claseEstado = "estadoNoShow"; break;
    }

const imagenes = {
  "Cumpleaños": "Happy.png",
  "Aniversario": "Aniversario.png",
  "Graduación": "Graduacion.png",
  "Reunión familiar": "Familia.png",
  "Cena de negocios": "Negocios.png",
  "Compromiso": "Compromiso.png",
  "Amigos": "Amigos.png",
  "Otro": "Otros.png",
};
let imagenOcasion = imagenes[item.ocasion] ? `<img src="../Reservas/${imagenes[item.ocasion]}" alt="${item.ocasion}">` : "";

    document.getElementById("bodyData").innerHTML += `
  <div id="Tarjetas" class="card mb-3 p-3 ${claseEstado}">
    <div id="Informacion">
      <h5>Reserva #${item.numeroReserva}</h5>
      <p><strong>ID de reserva:</strong> ${item.idReserva}</p>
      <p><strong>Nombre:</strong> ${item.nombre}</p>
      <p><strong>Número de personas:</strong> ${item.numeroPersonas}</p>
      <p><strong>Fecha de reserva:</strong> ${item.fechaReserva}</p>
      <p><strong>Hora de reserva:</strong> ${item.horaReserva}</p>
      <p><strong>Mesa:</strong> ${textoMesa}</p>
      <p><strong>Notas adicionales:</strong> ${item.notasAdicionales || "Ninguna"}</p>
      <p><strong>Estado de la reserva:</strong> <span>${item.estadoReserva}</span></p>
    </div>
    <div class="OcasionesyBotones">
      <div id="Ocasion"><p><strong>Ocasión:</strong> ${item.ocasion}</p>
      ${imagenOcasion}
    </div>
      <div class="Botones">
        <button type="button" class="btn btn-primary" onclick="editarReserva('${item.idReserva}')">✏️ Editar</button>
        <button type="button" class="btn btn-primary" onclick="pagarCuenta(${i})">💵 Pagar cuenta</button>
        <button type="button" class="btn btn-primary" onclick="eliminarReserva(${i})">❌ Eliminar</button>
      </div>
    </div>
  </div>
`;
  });
}

// Funcion Eliminar
function eliminarReserva(index) {
  let datos = getDatos();

  let reservas = datos.reservas;

  const reserva = reservas[index];

  reservas.splice(index, 1);

  localStorage.setItem("ReservasData", JSON.stringify(reservas));

  let mesas = JSON.parse(localStorage.getItem("mesas")) || [];
  let indexMesa = mesas.findIndex((m) => String(m.numeroMesa) === String(reserva.mesa));

  if (indexMesa !== -1) {
    mesas[indexMesa].estado = "Disponible";
    localStorage.setItem("mesas", JSON.stringify(mesas));
  }

  pintarDatos();
  Swal.fire({ title: "Reserva eliminada", icon: "success", text: "La reserva fue eliminada correctamente y la mesa quedó disponible.", });
}

// Funcion Editar
function editarReserva(id) {
  let datos = getDatos();
  const reservas = datos.reservas;

  const reserva = reservas.find((r) => r.idReserva === String(id));
  const mesas = datos.mesas;

  if (!reserva) {
    Swal.fire({ icon: "error", title: "Error", text: "Reserva no encontrada.", });
    return;
  }

  cargarMesasDisponibles(reserva.mesa);

  document.getElementById("reservaId").value = reserva.idReserva;
  document.getElementById("reservaId").disabled = true; // 
  document.getElementById("nombre").value = reserva.nombre;
  document.getElementById("numeroPersonas").value = reserva.numeroPersonas;
  document.getElementById("fechaReserva").value = reserva.fechaReserva;
  document.getElementById("horaReserva").value = reserva.horaReserva;
  document.getElementById("ocasion").value = reserva.ocasion;
  document.getElementById("notasAdicionales").value = reserva.notasAdicionales || "";
  document.getElementById("estadoReserva").value = reserva.estadoReserva || "Pendiente";


  const modalElement = document.getElementById("exampleModal");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  const botonGuardar = modalElement.querySelector("button.btn-primary");
  botonGuardar.textContent = "Actualizar";
  botonGuardar.onclick = function () {
    actualizarReserva(id, modal);
  };
}

// Funcion Actualizar
function actualizarReserva(id, modal) {
  let datos = getDatos();
  const reservas = datos.reservas;
  const index = reservas.findIndex((r) => r.idReserva === id);

  if (index === -1) {
    Swal.fire({ icon: "error", title: "Error", text: "No se pudo encontrar la reserva para actualizar.", });
    return;
  }

  const mesaVieja = reservas[index].mesa;

  const nombre = document.getElementById("nombre").value.trim();
  const numeroPersonas = parseInt(document.getElementById("numeroPersonas").value);
  const fechaReserva = document.getElementById("fechaReserva").value;
  const horaReserva = document.getElementById("horaReserva").value;
  const mesaNueva = document.getElementById("mesa").value;
  const ocasion = document.getElementById("ocasion").value;
  const notasAdicionales = document.getElementById("notasAdicionales").value.trim();
  const estadoReserva = document.getElementById("estadoReserva").value;

  reservas[index] = {
    ...reservas[index], nombre, numeroPersonas, fechaReserva,
    horaReserva, mesa: mesaNueva, ocasion, notasAdicionales, estadoReserva,
  };

  let mesas = JSON.parse(localStorage.getItem("mesas")) || [];

  if (mesaVieja && mesaVieja !== mesaNueva) {
    const indexMesaVieja = mesas.findIndex((m) => String(m.id) === String(mesaVieja));
    if (indexMesaVieja !== -1) {
      mesas[indexMesaVieja].estado = "Disponible";
    }
  }

  if (mesaNueva) {
    const indexMesaNueva = mesas.findIndex((m) => String(m.id) === String(mesaNueva));
    if (indexMesaNueva !== -1) {
      if (estadoReserva === "Pendiente" || estadoReserva === "Confirmada") {
        mesas[indexMesaNueva].estado = "Ocupada";
      } else {
        mesas[indexMesaNueva].estado = "Disponible";
      }
    }
  }


  localStorage.setItem("mesas", JSON.stringify(mesas));
  localStorage.setItem("ReservasData", JSON.stringify(reservas));

  modal.hide();

  pintarDatos();

  Swal.fire({ icon: "success", title: "Reserva actualizada", text: "Los datos de la reserva fueron actualizados correctamente.", });

  document.getElementById("reservaId").disabled = false;

  const botonGuardar = document.querySelector("#exampleModal .btn-primary");
  botonGuardar.textContent = "Guardar";
  botonGuardar.onclick = guardar;
}

// Funcion Pagar
function pagarCuenta(index) {
  Swal.fire({title: "¿Finalizar reserva?",text: "¿Estás seguro de que deseas pagar la cuenta y finalizar esta reserva?",icon: "warning",
    showCancelButton: true,confirmButtonText: "Sí, pagar",cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      let datos = getDatos();
      let reservas = datos.reservas;
      let mesas = datos.mesas;

      const reserva = reservas[index];

      if (!reserva) return;

      reserva.estadoReserva = "Finalizada";

      const indexMesa = mesas.findIndex((m) => String(m.id) === String(reserva.mesa));

      if (indexMesa !== -1) {
        mesas[indexMesa].estado = "Disponible";
      }

      localStorage.setItem("ReservasData", JSON.stringify(reservas));
      localStorage.setItem("mesas", JSON.stringify(mesas));

      pintarDatos();

      Swal.fire({icon: "success",title: "Reserva finalizada",text: "Se ha finalizado la reserva y liberado la mesa.",});
    }
  });
}

// Funcion LimpiarFormulario
function limpiarFormularioReserva() {
  document.getElementById("reservaId").value = "";
  document.getElementById("reservaId").disabled = false;
  document.getElementById("nombre").value = "";
  document.getElementById("numeroPersonas").value = "";
  document.getElementById("fechaReserva").value = "";
  document.getElementById("horaReserva").value = "";
  document.getElementById("mesa").value = "";
  document.getElementById("ocasion").value = "";
  document.getElementById("notasAdicionales").value = "";
  document.getElementById("estadoReserva").value = "Pendiente";
}

// Funcion Filtros
function limpiarFiltros() {
  document.getElementById("filtroFecha").value = "";
  document.getElementById("filtroEstado").value = "";
  pintarDatos();
}
