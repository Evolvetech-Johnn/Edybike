const User = require('../../models/User');
const AuditLog = require('../../models/AuditLog');

// Permissões default por role
const DEFAULT_PERMISSIONS = {
  super_admin: {
    products: { view: true, create: true, edit: true, delete: true },
    inventory: { view: true, adjust: true },
    orders: { view: true, update: true, cancel: true },
    promotions: { view: true, create: true, edit: true, delete: true },
    analytics: { view: true },
    users: { view: true, create: true, edit: true, delete: true },
    settings: { view: true, edit: true }
  },
  admin: {
    products: { view: true, create: true, edit: true, delete: true },
    inventory: { view: true, adjust: true },
    orders: { view: true, update: true, cancel: false },
    promotions: { view: true, create: true, edit: true, delete: false },
    analytics: { view: true },
    users: { view: true, create: false, edit: false, delete: false },
    settings: { view: true, edit: false }
  },
  operador: {
    products: { view: true, create: false, edit: true, delete: false },
    inventory: { view: true, adjust: true },
    orders: { view: true, update: true, cancel: false },
    promotions: { view: true, create: false, edit: false, delete: false },
    analytics: { view: false },
    users: { view: false, create: false, edit: false, delete: false },
    settings: { view: false, edit: false }
  }
};

// GET /api/admin/users
// Listar usuários admin
const getUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    
    const query = {
      role: { $in: ['admin', 'super_admin', 'operador', 'gestor'] }
    };

    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
};

// GET /api/admin/users/stats
// Estatísticas de usuários
const getUsersStats = async (req, res) => {
  try {
    const total = await User.countDocuments({
      role: { $in: ['admin', 'super_admin', 'operador', 'gestor'] }
    });

    const active = await User.countDocuments({
      role: { $in: ['admin', 'super_admin', 'operador', 'gestor'] },
      status: 'ativo'
    });

    const blocked = await User.countDocuments({
      role: { $in: ['admin', 'super_admin', 'operador', 'gestor'] },
      status: 'bloqueado'
    });

    res.json({ total, active, blocked });
  } catch (error) {
    console.error('Erro ao buscar stats:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
};

// GET /api/admin/users/:id
// Detalhes de um usuário
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
};

// POST /api/admin/users
// Criar novo usuário
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, permissions, status } = req.body;

    // Validações
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Campos obrigatórios: name, email, password, role' });
    }

    // Verificar se email já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Validar role
    const validRoles = ['admin', 'super_admin', 'operador', 'gestor'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Role inválido' });
    }

    // Apenas super_admin pode criar outros super_admin
    if (role === 'super_admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Apenas super_admin pode criar outros super_admin' });
    }

    // Validar senha forte
    if (password.length < 8) {
      return res.status(400).json({  message: 'Senha deve ter no mínimo 8 caracteres' });
    }

    // Usar permissões fornecidas ou padrões
    const userPermissions = permissions || DEFAULT_PERMISSIONS[role] || {};

    const user = new User({
      name,
      email,
      password,
      role,
      permissions: userPermissions,
      status: status || 'ativo'
    });

    await user.save();

    // Registrar audit log
    await AuditLog.create({
      user: req.user._id,
      action: 'CREATE_USER',
      entity: 'User',
      entityId: user._id,
      changes: { name, email, role },
      ip: req.ip
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      status: user.status
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};

// PUT /api/admin/users/:id
// Atualizar usuário
const updateUser = async (req, res) => {
  try {
    const { name, email, role, permissions, status } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Não pode alterar próprio role
    if (userId === req.user._id.toString() && role && role !== user.role) {
      return res.status(403).json({ message: 'Não pode alterar próprio role' });
    }

    // Apenas super_admin pode alterar role de outros admins
    if (role && role !== user.role && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Apenas super_admin pode alterar roles' });
    }

    const changes = {};
    if (name) { user.name = name; changes.name = name; }
    if (email) { user.email = email; changes.email = email; }
    if (role) { user.role = role; changes.role = role; }
    if (permissions) { user.permissions = permissions; changes.permissions = permissions; }
    if (status) { user.status = status; changes. status = status; }

    await user.save();

    // Registrar audit log
    await AuditLog.create({
      user: req.user._id,
      action: 'UPDATE_USER',
      entity: 'User',
      entityId: user._id,
      changes,
      ip: req.ip
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      status: user.status
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
};

// PATCH /api/admin/users/:id/toggle-status
// Ativar/bloquear usuário
const toggleStatus = async (req, res) => {
  try {
    const userId = req.params.id;

    // Não pode bloquear a si mesmo
    if (userId === req.user._id.toString()) {
      return res.status(403).json({ message: 'Não pode bloquear a si mesmo' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    user.status = user.status === 'ativo' ? 'bloqueado' : 'ativo';
    await user.save();

    // Registrar audit log
    await AuditLog.create({
      user: req.user._id,
      action: 'TOGGLE_USER_STATUS',
      entity: 'User',
      entityId: user._id,
      changes: { status: user.status },
      ip: req.ip
    });

    res.json({ message: 'Status atualizado', status: user.status });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ message: 'Erro ao atualizar status' });
  }
};

// DELETE /api/admin/users/:id
// Deletar usuário (soft delete)
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Apenas super_admin
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Apenas super_admin pode deletar usuários' });
    }

    // Não pode deletar a si mesmo
    if (userId === req.user._id.toString()) {
      return res.status(403).json({ message: 'Não pode deletar a si mesmo' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Soft delete: marcar como bloqueado e renomear email
    user.status = 'bloqueado';
    user.email = `deleted_${Date.now()}_${user.email}`;
    await user.save();

    // Registrar audit log
    await AuditLog.create({
      user: req.user._id,
      action: 'DELETE_USER',
      entity: 'User',
      entityId: user._id,
      changes: { deleted: true },
      ip: req.ip
    });

    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
};

// GET /api/admin/users/:id/activity-log
// Histórico de atividades
const getActivityLog = async (req, res) => {
  try {
    const userId = req.params.id;

    const logs = await AuditLog.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(logs);
  } catch (error) {
    console.error('Erro ao buscar activity log:', error);
    res.status(500).json({ message: 'Erro ao buscar histórico' });
  }
};

module.exports = {
  getUsers,
  getUsersStats,
  getUserById,
  createUser,
  updateUser,
  toggleStatus,
  deleteUser,
  getActivityLog
};
