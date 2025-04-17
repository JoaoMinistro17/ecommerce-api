const { User, Cart } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) return res.status(400).json({ error: 'Email já registado' });

    const user = await User.create({ name, email, password });

    // Cria o carrinho automaticamente ao registar
    await Cart.create({ UserId: user.id });

    const token = createToken(user);
    res.status(201).json({ user: { id: user.id, name, email }, token });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registar utilizador' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Palavra-passe incorreta' });

    const token = createToken(user);
    res.json({ user: { id: user.id, name: user.name, email }, token });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};
