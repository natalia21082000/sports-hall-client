// Функция для обработки регистрации
function handleRegistration() {
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        const formData = new FormData(event.target);
        const userData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await response.json();

            if (response.ok) {
                document.getElementById('successMessage').textContent = data.Message;
                document.getElementById('successMessage').style.display = 'block';
                document.getElementById('registrationForm').reset();

                const registrationModal = document.getElementById('registrationModal');
                const modal = bootstrap.Modal.getInstance(registrationModal);
                modal.hide();
            } else {
                handleErrors(data, '');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
            document.getElementById('errorMessage').textContent = 'Произошла ошибка при отправке запроса на сервер.';
            document.getElementById('errorMessage').style.display = 'block';
        }
    });
}

// Функция для обработки входа
function handleLogin() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.getElementById('loginErrorMessage').style.display = 'none';
        document.getElementById('loginSuccessMessage').style.display = 'none';

        const formData = new FormData(event.target);
        const loginData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:5127/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (response.ok) {
                document.getElementById('loginSuccessMessage').textContent = data.Message || 'Вы успешно вошли в систему.';
                document.getElementById('loginSuccessMessage').style.display = 'block';
               // document.getElementById('loginForm').reset();

                const loginModal = document.getElementById('loginModal');
                const modal = bootstrap.Modal.getInstance(loginModal);
                modal.hide();
            } else {
                handleErrors(data, 'login');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
            document.getElementById('loginErrorMessage').textContent = 'Произошла ошибка при отправке запроса на сервер.';
            document.getElementById('loginErrorMessage').style.display = 'block';
        }
    });
}

// Общая функция для обработки ошибок
function handleErrors(data, prefix) {
    if (data.errors) {
        for (const field in data.errors) {
            const errorElementId = `${prefix}${field.charAt(0).toUpperCase() + field.slice(1)}Error`;
            const errorElement = document.getElementById(errorElementId);
            if (errorElement) {
                errorElement.textContent = data.errors[field].join(', ');
            } else {
                console.warn(`Элемент для отображения ошибки "${field}" не найден.`);
            }
        }
    } else {
        const errorMessageElement = document.getElementById(`${prefix ? prefix : ''}ErrorMessage`);
        if (errorMessageElement) {
            errorMessageElement.textContent = data.message || 'Произошла ошибка.';
            errorMessageElement.style.display = 'block';
        }
    }
}

// Очистка сообщений об ошибках при изменении полей
function clearErrorMessages() {
    const inputFields = document.querySelectorAll('input, select, textarea');
    inputFields.forEach(inputField => {
        inputField.addEventListener('input', function () {
            const errorElementId = `${inputField.id}Error`;
            const errorElement = document.getElementById(errorElementId);
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    handleRegistration();
    handleLogin();
    clearErrorMessages();
});