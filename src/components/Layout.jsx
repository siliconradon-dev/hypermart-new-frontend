import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Layout = ({
  children,
  onBackToMain,
  showFullscreen = false,
  onToggleFullscreen,
  showMainPanelButton = true,
  showPosButton = true,
  showLogo,
}) => {
  const navigate = useNavigate();
  const handleBackToMain = onBackToMain || (() => navigate('/dashboard'));

  return (
    <div className="dashbord-page bg-white">
      <Header
        onBackToMain={handleBackToMain}
        showFullscreen={showFullscreen}
        onToggleFullscreen={onToggleFullscreen}
        showMainPanelButton={showMainPanelButton}
        showPosButton={showPosButton}
        showLogo={showLogo}
      />
      <div>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
