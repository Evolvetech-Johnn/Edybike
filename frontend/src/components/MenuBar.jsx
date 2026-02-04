import { Link } from 'react-router-dom';

const MenuBar = () => {
    const menuItems = [
        { name: 'MOUNTAIN BIKES', path: '/bikes/mountain' },
        { name: 'URBANAS', path: '/bikes/urban' },
        { name: 'ELÉTRICAS', path: '/bikes/electric' },
        { name: 'INFANTIL', path: '/bikes/kids' },
        { name: 'PEÇAS', path: '/parts' },
        { name: 'ACESSÓRIOS', path: '/accessories' },
        { name: 'VESTUÁRIO', path: '/apparel' },
        { name: 'OFERTAS', path: '/deals' }
    ];

    return (
        <div style={{ backgroundColor: '#0056b3', color: 'white' }}>
            <div className="container">
                <nav>
                    <ul style={{ 
                        display: 'flex', 
                        listStyle: 'none', 
                        margin: 0, 
                        padding: 0, 
                        justifyContent: 'center',
                        gap: '2rem'
                    }}>
                        {menuItems.map(item => (
                            <li key={item.name} style={{ padding: '0.8rem 0' }}>
                                <Link 
                                    to={item.path} 
                                    style={{ 
                                        color: 'white', 
                                        fontWeight: 'bold', 
                                        fontSize: '0.9rem', 
                                        textDecoration: 'none',
                                        letterSpacing: '0.5px',
                                        transition: 'opacity 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default MenuBar;
