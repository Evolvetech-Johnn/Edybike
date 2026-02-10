import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

/**
 * Middleware para verificar permissões granulares de admin
 * Usa após authMiddleware para validar permissões específicas
 */

const checkPermission = (entity: string, action: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Verificar se usuário está autenticado (deve vir do authMiddleware)
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }
    
    // Super admin tem todas as permissões
    if (req.user.role === 'super_admin') {
      return next();
    }
    
    // Verificar se usuário é admin
    if (!req.user.isAdmin || !req.user.isAdmin()) {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
    }
    
    // Verificar permissão específica
    if (req.user.hasPermission && !req.user.hasPermission(entity, action)) {
      return res.status(403).json({ 
        message: `Permissão negada. Requer: ${entity}.${action}` 
      });
    }
    
    next();
  };
};

// Middleware simplificado: apenas verificar se é admin (qualquer nível)
const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Não autenticado' });
  }
  
  const adminRoles = ['admin', 'super_admin', 'operador', 'gestor'];
  if (!adminRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
  }
  
  next();
};

// Middleware: apenas super_admin
const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Não autenticado' });
  }
  
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas super administradores.' });
  }
  
  next();
};

export {
  checkPermission,
  requireAdmin,
  requireSuperAdmin
};
