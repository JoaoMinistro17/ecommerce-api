# 🛒 E-commerce REST API

Uma API RESTful para um sistema de e-commerce, desenvolvida com Node.js, Express e Sequelize, com autenticação via JWT. Suporta gestão de utilizadores, produtos, carrinho de compras e encomendas.

## 🚀 Tecnologias

- Node.js
- Express
- Sequelize + SQLite (ou PostgreSQL/MySQL)
- JWT (JSON Web Token)
- Jest + Supertest (testes)
- Swagger (documentação)

---

## ⚙️ Instalação

```bash
git clone https://github.com/teu-username/ecommerce-api.git
cd ecommerce-api
npm install
```

Cria um ficheiro `.env` com:

```env
JWT_SECRET=segredo_super_secreto
```

Inicia o servidor com:

```bash
npm start
```

---

## 🧪 Testes

```bash
npm test
```

---

## 🔐 Autenticação

- Utiliza JWT em headers:  
  `Authorization: Bearer <token>`

---

## 📦 Endpoints da API

### 🔐 Autenticação

| Método | Rota         | Descrição              |
|--------|--------------|------------------------|
| POST   | `/api/auth/register` | Registar novo utilizador |
| POST   | `/api/auth/login`    | Autenticação (JWT)        |

---

### 👤 Utilizadores

| Método | Rota        | Descrição                         |
|--------|-------------|------------------------------------|
| GET    | `/api/users/profile` | Perfil do utilizador autenticado |

---

### 📦 Produtos

| Método | Rota        | Descrição                         |
|--------|-------------|------------------------------------|
| GET    | `/api/products`      | Listar todos os produtos        |
| GET    | `/api/products/:id`  | Obter um produto específico     |
| POST   | `/api/products`      | Criar produto (admin)           |
| PUT    | `/api/products/:id`  | Atualizar produto (admin)       |
| DELETE | `/api/products/:id`  | Remover produto (admin)         |

---

### 🛒 Carrinho

| Método | Rota              | Descrição                      |
|--------|-------------------|-------------------------------|
| GET    | `/api/cart`       | Ver carrinho do utilizador    |
| POST   | `/api/cart/add`   | Adicionar produto ao carrinho |
| POST   | `/api/cart/remove`| Remover produto do carrinho   |

---

### 📦 Encomendas

| Método | Rota                 | Descrição                             |
|--------|----------------------|----------------------------------------|
| POST   | `/api/orders/checkout` | Finalizar compra                      |
| GET    | `/api/orders`        | Ver encomendas do utilizador          |
| GET    | `/api/orders/all`    | Ver todas as encomendas (admin)       |

---

## 📂 Estrutura de Pastas

```
.
├── controllers/
├── models/
├── routes/
├── middleware/
├── tests/
├── app.js
└── config/
```

---

## 📘 Documentação Swagger

- [Abrir Swagger Editor](https://editor.swagger.io/)
- Carrega o ficheiro `swagger_ecommerce.json` incluído neste projeto.

---

## 📥 Exemplo de Requisição com Token

```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/users/profile
```

---

## 📣 Contribuição

1. Fork
2. Cria uma branch: `git checkout -b nova-feature`
3. Envia um PR 🚀

---

## 🧑‍💻 Autor

João Daniel Maciel Ministro  
Desenvolvedor 