# Caso de uso — TiendaMax

TiendaMax es una plataforma de e-commerce. Tiene una API interna con tres módulos: gestión de pedidos, catálogo de productos y panel de administración. Quiere controlar qué empleados pueden acceder a cada módulo.

## Actores

- **TiendaMax** (cliente) — integra Arthos para gestionar a sus empleados
- **Ana** (gerente) — acceso total
- **Carlos** (almacén) — solo catálogo de productos
- **Arthos** — valida quién puede acceder a qué

---

## Paso 1 — TiendaMax se registra

```http
POST /client
Content-Type: application/json

{
  "name": "TiendaMax",
  "email": "tech@tiendamax.com"
}
```

```json
{
  "clientId": "683b2fabc123",
  "clientSecret": "550e8400-e29b-41d4-a716-446655440000"
}
```

TiendaMax guarda estas credenciales. Las usará en todas las llamadas de gestión.

---

## Paso 2 — TiendaMax define sus scopes

```http
POST /scope
Authorization: Basic NjgzYjJmYWJjMTIzOjU1MGU4...

{ "name": "Ver pedidos",          "value": "read:orders" }
{ "name": "Gestionar pedidos",    "value": "write:orders" }
{ "name": "Ver catálogo",         "value": "read:products" }
{ "name": "Editar catálogo",      "value": "write:products" }
{ "name": "Administrar empleados","value": "admin:users" }
```

---

## Paso 3 — TiendaMax define sus recursos protegidos

```http
POST /resource
Authorization: Basic NjgzYjJmYWJjMTIzOjU1MGU4...

{ "name": "orders-api",   "requiredScopes": ["read:orders"] }
{ "name": "products-api", "requiredScopes": ["read:products"] }
{ "name": "admin-panel",  "requiredScopes": ["admin:users"] }
```

---

## Paso 4 — TiendaMax registra a sus empleados

**Ana — gerente, acceso total**
```http
POST /user
Authorization: Basic NjgzYjJmYWJjMTIzOjU1MGU4...

{
  "name": "Ana García",
  "email": "ana@tiendamax.com",
  "password": "ana_secret",
  "scopes": ["read:orders", "write:orders", "read:products", "write:products", "admin:users"]
}
```

**Carlos — almacén, solo productos**
```http
POST /user
Authorization: Basic NjgzYjJmYWJjMTIzOjU1MGU4...

{
  "name": "Carlos Ruiz",
  "email": "carlos@tiendamax.com",
  "password": "carlos_secret",
  "scopes": ["read:products", "write:products"]
}
```

---

## Paso 5 — Los empleados hacen login

**Ana inicia sesión**
```http
POST /auth/login
Authorization: Basic NjgzYjJmYWJjMTIzOjU1MGU4...

{ "email": "ana@tiendamax.com", "password": "ana_secret" }
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2M....",
  "expiresAt": "2026-06-01T00:00:00.000Z"
}
```

El JWT de Ana contiene en su payload:
```json
{
  "userId": "63abc...",
  "clientId": "683b2fabc123",
  "scopes": ["read:orders", "write:orders", "read:products", "write:products", "admin:users"]
}
```

**Carlos inicia sesión** — mismo proceso, su JWT solo tendrá `["read:products", "write:products"]`.

---

## Paso 6 — Validar acceso a recursos

**Ana intenta acceder al panel de administración → concedido**
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

**Carlos intenta acceder al panel de administración → denegado**
```http
POST /auth/validate
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2M....

{ "resourceName": "admin-panel" }
```

```json
HTTP 403
{ "statusCode": 403, "message": "Forbidden" }
```

Carlos no tiene el scope `admin:users`, por lo que Arthos rechaza el acceso.

---

**Carlos intenta acceder al catálogo → concedido**
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

## Paso 7 — Ana cierra sesión

```http
POST /auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2M....
```

```
HTTP 204 No Content
```

El token de Ana queda revocado. Cualquier llamada posterior con ese token devuelve `401`.

---

## Resumen de permisos

| Empleado | orders-api | products-api | admin-panel |
|----------|:----------:|:------------:|:-----------:|
| Ana      | ✓          | ✓            | ✓           |
| Carlos   | ✗          | ✓            | ✗           |
