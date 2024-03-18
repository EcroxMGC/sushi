function generarQR() {
    var fecha = document.getElementById('fecha').value;
    var hora = document.getElementById('hora').value;
    var motivo = document.getElementById('motivo').value;
    var comentario = document.getElementById('comentario').value;
    var idEmpleado = document.getElementById('idEmpleado').value;
    var nombreEmpleado = document.getElementById('nombreEmpleado').value;

    // Concatenar la información que desees en el QR
    var textoQR = `ID Empleado: ${idEmpleado}\nNombre Empleado: ${nombreEmpleado}\nFecha: ${fecha}\nHora: ${hora}\nMotivo: ${motivo}\nComentario: ${comentario}`;

    // Limpiar el contenedor del código QR
    document.getElementById('codigo-qr').innerHTML = '';

    // Generar el código QR y mostrarlo en el contenedor
    var qrcode = new QRCode(document.getElementById('codigo-qr'), {
        text: textoQR,
        width: 128,
        height: 128
    });
}
