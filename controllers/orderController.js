const orderService = require('../services/orderService');

exports.checkout = async (req, res) => {
  try {
    const order = await orderService.checkout(req.user.id)
    res.status(201).json({ message: 'Encomenda criada com sucesso', orderId: order.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao finalizar encomenda' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrders(req.user.id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter encomendas' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter todas as encomendas' });
  }
};
