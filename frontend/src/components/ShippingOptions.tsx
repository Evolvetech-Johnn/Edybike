import { FC } from 'react';
import { FreteOption } from '../services/freteService';

interface ShippingOptionsProps {
  opcoes: FreteOption[];
  selecionado: FreteOption | null;
  onSelect: (opcao: FreteOption) => void;
  loading?: boolean;
}

const ShippingOptions: FC<ShippingOptionsProps> = ({ 
  opcoes, 
  selecionado, 
  onSelect, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="shipping-options-container">
        <h3 className="shipping-title">Calculando frete...</h3>
        <div className="shipping-loading">
          <div className="spinner"></div>
          <p>Aguarde enquanto calculamos as melhores opções de entrega</p>
        </div>
      </div>
    );
  }

  if (opcoes.length === 0) {
    return (
      <div className="shipping-options-container">
        <h3 className="shipping-title">Opções de Frete</h3>
        <p className="shipping-empty">Informe o CEP para calcular o frete</p>
      </div>
    );
  }

  return (
    <div className="shipping-options-container">
      <h3 className="shipping-title">Escolha o frete</h3>
      
      <div className="shipping-options">
        {opcoes.map(opcao => (
          <label 
            key={opcao.id} 
            className={`shipping-option ${selecionado?.id === opcao.id ? 'selected' : ''}`}
          >
            <input 
              type="radio" 
              name="frete" 
              value={opcao.id}
              checked={selecionado?.id === opcao.id}
              onChange={() => onSelect(opcao)}
            />
            
            <div className="option-info">
              <div className="option-header">
                <div className="option-name">
                  <strong>{opcao.transportadora}</strong>
                  <span className="option-type">{opcao.tipo}</span>
                </div>
                <span className="price">R$ {opcao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <small className="option-delivery">{opcao.prazo}</small>
            </div>
          </label>
        ))}
      </div>
      
      <div className="shipping-info">
        <p>✓ Frete calculado automaticamente</p>
        <p>✓ Entrega rastreável</p>
      </div>
    </div>
  );
};

export default ShippingOptions;
