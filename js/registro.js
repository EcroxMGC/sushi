document.getElementById('registro-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar envío del formulario

    // Obtener los datos del formulario
    var nombre = document.getElementById('nombre').value.trim();
    var apellidos = document.getElementById('apellidos').value.trim();
    var curp = document.getElementById('curp').value.trim();
    var area = document.getElementById('area').value.trim();

    // Verificar que todos los campos estén completos y no solo espacios en blanco
    if (nombre && apellidos && curp && area) {
        // Guardar los datos en el almacenamiento local (simulado)
        var empleado = {
            nombre: nombre,
            apellidos: apellidos,
            curp: curp,
            area: area,
            fechaRegistro: new Date().toLocaleString() // Agregar fecha y hora de registro
        };

        // Verificar si la CURP ya existe
        if (localStorage.getItem(curp)) {
            alert("La CURP ya está registrada. Proporcione una CURP única.");
        } else {
            localStorage.setItem(curp, JSON.stringify(empleado));

            // Mostrar mensaje de registro exitoso
            alert("Empleado registrado correctamente.");

            // Confirmar si desea continuar registrando
            var continuarRegistro = confirm("¿Desea continuar registrando o ir a la siguiente sección?");
            if (continuarRegistro) {
                // Limpiar los datos del formulario
                document.getElementById('nombre').value = '';
                document.getElementById('apellidos').value = '';
                document.getElementById('curp').value = '';
                document.getElementById('area').selectedIndex = 0;
            } else {
                // Redirigir a empleados.html después de 3 segundos
                setTimeout(function() {
                    window.location.href = "empleados.html";
                }, 2000);
            }
        }
    } else {
        alert("Por favor complete todos los campos correctamente.");
    }
});

// Evitar retroceder con los botones del navegador
window.history.forward();

// Deshabilitar clic derecho para prevenir el acceso al menú contextual
document.addEventListener('contextmenu', event => event.preventDefault());
