import { FaWhatsapp, FaInstagram, FaFacebook, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-accent text-gray-100 pt-16 pb-8 mt-auto">
      <div className="container">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-12 mb-12">
          
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logoedybike.png" alt="Edy Bike" className="h-10" />
              <span className="text-2xl font-extrabold text-white">
                Edy<span className="text-secondary">Bike</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Sua loja especializada em bicicletas, peças e acessórios. Qualidade e confiança para suas pedaladas.
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="text-white text-xl mb-6 border-b-2 border-primary inline-block pb-2">
              Navegação
            </h4>
            <ul className="list-none">
              <li className="mb-2">
                <Link to="/" className="text-gray-300 hover:text-primary transition-colors">
                  Catálogo
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/admin/login" className="text-gray-300 hover:text-primary transition-colors">
                  Área Administrativa
                </Link>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white text-xl mb-6 border-b-2 border-secondary inline-block pb-2">
              Contato
            </h4>
            <ul className="list-none text-gray-300">
              <li className="mb-4 flex gap-3 items-start">
                <FaMapMarkerAlt className="text-primary mt-1" />
                <span>
                  Rua das Bicicletas, 123<br />Centro, Cidade - UF
                </span>
              </li>
              <li className="mb-4 flex gap-3 items-center">
                <FaWhatsapp className="text-[#25D366] text-xl" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="mb-4 flex gap-3 items-center">
                <FaEnvelope className="text-secondary" />
                <span>contato@edybike.com</span>
              </li>
            </ul>
          </div>

          {/* Social Column */}
          <div>
            <h4 className="text-white text-xl mb-6">Redes Sociais</h4>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="bg-gray-800 p-3 rounded-full text-white transition-all hover:bg-primary hover:-translate-y-1"
              >
                <FaInstagram size={24} />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 p-3 rounded-full text-white transition-all hover:bg-primary hover:-translate-y-1"
              >
                <FaFacebook size={24} />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 p-3 rounded-full text-white transition-all hover:bg-primary hover:-translate-y-1"
              >
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Edy Bike - Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
