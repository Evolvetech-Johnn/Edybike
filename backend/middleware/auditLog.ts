/**
 * Middleware para Audit Log automático
 * Registra ações administrativas importantes
 */

import { Response, NextFunction } from 'express';
// @ts-ignore - AuditLog model ainda não migrado ou precisamos de stub
import AuditLog from '../models/AuditLog'; 
import { AuthRequest } from './authMiddleware';

interface AuditMetadata {
  method: string;
  path: string;
  query: any;
}

/**
 * Middleware factory para criar log de ações
 * @param {string} action - Ação realizada (create, update, delete, etc)
 * @param {string} entity - Entidade afetada (product, order, etc)
 */
const auditLog = (action: string, entity: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Guardar resposta original
    // @ts-ignore - bind type mismatch complex to fix directly without complex overrides
    const originalJson = res.json.bind(res);
    
    // Override res.json para capturar resposta
    // @ts-ignore - override express response method
    res.json = function(data: any) {
      // Apenas logar se request foi bem sucedido
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Executar log de forma assíncrona (não bloquear resposta)
        setImmediate(async () => {
          try {
            await AuditLog.log({
              userId: req.user?._id || (req.user as any)?.id,
              action,
              entity,
              entityId: req.params?.id || data?._id || data?.id,
              changes: extractChanges(req.body, req.method),
              ip: req.ip || req.connection?.remoteAddress,
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
function extractChanges(body: any, method: string) {
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
function sanitizeData(data: any) {
  const sanitized = { ...data };
  
  // Remover campos sensíveis
  delete sanitized.password;
  delete sanitized.token;
  delete sanitized.accessToken;
  
  return sanitized;
}

// Helper: gerar descrição legível
function generateDescription(action: string, entity: string, req: AuthRequest) {
  const user = req.user?.name || req.user?.email || 'Admin';
  const entityMap: Record<string, string> = {
    product: 'produto',
    order: 'pedido',
    category: 'categoria',
    user: 'usuário',
    promotion: 'promoção',
    settings: 'configurações',
    stock: 'estoque'
  };
  
  const actionMap: Record<string, string> = {
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
const logAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin && req.user.isAdmin()) {
    setImmediate(async () => {
      try {
        await AuditLog.log({
          userId: req.user?._id || (req.user as any)?.id,
          action: 'access',
          entity: 'system',
          ip: req.ip || req.connection?.remoteAddress,
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

export {
  auditLog,
  logAccess
};
