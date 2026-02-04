const MenuBar = () => {
  const menuItems = [
    'MOUNTAIN BIKES', 'URBANAS', 'ELÉTRICAS', 'INFANTIL', 'PEÇAS', 'ACESSÓRIOS', 'VESTUÁRIO', 'OFERTAS'
  ];

  return (
    <div className="bg-[#0056b3] text-white">
      <div className="container">
        <nav>
          <ul className="flex list-none m-0 p-0 justify-center gap-8">
            {menuItems.map(item => (
              <li key={item} className="py-3">
                <a 
                  href="#" 
                  className="text-white font-bold text-sm no-underline tracking-wide hover:text-primary-light transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MenuBar;
