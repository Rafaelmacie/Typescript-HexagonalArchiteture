import 'reflect-metadata';
import { AppDataSource } from './infra/database/typeorm/data-source.js';
import { app } from './infra/http/server.js';
import { env } from './config/env.js';

async function startServer() {
    console.log('Iniciando o servidor...');

    try {
        // 1. Inicializa a conexão com o banco de dados
        await AppDataSource.initialize();
        console.log('Banco de dados inicializado!');

        // 2. Inicia o servidor Fastify
        await app.listen({
            host: '0.0.0.0',
            port: env.PORT,
        });

        console.log(`🚀 Servidor HTTP rodando na porta ${env.PORT}`);

    } catch (error) {
        console.error('❌ Erro ao iniciar o servidor:', error);
        process.exit(1);
    }
}

// Executa a função
startServer();