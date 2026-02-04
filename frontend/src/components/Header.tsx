import TopBar from './TopBar.tsx';
import MainHeader from './MainHeader.tsx';
import MenuBar from './MenuBar.tsx';

const Header = () => {
  return (
    <header className="sticky top-0 z-[1000] shadow-md">
      <TopBar />
      <MainHeader />
      <MenuBar />
    </header>
  );
};

export default Header;
