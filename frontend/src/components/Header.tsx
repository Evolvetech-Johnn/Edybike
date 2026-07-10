import { FC } from 'react';
import TopBar from './TopBar';
import MainHeader from './MainHeader';
import MenuBar from './MenuBar';

const Header: FC = () => {
    return (
        <header className="sticky top-0 z-[1000] glassmorphism shadow-md">
            <TopBar />
            <MainHeader />
            <MenuBar />
        </header>
    );
};

export default Header;
