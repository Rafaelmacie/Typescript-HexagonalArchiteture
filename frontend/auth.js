const API_URL = 'http://localhost:3000';

// Alternar entre Login e Cadastro
function toggleForms() {
    document.getElementById('login-box').classList.toggle('hidden');
    document.getElementById('register-box').classList.toggle('hidden');
}

// Função de Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/users/sessions`, { // Endpoint que definimos
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Salva o token e redireciona
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message || 'Erro ao fazer login');
        }
    } catch (error) {
        console.error(error);
        alert('Erro de conexão com o servidor');
    }
});

// Função de Cadastro
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (response.status === 201) {
            alert('Conta criada com sucesso! Faça login.');
            toggleForms();
        } else {
            const data = await response.json();
            alert(data.message || 'Erro ao criar conta');
        }
    } catch (error) {
        alert('Erro de conexão');
    }
});