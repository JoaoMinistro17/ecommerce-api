const { Product } = require('../models');
const { Op } = require('sequelize');

// with filtering, sorting and pagination
exports.getAllProducts = async (query) => {
    const { search, minPrice, maxPrice, sortBy, order, inStock, page = 1, limit = 10 } = query;

    const where = {};
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (inStock) {
      where.stock = { [Op.gt]: 0 };
    }

    const validSortFields = ['price', 'stock', 'name'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.findAll({
      where,
      order: [[sortField, sortOrder]],
      limit: parseInt(limit),
      offset
    });

    return products;
};
exports.getProductById = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) {
    const err = new Error('Produto não encontrado');
    err.status = 404;
    throw err;
  }
  return product;
};
exports.createProduct = async ({ name, description, price, stock }) => {
  if (!name || price <= 0) {
    const err = new Error('Dados inválidos');
    err.status = 400;
    throw err;
  }
  if (stock < 0) {
    const err = new Error('Stock não pode ser negativo');
    err.status = 400;
    throw err;
  }

  const product = await Product.create({ name, description, price, stock });
  return { message: 'Produto criado', product };
};
exports.updateProduct = async (id, { name, description, price, stock }) => {
    const product = await Product.findByPk(id);
    if (!product) {
      const err = new Error('Produto não encontrado');
      err.status = 404;
      throw err;
    }
  
    await product.update({ name, description, price, stock });
    return product;
};
exports.deleteProduct = async (id) => {
    const product = await Product.findByPk(id);
    if (!product) {
      const err = new Error('Produto não encontrado');
      err.status = 404;
      throw err;
    }
  
    await product.destroy();
    return { message: 'Produto eliminado com sucesso' };
};
