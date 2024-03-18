document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registration-form');

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe por defecto

        // Obtener los valores de usuario y contraseña
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Validar si el usuario y la contraseña cumplen los requisitos
        if (username.trim() === '' || password.trim() === '') {
            alert('Por favor, complete todos los campos.');
            return;
        }

        if (password.length < 8) {
            alert('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        // Guardar los datos en el almacenamiento local
        localStorage.setItem('adminData', JSON.stringify({ username: username, password: password }));

        // Mostrar mensaje de registro exitoso
        alert('El usuario ha sido registrado correctamente.');

        // Redirigir al usuario a la página de inicio de sesión
        window.location.href = 'loagin.html';
    });
});

