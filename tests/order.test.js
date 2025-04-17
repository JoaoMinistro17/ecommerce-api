const request = require('supertest');
const app = require('../app');
const { sequelize, User, Product, Cart } = require('../models');

let userToken, adminToken;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Criar utilizador
  const user = await User.create({
    name: 'User',
    email: 'user@example.com',
    password: '123456'
  });

  // Criar admin
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@example.com',
    password: '123456',
    isAdmin: true
  });

  // Login
  const resUser = await request(app).post('/api/users/login').send({
    email: 'user@example.com',
    password: '123456'
  });
  userToken = resUser.body.token;

  const resAdmin = await request(app).post('/api/users/login').send({
    email: 'admin@example.com',
    password: '123456'
  });
  adminToken = resAdmin.body.token;

  // Criar produto
  const product = await Product.create({
    name: 'Violoncelo',
    price: 400,
    stock: 5
  });

  // Criar carrinho
  await Cart.create({ UserId: user.id });

  // Adicionar ao carrinho
  await request(app)
    .post('/api/cart/add')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ productId: product.id, quantity: 2 });
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /api/orders/checkout', () => {
  it('deve finalizar a compra e criar encomenda', async () => {
    const res = await request(app)
      .post('/api/orders/checkout')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/Encomenda criada com sucesso/i);
  });
});

describe('GET /api/orders', () => {
  it('deve retornar as encomendas do utilizador', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('GET /api/orders/all', () => {
  it('deve retornar todas as encomendas (admin)', async () => {
    const res = await request(app)
      .get('/api/orders/all')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
