window.onload = function () {
  if (localStorage.getItem("mesas")) {
    datosGuardados = JSON.parse(localStorage.getItem("mesas"));
  }

  actualizarEstadoMesas();
  pintarDatos();

  setInterval(() => {
    actualizarEstadoMesas();
    pintarDatos();
  }, 5000);
};

// Funcion guardar
function guardar() {
  const id = parseInt(document.getElementById("Id").value);
  const capacidad = parseInt(document.getElementById("Capacidad").value);
  const ubicacion = document.getElementById("Ubicacion").value.trim();

  const estado = "Disponible";

  const camposVacios = !id && !capacidad && ubicacion === "";
  if (camposVacios) {
    Swal.fire({ icon: "warning", title: "Formulario vacío", text: "Debes completar todos los campos antes de guardar." });
    return;
  }
  if (!id) {
    Swal.fire({ icon: "error", title: "Ingrese el ID de la mesa", text: "Por favor, completa el campo." });
    return;
  }
  const idExistente = datosGuardados.some((mesa) => mesa.id === id);
  if (idExistente) {
    Swal.fire({ icon: "error", title: "ID duplicado", text: "Ya existe una mesa con este ID. Usa otro diferente." });
    return;
  }
  if (!capacidad) {
    Swal.fire({ icon: "error", title: "Ingrese la capacidad de la mesa", text: "Por favor, completa el campo." });
    return;
  }
  if (capacidad <= 0) {
    Swal.fire({ icon: "error", title: "Capacidad incorrecta", text: "La capacidad debe ser un número positivo." });
    return;
  }
  if (ubicacion === "") {
    Swal.fire({ icon: "error", title: "Ingrese la ubicación de la mesa", text: "Por favor, completa el campo." });
    return;
  }

  Swal.fire({
    title: "¿Confirmar creación?",
    html: `
      <strong>ID:</strong> ${id}<br>
      <strong>Capacidad:</strong> ${capacidad}<br>
      <strong>Ubicación:</strong> ${ubicacion}<br>
      <strong>Estado:</strong> ${estado}
    `,
    icon: "question", showCancelButton: true,
    confirmButtonText: "Sí, guardar", cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      const nuevaMesa = {
        id: id,
        numeroMesa: datosGuardados.length + 1,
        cantidadPersonas: capacidad,
        ubicacion: ubicacion,
        estado: estado,
      };

      datosGuardados.push(nuevaMesa);
      localStorage.setItem("mesas", JSON.stringify(datosGuardados));
      pintarDatos();

      Swal.fire({ title: "Mesa guardada exitosamente", icon: "success" });

      const modal = bootstrap.Modal.getInstance(document.getElementById("exampleModal"));
      modal.hide();

      limpiarCampos();
    }
  });
}

// Funcion GUARDAR
function cancelar() {
  Swal.fire({ title: "Cancelado", text: "No se ha creado ninguna mesa.", icon: "info", });
  const modal = bootstrap.Modal.getInstance(document.getElementById("exampleModal"));
  modal.hide();
  limpiarCampos();
}

// Funcion GUARDAR
function eliminarMesa(id) {
  Swal.fire({
    title: "¿Estás seguro?", text: "Esta acción no se puede deshacer.", icon: "warning",
    showCancelButton: true, confirmButtonColor: "#3085d6", cancelButtonColor: "#d33", confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {

      datosGuardados = datosGuardados.filter((mesa) => mesa.id !== id);

      localStorage.setItem("mesas", JSON.stringify(datosGuardados));

      pintarDatos();

      Swal.fire({ title: "Mesa eliminada", icon: "success", text: "La mesa fue eliminada correctamente.", });
    }
  });
}

// Funcion GUARDAR
function pintarDatos() {
  const contenedor = document.getElementById("Data");
  contenedor.innerHTML = "";

  let mesas = JSON.parse(localStorage.getItem("mesas")) || [];
  let reservas = JSON.parse(localStorage.getItem("ReservasData")) || [];

  mesas.forEach((mesa) => {
    const div = document.createElement("div");

    let Estado = "";
    switch (mesa.estado) {
      case "Disponible": Estado = "EstadoDisponible"; break;
      case "Ocupada": Estado = "EstadoOcupada"; break;
      case "Deshabilitada": Estado = "EstadoDeshabilitada"; break;
    }

    div.className = `DivMesa ${Estado}`;

    div.innerHTML = `
            <div class="editMesa">
            <h1>Mesa #${mesa.numeroMesa}</h1>
            <p><strong>ID:</strong> ${mesa.id}</p>
            <p><strong>Capacidad:</strong> ${mesa.cantidadPersonas}</p>
            <p><strong>Ubicación:</strong> ${mesa.ubicacion}</p>
            <p><strong>Estado:</strong> <span class="Estado">${mesa.estado}</span></p>
            </div>
            <div class="botonesMesas">
            <button onclick="eliminarMesa(${mesa.id})">❌ Eliminar</button>
            <button onclick="editarMesa(${mesa.id})">✏️ Editar</button>
            <button onclick="iraReserva(${mesa.id})">📅 Reservar</button>
            </div>
        `;
    contenedor.appendChild(div);
  });
}

// Funcion editarMesa
function editarMesa(id) {
  const mesa = datosGuardados.find((m) => m.id === id);

  if (!mesa) {
    Swal.fire({ icon: "error", title: "Error", text: "Mesa no encontrada.", });
    return;
  }

  document.getElementById("Id").value = mesa.id;
  document.getElementById("Id").disabled = true;
  document.getElementById("Capacidad").value = mesa.cantidadPersonas;
  document.getElementById("Ubicacion").value = mesa.ubicacion;

  // Mostrar y configurar select para EDITAR
  const estadoSelect = document.getElementById("Estado");
  estadoSelect.innerHTML = "";
  document.getElementById("divEstado").style.display = "block";

  ["Disponible", "Deshabilitada"].forEach((estado) => {
    const opcion = document.createElement("option");
    opcion.value = estado;
    opcion.text = estado;
    if (estado === mesa.estado) {
      opcion.selected = true;
    }
    estadoSelect.appendChild(opcion);
  });

  const modalElement = document.getElementById("exampleModal");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  const botonGuardar = modalElement.querySelector("button.btn-primary");
  botonGuardar.textContent = "Editar";

  // Reemplazar el evento onclick anterior
  botonGuardar.onclick = function () {
    Swal.fire({
      title: "¿Confirmar edición?", text: "Se actualizarán los datos de esta mesa.", icon: "question",
      showCancelButton: true, confirmButtonColor: "#3085d6", cancelButtonColor: "#d33",
      confirmButtonText: "Sí, actualizar", cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        actualizarMesa(id, modal);
      }
    });
  };

  // Escuchar evento cierre modal para limpiar y restaurar
  modalElement.addEventListener("hidden.bs.modal", function onClose() {
    limpiarCampos();

    const btnGuardar = modalElement.querySelector("button.btn-primary");
    btnGuardar.textContent = "Guardar";
    btnGuardar.onclick = guardar;

    modalElement.removeEventListener("hidden.bs.modal", onClose);
  });
}

// Funcion actualizar mesa
function actualizarMesa(id, modal) {

  const capacidad = parseInt(document.getElementById("Capacidad").value);
  const ubicacion = document.getElementById("Ubicacion").value.trim();
  const estado = document.getElementById("Estado").value;

  if (isNaN(capacidad) || capacidad <= 0) {
    Swal.fire({ icon: "error", title: "Capacidad inválida", text: "La capacidad debe ser un número mayor a 0.", });
    return;
  }

  const index = datosGuardados.findIndex((m) => m.id === id);
  if (index !== -1) {
    datosGuardados[index].cantidadPersonas = capacidad;
    datosGuardados[index].ubicacion = ubicacion;
    datosGuardados[index].estado = estado;

    localStorage.setItem("mesas", JSON.stringify(datosGuardados));

    pintarDatos();

    Swal.fire({ icon: "success", title: "Mesa actualizada", text: "Los datos de la mesa se han actualizado correctamente.", });

    modal.hide();

    limpiarCampos();

    const btnGuardar = modal._element.querySelector("button.btn-primary");
    btnGuardar.textContent = "Guardar";
    btnGuardar.onclick = guardar;
  }
}

// Funcion limpiarCampos
function limpiarCampos() {
  const modalElement = document.getElementById("exampleModal");

  document.getElementById("Id").value = "";
  document.getElementById("Id").disabled = false;
  document.getElementById("Capacidad").value = "";
  document.getElementById("Ubicacion").value = "";

  const divEstado = document.getElementById("divEstado");
  if (divEstado) divEstado.style.display = "none";

  // restaurar botón guardar a su comportamiento por defecto
  const btnGuardar = modalElement.querySelector("button.btn-primary");
  if (btnGuardar) {
    btnGuardar.textContent = "Guardar";
    btnGuardar.onclick = guardar;
  }
}

// Funcion ir a reserva
function iraReserva(idMesa) {
  window.location.href = `../Reservas/index1.html?id=${idMesa}&abrirModal=true`;
}

// Funcion duracion de cada ocasion
function obtenerDuracionPorOcasion(ocasion) {
  const duraciones = {
    "Cumpleaños": 120,
    "Compromiso": 180,
    "Aniversario": 120,
    "Graduación": 150,
    "Reunión familiar": 180,
    "Cena de negocios": 120,
    "Amigos": 30,
    "Otro": 30
  };
  return duraciones[ocasion] || 120;
}

//Funcion actualizar estado
function actualizarEstadoMesas() {
  let reservas = JSON.parse(localStorage.getItem("ReservasData")) || [];
  let mesas = JSON.parse(localStorage.getItem("mesas")) || [];
  const ahora = new Date();

  mesas.forEach(mesa => {
    if (mesa.estado === "Deshabilitada") return;

    //Buscar si hay alguna reserva activa SOLO por horario
    const reservaActiva = reservas.find(r => {
      if (String(r.mesa) !== String(mesa.id)) return false;

      // 👉 Si la reserva está cancelada, no show o finalizada, no ocupa mesa
      if (["Cancelada", "No Show", "Finalizada"].includes(r.estadoReserva)) return false;

      const inicio = new Date(`${r.fechaReserva}T${r.horaReserva}`);
      const fin = new Date(inicio.getTime() + obtenerDuracionPorOcasion(r.ocasion) * 60000);

      return ahora >= inicio && ahora <= fin;
    });



    mesa.estado = reservaActiva ? "Ocupada" : "Disponible";
  });

  localStorage.setItem("mesas", JSON.stringify(mesas));
}
