const request = require('supertest');
const app = require('../app');
const { sequelize, User, Product, Cart, CartItem } = require('../models');

let userToken;
let userId;
let productId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Criação do utilizador
  const user = await User.create({
    name: 'João',
    email: 'joao@example.com',
    password: '123456'
  });
  userId = user.id;

  // Login para obter token
  const login = await request(app).post('/api/users/login').send({
    email: 'joao@example.com',
    password: '123456'
  });
  userToken = login.body.token;

  // Criação do produto
  const product = await Product.create({
    name: 'Violino',
    price: 200,
    stock: 15
  });
  productId = product.id;

  // Criação do carrinho
  await Cart.create({ UserId: userId });
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /api/cart/add', () => {
  it('deve adicionar um produto ao carrinho', async () => {
    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ productId, quantity: 2 });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/Produto adicionado ao carrinho/i);
  });
});

describe('GET /api/cart', () => {
  it('deve devolver o carrinho do utilizador', async () => {
    const res = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    console.log(res.body.items);
    expect(Array.isArray(res.body.Products)).toBe(true);

    expect(res.body.Products.length).toBeGreaterThan(0);
    expect(res.body.Products[0].name).toBe('Violino');
  });
});

describe('DELETE /api/cart/remove', () => {
  it('deve remover um produto do carrinho', async () => {
    const res = await request(app)
      .delete('/api/cart/remove')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ productId });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/removido do carrinho/i);
  });
});