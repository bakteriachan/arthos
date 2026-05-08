# Arthos — Flujo

## Actores

- **Usuario** — persona que se autentica y consume recursos protegidos
- **Cliente** — aplicación que integra Arthos para gestionar sus usuarios y controlar el acceso
- **Arthos** — servidor de autorización

---

## 1. Registro del cliente

El cliente se registra en Arthos una sola vez y recibe sus credenciales.

```
Cliente → Arthos
POST /client
{ "name": "Mi App", "email": "app@example.com" }

Arthos → Cliente
{ "clientId": "683b2f...", "clientSecret": "550e8400-..." }
```

A partir de aquí el cliente usa `Basic <base64(clientId:clientSecret)>` en todas las llamadas de gestión.

---

## 2. Configuración (cliente → Arthos)

El cliente define los permisos y recursos que existen en su dominio.

```
POST /scope   { "name": "Leer usuarios", "value": "read:users" }
POST /resource { "name": "users-api", "requiredScopes": ["read:users"] }
```

---

## 3. Registro del usuario

El cliente crea el usuario en Arthos asignándole los scopes que correspondan.

```
Cliente → Arthos
POST /user
Authorization: Basic <clientId:clientSecret>
{
  "name": "Ana García",
  "email": "ana@example.com",
  "password": "secret123",
  "scopes": ["read:users"]
}

Arthos → Cliente
{ "name": "Ana García", "email": "ana@example.com", ... }
```

---

## 4. Login del usuario

El usuario introduce sus credenciales en la app del cliente. El cliente las reenvía a Arthos junto con su propia autenticación.

```
Usuario → Cliente
credenciales: email + password

Cliente → Arthos
POST /auth/login
Authorization: Basic <clientId:clientSecret>
{ "email": "ana@example.com", "password": "secret123" }

Arthos → Cliente → Usuario
{ "token": "<JWT>", "expiresAt": "..." }
```

El JWT contiene `userId`, `clientId`, `scopes` y `exp`. El cliente lo entrega al usuario para que lo use en llamadas futuras.

---

## 5. Validar acceso a un recurso

Antes de dar acceso a un recurso protegido, el cliente verifica con Arthos que el JWT del usuario es válido y tiene los scopes necesarios.

```
Usuario → Cliente
GET /mi-recurso
Authorization: Bearer <JWT>

Cliente → Arthos
POST /auth/validate
Authorization: Bearer <JWT>
{ "resourceName": "users-api" }

Arthos → Cliente
200 { "granted": true, "resource": "users-api", "scopes": ["read:users"] }
  o
403 (scopes insuficientes)
  o
401 (token inválido o revocado)

Cliente → Usuario
200 (acceso concedido) o 403/401 (acceso denegado)
```

---

## 6. Logout del usuario

El usuario cierra sesión. El JWT queda revocado en Arthos hasta su expiración natural.

```
Usuario → Cliente
solicitud de logout

Cliente → Arthos
POST /auth/logout
Authorization: Bearer <JWT>

Arthos → Cliente
204 No Content

Cliente → Usuario
sesión cerrada
```

---

## Secuencia completa

```
Usuario          Cliente              Arthos
  │                │                    │
  │                │── POST /client ───▶│ (registro único)
  │                │◀─ clientId/secret ─│
  │                │                    │
  │                │── POST /scope ────▶│
  │                │── POST /resource ─▶│
  │                │                    │
  │── register ──▶│── POST /user ─────▶│
  │                │◀─ user created ────│
  │                │                    │
  │── login ──────▶│── POST /auth/login▶│
  │                │                    │── verify password
  │                │                    │── sign JWT
  │◀─ JWT ─────────│◀─ { token } ───────│
  │                │                    │
  │── GET /recurso▶│── POST /validate ─▶│── check scopes
  │                │                    │── cache resultado
  │◀─ 200 ─────────│◀─ { granted } ─────│
  │                │                    │
  │── logout ─────▶│── POST /logout ───▶│── revocar token
  │◀─ ok ──────────│◀─ 204 ─────────────│── limpiar cache
```
