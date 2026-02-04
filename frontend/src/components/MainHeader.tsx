import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { FaSearch, FaUser, FaShoppingCart, FaHeart } from 'react-icons/fa';

const MainHeader = () => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white py-6 border-b border-gray-200">
      <div className="container flex items-center justify-between gap-8">
        
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img 
            src="/logoedybike.png" 
            alt="Edy Bike" 
            className="h-[70px] object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display='none';
              if (target.nextElementSibling) {
                (target.nextElementSibling as HTMLElement).style.display='block';
              }
            }}
          />
          <span className="hidden text-3xl font-extrabold text-primary">
            Edy<span className="text-secondary">Bike</span>
          </span>
        </Link>

        {/* Search Bar - Big & Central */}
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Busque por produto, categoria ou marca..." 
            className="w-full py-3.5 px-4 pl-12 rounded-lg border-2 border-primary text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-primary text-xl" />
          <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-primary text-white border-0 rounded-md px-6 font-bold cursor-pointer hover:bg-primary-dark transition-colors">
            Buscar
          </button>
        </div>

        {/* Account & Cart Actions */}
        <div className="flex gap-6 text-gray-800">
          
          <div className="flex items-center gap-2 cursor-pointer">
            <FaHeart size={24} className="text-gray-400" />
          </div>

          <div className="flex items-center gap-2 cursor-pointer">
            <FaShoppingCart size={24} className="text-primary" />
            <div className="flex flex-col leading-none">
              <span className="text-xs text-gray-400">Sua Cesta</span>
              <span className="font-bold">R$ 0,00</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div className="bg-gray-100 p-2 rounded-full">
              <FaUser size={20} className="text-gray-600" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs text-gray-400">
                {user ? `Olá, ${user.role}` : 'Bem vindo(a)'}
              </span>
              {user && (
                <div className="flex gap-2">
                  <Link to="/admin" className="text-sm font-bold text-gray-800 hover:text-primary">
                    Painel
                  </Link>
                  <span onClick={logout} className="text-sm font-bold text-secondary cursor-pointer hover:text-secondary-dark">
                    Sair
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MainHeader;
