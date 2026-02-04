import TopBar from './TopBar';
import MainHeader from './MainHeader';
import MenuBar from './MenuBar';

const Header = () => {
    return (
        <header style={{ position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <TopBar />
            <MainHeader />
            <MenuBar />
        </header>
    );
};

export default Header;
