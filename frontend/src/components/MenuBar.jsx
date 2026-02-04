const MenuBar = () => {
    const menuItems = [
        'MOUNTAIN BIKES', 'URBANAS', 'ELÉTRICAS', 'INFANTIL', 'PEÇAS', 'ACESSÓRIOS', 'VESTUÁRIO', 'OFERTAS'
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
                        justifyContent: 'center', /* Centered menu like GTSM1 implies a balanced look */
                        gap: '2rem'
                    }}>
                        {menuItems.map(item => (
                            <li key={item} style={{ padding: '0.8rem 0' }}>
                                <a 
                                    href="#" 
                                    style={{ 
                                        color: 'white', 
                                        fontWeight: 'bold', 
                                        fontSize: '0.9rem', 
                                        textDecoration: 'none',
                                        letterSpacing: '0.5px'
                                    }}
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
