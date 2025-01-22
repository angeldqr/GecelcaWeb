document.addEventListener("DOMContentLoaded", () => {
    const tablaCargos = document.getElementById("tablaCargos");
    const paginacion = document.getElementById("paginacion");
    const formCargo = document.getElementById("formCargo");
    const modalEditar = new bootstrap.Modal(document.getElementById("modalEditar"));
    const inputEditarNombre = document.getElementById("editar_nombre_cargo");
    const guardarEdicionBtn = document.getElementById("guardar-edicion");
    let cargoIdEnEdicion = null;

    const itemsPorPagina = 10;
    let paginaActual = 1;
    let datos = [];

    // Actualizar la tabla con los cargos
    const actualizarTabla = () => {
        tablaCargos.innerHTML = "";
        const inicio = (paginaActual - 1) * itemsPorPagina;
        const fin = inicio + itemsPorPagina;

        const datosPagina = datos.slice(inicio, fin);

        datosPagina.forEach((cargo) => {
            tablaCargos.innerHTML += `
                <tr>
                    <td>${cargo.nombre}</td>
                    <td>${cargo.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                        ${
                            cargo.estado
                                ? `
                                    <button class="btn btn-warning btn-sm" onclick="editarCargo(${cargo.id}, '${cargo.nombre}')">Editar</button>
                                    <button class="btn btn-danger btn-sm" onclick="inactivarCargo(${cargo.id})">Inactivar</button>
                                  `
                                : `<button class="btn btn-success btn-sm" onclick="activarCargo(${cargo.id})">Activar</button>`
                        }
                    </td>
                </tr>
            `;
        });

        actualizarPaginacion();
    };

    // Actualizar la paginación
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

    // Cargar los cargos desde el servidor
    const cargarCargos = async () => {
        try {
            const res = await fetch("/api/cargos/all");
            if (!res.ok) throw new Error("Error al cargar los cargos");
            datos = await res.json();
            actualizarTabla();
        } catch (error) {
            console.error(error);
            alert("Error al cargar los cargos.");
        }
    };

    // Crear un nuevo cargo
    formCargo.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombre = document.getElementById("nombre_cargo").value.trim();

        if (!nombre) {
            alert("El nombre del cargo no puede estar vacío.");
            return;
        }

        try {
            const res = await fetch("/api/cargos/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre_cargo: nombre }),
            });

            if (!res.ok) throw new Error("Error al insertar el cargo");

            formCargo.reset(); // Limpiar el formulario
            cargarCargos(); // Recargar los cargos
            alert("Cargo insertado correctamente.");
        } catch (error) {
            console.error("Error al insertar el cargo:", error);
            alert("Hubo un error al insertar el cargo.");
        }
    });

    // Editar un cargo
    window.editarCargo = (id, nombre) => {
        inputEditarNombre.value = nombre;
        cargoIdEnEdicion = id;
        modalEditar.show();
    };

    // Guardar los cambios en el cargo
    guardarEdicionBtn.addEventListener("click", async () => {
        const nuevoNombre = inputEditarNombre.value.trim();

        if (!nuevoNombre) {
            alert("El nombre del cargo no puede estar vacío.");
            return;
        }

        try {
            const res = await fetch(`/api/cargos/${cargoIdEnEdicion}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre_cargo: nuevoNombre }),
            });

            if (!res.ok) throw new Error("Error al actualizar el cargo");

            alert("Cargo actualizado correctamente.");
            cargoIdEnEdicion = null;
            modalEditar.hide();
            cargarCargos();
        } catch (error) {
            console.error("Error al editar el cargo:", error);
            alert("Hubo un error al editar el cargo.");
        }
    });

    // Inactivar un cargo
    window.inactivarCargo = async (id) => {
        if (!confirm("¿Estás seguro de inactivar este cargo?")) return;

        try {
            const res = await fetch(`/api/cargos/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Error al inactivar el cargo");

            cargarCargos();
        } catch (error) {
            console.error("Error al inactivar el cargo:", error);
            alert("Hubo un error al inactivar el cargo.");
        }
    };

    // Activar un cargo
    window.activarCargo = async (id) => {
        try {
            const res = await fetch(`/api/cargos/${id}/reactivate`, {
                method: "PUT",
            });

            if (!res.ok) throw new Error("Error al activar el cargo");

            cargarCargos();
        } catch (error) {
            console.error("Error al activar el cargo:", error);
            alert("Hubo un error al activar el cargo.");
        }
    };

    // Inicializar la carga de cargos
    cargarCargos();
});
