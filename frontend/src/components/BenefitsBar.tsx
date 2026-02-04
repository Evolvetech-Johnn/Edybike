import { FaTruck, FaMedal, FaCalendarAlt, FaShieldAlt } from 'react-icons/fa';
import { IconType } from 'react-icons';

interface Benefit {
  icon: IconType;
  title: string;
  desc: string;
}

const BenefitsBar = () => {
  const benefits: Benefit[] = [
    { icon: FaMedal, title: 'Garantia Vitalícia', desc: 'No quadro de alumínio' },
    { icon: FaShieldAlt, title: 'Compra Segura', desc: 'Site 100% Protegido' },
    { icon: FaTruck, title: 'Envio Rápido', desc: 'Para todo os Correios' },
    { icon: FaCalendarAlt, title: 'Até 12x Sem Juros', desc: 'Nos cartões de crédito' },
  ];

  return (
    <div className="border-b border-gray-200 py-8 bg-gray-50">
      <div className="container">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-4 justify-center">
              <benefit.icon size={36} className="text-primary" />
              <div>
                <h4 className="text-sm mb-1 text-gray-800">{benefit.title}</h4>
                <p className="text-xs text-gray-600">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitsBar;
