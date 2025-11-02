import fastify from 'fastify';
import { CreateUserUseCase } from '../../app/useCases/create-user.useCase.js';
import { TypeOrmUserRepository } from '../database/typeorm/repositories/user.repository.js';
import { ZodError } from 'zod';
import { env } from '../../config/env.js';

// Cria a instância do Fastify
export const app = fastify();

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

// --- Lógica de Graceful Shutdown ---
const GSignals = ['SIGINT', 'SIGTERM'];
GSignals.forEach((signal) => {
    process.on(signal, async () => {
        console.log(`\nRecebido ${signal}. Encerrando o app...`);
        await app.close();
        process.exit(0);
    });
});