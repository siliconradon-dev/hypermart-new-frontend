import React, { useEffect, useState } from 'react';
import './Transactions.css';

const transactions = [
  {
    id: 5,
    type: 'Internal',
    date: '2026-04-01',
    from: 'External',
    to: 'Cashbook',
    amount: '11,000.00',
    reference: 'SALE-69CC1EAAE28F9',
    performedBy: 'Admin',
    username: 'admin',
    slip: 'No slip',
    status: 'Auto-Verified',
    transactionType: 'sys_cash',
  },
  {
    id: 4,
    type: 'Internal',
    date: '2026-04-01',
    from: 'External',
    to: 'Cashbook',
    amount: '3,300.00',
    reference: 'SALE-69CC1A57BD3D7',
    performedBy: 'Admin',
    username: 'admin',
    slip: 'No slip',
    status: 'Auto-Verified',
    transactionType: 'sys_cash',
  },
  {
    id: 3,
    type: 'Internal',
    date: '2026-03-31',
    from: 'External',
    to: 'Cashbook',
    amount: '2,150.00',
    reference: 'SALE-69CBA6F433883',
    performedBy: 'Admin',
    username: 'admin',
    slip: 'No slip',
    status: 'Auto-Verified',
    transactionType: 'sys_cash',
  },
  {
    id: 2,
    type: 'Internal',
    date: '2026-03-29',
    from: 'Cashbook',
    to: 'External',
    amount: '1,000.00',
    reference: '758979jbhxgdx',
    performedBy: 'N/A',
    username: '',
    slip: 'No slip',
    status: 'Auto-Verified',
    transactionType: 'sys_cash',
  },
  {
    id: 2,
    type: 'Internal',
    date: '2026-03-29',
    from: 'Sample supplier',
    to: 'External',
    amount: '1,000.00',
    reference: '758979jbhxgdx',
    performedBy: 'Admin',
    username: 'admin',
    slip: 'No slip',
    status: 'Auto-Verified',
    transactionType: 'supplier_transaction',
  },
  {
    id: 1,
    type: 'Internal',
    date: '2026-03-29',
    from: 'Cashbook',
    to: 'External',
    amount: '200.00',
    reference: '758979jbhxgdx',
    performedBy: 'N/A',
    username: '',
    slip: 'No slip',
    status: 'Auto-Verified',
    transactionType: 'sys_cash',
  },
  {
    id: 1,
    type: 'Internal',
    date: '2026-03-29',
    from: 'Sample supplier',
    to: 'External',
    amount: '200.00',
    reference: '758979jbhxgdx',
    performedBy: 'Admin',
    username: 'admin',
    slip: 'No slip',
    status: 'Auto-Verified',
    transactionType: 'supplier_transaction',
  },
];

const Transactions = () => {
  const [loading, setLoading] = useState(true);
  const [reverseModalOpen, setReverseModalOpen] = useState(false);
  const [reverseForm, setReverseForm] = useState({
    transactionId: '',
    transactionType: '',
    amount: '',
    from: '',
    to: '',
    typeDisplay: '',
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const openReverseModal = (transactionId, transactionType, amount, from, to) => {
    let typeDisplay = '';

    if (transactionType === 'bank_deposit') {
      typeDisplay = 'Bank Deposit';
    } else if (transactionType === 'sys_cash') {
      typeDisplay = 'Internal Transfer';
    } else if (transactionType === 'supplier_transaction') {
      typeDisplay = 'Supplier Transaction';
    }

    setReverseForm({
      transactionId,
      transactionType,
      amount,
      from,
      to,
      typeDisplay,
    });
    setReverseModalOpen(true);
  };

  const closeReverseModal = () => {
    setReverseModalOpen(false);
    setReverseForm({
      transactionId: '',
      transactionType: '',
      amount: '',
      from: '',
      to: '',
      typeDisplay: '',
    });
  };

  return (
    <div className="transactions-page min-h-dvh max-lg:h-fit flex flex-col h-dvh">
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
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-14 max-sm:h-8 bg-white p-1 rounded-full"
          />
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

      <div className="flex flex-col h-[85%]">
        <div className="w-full px-4 py-5 sm:px-6 lg:px-12">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <a href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                  <svg className="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Main Panel
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <a href="/finance" className="text-sm font-medium text-gray-700 hover:text-blue-600 ms-1 md:ms-2">Finance</a>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <span className="text-sm font-medium text-gray-500 ms-1 md:ms-2">Transactions</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex-1 px-4 pb-6 overflow-auto sm:px-6 lg:px-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <a href="/finance/deposits/create" className="px-4 py-2 text-white rounded-lg bg-[#3c8c2c] hover:opacity-90">
              <i className="mr-2 fas fa-plus" />New Transaction
            </a>
          </div>

          <div className="p-6 mb-6 bg-white rounded-lg shadow">
            <form className="grid grid-cols-1 gap-4 md:grid-cols-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Search</label>
                <input
                  type="text"
                  name="search"
                  defaultValue=""
                  placeholder="Reference, deposited by..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="custom-select">
                <label className="block mb-2 text-sm font-medium text-gray-700">From Source</label>
                <select name="from_source" className="hidden">
                  <option value="">All Sources</option>
                  <option data-header>System Cash</option>
                  <option value="cashbook">Cashbook</option>
                  <option value="petty-cash">Petty cash</option>
                  <option data-header>Bank Accounts</option>
                </select>
              </div>

              <div className="custom-select">
                <label className="block mb-2 text-sm font-medium text-gray-700">To Source</label>
                <select name="to_source" className="hidden">
                  <option value="">All Sources</option>
                  <option data-header>System Cash</option>
                  <option value="cashbook">Cashbook</option>
                  <option value="petty-cash">Petty cash</option>
                  <option data-header>Bank Accounts</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">From Date</label>
                <input
                  type="date"
                  name="from_date"
                  defaultValue=""
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">To Date</label>
                <input
                  type="date"
                  name="to_date"
                  defaultValue=""
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Verified</label>
                <select name="verified" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option value="">All</option>
                  <option value="1">Verified</option>
                  <option value="0">Pending</option>
                </select>
              </div>

              <div className="flex items-end space-x-2">
                <button type="submit" className="px-4 py-2 text-white rounded-lg bg-[#3c8c2c] hover:opacity-90">
                  <i className="mr-2 fas fa-filter" />Filter
                </button>
                <a href="/finance/deposits" className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <i className="mr-2 fas fa-redo" />Reset
                </a>
              </div>
            </form>
          </div>

          <div className="overflow-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="text-xs text-white uppercase bg-[#3c8c2c]">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">From</th>
                  <th className="px-4 py-2">To</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Reference</th>
                  <th className="px-4 py-2">Performed By</th>
                  <th className="px-4 py-2">Bank Slip</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={`${transaction.id}-${transaction.reference}-${transaction.from}`}>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{transaction.id}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        <i className="fas fa-exchange-alt" /> {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{transaction.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded">{transaction.from}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded">{transaction.to}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">LKR {transaction.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{transaction.reference}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {transaction.performedBy}<br />
                      <span className="text-xs text-gray-500">{transaction.username}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      <span className="text-gray-400">{transaction.slip}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">{transaction.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        id="reverseModal"
        className={`fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 ${reverseModalOpen ? '' : 'hidden'}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeReverseModal();
          }
        }}
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reverse Transaction</h3>
              <button type="button" onClick={closeReverseModal} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times" />
              </button>
            </div>

            <form action="/finance/transactions/reverse" method="POST">
              <input type="hidden" name="_token" value="" autoComplete="off" />
              <input type="hidden" name="transaction_id" value={reverseForm.transactionId} />
              <input type="hidden" name="transaction_type" value={reverseForm.transactionType} />

              <div className="mb-4">
                <div className="p-4 mb-4 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    <i className="mr-2 fas fa-exclamation-triangle" />
                    <strong>Warning:</strong> This action cannot be undone. The transaction will be deleted and all balances will be reversed.
                  </p>
                </div>

                <div className="p-4 mb-4 bg-blue-50 border border-blue-200 rounded">
                  <p className="mb-2 text-sm text-blue-900"><strong>Transaction Details:</strong></p>
                  <p className="text-sm text-blue-800">Amount: <span className="font-semibold">LKR {reverseForm.amount}</span></p>
                  <p className="text-sm text-blue-800">From: <span className="font-semibold">{reverseForm.from}</span></p>
                  <p className="text-sm text-blue-800">To: <span className="font-semibold">{reverseForm.to}</span></p>
                  <p className="text-sm text-blue-800">Type: <span className="font-semibold">{reverseForm.typeDisplay}</span></p>
                </div>

                <label className="block mb-2 text-sm font-medium text-gray-700">Reason for Reversal (Optional)</label>
                <input
                  type="text"
                  name="reason"
                  maxLength="255"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Entered wrong amount, Duplicate entry"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">Additional Notes (Optional)</label>
                <textarea
                  name="notes"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional information..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button type="button" onClick={closeReverseModal} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
                  <i className="mr-2 fas fa-arrow-left" />Confirm Reversal
                </button>
              </div>
            </form>
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

export default Transactions;