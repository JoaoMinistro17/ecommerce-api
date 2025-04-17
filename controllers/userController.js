const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      // Verificar se o utilizador já existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email já registado' });
      }
  
      // Criar novo utilizador
      const user = await User.create({ name, email, password });
  
      return res.status(201).json({ message: 'Utilizador registado com sucesso' });
    } catch (err) {
      console.error('Erro ao registar utilizador:', err);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  };
  
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Procurar utilizador
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: 'Credenciais inválidas' });
      }
  
      // Verificar password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Credenciais inválidas' });
      }
  
      // Gerar token JWT
      const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, JWT_SECRET, {
        expiresIn: '1d'
      });
  
      return res.json({ token });
    } catch (err) {
      console.error('Erro no login:', err);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  };

exports.makeAdmin = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' });

    user.isAdmin = true;
    await user.save();

    res.json({ message: 'Utilizador promovido a admin com sucesso' });
  } catch (err) {
    console.error('Erro ao promover utilizador a admin:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};
