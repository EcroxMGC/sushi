document.addEventListener('DOMContentLoaded', function() {
    const fechaInput = document.getElementById('fecha');
    const reporteTextarea = document.getElementById('reporte');
    const enviarButton = document.getElementById('enviar-button');
    const reportesList = document.getElementById('reportes-list');

    // Cargar los reportes guardados del almacenamiento local al cargar la página
    cargarReportesGuardados();

    // Función para cargar los reportes guardados del almacenamiento local
    function cargarReportesGuardados() {
        const reportesGuardados = JSON.parse(localStorage.getItem('reportes')) || [];

        // Iterar sobre los reportes guardados y agregarlos a la lista
        reportesGuardados.forEach(function(reporteGuardado) {
            const nuevoReporte = crearReporteElemento(reporteGuardado.fecha, reporteGuardado.contenido);
            reportesList.appendChild(nuevoReporte);
        });
    }

    // Función para crear un elemento de reporte
    function crearReporteElemento(fecha, contenido) {
        const nuevoReporte = document.createElement('div');
        nuevoReporte.classList.add('reporte');

        // Crear un elemento strong para la fecha
        const fechaStrong = document.createElement('strong');
        fechaStrong.textContent = fecha;
        nuevoReporte.appendChild(fechaStrong);

        // Agregar el contenido del reporte
        nuevoReporte.appendChild(document.createTextNode(': ' + contenido));

        // Crear el botón de editar
        const editarButton = document.createElement('button');
        editarButton.textContent = 'Editar';
        editarButton.classList.add('editar-button');
        nuevoReporte.appendChild(editarButton);

        // Crear el botón de eliminar
        const eliminarButton = document.createElement('button');
        eliminarButton.textContent = 'Eliminar';
        eliminarButton.classList.add('eliminar-button');
        nuevoReporte.appendChild(eliminarButton);

        return nuevoReporte;
    }

    // Event listener para el botón de enviar
    enviarButton.addEventListener('click', function() {
        const fecha = fechaInput.value;
        const reporte = reporteTextarea.value;

        // Verificar que se haya seleccionado una fecha y se haya ingresado un reporte
        if (fecha.trim() === '' || reporte.trim() === '') {
            alert('Por favor, selecciona una fecha y escribe el reporte.');
            return;
        }

        // Crear un nuevo elemento de reporte y agregarlo a la lista
        const nuevoReporte = crearReporteElemento(fecha, reporte);
        reportesList.appendChild(nuevoReporte);

        // Limpiar los campos de entrada después de enviar el reporte
        fechaInput.value = '';
        reporteTextarea.value = '';

        // Guardar el reporte en el almacenamiento local
        guardarReporteEnLocalStorage(fecha, reporte);
    });

    // Event listener para editar un reporte
    reportesList.addEventListener('click', function(event) {
        if (event.target.classList.contains('editar-button')) {
            const reporte = event.target.parentNode;
            const contenidoActual = reporte.childNodes[1].textContent;
            const nuevoContenido = prompt('Editar reporte:', contenidoActual.substring(contenidoActual.indexOf(':') + 2));
            if (nuevoContenido !== null) {
                reporte.childNodes[1].textContent = ': ' + nuevoContenido;
                actualizarReporteEnLocalStorage(reporte.firstChild.textContent, nuevoContenido);
            }
        } else if (event.target.classList.contains('eliminar-button')) {
            const reporte = event.target.parentNode;
            const fechaReporte = reporte.firstChild.textContent;
            eliminarReporteDeLocalStorage(fechaReporte);
            reporte.remove();
        }
    });

    // Event listener para imprimir reportes de la semana
    const imprimirSemanaButton = document.getElementById('imprimir-semana-button');
    imprimirSemanaButton.addEventListener('click', function() {
        imprimirReportesSemana();
    });

    // Función para imprimir los reportes de la semana
    function imprimirReportesSemana() {
        const reportesGuardados = JSON.parse(localStorage.getItem('reportes')) || [];
        const fechaHoy = new Date();
        const hoy = fechaHoy.getTime();
        const unaSemana = 7 * 24 * 60 * 60 * 1000; // Milisegundos en una semana

        const reportesSemana = reportesGuardados.filter(function(reporte) {
            const fechaReporte = new Date(reporte.fecha).getTime();
            return hoy - fechaReporte < unaSemana;
        });

        // Crear un elemento de impresión
        const ventanaImpresion = window.open('', '_blank');
        ventanaImpresion.document.write('<html><head><title>Reportes de la semana</title></head><body>');

        ventanaImpresion.document.write('<h1>Reportes de la semana</h1>');
        reportesSemana.forEach(function(reporte) {
            ventanaImpresion.document.write('<p><strong>' + reporte.fecha + ':</strong> ' + reporte.contenido + '</p>');
        });

        ventanaImpresion.document.write('</body></html>');
        ventanaImpresion.document.close();
        ventanaImpresion.print();
    }

    // Función para guardar el reporte en el almacenamiento local
    function guardarReporteEnLocalStorage(fecha, contenido) {
        const reportesGuardados = JSON.parse(localStorage.getItem('reportes')) || [];
        reportesGuardados.push({ fecha: fecha, contenido: contenido });
        localStorage.setItem('reportes', JSON.stringify(reportesGuardados));
    }

    // Función para actualizar el reporte en el almacenamiento local
    function actualizarReporteEnLocalStorage(fecha, nuevoContenido) {
        const reportesGuardados = JSON.parse(localStorage.getItem('reportes')) || [];
        const indice = reportesGuardados.findIndex(function(reporte) {
            return reporte.fecha === fecha;
        });
        if (indice !== -1) {
            reportesGuardados[indice].contenido = nuevoContenido;
            localStorage.setItem('reportes', JSON.stringify(reportesGuardados));
        }
    }

    // Función para eliminar un reporte del almacenamiento local
    function eliminarReporteDeLocalStorage(fecha) {
        const reportesGuardados = JSON.parse(localStorage.getItem('reportes')) || [];
        const indice = reportesGuardados.findIndex(function(reporte) {
            return reporte.fecha === fecha;
        });
        if (indice !== -1) {
            reportesGuardados.splice(indice, 1);
            localStorage.setItem('reportes', JSON.stringify(reportesGuardados));
        }
    }
});
