document.addEventListener("DOMContentLoaded", () => {
    const formEmpleado = document.getElementById("formEmpleado");
    const formEditarEmpleado = document.getElementById("formEditarEmpleado");

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

    // Modal de edición
    const modalEditarEmpleado = new bootstrap.Modal(document.getElementById("modalEditarEmpleado"));
    const editarIdEmpleado = document.getElementById("editar_id_empleado");

    const editarPrimerNombre = document.getElementById("editar_primer_nombre");
    const editarSegundoNombre = document.getElementById("editar_segundo_nombre");
    const editarPrimerApellido = document.getElementById("editar_primer_apellido");
    const editarSegundoApellido = document.getElementById("editar_segundo_apellido");
    const editarCorreoElectronico = document.getElementById("editar_correo_electronico");
    const editarIdCargo = document.getElementById("editar_id_cargo");
    const editarIdSede = document.getElementById("editar_id_sede");
    const editarIdEmpresa = document.getElementById("editar_id_empresa");
    const editarIdArea = document.getElementById("editar_id_area");
    const editarFechaNacimiento = document.getElementById("editar_fecha_nacimiento");
    const editarFechaIngreso = document.getElementById("editar_fecha_ingreso");

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

            cargarSelect(editarIdCargo, cargos, "id", "nombre");
            cargarSelect(editarIdSede, sedes, "id", "nombre");
            cargarSelect(editarIdEmpresa, empresas, "id", "nombre");
            cargarSelect(editarIdArea, areas, "id", "nombre");
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

    // Función para abrir el modal de edición con datos
    window.editarEmpleado = (idEmpleado) => {
        const empleado = empleados.find(emp => emp.id_empleado === idEmpleado);
        if (!empleado) return alert("Empleado no encontrado");

        editarIdEmpleado.value = idEmpleado;
        editarPrimerNombre.value = empleado.primer_nombre;
        editarSegundoNombre.value = empleado.segundo_nombre || "";
        editarPrimerApellido.value = empleado.primer_apellido;
        editarSegundoApellido.value = empleado.segundo_apellido || "";
        editarCorreoElectronico.value = empleado.correo_electronico;
        editarIdCargo.value = empleado.id_cargo;
        editarIdSede.value = empleado.id_sede;
        editarIdEmpresa.value = empleado.id_empresa;
        editarIdArea.value = empleado.id_area;
        editarFechaNacimiento.value = empleado.fecha_nacimiento;
        editarFechaIngreso.value = empleado.fecha_ingreso;

        modalEditarEmpleado.show();
    };

    // Función para guardar cambios desde el modal
    formEditarEmpleado.addEventListener("submit", async (e) => {
        e.preventDefault();
        const idEmpleado = editarIdEmpleado.value;

        const empleadoData = {
            primer_nombre: editarPrimerNombre.value.trim(),
            segundo_nombre: editarSegundoNombre.value.trim(),
            primer_apellido: editarPrimerApellido.value.trim(),
            segundo_apellido: editarSegundoApellido.value.trim(),
            correo_electronico: editarCorreoElectronico.value.trim(),
            id_cargo: parseInt(editarIdCargo.value),
            id_sede: parseInt(editarIdSede.value),
            id_empresa: parseInt(editarIdEmpresa.value),
            id_area: parseInt(editarIdArea.value),
            fecha_nacimiento: editarFechaNacimiento.value,
            fecha_ingreso: editarFechaIngreso.value,
        };

        try {
            const res = await fetch(`/api/empleados/${idEmpleado}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(empleadoData),
            });

            if (!res.ok) throw new Error("Error al editar el empleado");
            alert("Empleado editado correctamente.");
            modalEditarEmpleado.hide();
            cargarEmpleados();
        } catch (error) {
            console.error("Error al editar el empleado:", error);
            alert("Hubo un error al editar el empleado.");
        }
    });

    // Función para crear un nuevo empleado
    formEmpleado.addEventListener("submit", async (e) => {
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
            alert("Empleado insertado correctamente.");
            formEmpleado.reset();
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
