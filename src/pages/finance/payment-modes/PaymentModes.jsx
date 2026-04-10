import React, { useEffect, useState } from 'react';
import './PaymentModes.css';

const paymentModes = [
  { id: 2, name: 'Card', description: 'Card', status: 'Active', editHref: '/finance/payment-modes/2/edit', toggleHref: '/finance/payment-modes/2/toggle-status' },
  { id: 1, name: 'Cash', description: 'Cash', status: 'Active', editHref: '/finance/payment-modes/1/edit', toggleHref: '/finance/payment-modes/1/toggle-status' },
  { id: 3, name: 'Online', description: 'Online', status: 'Active', editHref: '/finance/payment-modes/3/edit', toggleHref: '/finance/payment-modes/3/toggle-status' },
];

const PaymentModes = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="payment-modes-page min-h-dvh max-lg:h-fit flex flex-col h-dvh">
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
          <a href="/sales/billing" className="p-2 text-[#000000] rounded-lg bg-white flex gap-3 justify-center items-center hover:scale-90 transition-all">
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

      <div className="flex flex-col h-[85%]">
        <div className="w-full px-4 py-5 sm:px-6 lg:px-12">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <a href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                  <svg className="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Main Panel
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <a href="/finance" className="text-sm font-medium text-gray-700 hover:text-blue-600 ms-1 md:ms-2">Finance</a>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <span className="text-sm font-medium text-gray-500 ms-1 md:ms-2">Payment Modes</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex-1 px-4 pb-6 overflow-auto sm:px-6 lg:px-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Payment Modes</h1>
            <a href="/finance/payment-modes/create" className="px-4 py-2 text-white rounded-lg bg-blue-600 hover:opacity-90">
              <i className="mr-2 fas fa-plus" />Add New Payment Mode
            </a>
          </div>

          <div className="overflow-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="text-xs text-white uppercase bg-[#3c8c2c]">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentModes.map((mode) => (
                  <tr key={mode.id}>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{mode.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{mode.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{mode.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <form action={mode.toggleHref} method="POST" className="inline">
                        <input type="hidden" name="_token" value="" autoComplete="off" />
                        <button type="button" className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {mode.status}
                        </button>
                      </form>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <a href={mode.editHref} className="mr-3 text-blue-600 hover:text-blue-900">
                        <i className="fas fa-edit" /> Edit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex-grow" />
      <footer className="bg-[#3c8c2c] py-4 text-center text-[#ffffff]">
        <p>2026 © All Rights Reserved | Hypermart | Designed and Developed by Silicon Radon Networks (Pvt) Ltd</p>
      </footer>
    </div>
  );
};

export default PaymentModes;