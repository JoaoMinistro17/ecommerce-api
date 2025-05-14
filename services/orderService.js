const { User, CartItem, Order, OrderItem, Product } = require('../models');
const { Op } = require("sequelize");

exports.checkout = async (userId) => {
  const user = await User.findByPk(userId, {
    include: {
      association: "Cart",
      include: {
        model: Product,
        through: { attributes: ["quantity"] },
      },
    },
  });

  if (!user || !user.Cart) throw new Error("Carrinho não encontrado.");

  const cartProducts = user.Cart.Products;

  if (cartProducts.length === 0)
    return res.status(400).json({ error: "Carrinho vazio" });

  let total = 0;
  for (const item of cartProducts) {
    total += item.CartItem.quantity * item.price;
  }

  const order = await Order.create({ UserId: user.id, total });

  for (const item of cartProducts) {
    await OrderItem.create({
      OrderId: order.id,
      ProductId: item.id,
      quantity: item.CartItem.quantity,
      price: item.price,
    });

    // Atualizar stock do produto
    item.stock -= item.CartItem.quantity;
    await item.save();
  }

  // Limpar o carrinho
  await CartItem.destroy({ where: { CartId: user.Cart.id } });

  return order;
};
exports.getOrders = async (id) => {
  const orders = await Order.findAll({
    where: { UserId: id },
    include: {
      model: Product,
      through: { attributes: ["quantity", "price"] },
    },
    order: [["createdAt", "DESC"]],
  });

  return orders;
};
exports.getAllOrders = async () => {
  const orders = await Order.findAll({
    include: [
      {
        model: Product,
        through: { attributes: ["quantity", "price"] },
      },
      {
        model: User,
        attributes: ["id", "name"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return orders;
};
