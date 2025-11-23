import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { app } from '../../src/infra/http/server.js';
import { AppDataSource } from '../../src/infra/database/typeorm/data-source.js';

describe('Task Routes (Integration)', () => {
    // Setup e Teardown (Igual ao user.routes.test.ts)
    beforeAll(async () => {
        await AppDataSource.initialize();
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
        await AppDataSource.destroy();
    });

    afterEach(async () => {
        // Limpa ambas as tabelas com CASCADE
        await AppDataSource.query('TRUNCATE TABLE "tasks", "users" CASCADE');
    });

    // Isso evita repetir código em todo teste
    async function getAuthToken() {
        // 1. Cria o usuário
        await app.inject({
            method: 'POST',
            url: '/users',
            payload: {
                name: 'Task Master',
                email: 'task@master.com',
                password: 'password123',
            },
        });

        // 2. Faz o login
        const loginResponse = await app.inject({
            method: 'POST',
            url: '/users/sessions',
            payload: {
                email: 'task@master.com',
                password: 'password123',
            },
        });

        const body = loginResponse.json();
        return body.token; // Retorna o JWT
    }

    // --- TESTES ---

    it('POST /tasks - deve criar uma tarefa com sucesso', async () => {
        const token = await getAuthToken();

        const response = await app.inject({
            method: 'POST',
            url: '/tasks',
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                title: 'Estudar Clean Architecture',
                description: 'Focar nos testes de integração',
            },
        });

        const body = response.json();

        expect(response.statusCode).toBe(201);
        expect(body.id).toBeDefined();
        expect(body.title).toBe('Estudar Clean Architecture');
        expect(body.isCompleted).toBe(false);
    });

    it('POST /tasks - deve falhar sem token (401)', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/tasks',
            payload: {
                title: 'Tarefa sem dono',
            },
        });

        expect(response.statusCode).toBe(401);
    });

    it('GET /tasks - deve listar as tarefas do usuário', async () => {
        const token = await getAuthToken();

        // Cria uma tarefa primeiro
        await app.inject({
            method: 'POST',
            url: '/tasks',
            headers: { authorization: `Bearer ${token}` },
            payload: { title: 'Minha Tarefa 1' },
        });

        // Lista as tarefas
        const response = await app.inject({
            method: 'GET',
            url: '/tasks',
            headers: { authorization: `Bearer ${token}` },
        });

        const body = response.json();

        expect(response.statusCode).toBe(200);
        expect(body).toHaveLength(1);
        expect(body[0].title).toBe('Minha Tarefa 1');
    });

    it('PUT /tasks/:id - deve atualizar uma tarefa', async () => {
        const token = await getAuthToken();

        // 1. Cria
        const createResponse = await app.inject({
            method: 'POST',
            url: '/tasks',
            headers: { authorization: `Bearer ${token}` },
            payload: { title: 'Tarefa Antiga' },
        });
        const taskId = createResponse.json().id;

        // 2. Atualiza (Marca como concluída)
        const response = await app.inject({
            method: 'PUT',
            url: `/tasks/${taskId}`,
            headers: { authorization: `Bearer ${token}` },
            payload: {
                title: 'Tarefa Atualizada',
                isCompleted: true
            },
        });

        const body = response.json();

        expect(response.statusCode).toBe(200);
        expect(body.title).toBe('Tarefa Atualizada');
        expect(body.isCompleted).toBe(true);
    });

    it('DELETE /tasks/:id - deve apagar uma tarefa', async () => {
        const token = await getAuthToken();

        // 1. Cria
        const createResponse = await app.inject({
            method: 'POST',
            url: '/tasks',
            headers: { authorization: `Bearer ${token}` },
            payload: { title: 'Tarefa para apagar' },
        });
        const taskId = createResponse.json().id;

        // 2. Deleta
        const deleteResponse = await app.inject({
            method: 'DELETE',
            url: `/tasks/${taskId}`,
            headers: { authorization: `Bearer ${token}` },
        });

        expect(deleteResponse.statusCode).toBe(204); // No Content

        // 3. Tenta buscar de novo (deve vir vazio ou não achar)
        const listResponse = await app.inject({
            method: 'GET',
            url: '/tasks',
            headers: { authorization: `Bearer ${token}` },
        });

        expect(listResponse.json()).toHaveLength(0);
    });
});