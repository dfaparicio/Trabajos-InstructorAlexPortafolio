import {
  parse,
  addMinutes,
  isBefore,
  isAfter,
  areIntervalsOverlapping,
  parseISO,
  startOfToday,
  format,
} from "https://cdn.jsdelivr.net/npm/date-fns@3.6.0/+esm";

// Expón en window para que lo vean otros scripts
window.parse = parse;
window.addMinutes = addMinutes;
window.isBefore = isBefore;
window.isAfter = isAfter;
window.areIntervalsOverlapping = areIntervalsOverlapping;
window.parseISO = parseISO;
window.startOfToday = startOfToday;

window.guardar = guardar;
window.editarReserva = editarReserva;
window.eliminarReserva = eliminarReserva;
window.pagarCuenta = pagarCuenta;
window.limpiarFiltros = limpiarFiltros;

function getDatos() {
  return {
    reservas: JSON.parse(localStorage.getItem("ReservasData")) || [],
    mesas: JSON.parse(localStorage.getItem("mesas")) || [],
  };
}
console.log(getDatos());

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("Padre").innerHTML = `
<div class="Encabezado">
  <h1>Registro de Reservas</h1>
  <div class="Filtros mb-3">
    <div class="Fecha">
      <label for="filtroFecha"><strong>Filtrar por fecha:</strong></label>
      <input type="date" id="filtroFecha" class="form-control">
    </div>
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
    <div>
      <button class="btn btn-secondary" onclick="limpiarFiltros()">Limpiar filtros</button>
    </div>
    <div>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Realizar registro</button>
    </div>
  </div>
</div>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Nueva Reserva</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="ModalModal" style="display: flex; flex-direction: column; gap: 20px; padding: 10px; box-shadow: 2px 2px 2px 2px gray;">
          <label>ID Reserva:</label>
          <input type="number" id="reservaId" placeholder="ID de la reserva">
          <label>Nombre Cliente:</label>
          <input type="text"  id="nombre" placeholder="Digite el nombre"pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+" title="Solo se permiten letras y espacios" required>
          <label>Número de Personas:</label>
          <input type="number" id="numeroPersonas" min="1" placeholder="Ingrese número de personas">
          <label>Fecha de Reserva:</label>
          <input type="date" id="fechaReserva">
          <label>Hora de Reserva:</label>
          <input type="time" id="horaReserva" min="08:00" max="23:00"required>
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
          <label id="labelEstadoReserva" for="estadoReserva" style="display:none;">Estado:</label>
          <select id="estadoReserva" style="display:none;">
            <option value="Pendiente">Pendiente</option>
            <option value="Confirmada">Confirmada</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Finalizada">Finalizada</option>
            <option value="No Show">No Show</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" onclick="guardar()">Guardar</button>
      </div>
    </div> 
  </div>   
</div>    

<div id="bodyData"></div>

<div class="mt-3">
  <button type="button" class="btn btn-primary" onclick="window.location.href='../GestionDeMesas/index.html'">← Volver</button>
</div>
`;

  const params = new URLSearchParams(window.location.search);
  const abrirModal = params.get("abrirModal");
  const idMesa = params.get("id");

  cargarMesasDisponibles(idMesa);

  if (abrirModal === "true") {
    const traerModal = document.getElementById("exampleModal");
    const modal = new bootstrap.Modal(traerModal);

    if (idMesa) {
      const selecMesa = document.getElementById("mesa");
      if (selecMesa) selecMesa.value = idMesa;
    }
    modal.show();
  }

  setTimeout(() => {
    pintarDatos();
    document
      .getElementById("filtroFecha")
      .addEventListener("change", pintarDatos);
    document
      .getElementById("filtroEstado")
      .addEventListener("change", pintarDatos);
  }, 0);

  setInterval(() => {
    pintarDatos();
  }, 5000);

  setTimeout(() => {
    document
      .getElementById("ocasion")
      .addEventListener("change", actualizarLimiteHora);
    document
      .getElementById("fechaReserva")
      .addEventListener("change", actualizarLimiteHora);

    // Al cargar, asegurar límites iniciales
    actualizarLimiteHora();
  }, 0);
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

  mesas.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = String(m.id);
    opt.textContent = `Mesa #${m.numeroMesa} (${m.cantidadPersonas} personas)`;

    // Si la mesa está deshabilitada no se puede seleccionar y se ve opaca
    if (m.estado === "Deshabilitada") {
      opt.disabled = true;
      opt.style.opacity = "1";
      opt.style.color = "#BEBEBEFF";
      opt.textContent += " - Deshabilitada";
    }
    if (String(m.id) === String(mesaActual)) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
}

// Función Guardar
function guardar() {
  console.log("🚀 Ejecutando guardar()");

  let { reservas, mesas } = getDatos();
  const modalElement = document.getElementById("exampleModal");

  const idReserva = document.getElementById("reservaId").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const numeroPersonas = parseInt(
    document.getElementById("numeroPersonas").value
  );
  const fechaReserva = document.getElementById("fechaReserva").value;
  const horaReserva = document.getElementById("horaReserva").value;
  const mesa = document.getElementById("mesa").value;
  const ocasion = document.getElementById("ocasion").value;
  const notasAdicionales = document
    .getElementById("notasAdicionales")
    .value.trim();
  const estadoReserva = "Pendiente";

  // Validaciones normales
  if (!idReserva || isNaN(idReserva) || parseInt(idReserva) <= 0) {
    return Swal.fire({
      icon: "error",
      title: "ID inválido",
      text: "Por favor ingresa un ID numérico mayor a 0 para la reserva.",
    });
  }
  if (!document.getElementById("reservaId").disabled) {
    const existeId = reservas.some(
      (r) => String(r.idReserva) === String(idReserva)
    );
    if (existeId) {
      return Swal.fire({
        icon: "error",
        title: "ID duplicado",
        text: "Ya existe una reserva con este ID. Usa otro diferente.",
      });
    }
  }
  if (!nombre) {
    return Swal.fire({
      icon: "error",
      title: "Nombre requerido",
      text: "Por favor ingresa el nombre del cliente.",
    });
  }
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
    return Swal.fire({
      icon: "error",
      title: "Nombre inválido",
      text: "El nombre solo puede contener letras y espacios.",
    });
  }
  if (!numeroPersonas || numeroPersonas <= 0) {
    return Swal.fire({
      icon: "error",
      title: "Número inválido",
      text: "El número de personas debe ser mayor que 0.",
    });
  }

  if (!fechaReserva) {
    return Swal.fire({
      icon: "error",
      title: "Fecha requerida",
      text: "Por favor selecciona una fecha para la reserva.",
    });
  }

  const fechaSeleccionada = parseISO(fechaReserva);

  if (isNaN(fechaSeleccionada)) {
    return Swal.fire({
      icon: "error",
      title: "Fecha inválida",
      text: "La fecha ingresada no es válida.",
    });
  }

  if (isBefore(fechaSeleccionada, startOfToday())) {
    return Swal.fire({
      icon: "error",
      title: "Fecha inválida",
      text: "La fecha debe ser igual o posterior a hoy.",
    });
  }

  if (!horaReserva) {
    return Swal.fire({
      icon: "error",
      title: "Hora requerida",
      text: "Por favor selecciona una hora de reserva.",
    });
  }
  if (!mesa) {
    return Swal.fire({
      icon: "error",
      title: "Mesa requerida",
      text: "Por favor selecciona una mesa.",
    });
  }
  if (!ocasion) {
    return Swal.fire({
      icon: "error",
      title: "Ocasión requerida",
      text: "Por favor selecciona una ocasión.",
    });
  }

  const apertura = parse(
    `${fechaReserva} 08:00`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );
  const cierre = parse(`${fechaReserva} 23:00`, "yyyy-MM-dd HH:mm", new Date());
  const inicioReserva = parse(
    `${fechaReserva} ${horaReserva}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );
  const duracion = obtenerDuracionPorOcasion(ocasion);
  const finReserva = addMinutes(inicioReserva, duracion);
  if (isBefore(inicioReserva, apertura) || isAfter(finReserva, cierre)) {
    return Swal.fire({
      icon: "error",
      title: "Horario inválido",
      text: "Las reservas deben ser entre 08:00 y 23:00, respetando la duración.",
    });
  }

  const conflicto = reservas.some((r) => {
    if (
      String(r.mesa) !== String(mesa) ||
      !["Pendiente", "Confirmada"].includes(r.estadoReserva) ||
      r.fechaReserva !== fechaReserva
    ) {
      return false;
    }

    const inicioExistente = parse(
      `${r.fechaReserva} ${r.horaReserva}`,
      "yyyy-MM-dd HH:mm",
      new Date()
    );
    const finExistente = addMinutes(
      inicioExistente,
      obtenerDuracionPorOcasion(r.ocasion)
    );

    return areIntervalsOverlapping(
      { start: inicioReserva, end: finReserva },
      { start: inicioExistente, end: finExistente }
    );
  });

  if (conflicto) {
    return Swal.fire({
      icon: "error",
      title: "Conflicto de reserva",
      text: "Ya existe otra reserva para esta mesa en ese horario.",
    });
  }

  // Aquí recién pedimos confirmación
  Swal.fire({
    title: "¿Confirmar reserva?",
    html: `
    <strong>Cliente: ${nombre}</strong><br>
    <strong>Mesa: ${mesa}</strong><br>
    <strong>Fecha: ${fechaReserva}</strong><br>
    <strong>Hora de reserva: ${horaReserva}</strong>`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, guardar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      let numeroReserva = parseInt(localStorage.getItem("ultimaReserva")) || 1;

      const nuevaReserva = {
        numeroReserva,
        idReserva,
        nombre,
        numeroPersonas,
        fechaReserva,
        horaReserva,
        mesa,
        ocasion,
        notasAdicionales,
        estadoReserva,
      };

      reservas.push(nuevaReserva);
      localStorage.setItem("ReservasData", JSON.stringify(reservas));
      localStorage.setItem("ultimaReserva", numeroReserva + 1);

      pintarDatos();

      Swal.fire({
        title: "Registro exitoso",
        icon: "success",
        draggable: true,
      }).then(() => {
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        limpiarFormularioReserva();
      });
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

  if (reservas.length === 0) {
    document.getElementById(
      "bodyData"
    ).innerHTML = `<div class="alert alert-info">Aún no hay reservas registradas.</div>`;
    return;
  }

  if (reservasFiltradas.length === 0) {
    document.getElementById(
      "bodyData"
    ).innerHTML = `<div class="alert alert-warning">No se encontraron reservas con los filtros aplicados.</div>`;
    return;
  }

  reservasFiltradas.forEach((item, i) => {
    let mesaObj = mesas.find((m) => String(m.id) === String(item.mesa));
    let textoMesa = mesaObj ? `Mesa #${mesaObj.numeroMesa}` : "No asignada";

    let claseEstado = "";
    switch (item.estadoReserva) {
      case "Pendiente":
        claseEstado = "estadoPendiente";
        break;
      case "Confirmada":
        claseEstado = "estadoConfirmada";
        break;
      case "Finalizada":
        claseEstado = "estadoFinalizado";
        break;
      case "Cancelada":
        claseEstado = "estadoCancelado";
        break;
      case "No Show":
        claseEstado = "estadoNoShow";
        break;
    }

    const imagenes = {
      Cumpleaños: "Happy.png",
      Aniversario: "Aniversario.png",
      Graduación: "Graduacion.png",
      "Reunión familiar": "Familia.png",
      "Cena de negocios": "Negocios.png",
      Compromiso: "Compromiso.png",
      Amigos: "Amigos.png",
      Otro: "Otros.png",
    };

    let imagenOcasion = imagenes[item.ocasion]
      ? `<img src="../Reservas/${imagenes[item.ocasion]}" alt="${
          item.ocasion
        }">`
      : "";

    const estadosBloqueados = ["Finalizada", "Cancelada", "No Show"];
    const disabled = estadosBloqueados.includes(item.estadoReserva)
      ? "disabled style='opacity: 0.5; pointer-events: none;'"
      : "";

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
          <p><strong>Notas adicionales:</strong> ${
            item.notasAdicionales || "Ninguna"
          }</p>
          <p><strong>Estado de la reserva:</strong> <span>${
            item.estadoReserva
          }</span></p>
        </div>
        <div class="OcasionesyBotones">
          <div id="Ocasion"><p><strong>Ocasión:</strong> ${item.ocasion}</p>
          ${imagenOcasion}
        </div>
          <div class="Botones">
            <button type="button" class="btn btn-primary" onclick="editarReserva('${
              item.idReserva
            }')" ${disabled}>✏️ Editar</button>
            <button type="button" class="btn btn-primary" onclick="pagarCuenta(${i})" ${disabled}>💵 Pagar cuenta</button>
            <button type="button" class="btn btn-primary" onclick="eliminarReserva(${i})" ${disabled}>❌ Eliminar</button>
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
  let indexMesa = mesas.findIndex((m) => String(m.id) === String(reserva.mesa));

  if (indexMesa !== -1) {
    mesas[indexMesa].estado = "Disponible";
    localStorage.setItem("mesas", JSON.stringify(mesas));
  }

  pintarDatos();
  Swal.fire({
    title: "Reserva eliminada",
    icon: "success",
    text: "La reserva fue eliminada correctamente y la mesa quedó disponible.",
  });
}

// Funcion Editar
function editarReserva(id) {
  let datos = getDatos();
  const reservas = datos.reservas;

  const reserva = reservas.find((r) => r.idReserva === String(id));

  if (!reserva) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Reserva no encontrada.",
    });
    return;
  }

  cargarMesasDisponibles(reserva.mesa);

  document.getElementById("reservaId").value = reserva.idReserva;
  document.getElementById("reservaId").disabled = true; // No se puede cambiar el ID
  document.getElementById("nombre").value = reserva.nombre;
  document.getElementById("numeroPersonas").value = reserva.numeroPersonas;
  document.getElementById("fechaReserva").value = reserva.fechaReserva;
  document.getElementById("horaReserva").value = reserva.horaReserva;
  document.getElementById("ocasion").value = reserva.ocasion;
  document.getElementById("notasAdicionales").value =
    reserva.notasAdicionales || "";

  const estadoSelect = document.getElementById("estadoReserva");
  const labelEstado = document.getElementById("labelEstadoReserva");

  estadoSelect.style.display = "block";
  labelEstado.style.display = "block";
  estadoSelect.innerHTML = "";

  const estadosPermitidos = ["Confirmada", "No Show", "Cancelada"];

  if (reserva.estadoReserva === "Pendiente") {
    const optionPendiente = document.createElement("option");
    optionPendiente.value = "Pendiente";
    optionPendiente.text = "Pendiente";
    optionPendiente.selected = true;
    optionPendiente.disabled = true;
    estadoSelect.appendChild(optionPendiente);

    estadosPermitidos.forEach((estado) => {
      const option = document.createElement("option");
      option.value = estado;
      option.text = estado;
      estadoSelect.appendChild(option);
    });

    estadoSelect.addEventListener("change", function () {
      if (reserva.estadoReserva === "Pendiente") {
        Swal.fire({
          title: "¿Estás seguro?",
          text: "Si cambias el estado Pendiente, no podrás volver a colocarlo como Pendiente.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, cambiar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (!result.isConfirmed) {
            estadoSelect.value = "Pendiente";
          }
        });
      }
    });
  } else {
    estadosPermitidos.forEach((estado) => {
      const option = document.createElement("option");
      option.value = estado;
      option.text = estado;
      if (estado === reserva.estadoReserva) {
        option.selected = true;
      }
      estadoSelect.appendChild(option);
    });
  }

  // Mostrar modal
  const modalElement = document.getElementById("exampleModal");
  const onHidden = () => {
    limpiarFormularioReserva();
    modalElement.removeEventListener("hidden.bs.modal", onHidden);
  };
  modalElement.addEventListener("hidden.bs.modal", onHidden);

  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Aplicar límites de hora dinámicamente despues de abrir el modal
  setTimeout(() => {
    try {
      actualizarLimiteHora();
    } catch (err) {
      console.warn("No se pudo actualizar límites de hora en editar:", err);
    }
  }, 200);

  const botonGuardar = modalElement.querySelector("button.btn-primary");
  botonGuardar.textContent = "Editar";
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
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo encontrar la reserva para actualizar.",
    });
    return;
  }

  const nombre = document.getElementById("nombre").value.trim();
  const numeroPersonas = parseInt(
    document.getElementById("numeroPersonas").value
  );
  const fechaReserva = document.getElementById("fechaReserva").value;
  const horaReserva = document.getElementById("horaReserva").value;
  const mesaNueva = document.getElementById("mesa").value;
  const ocasion = document.getElementById("ocasion").value;
  const notasAdicionales = document
    .getElementById("notasAdicionales")
    .value.trim();
  const estadoReserva = document.getElementById("estadoReserva").value;

  const horaInput = document.getElementById("horaReserva");

  const horaReservaDate = parse(horaReserva, "HH:mm", new Date());
  const minPermitido = parse(horaInput.min, "HH:mm", new Date());
  const maxPermitido = parse(horaInput.max, "HH:mm", new Date());

  // Validar que la hora esté en rango
  if (
    isBefore(horaReservaDate, minPermitido) ||
    isAfter(horaReservaDate, maxPermitido)
  ) {
    Swal.fire({
      icon: "error",
      title: "Hora inválida",
      text: `La hora debe estar entre ${horaInput.min} y ${horaInput.max}.`,
    });
    return;
  }

  // Validar que la reserva no se pase del cierre (23:00)
  const duracion = obtenerDuracionPorOcasion(ocasion); // en minutos
  const horaFinReserva = addMinutes(horaReservaDate, duracion);
  const horaCierre = parse("23:00", "HH:mm", new Date());

  if (isAfter(horaFinReserva, horaCierre)) {
    Swal.fire({
      icon: "error",
      title: "Reserva demasiado tarde",
      text: `La reserva para "${ocasion}" dura ${
        duracion / 60
      }h y debe terminar antes de las 23:00. 
             Última hora posible: ${horaCierre.getHours() - duracion / 60}:00`,
    });
    return;
  }

  // Validar disponibilidad antes de actualizar
  const reservasSinLaActual = reservas.filter((r) => r.idReserva !== id);
  if (
    !validarDisponibilidadMesa(
      mesaNueva,
      fechaReserva,
      horaReserva,
      ocasion,
      reservasSinLaActual
    )
  ) {
    Swal.fire({
      icon: "error",
      title: "Mesa no disponible",
      text: "Esta mesa ya tiene una reserva cercana (menos de 2 horas antes o después).",
    });
    return;
  }

  // Guardar cambios
  reservas[index] = {
    ...reservas[index],
    nombre,
    numeroPersonas,
    fechaReserva,
    horaReserva,
    mesa: mesaNueva,
    ocasion,
    notasAdicionales,
    estadoReserva,
  };

  localStorage.setItem("ReservasData", JSON.stringify(reservas));

  let mesas = datos.mesas;
  const indexMesa = mesas.findIndex((m) => String(m.id) === String(mesaNueva));

  if (indexMesa !== -1) {
    const quedanReservasActivas = reservas.some(
      (r) =>
        String(r.mesa) === String(mesaNueva) &&
        (r.estadoReserva === "Pendiente" || r.estadoReserva === "Confirmada")
    );

    mesas[indexMesa].estado = quedanReservasActivas ? "Ocupada" : "Disponible";
    localStorage.setItem("mesas", JSON.stringify(mesas));
  }

  modal.hide();
  pintarDatos();

  Swal.fire({
    icon: "success",
    title: "Reserva actualizada",
    text: "Los datos de la reserva fueron actualizados correctamente.",
  });

  document.getElementById("reservaId").disabled = false;

  const botonGuardar = document.querySelector("#exampleModal .btn-primary");
  botonGuardar.textContent = "Guardar";
  botonGuardar.onclick = guardar;
}

// Funcion Pagar
function pagarCuenta(index) {
  Swal.fire({
    title: "¿Finalizar reserva?",
    text: "¿Estás seguro de que deseas pagar la cuenta y finalizar esta reserva?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, pagar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      let datos = getDatos();
      let reservas = datos.reservas;
      let mesas = datos.mesas;

      const reserva = reservas[index];
      if (!reserva) return;

      reserva.estadoReserva = "Finalizada";

      const indexMesa = mesas.findIndex(
        (m) => String(m.id) === String(reserva.mesa)
      );

      if (indexMesa !== -1) {
        const quedanReservasActivas = reservas.some(
          (r) =>
            String(r.mesa) === String(reserva.mesa) &&
            (r.estadoReserva === "Pendiente" ||
              r.estadoReserva === "Confirmada")
        );

        // Si no quedan reservas activas, la mesa pasa a Disponible
        mesas[indexMesa].estado = quedanReservasActivas
          ? "Ocupada"
          : "Disponible";
      }

      localStorage.setItem("ReservasData", JSON.stringify(reservas));
      localStorage.setItem("mesas", JSON.stringify(mesas));

      pintarDatos();

      Swal.fire({
        icon: "success",
        title: "Reserva finalizada",
        text:
          "Se ha finalizado la reserva. " +
          (mesas[indexMesa].estado === "Disponible"
            ? "La mesa ahora está disponible."
            : "La mesa sigue ocupada por otras reservas."),
      });
    }
  });
}

// Funcion limpiarFormularioReserva
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

  document.getElementById("estadoReserva").style.display = "none";
  document.getElementById("labelEstadoReserva").style.display = "none";

  const modalElement = document.getElementById("exampleModal");
  const botonGuardar = modalElement.querySelector("button.btn-primary");
  botonGuardar.textContent = "Guardar";
  botonGuardar.onclick = guardar;
}

// Funcion Filtros
function limpiarFiltros() {
  document.getElementById("filtroFecha").value = "";
  document.getElementById("filtroEstado").value = "";
  pintarDatos();
}

// Funcion Validar Disponibilidad
function validarDisponibilidadMesa(
  mesa,
  fechaReserva,
  horaReserva,
  ocasionActual,
  reservas
) {
  const nuevaInicio = parse(
    `${fechaReserva} ${horaReserva}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );
  const duracionActual = obtenerDuracionPorOcasion(ocasionActual);
  const nuevaFin = addMinutes(nuevaInicio, duracionActual);

  for (let r of reservas) {
    if (
      (r.estadoReserva !== "Pendiente" && r.estadoReserva !== "Confirmada") ||
      String(r.mesa) !== String(mesa)
    ) {
      continue;
    }

    if (r.fechaReserva !== fechaReserva) continue;

    const inicioExistente = parse(
      `${r.fechaReserva} ${r.horaReserva}`,
      "yyyy-MM-dd HH:mm",
      new Date()
    );
    const duracionExistente = obtenerDuracionPorOcasion(r.ocasion);
    const finExistente = addMinutes(inicioExistente, duracionExistente);

    const hayConflicto = areIntervalsOverlapping(
      { start: nuevaInicio, end: nuevaFin },
      { start: inicioExistente, end: finExistente }
    );

    if (hayConflicto) {
      return false;
    }
  }

  return true;
}

// Funcion duracion de cada ocasion
function obtenerDuracionPorOcasion(ocasion) {
  const duraciones = {
    Cumpleaños: 120,
    Compromiso: 180,
    Aniversario: 120,
    Graduación: 180,
    "Reunión familiar": 180,
    "Cena de negocios": 120,
    Amigos: 30,
    Otro: 30,
  };

  return duraciones[ocasion] || 120;
}

// Actualizar max de hora según ocasión y fecha
function actualizarLimiteHora() {
  const fechaReserva = document.getElementById("fechaReserva").value;
  const ocasion = document.getElementById("ocasion").value;
  const horaInput = document.getElementById("horaReserva");

  if (!fechaReserva || !ocasion) return;

  const duracion = obtenerDuracionPorOcasion(ocasion);

  const apertura = parse(
    `${fechaReserva} 08:00`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );
  const cierre = parse(`${fechaReserva} 23:00`, "yyyy-MM-dd HH:mm", new Date());

  // Última hora válida de inicio = cierre - duración
  const horaMaxInicio = addMinutes(cierre, -duracion);

  // Aplicamos límites dinámicos
  horaInput.min = "08:00";
  horaInput.max = format(horaMaxInicio, "HH:mm");

  console.log("⏱️ Hora máxima permitida:", horaInput.max);
}

document.getElementById("Padre").innerHTML = `...`;

setTimeout(() => {
  document.getElementById("nombre").addEventListener("input", function () {
    this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
  });
}, 0);
