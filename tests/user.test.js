const request = require('supertest');
const app = require('../app');
const { sequelize, User } = require('../models');

let tokenAdmin, tokenUser, userId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const user = await User.create({
    name: 'User',
    email: 'user@example.com',
    password: '123456'
  });

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@example.com',
    password: '123456',
    isAdmin: true
  });

  const resUser = await request(app)
    .post('/api/users/login')
    .send({ email: 'user@example.com', password: '123456' });

  const resAdmin = await request(app)
    .post('/api/users/login')
    .send({ email: 'admin@example.com', password: '123456' });

  tokenUser = resUser.body.token;
  tokenAdmin = resAdmin.body.token;
  userId = user.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /api/users/register', () => {
  it('deve registar um novo utilizador', async () => {
    const res = await request(app).post('/api/users/register').send({
      name: 'Novo',
      email: 'novo@example.com',
      password: '123456'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/Registado com sucesso/i);
  });
});

describe('POST /api/users/login', () => {
  it('deve autenticar o utilizador e devolver token', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: 'user@example.com',
      password: '123456'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('deve falhar com credenciais inválidas', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: 'user@example.com',
      password: 'senhaErrada'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Credenciais inválidas/i);
  });
});

describe('PUT /api/users/make-admin/:id', () => {
    it('não deve permitir se o token não for admin', async () => {
        const res = await request(app)
          .put(`/api/users/make-admin/${userId}`)
          .set('Authorization', `Bearer ${tokenUser}`);
        
        expect(res.statusCode).toBe(403);
        expect(res.body.error).toMatch(/Acesso negado/i);
      });
  
    it('deve promover um utilizador a admin com token admin', async () => {
    const res = await request(app)
      .put(`/api/users/make-admin/${userId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/promovido a admin/i);
  });
});
