import { useNavigate } from 'react-router-dom';

function Header({
  onBackToMain,
  onPOS,
  showFullscreen = false,
  onToggleFullscreen,
  showMainPanelButton = true,
  showPosButton = true,
  showLogo,
}) {
  const navigate = useNavigate();
  // Original behavior: show logo everywhere by default.
  // Can be overridden by passing showLogo={true|false}.
  const shouldShowLogo = typeof showLogo === 'boolean' ? showLogo : true;

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    user = null;
  }

  const isDeactivated = Number(user?.status_id ?? 1) === 0;

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    }

    if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    }

    if (hour >= 17 && hour < 21) {
      return 'Good Evening';
    }

    return 'Good Night';
  };

  const handleLeftButtonClick = () => {
    if (showFullscreen) {
      if (typeof onToggleFullscreen === 'function') {
        onToggleFullscreen();
      }
      return;
    }
    window.history.go(-1);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {
      // ignore network errors
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="nav bg-[#3c8c2c] w-full h-[10%] max-lg:h-[17dvh] py-6 flex justify-between items-center max-md:justify-center max-md:flex-col md:px-14 lg:px-0">
      <span className="flex items-center gap-3 ml-20 max-lg:ml-0 max-sm:scale-75">
        <button
          type="button"
          onClick={handleLeftButtonClick}
          className="rounded-full w-[50px] aspect-square bg-white flex justify-center items-center hover:scale-90 transition-all"
        >
          <i className={`text-xl text-[#000000] fas ${showFullscreen ? 'fa-expand' : 'fa-arrow-left'}`} />
        </button>

        {showMainPanelButton && (
          <button
            type="button"
            onClick={onBackToMain}
            className="p-2 text-[#000000] rounded-lg bg-white flex gap-3 justify-center items-center hover:scale-90 transition-all"
          >
            <i className="text-xl text-[#000000] fas fa-city" />
            Go to Main Panel
          </button>
        )}

        {showPosButton && !isDeactivated && (
          <button
            onClick={onPOS}
            className="p-2 text-[#000000] rounded-lg bg-white flex gap-3 justify-center items-center hover:scale-90 transition-all"
          >
            POS
          </button>
        )}
      </span>

      {shouldShowLogo && (
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-14 max-sm:h-8 bg-white p-1 rounded-full"
          />
        </div>
      )}

      <span className="flex items-center gap-3 mr-20 max-lg:mr-0 max-sm:scale-75">
        <div className="flex flex-col items-end text-right">
          <h3 className="text-2xl max-md:text-sm text-[#ffffff]">{getGreeting()}!</h3>
          <h3 className="text-sm text-[#ffffff]">Welcome HYPERMART</h3>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full w-[50px] aspect-square bg-white flex justify-center items-center hover:scale-90 transition-all"
        >
          <i className="text-xl font-bold text-[#000000] fas fa-sign-out-alt" />
        </button>
      </span>
    </div>
  );
}

export default Header;
