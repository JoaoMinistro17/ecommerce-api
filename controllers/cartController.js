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
  const item = await CartItem.findOne({
    where: { CartId: cart.id, ProductId: productId }
  });
  if (item) {
    await item.destroy();
    res.status(200).json({ message: 'Produto removido do carrinho' });
  } else {
    res.status(404).json({ message: 'Produto não encontrado no carrinho' });
  }
};

exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const user = await User.findByPk(req.user.id, { include: Cart });
  const cart = user.Cart;
  const item = await CartItem.findOne({
    where: { CartId: cart.id, ProductId: productId }
  });
  if (item) {
    item.quantity = quantity;
    await item.save();
    res.status(200).json({ message: 'Quantidade atualizada' });
  } else {
    res.status(404).json({ message: 'Produto não encontrado no carrinho' });
  }
}
