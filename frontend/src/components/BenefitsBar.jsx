import { FaTruck, FaMedal, FaCalendarAlt, FaShieldAlt } from 'react-icons/fa';

const BenefitsBar = () => {
    const benefits = [
        { icon: FaMedal, title: 'Garantia Vitalícia', desc: 'No quadro de alumínio' },
        { icon: FaShieldAlt, title: 'Compra Segura', desc: 'Site 100% Protegido' },
        { icon: FaTruck, title: 'Envio Rápido', desc: 'Para todo os Correios' },
        { icon: FaCalendarAlt, title: 'Até 12x Sem Juros', desc: 'Nos cartões de crédito' },
    ];

    return (
        <div style={{ borderBottom: '1px solid #e5e7eb', padding: '2rem 0', backgroundColor: '#f9fafb' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                    {benefits.map((benefit, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                            <benefit.icon size={36} color="var(--primary-color)" />
                            <div>
                                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.2rem', color: '#1f2937' }}>{benefit.title}</h4>
                                <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{benefit.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BenefitsBar;
