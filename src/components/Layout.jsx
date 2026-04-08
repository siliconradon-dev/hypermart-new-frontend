import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Layout = ({ children, onBackToMain }) => {
  return (
    <div className="dashbord-page min-h-dvh max-lg:h-fit flex flex-col h-dvh">
      <Header onBackToMain={onBackToMain} />
      <div className="flex-grow flex flex-col">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
