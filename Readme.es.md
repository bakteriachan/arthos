# Arthos — Servidor de Autorización

Arthos es un servidor de autorización multitenant. Permite que aplicaciones cliente gestionen sus propios usuarios, definan permisos (scopes) y recursos protegidos, y validen el acceso mediante JWT.

## Actores

- **Usuario** — persona que se autentica y consume recursos protegidos
- **Cliente** — aplicación que integra Arthos para gestionar sus usuarios y controlar el acceso
- **Arthos** — servidor de autorización

## Funciones principales

- Registrar y autenticar clientes (aplicaciones)
- Definir scopes y recursos protegidos por cliente
- Registrar usuarios con permisos granulares
- Emitir JWTs firmados en el login
- Validar acceso a recursos comparando scopes del token con los requeridos
- Revocar tokens en el logout con blacklist en Redis

## Stack

| Capa | Tecnología |
|------|-----------|
| Runtime | Node.js 22 (ESM) |
| Framework | Express 5 |
| Base de datos | MongoDB 7 (Mongoose) |
| Cache / Blacklist | Redis 7 (ioredis) |
| Autenticación | JWT (jsonwebtoken) + bcryptjs |

## Levantar el proyecto

Requiere Docker y Docker Compose.

```bash
# copiar variables de entorno
cp .env.example .env   # ajustar JWT_SECRET y MONGO_URI si es necesario

# iniciar todos los servicios
docker compose up
```

Variables de entorno relevantes:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `MONGO_URI` | Conexión a MongoDB | `mongodb://arthos:password@mongo:27017` |
| `REDIS_URL` | Conexión a Redis | `redis://redis:6379` |
| `JWT_SECRET` | Clave para firmar JWTs | `supersecret` |

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/client` | — | Registrar cliente |
| `POST` | `/scope` | Basic | Crear scope |
| `GET` | `/scope` | Basic | Listar scopes |
| `POST` | `/resource` | Basic | Crear recurso |
| `GET` | `/resource` | Basic | Listar recursos |
| `POST` | `/user` | Basic | Crear usuario |
| `POST` | `/auth/login` | Basic | Login → JWT |
| `POST` | `/auth/validate` | Bearer | Validar acceso a recurso |
| `POST` | `/auth/logout` | Bearer | Cerrar sesión |

`Basic` = `Authorization: Basic <base64(clientId:clientSecret)>`  
`Bearer` = `Authorization: Bearer <JWT>`

## Conceptos clave

**Hash de contraseña**  
Las contraseñas nunca se almacenan en texto plano. Se procesan con bcrypt antes de guardarse, haciendo imposible recuperar la original en caso de filtración.

**JWT (JSON Web Token)**  
Token firmado que contiene `userId`, `clientId`, `scopes` y `exp`. Tiene el formato `<header>.<payload>.<firma>`. Más información: [jwt.io](https://jwt.io)

**Autenticación de dos niveles**  
Las operaciones de gestión usan Basic Auth (cliente). Las operaciones de sesión de usuario usan Bearer JWT. Esto garantiza que un usuario solo puede operar dentro del espacio de su cliente.

**Cache con Redis**  
El resultado de `/auth/validate` se cachea en Redis con el TTL restante del JWT. El logout elimina el cache del usuario y añade el token a la blacklist hasta su expiración.

## Documentación

- [Flow.es.md](Flow.es.md) — Flujo de la aplicación
- [Schemas.md](Schemas.md) — Esquemas de las entidades
