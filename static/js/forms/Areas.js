document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Areas.js se ha cargado correctamente.");

    // 🌟 Variables globales
    const tablaAreas = document.getElementById("tablaAreas");
    const paginacion = document.getElementById("paginacion");
    const formArea = document.getElementById("formArea");
    const modalEditar = new bootstrap.Modal(document.getElementById("modalEditar"));
    const inputEditarNombre = document.getElementById("editar_nombre_area");
    const guardarEdicionBtn = document.getElementById("guardar-edicion");

    let areaIdEnEdicion = null;
    let datos = [];
    const itemsPorPagina = 10;
    let paginaActual = 1;

    // 🔄 Definir `cargarAreas()` globalmente
    window.cargarAreas = async () => {
        try {
            console.log("🔄 Cargando áreas desde el backend...");
            const res = await fetch("/api/areas/all");
            if (!res.ok) throw new Error("Error al cargar las áreas");

            datos = await res.json();
            console.log("✅ Datos de áreas recibidos:", datos);
            actualizarTabla();
        } catch (error) {
            console.error("❌ Error cargando las áreas:", error);
        }
    };

    // 📝 Actualizar la tabla con los datos paginados
    const actualizarTabla = () => {
        if (!tablaAreas) {
            console.error("❌ La tabla de áreas no se encontró.");
            return;
        }

        tablaAreas.innerHTML = "";
        const inicio = (paginaActual - 1) * itemsPorPagina;
        const fin = inicio + itemsPorPagina;
        const datosPagina = datos.slice(inicio, fin);

        datosPagina.forEach(area => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${area.nombre}</td>
                <td>${area.estado ? "Activo" : "Inactivo"}</td>
                <td>
                    ${
                        area.estado
                            ? `<button class="btn btn-warning btn-sm" onclick="editarArea(${area.id}, '${area.nombre}')">✏️ Editar</button>
                               <button class="btn btn-danger btn-sm" onclick="inactivarArea(${area.id})">🛑 Inactivar</button>`
                            : `<button class="btn btn-success btn-sm" onclick="activarArea(${area.id})">✅ Activar</button>`
                    }
                </td>
            `;
            tablaAreas.appendChild(fila);
        });

        actualizarPaginacion();
    };

    // 📌 Paginación
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

    // ➕ Agregar nueva área
    formArea.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombre = document.getElementById("nombre_area").value.trim();

        if (!nombre) {
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
            cargarAreas();
        } catch (error) {
            console.error("❌ Error al insertar el área:", error);
        }
    });

    // ✏️ Editar un área
    window.editarArea = (id, nombre) => {
        inputEditarNombre.value = nombre;
        areaIdEnEdicion = id;
        modalEditar.show();
    };

    guardarEdicionBtn.addEventListener("click", async () => {
        const nuevoNombre = inputEditarNombre.value.trim();

        if (!nuevoNombre) {
            alert("El nombre del área no puede estar vacío.");
            return;
        }

        try {
            await fetch(`/api/areas/${areaIdEnEdicion}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre_area: nuevoNombre }),
            });

            modalEditar.hide();
            cargarAreas();
        } catch (error) {
            console.error("❌ Error al editar el área:", error);
        }
    });

    // 🛑 Inactivar área
    window.inactivarArea = async (id) => {
        if (!confirm("¿Estás seguro de inactivar esta área?")) return;

        try {
            await fetch(`/api/areas/${id}`, { method: "DELETE" });
            cargarAreas();
        } catch (error) {
            console.error("❌ Error al inactivar el área:", error);
        }
    };

    // ✅ Activar área
    window.activarArea = async (id) => {
        try {
            await fetch(`/api/areas/${id}/reactivate`, { method: "PUT" });
            cargarAreas();
        } catch (error) {
            console.error("❌ Error al activar el área:", error);
        }
    };

    // 🚀 Ejecutar cargarAreas() después de que la vista se haya cargado
    setTimeout(() => {
        if (typeof window.cargarAreas === "function") {
            console.log("🚀 Ejecutando cargarAreas()...");
            cargarAreas();
        } else {
            console.error("❌ cargarAreas() sigue sin estar definida.");
        }
    }, 300);
});
