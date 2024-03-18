document.addEventListener('DOMContentLoaded', () => {
    const tablaSalidas = document.getElementById('registro-table');
    const scanner = new Instascan.Scanner({ video: document.getElementById('scanner') });
    const cameraPanel = document.getElementById('camera-panel'); // Elemento contenedor de la cámara

    // Variable para mantener un registro de los códigos QR ya escaneados
    const codigosEscaneados = new Set();

    // Verificar si hay datos guardados en el almacenamiento local y mostrarlos en la tabla
    const storedData = JSON.parse(localStorage.getItem('registroSalida')) || [];
    storedData.forEach(entry => agregarSalidaTabla(entry));

    // Función para agregar una salida a la tabla y guardarla en el almacenamiento local
    function agregarSalidaTabla(entry) {
        if (codigosEscaneados.has(entry.qr)) {
            alert('Este código QR ya ha sido registrado anteriormente.');
            return; // Salir de la función si el código ya está registrado
        }

        const row = tablaSalidas.insertRow();
        const qrCell = row.insertCell(0);
        const fechaHoraCell = row.insertCell(1);
        qrCell.textContent = entry.qr;
        fechaHoraCell.textContent = `${entry.fecha} - ${entry.hora}`;

        // Registrar el código QR como escaneado
        codigosEscaneados.add(entry.qr);
    }

    // Función para guardar una salida en el almacenamiento local
    function guardarSalidaLocalStorage(qr, fecha, hora) {
        const entry = { qr, fecha, hora };
        storedData.push(entry);
        localStorage.setItem('registroSalida', JSON.stringify(storedData));
    }

    // Función para eliminar todos los datos del almacenamiento local
    function limpiarLocalStorage() {
        localStorage.removeItem('registroSalida');
        tablaSalidas.innerHTML = ''; // Limpiar la tabla
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
        agregarSalidaTabla({ qr: contenido, fecha: fechaActual, hora: horaActual });
        guardarSalidaLocalStorage(contenido, fechaActual, horaActual);
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
        const printContents = tablaSalidas.outerHTML;
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
