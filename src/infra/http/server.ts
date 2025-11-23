import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { CreateUserUseCase } from '../../app/useCases/user/create-user.useCase.js';
import { TypeOrmUserRepository } from '../database/typeorm/repositories/user.repository.js';
import { AuthenticateUserUseCase } from '../../app/useCases/user/auth-user.useCase.js';
import { ZodError } from 'zod';
import { env } from '../../config/env.js';
import jwt from 'jsonwebtoken';
import { TypeOrmTaskRepository } from '../database/typeorm/repositories/task.repository.js';
import { CreateTaskUseCase } from '../../app/useCases/tasks/create-task.useCase.js';
import { ListUserTasksUseCase } from '../../app/useCases/tasks/list-user-tasks.useCase.js';
import { UpdateTaskUseCase } from '../../app/useCases/tasks/update-task.useCase.js';
import { DeleteTaskUseCase } from '../../app/useCases/tasks/delete-task.useCase.js';

// Cria a instância do Fastify
export const app = fastify();

app.register(fastifyCors, {
  origin: "*",
});

// --- Definindo a Rota de Criação de Usuário ---
app.post('/users', async (request, reply) => {
  try {
    // Instanciação manual (injeção de dependência simples)
    const userRepository = new TypeOrmUserRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);

    const body = request.body as { name: string; email: string; password: string };

    // Executa o Caso de Uso
    const output = await createUserUseCase.execute(body);

    // Retorna a resposta de sucesso
    return reply.status(201).send(output);

  } catch (error) {
    // Tratamento de Erros

    // Se for um erro de validação do Zod (das variáveis de ambiente, por ex)
    if (error instanceof ZodError) {
      return reply.status(500).send({
        message: 'Error validating environment variables',
        errors: error.format(),
      });
    }

    // Se for um erro de negócio (ex: "Email already registered", "Invalid email")
    if (error instanceof Error) {
      // 400 = Bad Request (erro do cliente)
      // 409 = Conflict (email duplicado)
      const statusCode = error.message.includes('already registered') ? 409 : 400;
      return reply.status(statusCode).send({
        message: error.message,
      });
    }

    // Erro genérico
    return reply.status(500).send({
      message: 'Internal Server Error',
    });
  }
});

// --- Rota de Autenticação (Login) ---
app.post('/users/sessions', async (request, reply) => {
  try {
    const userRepository = new TypeOrmUserRepository();
    const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);

    const body = request.body as { email: string; password: string };

    const output = await authenticateUserUseCase.execute(body);

    // Retorna 200 OK com o token e os dados do usuário
    return reply.status(200).send(output);

  } catch (error) {

    // Erro de autenticação (401 Unauthorized)
    if (error instanceof Error && error.message.includes('Invalid')) {
      return reply.status(401).send({
        message: error.message,
      });
    }

    // Erro genérico
    return reply.status(500).send({
      message: 'Internal Server Error',
    });
  }
});

// --- Lógica de Graceful Shutdown ---
const GSignals = ['SIGINT', 'SIGTERM'];
GSignals.forEach((signal) => {
  process.on(signal, async () => {
    console.log(`\nRecebido ${signal}. Encerrando o app...`);
    await app.close();
    process.exit(0);
  });
});

// Middleware simples para pegar o usuário do token
const verifyAuth = async (request: any, reply: any) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) return reply.status(401).send({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded: any = jwt.verify(token, env.JWT_SECRET);
    request.user = { id: decoded.sub }; // Salva o ID no request
  } catch (err) {
    return reply.status(401).send({ message: "Invalid token" });
  }
};

// Criar Tarefa
app.post('/tasks', { preHandler: verifyAuth }, async (request: any, reply) => {
  const repo = new TypeOrmTaskRepository();
  const useCase = new CreateTaskUseCase(repo);
  const { title, description } = request.body as any;

  const task = await useCase.execute({ title, description, userId: request.user.id });
  return reply.status(201).send(task);
});

// Listar Minhas Tarefas
app.get('/tasks', { preHandler: verifyAuth }, async (request: any, reply) => {
  const repo = new TypeOrmTaskRepository();
  const useCase = new ListUserTasksUseCase(repo);

  const tasks = await useCase.execute(request.user.id);
  return reply.send(tasks);
});

//Atualizar Tarefa
app.put('/tasks/:id', { preHandler: verifyAuth }, async (request: any, reply) => {
  const repo = new TypeOrmTaskRepository();
  const useCase = new UpdateTaskUseCase(repo);
  const { id } = request.params as any;
  const { title, description, isCompleted } = request.body as any;

  try {
    const task = await useCase.execute({ taskId: id, userId: request.user.id, title, description, isCompleted });
    return reply.send(task);
  } catch (e: any) {
    return reply.status(400).send({ message: e.message });
  }
});

//Deletar Tarefa
app.delete('/tasks/:id', { preHandler: verifyAuth }, async (request: any, reply) => {
  const repo = new TypeOrmTaskRepository();
  const useCase = new DeleteTaskUseCase(repo);
  const { id } = request.params as any;

  try {
    await useCase.execute(id, request.user.id);
    return reply.status(204).send();
  } catch (e: any) {
    return reply.status(400).send({ message: e.message });
  }
});