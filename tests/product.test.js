const request = require('supertest');
const app = require('../app'); 
const jwt = require('jsonwebtoken');
const { sequelize, Product, User } = require('../models');

let adminToken;
let productId;

beforeAll(async () => {
  await sequelize.sync({ force: true }); // cuidado: apaga dados de teste
  
  const product = await Product.create({ name: 'Guitarra', price: 300, stock: 10 });
  productId = product.id; 

  // Criação de utilizador admin e geração de token
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@example.com',
    password: '123456',
    isAdmin: true
  });

  adminToken = jwt.sign(
    { id: admin.id, isAdmin: true },
    process.env.JWT_SECRET || 'segredo_super_secreto',
    { expiresIn: '1d' }
  );
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /api/products', () => {
  it('deve retornar todos os produtos', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('deve filtrar produtos pelo nome', async () => {
    const res = await request(app).get('/api/products?search=Guitarra');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].name).toMatch(/guitarra/i);
  });

  it('deve devolver 200 e uma lista de produtos (array)', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /api/products', () => {
  it('deve criar um novo produto com token admin', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Teclado',
        price: 150,
        stock: 5
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.product.name).toBe('Teclado');
  });
});

describe('PUT /api/products/:id', () => {
  it('deve atualizar um produto com token admin', async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Guitarra Atualizada',
        price: 350,
        stock: 8
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Guitarra Atualizada');
  });
});

describe('DELETE /api/products/:id', () => {
  it('deve eliminar um produto com token admin', async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/eliminado/i);
  });
});