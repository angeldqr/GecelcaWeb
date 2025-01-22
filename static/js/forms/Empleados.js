document.addEventListener("DOMContentLoaded", () => {
    const tablaEmpleados = document.getElementById("tablaEmpleados");
    const paginacion = document.getElementById("paginacion");
    const formEmpleado = document.getElementById("formEmpleado");

    // Campos del formulario de inserción
    const primerNombre = document.getElementById("primer_nombre");
    const segundoNombre = document.getElementById("segundo_nombre");
    const primerApellido = document.getElementById("primer_apellido");
    const segundoApellido = document.getElementById("segundo_apellido");
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

    let paginaActual = 1;
    const itemsPorPagina = 10;

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
            actualizarTabla();
        } catch (error) {
            console.error("Error al cargar los empleados:", error);
            alert("Hubo un error al cargar los empleados.");
        }
    };

    // Función para obtener el nombre descriptivo por ID
    const obtenerNombrePorId = (id, lista) => {
        const item = lista.find(el => el.id === id);
        return item ? item.nombre : "Desconocido";
    };

    // Función para actualizar la tabla de empleados
    const actualizarTabla = () => {
        tablaEmpleados.innerHTML = "";
        const inicio = (paginaActual - 1) * itemsPorPagina;
        const fin = inicio + itemsPorPagina;

        const datosPagina = empleados.slice(inicio, fin);

        datosPagina.forEach(empleado => {
            tablaEmpleados.innerHTML += `
                <tr>
                    <td>${empleado.primer_nombre} ${empleado.segundo_nombre || ""} ${empleado.primer_apellido} ${empleado.segundo_apellido || ""}</td>
                    <td>${obtenerNombrePorId(empleado.id_cargo, cargos)}</td>
                    <td>${obtenerNombrePorId(empleado.id_sede, sedes)}</td>
                    <td>${obtenerNombrePorId(empleado.id_empresa, empresas)}</td>
                    <td>${obtenerNombrePorId(empleado.id_area, areas)}</td>
                    <td>${empleado.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                        ${
                            empleado.estado
                                ? `
                                    <button class="btn btn-warning btn-sm" onclick="editarEmpleado(${empleado.id_empleado})">Editar</button>
                                    <button class="btn btn-danger btn-sm" onclick="inactivarEmpleado(${empleado.id_empleado})">Inactivar</button>
                                  `
                                : `<button class="btn btn-success btn-sm" onclick="activarEmpleado(${empleado.id_empleado})">Activar</button>`
                        }
                    </td>
                </tr>
            `;
        });

        actualizarPaginacion();
    };

    // Función para actualizar la paginación
    const actualizarPaginacion = () => {
        paginacion.innerHTML = "";
        const totalPaginas = Math.ceil(empleados.length / itemsPorPagina);

        for (let i = 1; i <= totalPaginas; i++) {
            paginacion.innerHTML += `
                <button class="btn btn-primary btn-sm mx-1 ${i === paginaActual ? "active" : ""}" onclick="cambiarPagina(${i})">${i}</button>
            `;
        }
    };

    // Cambiar página
    window.cambiarPagina = pagina => {
        paginaActual = pagina;
        actualizarTabla();
    };

    // Crear un nuevo empleado
    formEmpleado.addEventListener("submit", async e => {
        e.preventDefault();

        const nuevoEmpleado = {
            primer_nombre: primerNombre.value.trim(),
            segundo_nombre: segundoNombre.value.trim(),
            primer_apellido: primerApellido.value.trim(),
            segundo_apellido: segundoApellido.value.trim(),
            id_cargo: parseInt(idCargo.value),
            id_sede: parseInt(idSede.value),
            id_empresa: parseInt(idEmpresa.value),
            id_area: parseInt(idArea.value),
            fecha_nacimiento: fechaNacimiento.value,
            fecha_ingreso: fechaIngreso.value,
        };

        console.log("Datos enviados al backend:", nuevoEmpleado);

        try {
            const res = await fetch("/api/empleados/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoEmpleado),
            });

            if (!res.ok) throw new Error("Error al insertar el empleado");

            formEmpleado.reset();
            cargarEmpleados();
            alert("Empleado insertado correctamente.");
        } catch (error) {
            console.error("Error al insertar el empleado:", error);
            alert("Hubo un error al insertar el empleado.");
        }
    });

    // Inicializar opciones y empleados
    cargarOpciones();
    cargarEmpleados();
});
