import { FC } from 'react';
import { FaWhatsapp, FaInstagram, FaFacebook, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer: FC = () => {
  return (
    <footer style={{ backgroundColor: '#1f2937', color: '#f9fafb', paddingTop: '4rem', paddingBottom: '2rem', marginTop: 'auto', borderTop: '4px solid var(--primary)' }}>
      <div className="container">
        
        {/* Main Footer Grid - 4 Columns */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          
          {/* Column 1: Institucional */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Institucional
            </h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li className="mb-2"><Link to="/" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-white">Sobre a Edy Bike</Link></li>
                <li className="mb-2"><Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Política de Privacidade</Link></li>
                <li className="mb-2"><Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Política de Entrega</Link></li>
                <li className="mb-2"><Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Trabalhe Conosco</Link></li>
            </ul>
          </div>

          {/* Column 2: Dúvidas */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Dúvidas
            </h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li className="mb-2"><Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Trocas e Devoluções</Link></li>
                <li className="mb-2"><Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Garantia</Link></li>
                <li className="mb-2"><Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Como Comprar</Link></li>
                <li className="mb-2"><Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Prazos de Entrega</Link></li>
            </ul>
          </div>

          {/* Column 3: Compras */}
          <div>
             <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Compras
            </h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li className="mb-2"><Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Meus Pedidos</Link></li>
                <li className="mb-2"><Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Minha Conta</Link></li>
                <li className="mb-2"><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Rastrear Pedido</a></li>
                <li className="mb-2"><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Carrinho</a></li>
            </ul>
          </div>

          {/* Column 4: Atendimento */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Atendimento
            </h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li className="mb-3" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%' }}>
                        <FaWhatsapp style={{ color: '#25D366', fontSize: '1.2rem' }} />
                    </div>
                    <div>
                        <span style={{ display: 'block', fontSize: '0.8rem', color: '#6b7280' }}>WhatsApp</span>
                        <span style={{ color: 'white', fontWeight: 'bold' }}>(51) 99987-0471</span>
                    </div>
                </li>
                <li className="mb-3" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                     <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%' }}>
                        <FaEnvelope style={{ color: '#EDBF5C', fontSize: '1.2rem' }} />
                    </div>
                    <div>
                        <span style={{ display: 'block', fontSize: '0.8rem', color: '#6b7280' }}>Email</span>
                        <span style={{ color: 'white' }}>contato@edybike.com</span>
                    </div>
                </li>
                 <li className="mb-3" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                     <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%' }}>
                        <FaMapMarkerAlt style={{ color: '#ef4444', fontSize: '1.2rem' }} />
                    </div>
                    <div>
                        <span style={{ display: 'block', fontSize: '0.8rem', color: '#6b7280' }}>Endereço</span>
                        <span style={{ color: 'white' }}>Canoas, RS</span>
                    </div>
                </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
             
             {/* Logo & Copyright */}
             <div className="footer-copyright">
                <div className="footer-brand-bottom">
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>Edy<span style={{ color: 'var(--secondary-color)' }}>Bike</span></span>
                </div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    &copy; {new Date().getFullYear()} Edy Bike - Todos os direitos reservados. CNPJ: 00.000.000/0001-00
                </p>
             </div>

             {/* Social Media */}
             <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" style={{ color: '#9ca3af', transition: 'color 0.2s', fontSize: '1.5rem' }} className="hover:text-white"><FaInstagram /></a>
                <a href="#" style={{ color: '#9ca3af', transition: 'color 0.2s', fontSize: '1.5rem' }} className="hover:text-white"><FaFacebook /></a>
                <a href="#" style={{ color: '#9ca3af', transition: 'color 0.2s', fontSize: '1.5rem' }} className="hover:text-white"><FaWhatsapp /></a>
             </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
