const { Cart, CartItem, Product, User } = require('../models');

exports.getCart = async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    include: {
      model: Cart,
      include: {
        model: Product,
        through: { attributes: ['quantity'] }
      }
    }
  });

  res.json(user.Cart);
};

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  const user = await User.findByPk(req.user.id, { include: Cart });
  const cart = user.Cart;

  const [item, created] = await CartItem.findOrCreate({
    where: { CartId: cart.id, ProductId: productId },
    defaults: { quantity }
  });

  if (!created) {
    item.quantity += quantity;
    await item.save();
  }

  res.status(201).json({ message: 'Produto adicionado ao carrinho', cart });
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findByPk(req.user.id, { include: Cart });

  const cart = user.Cart;
  await CartItem.destroy({
    where: { CartId: cart.id, ProductId: productId }
  });

  res.json({ message: 'Produto removido do carrinho' });
};
