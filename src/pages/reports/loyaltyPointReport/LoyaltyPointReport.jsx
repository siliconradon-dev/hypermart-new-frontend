import React, { useEffect, useState } from 'react';
import './LoyaltyPointReport.css';

function LoyaltyPointReport() {
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

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

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    window.setTimeout(() => setLoading(false), 3000);
  };

  const handleReset = () => {
    window.location.href = '/reports/loyaltyPointReport';
  };

  return (
    <div className="loyalty-point-report-page min-h-dvh max-lg:h-fit flex flex-col h-dvh">
      <div className="nav bg-[#3c8c2c] w-full h-[10%] max-lg:h-[17dvh] py-6 flex justify-between items-center max-md:justify-center max-md:flex-col md:px-14 lg:px-0">
        <span className="flex items-center gap-3 ml-20 max-lg:ml-0 max-sm:scale-75">
          <button
            type="button"
            onClick={() => window.history.go(-1)}
            className="rounded-full w-[50px] aspect-square bg-white flex justify-center items-center hover:scale-90 transition-all"
          >
            <i className="text-xl text-[#000000] fas fa-arrow-left" />
          </button>
          <button
            type="button"
            onClick={() => { window.location.href = '/dashboard'; }}
            className="p-2 text-[#000000] rounded-lg bg-white flex gap-3 justify-center items-center hover:scale-90 transition-all"
          >
            <i className="text-xl text-[#000000] fas fa-city" />
            Go to Main Panel
          </button>
          <a
            href="/sales/billing"
            className="p-2 text-[#000000] rounded-lg bg-white flex gap-3 justify-center items-center hover:scale-90 transition-all"
          >
            POS
          </a>
        </span>

        <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
          <img src="/images/logo.png" alt="Logo" className="h-14 max-sm:h-8 bg-white p-1 rounded-full" />
        </div>

        <span className="flex items-center gap-3 mr-20 max-lg:mr-0 max-sm:scale-75">
          <div className="flex flex-col items-end text-right">
            <h3 className="text-2xl max-md:text-sm text-[#ffffff]">Good Morning!</h3>
            <h3 className="text-sm text-[#ffffff]">Welcome HYPERMART</h3>
          </div>
          <form method="POST" action="/logout">
            <input type="hidden" name="_token" value="" autoComplete="off" />
            <button
              type="submit"
              className="rounded-full w-[50px] aspect-square bg-white flex justify-center items-center hover:scale-90 transition-all"
            >
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
                <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Loyalty Point Income</p>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="px-12 max-sm:px-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 md:grid-cols-6 items-end">
            <div>
              <label htmlFor="from-date" className="block mb-1 text-xs font-medium text-black">From Date</label>
              <input
                id="from-date"
                name="from_date"
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Select a date"
              />
            </div>

            <div>
              <label htmlFor="to-date" className="block mb-1 text-xs font-medium text-black">To Date</label>
              <input
                id="to-date"
                name="to_date"
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Select a date"
              />
            </div>

            <div className="flex space-x-2">
              <button type="submit" className="py-3 px-3 w-auto bg-[#3c8c2c] text-white rounded-lg text-xs self-end">Submit</button>
              <button type="button" className="py-3 px-3 w-auto bg-[#000000] text-white rounded-lg text-xs self-end" onClick={handleReset}>Reset</button>
            </div>
          </div>
        </form>
      </div>

      <div className="flex flex-col px-12 py-5 overflow-y-auto bg-white max-sm:px-6 max-lg:min-h-full">
        <span />
        <div className="relative h-[500px] overflow-x-auto">
          <table id="ItemStock" className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-white uppercase bg-[#3c8c2c] sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 rounded-tl-lg">No</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2 rounded-tr-lg text-right">Point Value</th>
              </tr>
            </thead>
            <tbody className="space-y-2" />
          </table>
        </div>

        <div className="mt-4" />
      </div>

      <div className="flex-grow" />
      <footer className="bg-[#3c8c2c] py-4 text-center text-[#ffffff]">
        <p>2026 © All Rights Reserved | Hypermart | Designed and Developed by Silicon Radon Networks (Pvt) Ltd</p>
      </footer>
    </div>
  );
}

export default LoyaltyPointReport;
