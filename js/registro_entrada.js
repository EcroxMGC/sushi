document.addEventListener('DOMContentLoaded', () => {
    const tablaEmpleados = document.getElementById('registro-table');
    const scanner = new Instascan.Scanner({ video: document.getElementById('scanner') });
    const cameraPanel = document.getElementById('camera-panel'); // Elemento contenedor de la cámara

    // Variable para mantener un registro de los códigos QR ya escaneados
    const codigosEscaneados = new Set();

    // Verificar si hay datos guardados en el almacenamiento local y mostrarlos en la tabla
    const storedData = JSON.parse(localStorage.getItem('registroEntrada')) || [];
    storedData.forEach(entry => agregarEntradaTabla(entry));

    // Función para agregar una entrada a la tabla y guardarla en el almacenamiento local
    function agregarEntradaTabla(entry) {
        const row = tablaEmpleados.insertRow();
        const qrCell = row.insertCell(0);
        const fechaHoraCell = row.insertCell(1);
        const situacionCell = row.insertCell(2);

        qrCell.textContent = entry.qr;
        fechaHoraCell.textContent = `${entry.fecha} ${entry.hora}`;

        // Verificar si tiene motivo y la hora de llegada para determinar la situación
        if (entry.motivo && entry.horaLlegada) {
            // Calcular la diferencia en minutos entre la hora de llegada y la hora correcta (1:20 pm)
            const horaCorrecta = new Date(entry.fecha + ' 13:20');
            const horaLlegada = new Date(entry.fecha + ' ' + entry.horaLlegada);
            const diferenciaMinutos = Math.floor((horaLlegada - horaCorrecta) / (1000 * 60));

            // Determinar la situación y asignar el color de fondo
            if (diferenciaMinutos <= 0) {
                situacionCell.textContent = 'Asistencia';
                row.classList.add('entrada-correcta'); // Fondo verde
            } else if (entry.motivo.toLowerCase() === 'permiso') {
                situacionCell.textContent = 'Permiso';
                row.classList.add('permiso'); // Fondo naranja
            } else {
                situacionCell.textContent = 'Retardo';
                row.classList.add('llego-tarde'); // Fondo rojo
            }
        } else {
            situacionCell.textContent = 'Rechazada';
            row.classList.add('retardo-obligatorio'); // Fondo rojo
        }

        // Verificar si aparece la palabra 'Motivo' en QR y marcar en naranja
        if (entry.qr.toLowerCase().includes('motivo')) {
            row.classList.add('motivo'); // Fondo naranja
            situacionCell.textContent = 'Permiso';
        }
    }

    // Función para guardar una entrada en el almacenamiento local
    function guardarEntradaLocalStorage(qr, fecha, hora, motivo, horaLlegada) {
        const entry = { qr, fecha, hora, motivo, horaLlegada };
        storedData.push(entry);
        localStorage.setItem('registroEntrada', JSON.stringify(storedData));
    }

    // Función para eliminar todos los datos del almacenamiento local
    function limpiarLocalStorage() {
        localStorage.removeItem('registroEntrada');
        tablaEmpleados.innerHTML = ''; // Limpiar la tabla
    }

    // Función para leer el código QR
    scanner.addListener('scan', contenido => {
        // Verificar si el código QR ya ha sido escaneado previamente
        if (codigosEscaneados.has(contenido)) {
            // Mostrar mensaje de que el código ya fue registrado
            alert('Este código QR ya ha sido registrado anteriormente.');
            return; // Salir de la función
        }

        // Registrar el código QR como escaneado
        codigosEscaneados.add(contenido);

        const fechaActual = new Date().toLocaleDateString();
        const horaActual = new Date().toLocaleTimeString();
        let motivo = 'retardo-obligatorio'; // Valor por defecto

        // Obtener el ID y nombre del empleado desde el contenido del QR
        const [idEmpleado, nombreEmpleado, motivoPersonalizado] = contenido.split(',');

        // Actualizar el motivo si se proporciona en el QR
        if (motivoPersonalizado) {
            motivo = motivoPersonalizado.trim().toLowerCase();
        }

        // Verificar si el empleado tiene permisos
        const tienePermisos = JSON.parse(localStorage.getItem('permisosConcedidos')) || [];
        if (tienePermisos.includes(idEmpleado)) {
            motivo = 'permiso'; // Cambiar motivo a 'permiso'
        }

        // Agregar la entrada a la tabla y guardarla en el almacenamiento local
        agregarEntradaTabla({
            qr: contenido,
            fecha: fechaActual,
            hora: horaActual,
            motivo: motivo,
            horaLlegada: horaActual
        });

        // Guardar la entrada en el almacenamiento local
        guardarEntradaLocalStorage(contenido, fechaActual, horaActual, motivo, horaActual);
    });

    // Iniciar el escaneo al cargar la página
    Instascan.Camera.getCameras().then(cameras => {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            console.error('No se encontraron cámaras disponibles.');
        }
    });

    // Función para imprimir el reporte (solo la tabla)
    document.getElementById('print-btn').addEventListener('click', () => {
        const printContents = tablaEmpleados.outerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    });

    // Función para limpiar el registro
    document.getElementById('clear-btn').addEventListener('click', () => {
        limpiarLocalStorage();
    });

    // Función para apagar la cámara
    document.getElementById('stop-btn').addEventListener('click', () => {
        scanner.stop();
        cameraPanel.classList.add('off'); // Agregar la clase off para hacer la cámara transparente
    });

    // Función para encender la cámara
    document.getElementById('start-btn').addEventListener('click', () => {
        cameraPanel.classList.remove('off'); // Remover la clase off para mostrar la cámara
        scanner.start(); // Reiniciar el escaneo
    });
});
