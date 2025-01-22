document.addEventListener("DOMContentLoaded", () => {
    const tablaSedes = document.getElementById("tablaSedes");
    const paginacion = document.getElementById("paginacion");
    const formSede = document.getElementById("formSede");
    const modalEditar = new bootstrap.Modal(document.getElementById("modalEditar"));
    const inputEditarNombre = document.getElementById("editar_nombre_sede");
    const guardarEdicionBtn = document.getElementById("guardar-edicion");
    let sedeIdEnEdicion = null;

    const itemsPorPagina = 10;
    let paginaActual = 1;
    let datos = [];

    // Actualizar tabla
    const actualizarTabla = () => {
        tablaSedes.innerHTML = "";
        const inicio = (paginaActual - 1) * itemsPorPagina;
        const fin = inicio + itemsPorPagina;

        const datosPagina = datos.slice(inicio, fin);

        datosPagina.forEach((sede) => {
            tablaSedes.innerHTML += `
                <tr>
                    <td>${sede.nombre}</td>
                    <td>${sede.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                        ${
                            sede.estado
                                ? `
                                    <button class="btn btn-warning btn-sm" onclick="editarSede(${sede.id}, '${sede.nombre}')">Editar</button>
                                    <button class="btn btn-danger btn-sm" onclick="inactivarSede(${sede.id})">Inactivar</button>
                                  `
                                : `<button class="btn btn-success btn-sm" onclick="activarSede(${sede.id})">Activar</button>`
                        }
                    </td>
                </tr>
            `;
        });

        actualizarPaginacion();
    };

    // Actualizar paginación
    const actualizarPaginacion = () => {
        paginacion.innerHTML = "";
        const totalPaginas = Math.ceil(datos.length / itemsPorPagina);

        for (let i = 1; i <= totalPaginas; i++) {
            paginacion.innerHTML += `
                <button class="btn btn-primary btn-sm mx-1 ${i === paginaActual ? "active" : ""}" onclick="cambiarPagina(${i})">${i}</button>
            `;
        }
    };

    // Cambiar de página
    window.cambiarPagina = (pagina) => {
        paginaActual = pagina;
        actualizarTabla();
    };

    // Cargar sedes desde el servidor
    const cargarSedes = async () => {
        try {
            const res = await fetch("/api/sedes/all");
            if (!res.ok) throw new Error("Error al cargar las sedes");
            datos = await res.json();
            actualizarTabla();
        } catch (error) {
            console.error("Error al cargar las sedes:", error);
            alert("Error al cargar las sedes.");
        }
    };

    // Crear nueva sede
    formSede.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombre = document.getElementById("nombre_sede").value.trim();

        if (!nombre) {
            alert("El nombre de la sede no puede estar vacío.");
            return;
        }

        try {
            const res = await fetch("/api/sedes/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre_sede: nombre }),
            });

            if (!res.ok) throw new Error("Error al insertar la sede");

            formSede.reset();
            cargarSedes();
            alert("Sede insertada correctamente.");
        } catch (error) {
            console.error("Error al insertar la sede:", error);
            alert("Hubo un error al insertar la sede.");
        }
    });

    // Editar sede
    window.editarSede = (id, nombre) => {
        inputEditarNombre.value = nombre;
        sedeIdEnEdicion = id;
        modalEditar.show();
    };

    // Guardar cambios en la sede
    guardarEdicionBtn.addEventListener("click", async () => {
        const nuevoNombre = inputEditarNombre.value.trim();

        if (!nuevoNombre) {
            alert("El nombre de la sede no puede estar vacío.");
            return;
        }

        try {
            const res = await fetch(`/api/sedes/${sedeIdEnEdicion}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre_sede: nuevoNombre }),
            });

            if (!res.ok) throw new Error("Error al editar la sede");

            alert("Sede actualizada correctamente.");
            sedeIdEnEdicion = null;
            modalEditar.hide();
            cargarSedes();
        } catch (error) {
            console.error("Error al editar la sede:", error);
            alert("Hubo un error al editar la sede.");
        }
    });

    // Inactivar sede
    window.inactivarSede = async (id) => {
        if (!confirm("¿Estás seguro de inactivar esta sede?")) return;

        try {
            const res = await fetch(`/api/sedes/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Error al inactivar la sede");

            cargarSedes();
        } catch (error) {
            console.error("Error al inactivar la sede:", error);
            alert("Hubo un error al inactivar la sede.");
        }
    };

    // Activar sede
    window.activarSede = async (id) => {
        try {
            const res = await fetch(`/api/sedes/${id}/reactivate`, {
                method: "PUT",
            });

            if (!res.ok) throw new Error("Error al activar la sede");

            cargarSedes();
        } catch (error) {
            console.error("Error al activar la sede:", error);
            alert("Hubo un error al activar la sede.");
        }
    };

    // Inicializar la carga de sedes
    cargarSedes();
});
