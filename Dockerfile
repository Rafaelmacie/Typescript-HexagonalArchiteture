FROM node:20-alpine AS development
LABEL author="Rafael Maciel"

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json package-lock.json* ./

# Instala TODAS as dependências (incluindo devDependencies)
RUN npm ci

# Copia todo o resto do código para o container
COPY . .

# Expõe a porta que o Fastify usará
EXPOSE 3000