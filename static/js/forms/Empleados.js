document.addEventListener("DOMContentLoaded", () => {
    const formEmpleado = document.getElementById("formEmpleado");

    // Tablas
    const tablaActivos = document.getElementById("tablaActivos");
    const tablaInactivos = document.getElementById("tablaInactivos");

    // Campos del formulario de inserción
    const primerNombre = document.getElementById("primer_nombre");
    const segundoNombre = document.getElementById("segundo_nombre");
    const primerApellido = document.getElementById("primer_apellido");
    const segundoApellido = document.getElementById("segundo_apellido");
    const correoElectronico = document.getElementById("correo_electronico");
    const idCargo = document.getElementById("id_cargo");
    const idSede = document.getElementById("id_sede");
    const idEmpresa = document.getElementById("id_empresa");
    const idArea = document.getElementById("id_area");
    const fechaNacimiento = document.getElementById("fecha_nacimiento");
    const fechaIngreso = document.getElementById("fecha_ingreso");

    // Listas dinámicas para mostrar nombres en lugar de IDs
    let cargos = [];
    let sedes = [];
    let empresas = [];
    let areas = [];
    let empleados = [];

    // Función para cargar opciones dinámicas
    const cargarOpciones = async () => {
        try {
            const [cargosData, sedesData, empresasData, areasData] = await Promise.all([
                fetch("/api/cargos/").then(res => res.json()),
                fetch("/api/sedes/").then(res => res.json()),
                fetch("/api/empresas/").then(res => res.json()),
                fetch("/api/areas/").then(res => res.json()),
            ]);

            cargos = cargosData;
            sedes = sedesData;
            empresas = empresasData;
            areas = areasData;

            const cargarSelect = (select, data, keyId, keyNombre) => {
                select.innerHTML = `<option value="" disabled selected>Selecciona una opción</option>`;
                data.forEach(item => {
                    select.innerHTML += `<option value="${item[keyId]}">${item[keyNombre]}</option>`;
                });
            };

            cargarSelect(idCargo, cargos, "id", "nombre");
            cargarSelect(idSede, sedes, "id", "nombre");
            cargarSelect(idEmpresa, empresas, "id", "nombre");
            cargarSelect(idArea, areas, "id", "nombre");
        } catch (error) {
            console.error("Error al cargar las opciones dinámicas:", error);
            alert("Hubo un error al cargar las opciones dinámicas.");
        }
    };

    // Función para cargar empleados desde el servidor
    const cargarEmpleados = async () => {
        try {
            const res = await fetch("/api/empleados/all");
            if (!res.ok) throw new Error("Error al cargar los empleados");
            empleados = await res.json();

            // Filtrar empleados en activos e inactivos
            const empleadosActivos = empleados.filter(emp => emp.estado === true);
            const empleadosInactivos = empleados.filter(emp => emp.estado === false);

            actualizarTabla(tablaActivos, empleadosActivos, true);
            actualizarTabla(tablaInactivos, empleadosInactivos, false);
        } catch (error) {
            console.error("Error al cargar los empleados:", error);
            alert("Hubo un error al cargar los empleados.");
        }
    };

    // Función para actualizar tablas
    const actualizarTabla = (tabla, datos, esActivo) => {
        tabla.innerHTML = "";
        datos.forEach(empleado => {
            tabla.innerHTML += `
                <tr>
                    <td>${empleado.primer_nombre} ${empleado.segundo_nombre || ""} ${empleado.primer_apellido} ${empleado.segundo_apellido || ""}</td>
                    <td>${empleado.correo_electronico}</td>
                    <td>${obtenerNombrePorId(empleado.id_cargo, cargos)}</td>
                    <td>${obtenerNombrePorId(empleado.id_sede, sedes)}</td>
                    <td>${obtenerNombrePorId(empleado.id_empresa, empresas)}</td>
                    <td>${obtenerNombrePorId(empleado.id_area, areas)}</td>
                    <td>${formatearFecha(empleado.fecha_nacimiento)}</td>
                    <td>${formatearFecha(empleado.fecha_ingreso)}</td>
                    <td>
                        ${
                            esActivo
                                ? `<button class="btn btn-warning btn-sm" onclick="editarEmpleado(${empleado.id_empleado})">Editar</button>
                                   <button class="btn btn-danger btn-sm" onclick="cambiarEstado(${empleado.id_empleado}, false)">Inactivar</button>`
                                : `<button class="btn btn-success btn-sm" onclick="cambiarEstado(${empleado.id_empleado}, true)">Activar</button>`
                        }
                    </td>
                </tr>
            `;
        });
    };

    // Función para formatear fecha en dd/mm/aaaa
    const formatearFecha = (fecha) => {
        const dateObj = new Date(fecha);
        const dia = String(dateObj.getDate()).padStart(2, "0");
        const mes = String(dateObj.getMonth() + 1).padStart(2, "0");
        const anio = dateObj.getFullYear();
        return `${dia}/${mes}/${anio}`;
    };

    // Función para obtener el nombre descriptivo por ID
    const obtenerNombrePorId = (id, lista) => {
        const item = lista.find(el => el.id === id);
        return item ? item.nombre : "Desconocido";
    };

    // Función para cambiar estado de un empleado
    window.cambiarEstado = async (idEmpleado, nuevoEstado) => {
        try {
            const res = await fetch(`/api/empleados/${idEmpleado}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: nuevoEstado })
            });

            if (!res.ok) throw new Error("Error al cambiar el estado del empleado");
            alert(`Empleado ${nuevoEstado ? "activado" : "inactivado"} correctamente.`);
            cargarEmpleados();
        } catch (error) {
            console.error("Error al cambiar el estado del empleado:", error);
            alert("Hubo un error al cambiar el estado del empleado.");
        }
    };

    // Función para editar empleado
    window.editarEmpleado = (idEmpleado) => {
        const empleado = empleados.find(emp => emp.id_empleado === idEmpleado);
        if (!empleado) return alert("Empleado no encontrado");

        // Navegar a la pestaña de insertar empleado y llenar datos
        document.querySelector('[data-tab="tab-insertar"]').click();
        primerNombre.value = empleado.primer_nombre;
        segundoNombre.value = empleado.segundo_nombre || "";
        primerApellido.value = empleado.primer_apellido;
        segundoApellido.value = empleado.segundo_apellido || "";
        correoElectronico.value = empleado.correo_electronico;
        idCargo.value = empleado.id_cargo;
        idSede.value = empleado.id_sede;
        idEmpresa.value = empleado.id_empresa;
        idArea.value = empleado.id_area;
        fechaNacimiento.value = empleado.fecha_nacimiento;
        fechaIngreso.value = empleado.fecha_ingreso;
    };

    // Función para crear un nuevo empleado
    formEmpleado.addEventListener("submit", async e => {
        e.preventDefault();

        const nuevoEmpleado = {
            primer_nombre: primerNombre.value.trim(),
            segundo_nombre: segundoNombre.value.trim(),
            primer_apellido: primerApellido.value.trim(),
            segundo_apellido: segundoApellido.value.trim(),
            correo_electronico: correoElectronico.value.trim(),
            id_cargo: parseInt(idCargo.value),
            id_sede: parseInt(idSede.value),
            id_empresa: parseInt(idEmpresa.value),
            id_area: parseInt(idArea.value),
            fecha_nacimiento: fechaNacimiento.value,
            fecha_ingreso: fechaIngreso.value,
        };

        try {
            const res = await fetch("/api/empleados/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoEmpleado),
            });

            if (!res.ok) throw new Error("Error al insertar el empleado");
            formEmpleado.reset();
            alert("Empleado insertado correctamente.");
            cargarEmpleados();
        } catch (error) {
            console.error("Error al insertar el empleado:", error);
            alert("Hubo un error al insertar el empleado.");
        }
    });

    // Inicializar opciones y empleados
    cargarOpciones();
    cargarEmpleados();
});
