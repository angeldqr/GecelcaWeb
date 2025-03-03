document.addEventListener("DOMContentLoaded", function () {
    cargarAreas();

    document.getElementById("formArea").addEventListener("submit", function (event) {
        event.preventDefault();
        crearArea();
    });

    document.getElementById("guardar-edicion").addEventListener("click", function () {
        actualizarArea();
    });
});

async function cargarAreas() {
    try {
        let response = await fetch("/api/areas/all");
        let areas = await response.json();
        let tbody = document.getElementById("tablaAreas");
        tbody.innerHTML = "";

        areas.forEach(area => {
            let fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${area.nombre}</td>
                <td>${area.estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                    ${area.estado ? `
                        <button class="btn btn-warning btn-sm" onclick="mostrarModalEdicion(${area.id}, '${area.nombre}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="cambiarEstadoArea(${area.id}, false)">Inactivar</button>
                    ` : `
                        <button class="btn btn-success btn-sm" onclick="cambiarEstadoArea(${area.id}, true)">Activar</button>
                    `}
                </td>
            `;
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al cargar las áreas", error);
    }
}

async function crearArea() {
    let nombre_area = document.getElementById("nombre_area").value.trim();
    if (!nombre_area) return alert("El nombre del área no puede estar vacío");

    try {
        let response = await fetch("/api/areas/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre_area })
        });

        if (response.ok) {
            cargarAreas();
            document.getElementById("formArea").reset();
        } else {
            alert("Error al crear el área");
        }
    } catch (error) {
        console.error("Error al crear el área", error);
    }
}

function mostrarModalEdicion(id, nombre) {
    document.getElementById("editar_id_area").value = id;
    document.getElementById("editar_nombre_area").value = nombre;
    let modal = new bootstrap.Modal(document.getElementById("modalEditar"));
    modal.show();
}

async function actualizarArea() {
    let id_area = document.getElementById("editar_id_area").value;
    let nombre_area = document.getElementById("editar_nombre_area").value.trim();

    if (!nombre_area) return alert("El nombre del área no puede estar vacío");

    try {
        let response = await fetch(`/api/areas/${id_area}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre_area })
        });

        if (response.ok) {
            cargarAreas();
            bootstrap.Modal.getInstance(document.getElementById("modalEditar")).hide();
        } else {
            alert("Error al actualizar el área");
        }
    } catch (error) {
        console.error("Error al actualizar el área", error);
    }
}

async function cambiarEstadoArea(id, estado) {
    let url = estado ? `/api/areas/${id}/reactivate` : `/api/areas/${id}`;
    let method = estado ? "PUT" : "DELETE";

    try {
        let response = await fetch(url, { method });
        if (response.ok) {
            cargarAreas();
        } else {
            alert("Error al cambiar estado del área");
        }
    } catch (error) {
        console.error("Error al cambiar estado del área", error);
    }
}