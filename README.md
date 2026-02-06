# 📝 API de Tarefas

API REST de gerenciamento de tarefas desenvolvida com **TypeScript** e **NestJS**.  
O sistema possui autenticação via **JWT**, controle de usuários e **CRUD completo de tarefas**.

## ⚙️ Instalação e Execução

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/matsoaresp/api_tarefas.git
cd https://github.com/matsoaresp/api_tarefas.git
```

### 2️⃣ Instalar as dependências

O projeto utiliza pnpm como gerenciador de pacotes.

```bash
pnpm install
```

###3️⃣ Configurar variáveis de ambiente

Crie um arquivo .env na raiz do projeto e configure as variáveis necessárias, por exemplo:
```bash
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_USER=postgres
DATABASE_PASSWORD= ####
DATABASE_NAME= ####

JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=1d
```

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **TypeScript**
- **NestJS**
- **TypeORM**
- **JWT (JSON Web Token)**
- **bcryptjs**
- **PostgreSQL / MySQL / SQLite** (dependendo da configuração)

## 📌 Funcionalidades

### 👤 Usuários
- Criar usuário com:
  - Nome
  - Email
  - Senha (armazenada com hash)
- Autenticação via email e senha
- Geração de **token JWT**
- CRUD de usuário protegido:
  - Buscar dados do usuário autenticado
  - Atualizar dados do usuário
  - Excluir usuário
- As operações de ler, atualizar e deletar usuário só podem ser feitas após autenticação

### 🔐 Autenticação
- A API só pode ser utilizada por usuários **autenticados**
- Login retorna um **access token JWT**
- Rotas protegidas com **Guard de autenticação**

### ✅ Tarefas
- CRUD completo de tarefas:
  - Criar tarefa
  - Listar tarefas do usuário autenticado
  - Buscar tarefa por ID
  - Atualizar tarefa
  - Excluir tarefa
- Cada tarefa pertence a um usuário
- Apenas o usuário autenticado pode acessar suas próprias tarefas

---

## 🔑 Autenticação JWT

Para acessar as rotas protegidas, é necessário enviar o token JWT no header:

```http
Authorization: Bearer SEU_TOKEN_AQUI
