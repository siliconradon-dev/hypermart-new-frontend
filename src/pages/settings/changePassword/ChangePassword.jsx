import React, { useEffect, useState } from 'react';
import './ChangePassword.css';

function ChangePassword() {
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setLoading(false);

    const showLoading = () => setLoading(true);
    const hideLoading = () => setLoading(false);

    const handleClick = (event) => {
      const target = event.target;
      const element = target.tagName === 'A' ? target : target.closest('a') || target.closest('button');

      if (!element) {
        return;
      }

      const href = element.href || element.getAttribute('onclick');
      const heavyPages = [
        '/dashboard',
        '/item/item_list',
        '/item/add_item',
        '/item/edit',
        '/sales/billing',
        '/sales/budget',
        '/item/importItem',
        '/item/exportPanel',
      ];

      if (href && heavyPages.some((page) => href.includes(page))) {
        showLoading();
        window.setTimeout(hideLoading, 10000);
      }
    };

    const handleSubmit = () => {
      showLoading();
      window.setTimeout(hideLoading, 3000);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        hideLoading();
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    window.showPageLoading = showLoading;
    window.hidePageLoading = hideLoading;

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleSubmit);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      delete window.showPageLoading;
      delete window.hidePageLoading;
    };
  }, []);

  return (
    <div className="change-password-page min-h-dvh max-lg:h-fit flex flex-col h-dvh">
      <div className="nav bg-[#3c8c2c] w-full h-[10%] max-lg:h-[17dvh] py-6 flex justify-between items-center max-md:justify-center max-md:flex-col md:px-14 lg:px-0">
        <span className="flex items-center gap-3 ml-20 max-lg:ml-0 max-sm:scale-75">
          <button type="button" onClick={() => window.history.go(-1)} className="rounded-full w-[50px] aspect-square bg-white flex justify-center items-center hover:scale-90 transition-all">
            <i className="text-xl text-[#000000] fas fa-arrow-left" />
          </button>
          <button type="button" onClick={() => { window.location.href = '/dashboard'; }} className="p-2 text-[#000000] rounded-lg bg-white flex gap-3 justify-center items-center hover:scale-90 transition-all">
            <i className="text-xl text-[#000000] fas fa-city" />
            Go to Main Panel
          </button>
          <a href="/sales/billing" className="p-2 text-[#000000] rounded-lg bg-white flex gap-3 justify-center items-center hover:scale-90 transition-all">
            POS
          </a>
        </span>

        <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
          <img src="/images/logo.png" alt="Logo" className="h-14 max-sm:h-8 bg-white p-1 rounded-full" />
        </div>

        <span className="flex items-center gap-3 mr-20 max-lg:mr-0 max-sm:scale-75">
          <div className="flex flex-col items-end text-right">
            <h3 className="text-2xl max-md:text-sm text-[#ffffff]">Good Afternoon!</h3>
            <h3 className="text-sm text-[#ffffff]">Welcome HYPERMART</h3>
          </div>
          <form method="POST" action="/logout">
            <input type="hidden" name="_token" value="0QWDdrFGyZ41V8aij087hIY5Tp8vhZRdNCZrEcGu" autoComplete="off" />
            <button type="submit" className="rounded-full w-[50px] aspect-square bg-white flex justify-center items-center hover:scale-90 transition-all">
              <i className="text-xl font-bold text-[#000000] fas fa-sign-out-alt" />
            </button>
          </form>
        </span>
      </div>

      <div id="loading-overlay" className={`loading-overlay${loading ? ' show' : ''}`}>
        <div className="text-center">
          <div className="spinner" />
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        <div className="px-12 py-5 max-sm:px-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <p className="inline-flex items-center text-sm font-medium text-gray-700">
                  <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Main Panel
                </p>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Settings</p>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Change Password</p>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="p-6">
          <form method="post" action="" onSubmit={(event) => event.preventDefault()}>
            <input type="hidden" name="_token" value="0QWDdrFGyZ41V8aij087hIY5Tp8vhZRdNCZrEcGu" autoComplete="off" />
            <div className="flex flex-col flex-grow h-full p-6 border-2 rounded-lg">
              <div className="grid mb-6">
                <div>
                  <label htmlFor="c_psw" className="block mb-2 text-sm font-medium text-black">Current Password</label>
                  <input
                    type="password"
                    id="c_psw"
                    name="old_password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Enter current password"
                    required
                  />
                </div>
              </div>

              <div className="grid mb-6">
                <div>
                  <label htmlFor="n_psw" className="block mb-2 text-sm font-medium text-black">New Password</label>
                  <input
                    type="password"
                    id="n_psw"
                    name="new_password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Enter new password"
                    required
                  />
                </div>
              </div>

              <div className="grid mb-6">
                <div>
                  <label htmlFor="con_psw" className="block mb-2 text-sm font-medium text-black">Confirm New Password</label>
                  <input
                    type="password"
                    id="con_psw"
                    name="new_password_confirmation"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Enter new password again"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-center w-full gap-4 max-sm:flex-col">
                <button type="submit" className="py-3 px-6 bg-[#3c8c2c] text-white rounded-lg max-sm:py-1 max-sm:px-3 max-sm:w-full">
                  Create
                </button>
                <button type="button" id="cancel" className="px-6 py-3 text-white bg-red-600 rounded-lg max-sm:py-1 max-sm:px-3 max-sm:w-full" onClick={() => { window.location.href = '/settings/settings'; }}>
                  {'>Cancel'}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="flex-grow" />

        <footer className="bg-[#3c8c2c] py-4 text-center text-[#ffffff]">
          <p>2026 © All Rights Reserved | Hypermart | Designed and Developed by Silicon Radon Networks (Pvt) Ltd</p>
        </footer>
      </div>
    </div>
  );
}

export default ChangePassword;
