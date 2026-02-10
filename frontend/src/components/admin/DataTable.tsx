import { FC, ReactNode } from 'react';
import '../styles/admin.css';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
}

const DataTable: FC<DataTableProps> = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'Nenhum dado encontrado'
}) => {
  if (loading) {
    return (
      <div className="admin-table-container">
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
          Carregando...
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="admin-table-container">
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render 
                    ? column.render(row[column.key], row)
                    : row[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
