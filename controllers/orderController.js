const { User, CartItem, Order, OrderItem, Product } = require('../models');

exports.checkout = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: {
        association: 'Cart',
        include: {
          model: Product,
          through: { attributes: ['quantity'] }
        }
      }
    });

    const cartProducts = user.Cart.Products;

    if (cartProducts.length === 0)
      return res.status(400).json({ error: 'Carrinho vazio' });

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
        price: item.price
      });

      // Atualizar stock do produto
      item.stock -= item.CartItem.quantity;
      await item.save();
    }

    // Limpar o carrinho
    await CartItem.destroy({ where: { CartId: user.Cart.id } });

    res.status(201).json({ message: 'Encomenda criada com sucesso', orderId: order.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao finalizar encomenda' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserId: req.user.id },
      include: {
        model: Product,
        through: { attributes: ['quantity', 'price'] }
      },
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter encomendas' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Product,
          through: { attributes: ['quantity', 'price'] }
        },
        {
          model: User,
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter todas as encomendas' });
  }
};
