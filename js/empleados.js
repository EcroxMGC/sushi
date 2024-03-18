// Función para cargar los empleados desde el almacenamiento local
function cargarEmpleados() {
    var empleados = [];
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var empleado = JSON.parse(localStorage.getItem(key));
        empleados.push(empleado);
    }
    return empleados;
}

// Función para mostrar los empleados en la tabla
function mostrarEmpleados() {
    var empleados = cargarEmpleados();
    var tabla = document.getElementById('tabla-empleados');
    var tbody = tabla.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    empleados.forEach(function(empleado, index) {
        if (empleado && empleado.nombre && empleado.apellidos && empleado.curp && empleado.area && empleado.fechaRegistro) {
            var row = tbody.insertRow();
            row.insertCell(0).innerHTML = index + 1; // ID único, comenzando desde 1
            row.insertCell(1).innerHTML = empleado.nombre;
            row.insertCell(2).innerHTML = empleado.apellidos;
            row.insertCell(3).innerHTML = empleado.curp;
            row.insertCell(4).innerHTML = empleado.area;
            row.insertCell(5).innerHTML = empleado.fechaRegistro;
            // Agregar botones de editar y eliminar a cada fila
            var editarBtn = document.createElement('button');
            editarBtn.textContent = 'Editar';
            editarBtn.onclick = function() {
                editarEmpleado(empleado);
            };
            var eliminarBtn = document.createElement('button');
            eliminarBtn.textContent = 'Eliminar';
            eliminarBtn.onclick = function() {
                eliminarEmpleado(empleado);
            };
            row.insertCell(6).appendChild(editarBtn);
            row.insertCell(7).appendChild(eliminarBtn);
        }
    });
}

// Función para editar un empleado
function editarEmpleado(empleado) {
    // Obtener el formulario de edición desde el HTML
    var form = document.getElementById('formulario-edicion');

    // Rellenar el formulario con los datos del empleado
    form.elements['nombre'].value = empleado.nombre;
    form.elements['apellidos'].value = empleado.apellidos;
    form.elements['curp'].value = empleado.curp;
    form.elements['area'].value = empleado.area;

    // Mostrar el formulario de edición
    form.style.display = 'block';

    // Manejar la lógica de guardado al enviar el formulario
    form.onsubmit = function(event) {
        event.preventDefault(); // Evitar el envío del formulario
        // Actualizar los datos del empleado con los valores del formulario
        empleado.nombre = form.elements['nombre'].value;
        empleado.apellidos = form.elements['apellidos'].value;
        empleado.curp = form.elements['curp'].value;
        empleado.area = form.elements['area'].value;

        // Guardar los cambios
        guardarCambios(empleado);

        // Ocultar el formulario de edición
        form.style.display = 'none';

        // Actualizar la tabla
        mostrarEmpleados();
    };
}

// Función para guardar los cambios realizados al editar un empleado
function guardarCambios(empleado) {
    // Actualizar el objeto de empleado en el almacenamiento local
    localStorage.setItem(empleado.curp, JSON.stringify(empleado));
}

// Función para eliminar un empleado
function eliminarEmpleado(empleado) {
    // Eliminar el empleado del almacenamiento local
    localStorage.removeItem(empleado.curp);
    // Actualizar la tabla
    mostrarEmpleados();
}

function filtrarEmpleados() {
    var input = document.getElementById('busqueda');
    var filter = input.value.toUpperCase();
    var tabla = document.getElementById('tabla-empleados');
    var tr = tabla.getElementsByTagName('tr');
    for (var i = 0; i < tr.length; i++) {
        var nombreTd = tr[i].getElementsByTagName('td')[0];
        var apellidosTd = tr[i].getElementsByTagName('td')[1];
        if (nombreTd && apellidosTd) {
            var nombreTxtValue = nombreTd.textContent || nombreTd.innerText;
            var apellidosTxtValue = apellidosTd.textContent || apellidosTd.innerText;
            if (nombreTxtValue.toUpperCase().indexOf(filter) > -1 || apellidosTxtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = '';
            } else {
                tr[i].style.display = 'none';
            }
        }
    }
}

// Función para limpiar la tabla
function limpiarTabla() {
    var tabla = document.getElementById('tabla-empleados');
    var tbody = tabla.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
}

// Función que se ejecuta al cargar la página
window.onload = function() {
    mostrarEmpleados();

    // Agrega un botón para limpiar la tabla
    var limpiarBtn = document.getElementById('limpiar-btn');
    limpiarBtn.onclick = function() {
        limpiarTabla();
    };
};
