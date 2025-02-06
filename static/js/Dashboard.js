document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".toggle");
    const menuDashboard = document.querySelector(".menu-dashboard");
    const iconoMenu = toggle.querySelector("i");
    const enlacesMenu = document.querySelectorAll(".enlace");
    const contentArea = document.getElementById("content-area");

    // Expandir / Contraer Menú
    toggle.addEventListener("click", () => {
        const isOpen = menuDashboard.classList.toggle("open");
        iconoMenu.classList.replace(isOpen ? "bx-menu" : "bx-x", isOpen ? "bx-x" : "bx-menu");
    });

    // Cargar contenido dinámicamente
    async function cargarContenido(route, enlaceSeleccionado) {
        contentArea.innerHTML = `<p class="loading">Cargando...</p>`;

        try {
            const response = await fetch(route, {
                headers: { "Accept": "application/json" }
            });

            if (!response.ok) throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);

            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                if (route.includes("/empleados/")) {
                    renderizarEmpleados(data);
                } else {
                    contentArea.innerHTML = `<p>Se cargó el contenido correctamente.</p>`;
                }
            } else {
                contentArea.innerHTML = await response.text();
            }

            enlacesMenu.forEach(enlace => enlace.classList.remove("activo"));
            enlaceSeleccionado.classList.add("activo");

        } catch (error) {
            console.error("Error al cargar los datos:", error);
            contentArea.innerHTML = `<p class="error">Error al cargar el contenido. Ver la consola para más detalles.</p>`;
        }
    }

    // Renderizar empleados en la tabla
    function renderizarEmpleados(empleados) {
        let tabla = `
            <div class="tabla-contenedor">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Cargo</th>
                            <th>Sede</th>
                            <th>Empresa</th>
                            <th>Área</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        empleados.forEach(emp => {
            tabla += `
                <tr>
                    <td>${emp.primer_nombre} ${emp.segundo_nombre || ""} ${emp.primer_apellido} ${emp.segundo_apellido || ""}</td>
                    <td>${emp.correo_electronico}</td>
                    <td>${emp.id_cargo}</td>
                    <td>${emp.id_sede}</td>
                    <td>${emp.id_empresa}</td>
                    <td>${emp.id_area}</td>
                    <td><button>Editar</button> <button>Eliminar</button></td>
                </tr>
            `;
        });

        tabla += `</tbody></table></div>`;
        contentArea.innerHTML = tabla;
    }

    enlacesMenu.forEach(enlace => {
        enlace.addEventListener("click", () => {
            const route = enlace.getAttribute("data-route");
            if (route) cargarContenido(route, enlace);
        });
    });
});
