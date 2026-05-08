# Arthos — Servidor de Autorização

Arthos é um servidor de autorização multitenant. Permite que aplicações cliente gerenciem seus próprios usuários, definam permissões (scopes) e recursos protegidos, e validem o acesso mediante JWT.

## Atores

- **Usuário** — pessoa que se autentica e consome recursos protegidos
- **Cliente** — aplicação que integra o Arthos para gerenciar seus usuários e controlar o acesso
- **Arthos** — servidor de autorização

## Funções principais

- Registrar e autenticar clientes (aplicações)
- Definir scopes e recursos protegidos por cliente
- Registrar usuários com permissões granulares
- Emitir JWTs assinados no login
- Validar acesso a recursos comparando scopes do token com os requeridos
- Revogar tokens no logout com blacklist no Redis

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Runtime | Node.js 22 (ESM) |
| Framework | Express 5 |
| Banco de dados | MongoDB 7 (Mongoose) |
| Cache / Blacklist | Redis 7 (ioredis) |
| Autenticação | JWT (jsonwebtoken) + bcryptjs |

## Iniciar o projeto

Requer Docker e Docker Compose.

```bash
# copiar variáveis de ambiente
cp .env.example .env   # ajustar JWT_SECRET e MONGO_URI se necessário

# iniciar todos os serviços
docker compose up
```

Variáveis de ambiente relevantes:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `PORT` | Porta do servidor | `3000` |
| `MONGO_URI` | Conexão ao MongoDB | `mongodb://arthos:password@mongo:27017` |
| `REDIS_URL` | Conexão ao Redis | `redis://redis:6379` |
| `JWT_SECRET` | Chave para assinar JWTs | `supersecret` |

## Endpoints

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/client` | — | Registrar cliente |
| `POST` | `/scope` | Basic | Criar scope |
| `GET` | `/scope` | Basic | Listar scopes |
| `POST` | `/resource` | Basic | Criar recurso |
| `GET` | `/resource` | Basic | Listar recursos |
| `POST` | `/user` | Basic | Criar usuário |
| `POST` | `/auth/login` | Basic | Login → JWT |
| `POST` | `/auth/validate` | Bearer | Validar acesso a recurso |
| `POST` | `/auth/logout` | Bearer | Encerrar sessão |

`Basic` = `Authorization: Basic <base64(clientId:clientSecret)>`  
`Bearer` = `Authorization: Bearer <JWT>`

## Conceitos principais

**Hash de senha**  
As senhas nunca são armazenadas em texto puro. São processadas com bcrypt antes de serem salvas, tornando impossível recuperar a original em caso de vazamento.

**JWT (JSON Web Token)**  
Token assinado que contém `userId`, `clientId`, `scopes` e `exp`. Tem o formato `<header>.<payload>.<assinatura>`. Mais informações: [jwt.io](https://jwt.io)

**Autenticação em dois níveis**  
As operações de gerenciamento usam Basic Auth (cliente). As operações de sessão do usuário usam Bearer JWT. Isso garante que um usuário só pode operar dentro do espaço do seu cliente.

**Cache com Redis**  
O resultado de `/auth/validate` é cacheado no Redis com o TTL restante do JWT. O logout remove o cache do usuário e adiciona o token à blacklist até sua expiração.

## Documentação

- [Flow.pt.md](Flow.pt.md) — Fluxo da aplicação
- [Schemas.md](Schemas.md) — Esquemas das entidades
