import { useState, useEffect, useCallback, FC } from 'react';
import bike1 from '../assets/img/bikes/Bicicleta Oggi Big Wheel 7.1 aro 29 18v - Shimano Alivio- Deore 2022.png';
import bike2 from '../assets/img/bikes/bicicleta_caloi_explorer_comp_Aro 29 18V - Shimano  Alivio - 2021.png';
import bike3 from '../assets/img/bikes/bicicleta_eletrica_oggi_big_wheel 8.3 Aro 29 - Shimano Deore 11V - 2022.png';
import bike4 from '../assets/img/bikes/bicicleta_caloi_explorer_expert Aro 29 20V - ShimanoDeore - 2021.png';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
}

const HeroCarousel: FC = () => {
  const slides: Slide[] = [
    {
      id: 1,
      image: bike1,
      title: "Oggi Big Wheel 7.1",
      subtitle: "Mountain Bike Aro 29 com Shimano Alivio/Deore",
      cta: "Ver Modelos"
    },
    {
      id: 2,
      image: bike2,
      title: "Caloi Explorer Comp",
      subtitle: "Performance e conforto para suas aventuras",
      cta: "Explorar MTBs"
    },
    {
      id: 3,
      image: bike3,
      title: "E-Bike Oggi Big Wheel 8.3",
      subtitle: "Tecnologia elétrica para ir mais longe",
      cta: "Conhecer E-Bikes"
    },
    {
      id: 4,
      image: bike4,
      title: "Caloi Explorer Expert",
      subtitle: "MTB profissional com Shimano Deore",
      cta: "Ver Coleção"
    }
  ];


  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // 5 segundos

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <div 
      className="hero-carousel"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <div className="carousel-track">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              transform: `translateX(${(index - currentSlide) * 100}%)`
            }}
          >
            {/* Background image com overlay */}
            <div className="slide-background">
              <img src={slide.image} alt={slide.title} />
              <div className="slide-overlay"></div>
            </div>

            {/* Content */}
            <div className="slide-content container">
              <div className="slide-text fade-in">
                <h1 className="slide-title">{slide.title}</h1>
                <p className="slide-subtitle">{slide.subtitle}</p>
                <button className="btn btn-primary hover-lift">
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        className="carousel-arrow carousel-arrow-prev"
        onClick={prevSlide}
        aria-label="Anterior"
      >
        <FaChevronLeft />
      </button>
      <button 
        className="carousel-arrow carousel-arrow-next"
        onClick={nextSlide}
        aria-label="Próximo"
      >
        <FaChevronRight />
      </button>

      {/* Indicators */}
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
