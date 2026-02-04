import { useState } from 'react';

const HeroBanner = () => {
    // For MVP, single banner or simple fade
    // Simulating GTSM1-style high impact banner
    
    return (
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden', height: 'auto' }}>
            {/* Desktop Banner Mockup */}
            <div style={{ width: '100%', height: '400px', backgroundColor: '#e5e7eb', backgroundImage: 'url(https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                    <div style={{ maxWidth: '500px', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', lineHeight: 1.1 }}>
                            PEDALE COM A <span style={{ color: 'var(--secondary-color)' }}>EDY BIKE</span>
                        </h2>
                        <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
                            Qualidade, performance e os melhores preços do mercado.
                        </p>
                        <button 
                            className="btn btn-primary" 
                            style={{ padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '4px' }}
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
