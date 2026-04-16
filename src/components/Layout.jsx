import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Layout = ({
  children,
  onBackToMain,
  onPOS,
  showFullscreen = false,
  onToggleFullscreen,
  showMainPanelButton = true,
  showPosButton = true,
  showLogo,
  contentClassName,
  contentStyle,
}) => {
  const navigate = useNavigate();
  const handleBackToMain = onBackToMain || (() => navigate('/dashboard'));
  const handlePOS = onPOS || (() => navigate('/sales/billing'));

  return (
    <div className="dashbord-page min-h-screen bg-white flex flex-col overflow-x-hidden">
      <Header
        onBackToMain={handleBackToMain}
        onPOS={handlePOS}
        showFullscreen={showFullscreen}
        onToggleFullscreen={onToggleFullscreen}
        showMainPanelButton={showMainPanelButton}
        showPosButton={showPosButton}
        showLogo={showLogo}
      />
      <div
        className={`flex-1 min-h-0 ${contentClassName || ''}`}
        style={contentStyle}
      >
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
