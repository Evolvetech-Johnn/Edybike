import { FC } from 'react';

interface Permission {
  view?: boolean;
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
  adjust?: boolean;
  update?: boolean;
  cancel?: boolean;
}

interface Permissions {
  products?: Permission;
  inventory?: Permission;
  orders?: Permission;
  promotions?: Permission;
  analytics?: Permission;
  users?: Permission;
  settings?: Permission;
}

interface PermissionsMatrixProps {
  permissions: Permissions;
  onChange: (permissions: Permissions) => void;
  disabled?: boolean;
}

const PermissionsMatrix: FC<PermissionsMatrixProps> = ({ permissions, onChange, disabled = false }) => {
  
  const handleChange = (module: string, action: string, value: boolean) => {
    onChange({
      ...permissions,
      [module]: {
        ...permissions[module as keyof Permissions],
        [action]: value
      }
    });
  };

  const modules = [
    { key: 'products', label: 'Produtos', actions: ['view', 'create', 'edit', 'delete'] },
    { key: 'inventory', label: 'Estoque', actions: ['view', 'adjust'] },
    { key: 'orders', label: 'Pedidos', actions: ['view', 'update', 'cancel'] },
    { key: 'promotions', label: 'Promoções', actions: ['view', 'create', 'edit', 'delete'] },
    { key: 'analytics', label: 'Analytics', actions: ['view'] },
    { key: 'users', label: 'Usuários', actions: ['view', 'create', 'edit', 'delete'] },
    { key: 'settings', label: 'Configurações', actions: ['view', 'edit'] }
  ];

  const actionLabels: Record<string, string> = {
    view: 'Ver',
    create: 'Criar',
    edit: 'Editar',
    delete: 'Deletar',
    adjust: 'Ajustar',
    update: 'Atualizar',
    cancel: 'Cancelar'
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.875rem'
      }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--admin-border)' }}>
            <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Módulo</th>
            <th style={{ textAlign: 'center', padding: '0.75rem', fontWeight: '600' }}>Ver</th>
            <th style={{ textAlign: 'center', padding: '0.75rem', fontWeight: '600' }}>Criar</th>
            <th style={{ textAlign: 'center', padding: '0.75rem', fontWeight: '600' }}>Editar</th>
            <th style={{ textAlign: 'center', padding: '0.75rem', fontWeight: '600' }}>Deletar/Outras</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((module) => (
            <tr key={module.key} style={{ borderBottom: '1px solid var(--admin-border)' }}>
              <td style={{ padding: '0.75rem', fontWeight: '500' }}>{module.label}</td>
              {['view', 'create', 'edit', 'delete'].map((action) => {
                const hasAction = module.actions.includes(action) || 
                  (action === 'delete' && module.actions.some(a => !['view', 'create', 'edit'].includes(a)));
                
                const actualAction = action === 'delete' && !module.actions.includes('delete')
                  ? module.actions.find(a => !['view', 'create', 'edit'].includes(a))
                  : action;

                if (!hasAction) {
                  return <td key={action} style={{ padding: '0.75rem', textAlign: 'center' }}>-</td>;
                }

                const modulePerms = permissions[module.key as keyof Permissions] || {};
                const isChecked = actualAction ? modulePerms[actualAction as keyof Permission] || false : false;

                return (
                  <td key={action} style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => actualAction && handleChange(module.key, actualAction, e.target.checked)}
                      disabled={disabled}
                      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                    />
                    {actualAction && actualAction !== action && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '0.25rem' }}>
                        {actionLabels[actualAction]}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionsMatrix;
