# Arthos — Fluxo

## Atores

- **Usuário** — pessoa que se autentica e consome recursos protegidos
- **Cliente** — aplicação que integra o Arthos para gerenciar seus usuários e controlar o acesso
- **Arthos** — servidor de autorização

---

## 1. Registro do cliente

O cliente se registra no Arthos uma única vez e recebe suas credenciais.

```
Cliente → Arthos
POST /client
{ "name": "Minha App", "email": "app@example.com" }

Arthos → Cliente
{ "clientId": "683b2f...", "clientSecret": "550e8400-..." }
```

A partir daqui o cliente usa `Basic <base64(clientId:clientSecret)>` em todas as chamadas de gerenciamento.

---

## 2. Configuração (cliente → Arthos)

O cliente define as permissões e os recursos existentes no seu domínio.

```
POST /scope    { "name": "Ler usuários", "value": "read:users" }
POST /resource { "name": "users-api", "requiredScopes": ["read:users"] }
```

---

## 3. Registro do usuário

O cliente cria o usuário no Arthos atribuindo os scopes correspondentes.

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

## 4. Login do usuário

O usuário insere suas credenciais na app do cliente. O cliente as repassa ao Arthos junto com sua própria autenticação.

```
Usuário → Cliente
credenciais: email + password

Cliente → Arthos
POST /auth/login
Authorization: Basic <clientId:clientSecret>
{ "email": "ana@example.com", "password": "secret123" }

Arthos → Cliente → Usuário
{ "token": "<JWT>", "expiresAt": "..." }
```

O JWT contém `userId`, `clientId`, `scopes` e `exp`. O cliente entrega o token ao usuário para uso nas chamadas futuras.

---

## 5. Validar acesso a um recurso

Antes de conceder acesso a um recurso protegido, o cliente verifica com o Arthos se o JWT do usuário é válido e possui os scopes necessários.

```
Usuário → Cliente
GET /meu-recurso
Authorization: Bearer <JWT>

Cliente → Arthos
POST /auth/validate
Authorization: Bearer <JWT>
{ "resourceName": "users-api" }

Arthos → Cliente
200 { "granted": true, "resource": "users-api", "scopes": ["read:users"] }
  ou
403 (scopes insuficientes)
  ou
401 (token inválido ou revogado)

Cliente → Usuário
200 (acesso concedido) ou 403/401 (acesso negado)
```

---

## 6. Logout do usuário

O usuário encerra a sessão. O JWT fica revogado no Arthos até sua expiração natural.

```
Usuário → Cliente
solicitação de logout

Cliente → Arthos
POST /auth/logout
Authorization: Bearer <JWT>

Arthos → Cliente
204 No Content

Cliente → Usuário
sessão encerrada
```

---

## Sequência completa

```
Usuário          Cliente              Arthos
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
  │                │                    │── verificar senha
  │                │                    │── assinar JWT
  │◀─ JWT ─────────│◀─ { token } ───────│
  │                │                    │
  │── GET /recurso▶│── POST /validate ─▶│── verificar scopes
  │                │                    │── cachear resultado
  │◀─ 200 ─────────│◀─ { granted } ─────│
  │                │                    │
  │── logout ─────▶│── POST /logout ───▶│── revogar token
  │◀─ ok ──────────│◀─ 204 ─────────────│── limpar cache
```
