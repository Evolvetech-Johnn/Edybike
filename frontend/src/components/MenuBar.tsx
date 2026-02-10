import { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MenuBar: FC = () => {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        fetch('https://edybike.onrender.com/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error('Erro ao carregar menu:', err));
    }, []);

    return (
        <div style={{ backgroundColor: '#0056b3', color: 'white' }}>
            <div className="container">
                <nav style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <ul style={{ 
                        display: 'flex', 
                        listStyle: 'none', 
                        margin: 0, 
                        padding: 0, 
                        justifyContent: 'flex-start', /* Mobile: left align */
                        gap: '2rem',
                        minWidth: 'max-content',
                        paddingBottom: '5px' /* Scrollbar space */
                    }}>
                        {categories.map(cat => (
                            <li key={cat._id} style={{ padding: '0.8rem 0' }}>
                                <Link 
                                    to={`/categoria/${cat._id}`}
                                    style={{ 
                                        color: 'white', 
                                        fontWeight: 'bold', 
                                        fontSize: '0.9rem', 
                                        textDecoration: 'none',
                                        letterSpacing: '0.5px',
                                        transition: 'opacity 0.3s',
                                        textTransform: 'uppercase',
                                        whiteSpace: 'nowrap'
                                    }}
                                    onMouseEnter={(e) => (e.target as HTMLElement).style.opacity = '0.8'}
                                    onMouseLeave={(e) => (e.target as HTMLElement).style.opacity = '1'}
                                >
                                    {cat.name}
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
