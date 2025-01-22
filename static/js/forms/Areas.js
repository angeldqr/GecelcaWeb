document.addEventListener("DOMContentLoaded", () => {
    const tablaAreas = document.getElementById("tablaAreas");
    const paginacion = document.getElementById("paginacion");
    const formArea = document.getElementById("formArea");
    const modalEditar = new bootstrap.Modal(document.getElementById("modalEditar"));
    const inputEditarNombre = document.getElementById("editar_nombre_area");
    const guardarEdicionBtn = document.getElementById("guardar-edicion");
    let areaIdEnEdicion = null;

    const itemsPorPagina = 10; // Número de áreas por página
    let paginaActual = 1;
    let datos = [];

    // Actualizar la tabla con datos paginados
    const actualizarTabla = () => {
        tablaAreas.innerHTML = "";
        const inicio = (paginaActual - 1) * itemsPorPagina;
        const fin = inicio + itemsPorPagina;

        const datosPagina = datos.slice(inicio, fin);

        datosPagina.forEach(area => {
            tablaAreas.innerHTML += `
                <tr>
                    <td>${area.nombre}</td>
                    <td>${area.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                        ${
                            area.estado
                                ? `
                                    <button class="btn btn-warning btn-sm" onclick="editarArea(${area.id}, '${area.nombre}')">Editar</button>
                                    <button class="btn btn-danger btn-sm" onclick="inactivarArea(${area.id})">Inactivar</button>
                                  `
                                : `<button class="btn btn-success btn-sm" onclick="activarArea(${area.id})">Activar</button>`
                        }
                    </td>
                </tr>
            `;
        });

        actualizarPaginacion();
    };

    // Actualizar los botones de paginación
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

    // Cargar todas las áreas del servidor
    const cargarAreas = async () => {
        try {
            const res = await fetch("/api/areas/all"); // Usar la ruta que devuelve todas las áreas
            if (!res.ok) throw new Error("Error al cargar las áreas");
            datos = await res.json(); // Guardar los datos en la variable global
            actualizarTabla(); // Renderizar la tabla con los datos cargados
        } catch (error) {
            console.error("Error al cargar las áreas:", error);
            alert("Hubo un problema al cargar las áreas. Intenta nuevamente.");
        }
    };

    // Crear una nueva área
    formArea.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombre = document.getElementById("nombre_area").value;

        if (!nombre.trim()) {
            alert("El nombre del área no puede estar vacío.");
            return;
        }

        try {
            await fetch("/api/areas/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre_area: nombre }),
            });
            formArea.reset();
            cargarAreas(); // Recargar las áreas después de crear una nueva
        } catch (error) {
            console.error("Error al insertar el área:", error);
        }
    });

    // Editar un área
    window.editarArea = (id, nombre) => {
        inputEditarNombre.value = nombre;
        areaIdEnEdicion = id;
        modalEditar.show(); // Mostrar el modal de edición
    };

    // Guardar los cambios de edición
    guardarEdicionBtn.addEventListener("click", async () => {
        const nuevoNombre = inputEditarNombre.value;

        if (!nuevoNombre.trim()) {
            alert("El nombre del área no puede estar vacío.");
            return;
        }

        try {
            await fetch(`/api/areas/${areaIdEnEdicion}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre_area: nuevoNombre }),
            });
            alert("Área actualizada correctamente.");
            areaIdEnEdicion = null;
            modalEditar.hide();
            cargarAreas();
        } catch (error) {
            console.error("Error al editar el área:", error);
        }
    });

    // Inactivar un área
    window.inactivarArea = async (id) => {
        if (!confirm("¿Estás seguro de inactivar esta área?")) return;

        try {
            await fetch(`/api/areas/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: false }), // Actualizar el estado a inactivo
            });
            cargarAreas();
        } catch (error) {
            console.error("Error al inactivar el área:", error);
        }
    };

    // Activar un área
    window.activarArea = async (id) => {
        try {
            await fetch(`/api/areas/${id}/reactivate`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });
            cargarAreas();
        } catch (error) {
            console.error("Error al activar el área:", error);
        }
    };

    // Inicializar la carga de áreas
    cargarAreas();
});
