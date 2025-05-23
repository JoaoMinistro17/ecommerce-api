module.exports = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Requer permissões de administrador.' });
    }
    next();
};