const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ error: 'Token ausente' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo_super_secreto');
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(401).json({ error: 'Utilizador não encontrado' });

    req.user = user;
    
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};