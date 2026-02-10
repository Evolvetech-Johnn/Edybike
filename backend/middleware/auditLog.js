/**
 * Middleware para Audit Log automático
 * Registra ações administrativas importantes
 */

const AuditLog = require('../models/AuditLog');

/**
 * Middleware factory para criar log de ações
 * @param {string} action - Ação realizada (create, update, delete, etc)
 * @param {string} entity - Entidade afetada (product, order, etc)
 */
const auditLog = (action, entity) => {
  return async (req, res, next) => {
    // Guardar resposta original
    const originalJson = res.json.bind(res);
    
    // Override res.json para capturar resposta
    res.json = function(data) {
      // Apenas logar se request foi bem sucedido
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Executar log de forma assíncrona (não bloquear resposta)
        setImmediate(async () => {
          try {
            await AuditLog.log({
              userId: req.user?._id || req.user?.id,
              action,
              entity,
              entityId: req.params?.id || data?._id || data?.id,
              changes: extractChanges(req.body, req.method),
              ip: req.ip || req.connection.remoteAddress,
              userAgent: req.get('user-agent'),
              description: generateDescription(action, entity, req),
              metadata: {
                method: req.method,
                path: req.path,
                query: req.query
              }
            });
          } catch (error) {
            console.error('[AuditLog] Erro ao criar log:', error);
            // Não falha se log não for criado
          }
        });
      }
      
      return originalJson(data);
    };
    
    next();
  };
};

// Helper: extrair mudanças relevantes do body
function extractChanges(body, method) {
  if (method === 'DELETE') {
    return { deleted: true };
  }
  
  if (method === 'POST') {
    return { created: true, data: sanitizeData(body) };
  }
  
  if (method === 'PUT' || method === 'PATCH') {
    return { updated: true, data: sanitizeData(body) };
  }
  
  return {};
}

// Helper: sanitizar dados sensíveis
function sanitizeData(data) {
  const sanitized = { ...data };
  
  // Remover campos sensíveis
  delete sanitized.password;
  delete sanitized.token;
  delete sanitized.accessToken;
  
  return sanitized;
}

// Helper: gerar descrição legível
function generateDescription(action, entity, req) {
  const user = req.user?.name || req.user?.email || 'Admin';
  const entityMap = {
    product: 'produto',
    order: 'pedido',
    category: 'categoria',
    user: 'usuário',
    promotion: 'promoção',
    settings: 'configurações',
    stock: 'estoque'
  };
  
  const actionMap = {
    create: 'criou',
    update: 'atualizou',
    delete: 'deletou',
    soft_delete: 'desativou',
    price_change: 'alterou preço',
    stock_adjust: 'ajustou estoque',
    order_cancel: 'cancelou',
    order_refund: 'reembolsou'
  };
  
  const entityName = entityMap[entity] || entity;
  const actionName = actionMap[action] || action;
  
  return `${user} ${actionName} ${entityName}`;
}

// Middleware simplificado: apenas registrar acesso
const logAccess = async (req, res, next) => {
  if (req.user && req.user.isAdmin && req.user.isAdmin()) {
    setImmediate(async () => {
      try {
        await AuditLog.log({
          userId: req.user._id || req.user.id,
          action: 'access',
          entity: 'system',
          ip: req.ip || req.connection.remoteAddress,
          userAgent: req.get('user-agent'),
          description: `Acessou ${req.path}`,
          metadata: {
            method: req.method,
            path: req.path
          }
        });
      } catch (error) {
        // Silent fail
      }
    });
  }
  next();
};

module.exports = {
  auditLog,
  logAccess
};
