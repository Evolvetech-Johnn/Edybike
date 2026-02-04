const HeroBanner = () => {
  return (
    <div className="relative w-full overflow-hidden h-auto">
      {/* Desktop Banner Mockup */}
      <div 
        className="w-full h-[400px] bg-gray-200 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80)' }}
      >
        <div className="container h-full flex items-center">
          <div className="max-w-[500px] text-white">
            <h2 className="text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg">
              PEDALE COM A <span className="text-secondary">EDY BIKE</span>
            </h2>
            <p className="text-xl mb-8 drop-shadow-md">
              Qualidade, performance e os melhores preços do mercado.
            </p>
            <button 
              className="btn btn-primary py-4 px-12 text-lg rounded"
              onClick={() => document.getElementById('destaques')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Confira as Ofertas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
