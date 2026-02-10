const SystemConfig = require('../../models/SystemConfig');
const AuditLog = require('../../models/AuditLog');

// GET /api/admin/settings
// Obter todas as configurações (admin)
const getSettings = async (req, res) => {
  try {
    let config = await SystemConfig.findOne();
    
    // Se não existir, criar com defaults
    if (!config) {
      config = new SystemConfig({
        siteName: 'Edy-Bike',
        siteDescription: 'Loja de bicicletas e acessórios',
        email: 'contato@edybike.com',
        supportEmail: 'suporte@edybike.com',
        settings: {
          itemsPerPage: 20,
          maxUploadSize: 5,
          sessionTimeout: 3600,
          enableCache: true,
          maintenanceMode: false,
          allowGuestCheckout: true
        },
        updatedBy: req.user._id
      });
      await config.save();
    }

    res.json(config);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({ message: 'Erro ao buscar configurações' });
  }
};

// PUT /api/admin/settings
// Atualizar configurações
const updateSettings = async (req, res) => {
  try {
    let config = await SystemConfig.findOne();
    
    if (!config) {
      config = new SystemConfig();
    }

    // Atualizar campos
    const allowedFields = [
      'siteName', 'siteDescription', 'logoUrl', 'faviconUrl',
      'address', 'phone', 'whatsapp', 'email', 'supportEmail',
      'social', 'policies', 'settings', 'integrations'
    ];

    const changes = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        config[field] = req.body[field];
        changes[field] = req.body[field];
      }
    });

    config.updatedBy = req.user._id;
    config.updatedAt = new Date();
    
    await config.save();

    // Registrar audit log
    await AuditLog.create({
      user: req.user._id,
      action: 'UPDATE_SETTINGS',
      entity: 'SystemConfig',
      entityId: config._id,
      changes,
      ip: req.ip
    });

    res.json(config);
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({ message: 'Erro ao atualizar configurações' });
  }
};

// GET /api/settings/public
// Obter configurações públicas (sem autenticação)
const getPublicSettings = async (req, res) => {
  try {
    const config = await SystemConfig.findOne().select(
      'siteName siteDescription logoUrl phone whatsapp email address social'
    );

    if (!config) {
      return res.json({
        siteName: 'Edy-Bike',
        siteDescription: 'Loja de bicicletas e acessórios',
        email: 'contato@edybike.com'
      });
    }

    res.json(config);
  } catch (error) {
    console.error('Erro ao buscar configurações públicas:', error);
    res.status(500).json({ message: 'Erro ao buscar configurações' });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getPublicSettings
};
