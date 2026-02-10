import { FC, useState } from 'react';
import { validarCEP, formatarCEP } from '../services/freteService';

interface CEPInputProps {
  onCalculate: (cep: string) => void;
  loading?: boolean;
}

const CEPInput: FC<CEPInputProps> = ({ onCalculate, loading = false }) => {
  const [cep, setCep] = useState('');
  const [erro, setErro] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove não-numéricos
    
    if (value.length <= 8) {
      setCep(value);
      setErro('');
    }
  };

  const handleCalculate = () => {
    if (!validarCEP(cep)) {
      setErro('CEP inválido. Digite 8 dígitos.');
      return;
    }

    setErro('');
    onCalculate(cep);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCalculate();
    }
  };

  const cepFormatado = formatarCEP(cep);

  return (
    <div className="cep-input-container">
      <h4 className="cep-input-title">Calcular Frete</h4>
      
      <div className="cep-input-group">
        <input
          type="text"
          className={`cep-input ${erro ? 'error' : ''}`}
          placeholder="00000-000"
          value={cepFormatado}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          disabled={loading}
          maxLength={9}
        />
        
        <button
          onClick={handleCalculate}
          disabled={loading || cep.length !== 8}
          className="btn-calculate-shipping"
        >
          {loading ? 'Calculando...' : 'Calcular'}
        </button>
      </div>
      
      {erro && <p className="cep-error">{erro}</p>}
      
      {!erro && cep.length === 0 && (
        <p className="cep-hint">Digite seu CEP para ver as opções de frete</p>
      )}
    </div>
  );
};

export default CEPInput;
