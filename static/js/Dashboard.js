document.addEventListener("DOMContentLoaded", () => {
    alert("El script se ha cargado correctamente.");
    console.log("El script Dashboard.js se está ejecutando.");
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

    // Cargar contenido dinámicamente con mejor manejo de errores
    async function cargarContenido(route, enlaceSeleccionado) {
        contentArea.innerHTML = `<p class="loading">Cargando...</p>`;

        try {
            const response = await fetch(route);
            if (!response.ok) throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);

            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                renderizarVista(route, data);
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

    // Renderizar vistas de acuerdo con los datos obtenidos
    function renderizarVista(route, data) {
        switch (true) {
            case route.includes("/api/empleados"): renderizarEmpleados(data); break;
            case route.includes("/api/areas"): renderizarAreas(data); break;
            case route.includes("/api/cargos"): renderizarCargos(data); break;
            case route.includes("/api/empresas"): renderizarEmpresas(data); break;
            case route.includes("/api/sedes"): renderizarSedes(data); break;
            default:
                contentArea.innerHTML = `<p>Se cargó el contenido correctamente.</p>`;
        }
    }

    // Renderizar Empleados
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

    // Cargar la primera sección por defecto
    const primerEnlace = document.querySelector(".enlace");
    if (primerEnlace) {
        const primeraRuta = primerEnlace.getAttribute("data-route");
        cargarContenido(primeraRuta, primerEnlace);
    }
});
