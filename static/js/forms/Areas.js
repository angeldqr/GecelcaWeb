document.addEventListener("DOMContentLoaded", () => {
    const tablaAreas = document.getElementById("tablaAreas");
    const formArea = document.getElementById("formArea");
    const modalEditar = new bootstrap.Modal(document.getElementById("modalEditar"));
    const inputEditarNombre = document.getElementById("editar_nombre_area");
    const guardarEdicionBtn = document.getElementById("guardar-edicion");
    let areaIdEnEdicion = null;

    // Cargar Áreas
    const cargarAreas = async () => {
        try {
            const res = await fetch("/api/areas/");
            if (!res.ok) throw new Error("Error al cargar las áreas");
            const data = await res.json();

            // Llenar la tabla
            tablaAreas.innerHTML = "";
            data.forEach(area => {
                tablaAreas.innerHTML += `
                    <tr>
                        <td>${area.nombre_area}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editarArea(${area.id_area}, '${area.nombre_area}')">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarArea(${area.id_area})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error(error);
            alert("Error al cargar las áreas.");
        }
    };

    // Insertar Área
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
            cargarAreas(); // Recargar áreas
        } catch (error) {
            console.error("Error al insertar el área:", error);
        }
    });

    // Editar Área
    window.editarArea = (id, nombre) => {
        inputEditarNombre.value = nombre;
        areaIdEnEdicion = id;
        modalEditar.show();
    };

    // Guardar Cambios en Edición
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
            cargarAreas(); // Recargar áreas
        } catch (error) {
            console.error("Error al editar el área:", error);
        }
    });

    // Eliminar Área
    window.eliminarArea = async (id) => {
        if (!confirm("¿Estás seguro de eliminar esta área?")) return;
        try {
            await fetch(`/api/areas/${id}`, { method: "DELETE" });
            cargarAreas(); // Recargar áreas
        } catch (error) {
            console.error("Error al eliminar el área:", error);
        }
    };

    cargarAreas(); // Cargar áreas al iniciar
});
