document.addEventListener("DOMContentLoaded", () => {
    const tablaEmpresas = document.getElementById("tablaEmpresas");
    const paginacion = document.getElementById("paginacion");
    const formEmpresa = document.getElementById("formEmpresa");
    const modalEditar = new bootstrap.Modal(document.getElementById("modalEditar"));
    const inputEditarNombre = document.getElementById("editar_nombre_empresa");
    const guardarEdicionBtn = document.getElementById("guardar-edicion");
    let empresaIdEnEdicion = null;

    const itemsPorPagina = 10;
    let paginaActual = 1;
    let datos = [];

    // Actualizar tabla
    const actualizarTabla = () => {
        tablaEmpresas.innerHTML = "";
        const inicio = (paginaActual - 1) * itemsPorPagina;
        const fin = inicio + itemsPorPagina;

        const datosPagina = datos.slice(inicio, fin);

        datosPagina.forEach((empresa) => {
            tablaEmpresas.innerHTML += `
                <tr>
                    <td>${empresa.nombre}</td>
                    <td>${empresa.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                        ${
                            empresa.estado
                                ? `
                                    <button class="btn btn-warning btn-sm" onclick="editarEmpresa(${empresa.id}, '${empresa.nombre}')">Editar</button>
                                    <button class="btn btn-danger btn-sm" onclick="inactivarEmpresa(${empresa.id})">Inactivar</button>
                                  `
                                : `<button class="btn btn-success btn-sm" onclick="activarEmpresa(${empresa.id})">Activar</button>`
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

    // Cargar empresas desde el servidor
    const cargarEmpresas = async () => {
        try {
            const res = await fetch("/api/empresas/all");
            if (!res.ok) throw new Error("Error al cargar las empresas");
            datos = await res.json();
            actualizarTabla();
        } catch (error) {
            console.error(error);
            alert("Error al cargar las empresas.");
        }
    };

    // Crear nueva empresa
    formEmpresa.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombre = document.getElementById("nombre_empresa").value.trim();

        if (!nombre) {
            alert("El nombre de la empresa no puede estar vacío.");
            return;
        }

        try {
            const res = await fetch("/api/empresas/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre_empresa: nombre }),
            });

            if (!res.ok) throw new Error("Error al insertar la empresa");

            formEmpresa.reset();
            cargarEmpresas();
            alert("Empresa insertada correctamente.");
        } catch (error) {
            console.error("Error al insertar la empresa:", error);
            alert("Hubo un error al insertar la empresa.");
        }
    });

    // Editar empresa
    window.editarEmpresa = (id, nombre) => {
        inputEditarNombre.value = nombre;
        empresaIdEnEdicion = id;
        modalEditar.show();
    };

    // Guardar cambios en la empresa
    guardarEdicionBtn.addEventListener("click", async () => {
        const nuevoNombre = inputEditarNombre.value.trim();

        if (!nuevoNombre) {
            alert("El nombre de la empresa no puede estar vacío.");
            return;
        }

        try {
            const res = await fetch(`/api/empresas/${empresaIdEnEdicion}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre_empresa: nuevoNombre }),
            });

            if (!res.ok) throw new Error("Error al editar la empresa");

            alert("Empresa actualizada correctamente.");
            empresaIdEnEdicion = null;
            modalEditar.hide();
            cargarEmpresas();
        } catch (error) {
            console.error("Error al editar la empresa:", error);
            alert("Hubo un error al editar la empresa.");
        }
    });

    // Inactivar empresa
    window.inactivarEmpresa = async (id) => {
        if (!confirm("¿Estás seguro de inactivar esta empresa?")) return;

        try {
            const res = await fetch(`/api/empresas/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Error al inactivar la empresa");

            cargarEmpresas();
        } catch (error) {
            console.error("Error al inactivar la empresa:", error);
            alert("Hubo un error al inactivar la empresa.");
        }
    };

    // Activar empresa
    window.activarEmpresa = async (id) => {
        try {
            const res = await fetch(`/api/empresas/${id}/reactivate`, {
                method: "PUT",
            });

            if (!res.ok) throw new Error("Error al activar la empresa");

            cargarEmpresas();
        } catch (error) {
            console.error("Error al activar la empresa:", error);
            alert("Hubo un error al activar la empresa.");
        }
    };

    // Inicializar la carga de empresas
    cargarEmpresas();
});
