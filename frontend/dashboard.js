const API_URL = 'http://localhost:3000';
const token = localStorage.getItem('token');

// Verifica Token
if (!token) {
    console.warn("Sem token, redirecionando...");
    window.location.href = 'index.html';
}

const user = JSON.parse(localStorage.getItem('user'));
if (user) document.getElementById('user-name').innerText = user.name;

// --- CARREGAR TAREFAS ---
async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            logout(); // Token expirou
            return;
        }

        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error("Erro detalhado ao carregar:", error);
    }
}

// --- RENDERIZAR HTML ---
function renderTasks(tasks) {
    const list = document.getElementById('task-list');
    list.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        if (task.isCompleted) li.classList.add('completed');

        li.innerHTML = `
            <span class="task-text">${task.title}</span>
            <div class="actions">
                <button 
                    class="action-btn check-btn" 
                    onclick="toggleTask('${task.id}', ${task.isCompleted})"
                >
                    <i class="fa-solid ${task.isCompleted ? 'fa-rotate-left' : 'fa-check'}"></i>
                </button>

                <button 
                    class="action-btn delete-btn" 
                    onclick="deleteTask('${task.id}')"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        list.appendChild(li);
    });
}

// --- CRIAR TAREFA ---
document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const titleInput = document.getElementById('task-title');
    const title = titleInput.value;

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title: title })
        });

        if (response.ok) {
            titleInput.value = '';
            loadTasks();
        } else {
            const errorData = await response.json();
            console.error("Erro API Criar:", errorData);
            alert(`Erro: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Erro de Rede Criar:", error);
    }
});

// --- ATUALIZAR TAREFA ---
async function toggleTask(id, currentStatus) {

    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ isCompleted: !currentStatus })
        });

        if (response.ok) {
            loadTasks();
        } else {
            const errorData = await response.json();
            console.error("Erro API Atualizar:", errorData);
            alert(`Erro: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Erro de Rede Atualizar:", error);
    }
}

// --- DELETAR TAREFA ---
async function deleteTask(id) {

    if(!confirm("Tem certeza que deseja excluir a tarefa?")) return;

    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok || response.status === 204) {
            console.log("Deletado com sucesso!");
            loadTasks();
        } else {
            const errorData = await response.json();
            console.error("Erro API Deletar:", errorData);
            alert(`Erro: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Erro de Rede:", error);
        alert("Erro de conexão.");
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// Inicializa
loadTasks();