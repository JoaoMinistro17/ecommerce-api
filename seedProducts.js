const sequelize = require('./config/database');
const Product = require('./models/Product');

async function seed() {
  try {
    await sequelize.sync({ force: true }); // CUIDADO: isto apaga tudo e recria a BD
    await Product.bulkCreate([
      {
        name: 'Teclado Mecânico RGB',
        description: 'Teclado com switches vermelhos e iluminação RGB.',
        price: 89.99,
        stock: 30
      },
      {
        name: 'Monitor 27" 144Hz',
        description: 'Monitor com alta taxa de atualização para gaming.',
        price: 199.99,
        stock: 12
      },
      {
        name: 'Rato Sem Fios',
        description: 'Rato leve e sem fios, ideal para trabalho e lazer.',
        price: 24.5,
        stock: 50
      }
    ]);

    console.log('Produtos adicionados com sucesso.');
    process.exit();
  } catch (err) {
    console.error('Erro ao popular base de dados:', err);
    process.exit(1);
  }
}

seed();
