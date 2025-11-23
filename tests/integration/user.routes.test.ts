import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { app } from '../../src/infra/http/server.js';
import { AppDataSource } from '../../src/infra/database/typeorm/data-source.js';

// Roda UMA VEZ antes de todos os testes
beforeAll(async () => {
  await AppDataSource.initialize(); // Conecta no banco
  await app.ready(); // Inicializa o Fastify
});

// Roda UMA VEZ depois de todos os testes
afterAll(async () => {
  await app.close(); // Fecha o servidor
  await AppDataSource.destroy(); // Fecha o banco
});

// Roda DEPOIS de CADA teste
afterEach(async () => {
  // Limpa com CASCADE para ignorar a FK
  await AppDataSource.query('TRUNCATE TABLE "users" CASCADE');
});

describe('User Routes (Integration)', () => {
  it('POST /users - deve criar um usuário e retornar 201', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'Test User',
        email: 'integration@test.com',
        password: 'password123',
      },
    });

    const body = response.json();

    expect(response.statusCode).toBe(201);
    expect(body.id).toBeTypeOf('string');
    expect(body.name).toBe('Test User');
  });

  it('POST /users - deve retornar 409 para email duplicado', async () => {
    // Cria o primeiro usuário
    await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'Test User',
        email: 'duplicate@test.com',
        password: 'password123',
      },
    });

    // Tenta criar o segundo
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'Test User 2',
        email: 'duplicate@test.com',
        password: 'password456',
      },
    });

    expect(response.statusCode).toBe(409);
  });
});