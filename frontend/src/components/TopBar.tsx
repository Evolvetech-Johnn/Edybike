import { FaTruck, FaCreditCard } from 'react-icons/fa';

const TopBar = () => {
  return (
    <div className="bg-accent text-white text-xs py-2">
      <div className="container flex justify-between items-center">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5">
            <FaTruck className="text-primary" /> Frete Grátis para todo Sul e Sudeste*
          </span>
          <span className="flex items-center gap-1.5">
            <FaCreditCard className="text-primary" /> Até 12x sem juros no cartão
          </span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="text-gray-300 no-underline hover:text-primary transition-colors">
            Central de Atendimento
          </a>
          <a href="#" className="text-gray-300 no-underline hover:text-primary transition-colors">
            Rastrear Pedido
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
