document.addEventListener("DOMContentLoaded", () => {
    const tablaAreas = document.getElementById("tablaAreas");
    const paginacion = document.getElementById("paginacion");
    const formArea = document.getElementById("formArea");
    const modalEditar = new bootstrap.Modal(document.getElementById("modalEditar"));
    const inputEditarNombre = document.getElementById("editar_nombre_area");
    const guardarEdicionBtn = document.getElementById("guardar-edicion");
    let areaIdEnEdicion = null;

    const itemsPorPagina = 10;
    let paginaActual = 1;
    let datos = [];

    const actualizarTabla = () => {
        tablaAreas.innerHTML = "";
        const inicio = (paginaActual - 1) * itemsPorPagina;
        const fin = inicio + itemsPorPagina;

        const datosPagina = datos.slice(inicio, fin);

        datosPagina.forEach(area => {
            tablaAreas.innerHTML += `
                <tr>
                    <td>${area.nombre_area}</td>
                    <td>${area.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                        ${area.estado
                            ? `
                                <button class="btn btn-warning btn-sm" onclick="editarArea(${area.id_area}, '${area.nombre_area}')">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="inactivarArea(${area.id_area})">Inactivar</button>
                              `
                            : `<button class="btn btn-success btn-sm" onclick="activarArea(${area.id_area})">Activar</button>`
                        }
                    </td>
                </tr>
            `;
        });

        actualizarPaginacion();
    };

    const actualizarPaginacion = () => {
        paginacion.innerHTML = "";
        const totalPaginas = Math.ceil(datos.length / itemsPorPagina);

        for (let i = 1; i <= totalPaginas; i++) {
            paginacion.innerHTML += `
                <button class="btn btn-primary btn-sm mx-1 ${i === paginaActual ? "active" : ""}" onclick="cambiarPagina(${i})">${i}</button>
            `;
        }
    };

    window.cambiarPagina = (pagina) => {
        paginaActual = pagina;
        actualizarTabla();
    };

    const cargarAreas = async () => {
        try {
            const res = await fetch("/api/areas/");
            if (!res.ok) throw new Error("Error al cargar las áreas");
            datos = await res.json();
            actualizarTabla();
        } catch (error) {
            console.error(error);
            alert("Error al cargar las áreas.");
        }
    };

    formArea.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombre = document.getElementById("nombre_area").value;

        try {
            await fetch("/api/areas/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre_area: nombre }),
            });
            formArea.reset();
            cargarAreas();
        } catch (error) {
            console.error("Error al insertar el área:", error);
        }
    });

    window.editarArea = (id, nombre) => {
        inputEditarNombre.value = nombre;
        areaIdEnEdicion = id;
        modalEditar.show();
    };

    guardarEdicionBtn.addEventListener("click", async () => {
        const nuevoNombre = inputEditarNombre.value;

        try {
            await fetch(`/api/areas/${areaIdEnEdicion}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre_area: nuevoNombre }),
            });
            alert("Área actualizada correctamente");
            areaIdEnEdicion = null;
            modalEditar.hide();
            cargarAreas();
        } catch (error) {
            console.error("Error al editar el área:", error);
        }
    });

    window.inactivarArea = async (id) => {
        if (!confirm("¿Estás seguro de inactivar esta área?")) return;
        try {
            await fetch(`/api/areas/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: false }),
            });
            cargarAreas();
        } catch (error) {
            console.error("Error al inactivar el área:", error);
        }
    };

    window.activarArea = async (id) => {
        try {
            await fetch(`/api/areas/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: true }),
            });
            cargarAreas();
        } catch (error) {
            console.error("Error al activar el área:", error);
        }
    };

    cargarAreas();
});
