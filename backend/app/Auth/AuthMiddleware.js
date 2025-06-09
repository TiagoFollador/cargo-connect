const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401); 
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      console.error("Erro na verificação do JWT:", err.message);
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ message: 'Token expirado.' }); 
      }
      return res.status(403).json({ message: 'Token inválido.' }); 
    }

    req.user = userPayload; 
    next(); 
  });
};

exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
        return res.status(403).json({ message: "Acesso negado. Informações de papel ausentes."})
    }
    const hasRequiredRole = req.user.roles.some(role => allowedRoles.includes(role));
    if (!hasRequiredRole) {
      return res.status(403).json({ message: `Acesso negado. Requer um dos seguintes papéis: ${allowedRoles.join(', ')}` });
    }
    next();
  };
};