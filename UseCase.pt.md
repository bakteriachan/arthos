# Caso de uso — LojaMax

LojaMax é uma plataforma de e-commerce. Possui uma API interna com três módulos: gestão de pedidos, catálogo de produtos e painel administrativo. Quer controlar quais funcionários podem acessar cada módulo.

## Atores

- **LojaMax** (cliente) — integra o Arthos para gerenciar seus funcionários
- **Ana** (gerente) — acesso total
- **Carlos** (estoque) — apenas catálogo de produtos
- **Arthos** — valida quem pode acessar o quê

---

## Passo 1 — LojaMax se registra

```http
POST /client
Content-Type: application/json

{
  "name": "LojaMax",
  "email": "tech@lojamax.com"
}
```

```json
{
  "clientId": "683b2fabc123",
  "clientSecret": "550e8400-e29b-41d4-a716-446655440000"
}
```

LojaMax guarda essas credenciais. As usará em todas as chamadas de gerenciamento.

---

## Passo 2 — LojaMax define seus scopes

```http
POST /scope
Authorization: Basic NjgzYjJmYWJjMTIzOjU1MGU4...

{ "name": "Ver pedidos",           "value": "read:orders" }
{ "name": "Gerenciar pedidos",     "value": "write:orders" }
{ "name": "Ver catálogo",          "value": "read:products" }
{ "name": "Editar catálogo",       "value": "write:products" }
{ "name": "Administrar funcionários", "value": "admin:users" }
```

---

## Passo 3 — LojaMax define seus recursos protegidos

```http
POST /resource
Authorization: Basic NjgzYjJmYWJjMTIzOjU1MGU4...

{ "name": "orders-api",   "requiredScopes": ["read:orders"] }
{ "name": "products-api", "requiredScopes": ["read:products"] }
{ "name": "admin-panel",  "requiredScopes": ["admin:users"] }
```

---

## Passo 4 — LojaMax registra seus funcionários

**Ana — gerente, acesso total**
```http
POST /user
Authorization: Basic NjgzYjJmYWJjMTIzOjU1MGU4...

{
  "name": "Ana García",
  "email": "ana@lojamax.com",
  "password": "ana_secret",
  "scopes": ["read:orders", "write:orders", "read:products", "write:products", "admin:users"]
}
```

**Carlos — estoque, apenas produtos**
```http
POST /user
Authorization: Basic NjgzYjJmYWJjMTIzOjU1MGU4...

{
  "name": "Carlos Ruiz",
  "email": "carlos@lojamax.com",
  "password": "carlos_secret",
  "scopes": ["read:products", "write:products"]
}
```

---

## Passo 5 — Os funcionários fazem login

**Ana faz login**
```http
POST /auth/login
Authorization: Basic NjgzYjJmYWJjMTIzOjU1MGU4...

{ "email": "ana@lojamax.com", "password": "ana_secret" }
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2M....",
  "expiresAt": "2026-06-01T00:00:00.000Z"
}
```

O JWT da Ana contém em seu payload:
```json
{
  "userId": "63abc...",
  "clientId": "683b2fabc123",
  "scopes": ["read:orders", "write:orders", "read:products", "write:products", "admin:users"]
}
```

**Carlos faz login** — mesmo processo, seu JWT terá apenas `["read:products", "write:products"]`.

---

## Passo 6 — Validar acesso aos recursos

**Ana tenta acessar o painel administrativo → concedido**
```http
POST /auth/validate
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2M....

{ "resourceName": "admin-panel" }
```

```json
HTTP 200
{ "granted": true, "resource": "admin-panel", "scopes": ["admin:users"] }
```

---

**Carlos tenta acessar o painel administrativo → negado**
```http
POST /auth/validate
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2M....

{ "resourceName": "admin-panel" }
```

```json
HTTP 403
{ "statusCode": 403, "message": "Forbidden" }
```

Carlos não possui o scope `admin:users`, portanto o Arthos nega o acesso.

---

**Carlos tenta acessar o catálogo → concedido**
```http
POST /auth/validate
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9....

{ "resourceName": "products-api" }
```

```json
HTTP 200
{ "granted": true, "resource": "products-api", "scopes": ["read:products"] }
```

---

## Passo 7 — Ana encerra a sessão

```http
POST /auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2M....
```

```
HTTP 204 No Content
```

O token da Ana fica revogado. Qualquer chamada posterior com esse token retorna `401`.

---

## Resumo de permissões

| Funcionário | orders-api | products-api | admin-panel |
|-------------|:----------:|:------------:|:-----------:|
| Ana         | ✓          | ✓            | ✓           |
| Carlos      | ✗          | ✓            | ✗           |
