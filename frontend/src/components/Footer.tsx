import { FC } from 'react';
import { FaWhatsapp, FaInstagram, FaFacebook, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer: FC = () => {
  return (
    <footer style={{ backgroundColor: '#111827', color: '#f3f4f6', paddingTop: '4rem', paddingBottom: '2rem', marginTop: 'auto' }}>
      <div className="container">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          
          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <img src="/logoedybike.png" alt="Edy Bike" style={{ height: '40px' }} />
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>Edy<span style={{ color: 'var(--secondary-color)' }}>Bike</span></span>
            </div>
            <p style={{ color: '#9ca3af', lineHeight: 1.6 }}>
              Sua loja especializada em bicicletas, peças e acessórios. Qualidade e confiança para suas pedaladas.
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--primary-color)', display: 'inline-block', paddingBottom: '0.5rem' }}>
                Navegação
            </h4>
            <ul style={{ listStyle: 'none' }}>
                <li className="mb-2"><Link to="/" style={{ color: '#d1d5db' }}>Catálogo</Link></li>
                <li className="mb-2"><Link to="/admin/login" style={{ color: '#d1d5db' }}>Área Administrativa</Link></li>
                <li className="mb-2"><a href="#" style={{ color: '#d1d5db' }}>Política de Privacidade</a></li>
                <li className="mb-2"><a href="#" style={{ color: '#d1d5db' }}>Termos de Uso</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--secondary-color)', display: 'inline-block', paddingBottom: '0.5rem' }}>
                Contato
            </h4>
            <ul style={{ listStyle: 'none', color: '#d1d5db' }}>
                <li className="mb-4" style={{ display: 'flex', gap: '0.75rem', alignItems: 'start' }}>
                    <FaMapMarkerAlt style={{ color: 'var(--primary-color)', marginTop: '0.25rem' }} />
                    <span>Rua das Bicicletas, 123<br />Centro, Cidade - UF</span>
                </li>
                <li className="mb-4" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <FaWhatsapp style={{ color: '#25D366', fontSize: '1.2rem' }} />
                    <span>(11) 99999-9999</span>
                </li>
                <li className="mb-4" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <FaEnvelope style={{ color: 'var(--secondary-color)' }} />
                    <span>contato@edybike.com</span>
                </li>
            </ul>
          </div>

            {/* Social Column */}
            <div>
                <h4 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '1.5rem' }}>Redes Sociais</h4>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href="#" style={{ backgroundColor: '#252f3f', padding: '0.75rem', borderRadius: '50%', color: 'white', transition: 'all 0.3s' }} className="social-icon">
                        <FaInstagram size={24} />
                    </a>
                    <a href="#" style={{ backgroundColor: '#252f3f', padding: '0.75rem', borderRadius: '50%', color: 'white', transition: 'all 0.3s' }} className="social-icon">
                        <FaFacebook size={24} />
                    </a>
                    <a href="#" style={{ backgroundColor: '#252f3f', padding: '0.75rem', borderRadius: '50%', color: 'white', transition: 'all 0.3s' }} className="social-icon">
                        <FaWhatsapp size={24} />
                    </a>
                </div>
            </div>
        </div>

        <div style={{ borderTop: '1px solid #374151', paddingTop: '2rem', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
            &copy; {new Date().getFullYear()} Edy Bike - Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
