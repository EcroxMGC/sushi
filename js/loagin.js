document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const showPasswordButton = document.getElementById('show-password-button');
    const loginButton = document.getElementById('login-button');
    const createAccountButton = document.getElementById('create-account-button');
    const loginForm = document.getElementById('login-form');

    // Función para validar contraseña
    function validatePassword(password) {
        const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        return regex.test(password);
    }

    // Función para validar credenciales
    function validateCredentials(username, password) {
        // Recuperar los datos de usuario registrados en admin.html
        var adminData = localStorage.getItem('adminData');
        if (!adminData) {
            return false; // No hay datos de administrador registrados
        }
        var adminCredentials = JSON.parse(adminData);
        return username === adminCredentials.username && password === adminCredentials.password;
    }

    // Event listener para mostrar/ocultar contraseña
    showPasswordButton.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            showPasswordButton.textContent = '👁️ Ocultar Contraseña';
        } else {
            passwordInput.type = 'password';
            showPasswordButton.textContent = '👁️ Mostrar Contraseña';
        }
    });

    // Event listener para el botón de inicio de sesión
    loginButton.addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Validar campos de inicio de sesión
        if (username.trim() === '' || password.trim() === '') {
            alert('Por favor, complete todos los campos.');
            return;
        }

        // Validar contraseña
        if (!validatePassword(password)) {
            alert('La contraseña debe tener al menos 8 caracteres, incluyendo al menos un número y un caracter especial.');
            return;
        }

        // Validar credenciales
        if (validateCredentials(username, password)) {
            // Credenciales correctas, redirigir al menú
            window.location.href = 'menu.html';
        } else {
            // Credenciales incorrectas, mostrar mensaje de error
            alert('Usuario o contraseña incorrectos.');
        }
    });

    // Event listener para el botón de crear cuenta
    createAccountButton.addEventListener('click', function() {
        window.location.href = 'admin.html'; // Redireccionar a la página de registro
    });
});
