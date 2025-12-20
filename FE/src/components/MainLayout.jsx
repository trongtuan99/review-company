import { memo } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './MainLayout.css';

const MainLayout = memo(({ children }) => {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content-wrapper">
        {children}
      </main>
      <Footer />
    </div>
  );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;

