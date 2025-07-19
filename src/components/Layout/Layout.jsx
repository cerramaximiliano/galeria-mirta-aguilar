import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gallery-50">
      <Header />
      <main className="flex-grow pt-20 lg:pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;