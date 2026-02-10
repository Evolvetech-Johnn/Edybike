import { useState } from 'react';
import { calcularTodasOpcoes, FreteOption, FreteParams } from '../services/freteService';

interface UseFreteReturn {
  opcoesFrete: FreteOption[];
  freteSelecionado: FreteOption | null;
  loading: boolean;
  erro: string | null;
  calcularFrete: (params: FreteParams) => void;
  selecionarFrete: (opcao: FreteOption) => void;
  limparFrete: () => void;
}

export const useFrete = (): UseFreteReturn => {
  const [opcoesFrete, setOpcoesFrete] = useState<FreteOption[]>([]);
  const [freteSelecionado, setFreteSelecionado] = useState<FreteOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const calcularFrete = (params: FreteParams) => {
    setLoading(true);
    setErro(null);

    try {
      // Simula delay de API (500ms)
      setTimeout(() => {
        const opcoes = calcularTodasOpcoes(params);
        
        if (opcoes.length === 0) {
          setErro('Não há opções de frete disponíveis para este CEP');
          setOpcoesFrete([]);
        } else {
          setOpcoesFrete(opcoes);
          // Auto-seleciona a opção mais barata
          const maisBarata = opcoes.reduce((prev, current) => 
            current.valor < prev.valor ? current : prev
          );
          setFreteSelecionado(maisBarata);
        }
        
        setLoading(false);
      }, 500);
    } catch (error) {
      setErro('Erro ao calcular frete. Tente novamente.');
      setLoading(false);
    }
  };

  const selecionarFrete = (opcao: FreteOption) => {
    setFreteSelecionado(opcao);
  };

  const limparFrete = () => {
    setOpcoesFrete([]);
    setFreteSelecionado(null);
    setErro(null);
  };

  return {
    opcoesFrete,
    freteSelecionado,
    loading,
    erro,
    calcularFrete,
    selecionarFrete,
    limparFrete
  };
};
