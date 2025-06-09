const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../db');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

async function assignDefaultRole(userId) {
  try {
    const [role] = await db.query('SELECT id FROM roles WHERE name = ?', ['shipper']);
    if (role.length > 0) {
      const roleId = role[0].id;
      await db.query('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId, roleId]);
      console.log(`Função 'shipper' atribuída ao usuário ${userId}`);
    } else {
      console.warn("Função padrão 'shipper' não encontrada. O usuário não terá uma função inicial.");
    }
  } catch (error) {
    console.error('Erro ao atribuir função padrão:', error);
  }
}


exports.register = async (req, res) => {
  const { email, password, name, phone } = req.body;

  if (!email || !password || !name || !phone) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios (email, password, name, phone).' });
  }

  try {
    const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'E-mail já cadastrado.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await db.query(
      'INSERT INTO users (email, password, name, phone) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, phone]
    );

    const userId = result.insertId;

    await assignDefaultRole(userId);

    res.status(201).json({ message: 'Usuário registrado com sucesso!', userId });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao registrar usuário.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas (usuário não encontrado).' });
    }
    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas (senha incorreta).' });
    }

    const [userRoles] = await db.query(
      `SELECT r.name FROM roles r
         JOIN user_roles ur ON r.id = ur.role_id
         WHERE ur.user_id = ?`,
      [user.id]
    );
    const roles = userRoles.map(role => role.name);

    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      roles: roles
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    res.json({
      message: 'Login bem-sucedido!',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: roles
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao tentar fazer login.' });
  }
};