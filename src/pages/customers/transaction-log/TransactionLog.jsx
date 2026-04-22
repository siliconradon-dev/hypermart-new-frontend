import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TransactionLog.css';
import Layout from '../../../components/Layout';

const TransactionLog = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logData, setLogData] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Fetch log data
  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    setError(null);
    let url = `/api/customers/${customerId}/transactions`;
    const params = [];
    if (dateFrom) params.push(`date_from=${dateFrom}`);
    if (dateTo) params.push(`date_to=${dateTo}`);
    if (params.length) url += `?${params.join('&')}`;
    fetch(url, {
      headers: {
        Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : undefined,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLogData(data);
        else setError(data.error || 'Failed to fetch log');
        setLoading(false);
      })
      .catch((e) => {
        setError('Failed to fetch log');
        setLoading(false);
      });
  }, [customerId, dateFrom, dateTo]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // Triggers useEffect
  };

  return (
    <Layout>
      <div className="transaction-log-root min-h-screen flex flex-col">
        {/* Loading Overlay */}
        {loading && (
          <div className="loading-overlay">
            <div className="text-center">
              <div className="spinner"></div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 flex items-center bg-red-600 text-white px-6 py-3 rounded shadow-lg transition-all">
            <span className="mr-2">
              <i className="fas fa-times-circle"></i>
            </span>
            {error}
            <button className="ml-4 text-white" onClick={() => setError(null)}>&times;</button>
          </div>
        )}

        <div className="flex flex-col flex-grow">
          {/* Breadcrumbs */}
          <div className="w-full px-4 py-5 sm:px-6 lg:px-12">
            <nav aria-label="Breadcrumb" className="flex items-center justify-between max-md:flex-col">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    <svg className="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V18a2 2 0 002 2h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a2 2 0 002-2v-7.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    Main Panel
                  </button>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mx-1 text-gray-400" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <button
                      onClick={() => navigate('/customers/customer_list')}
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 ms-1 md:ms-2"
                    >
                      Customers
                    </button>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mx-1 text-gray-400" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <span className="text-sm font-medium text-gray-500 ms-1 md:ms-2">Customer Transaction Log</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Filters */}
          <div className="px-4 py-4 sm:px-6 lg:px-12">
            <form className="p-4 bg-white rounded-lg shadow" onSubmit={handleFilterSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {/* Customer Filter (disabled if customerId is present) */}
                <div className="custom-select">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Customer</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    value={logData?.customer?.name || ''}
                    disabled
                  />
                </div>
                {/* Date From */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">From Date</label>
                  <input
                    type="date"
                    name="date_from"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                {/* Date To */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">To Date</label>
                  <input
                    type="date"
                    name="date_to"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex-1">
                    Apply Filters
                  </button>
                  <button 
                    type="button" 
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 whitespace-nowrap" 
                    onClick={() => { setDateFrom(""); setDateTo(""); }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Log Table & Summary */}
          <div className="flex-1 px-4 pb-6 md:overflow-auto sm:px-6 lg:px-12">
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Logs for Customer</h2>
              
              {/* Summary Cards — Filtered */}
              {logData && logData.summary && (
                <>
                  <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                    Filtered Period: {dateFrom || 'All'} — {dateTo || 'All'}
                  </p>
                  <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="p-4 border-l-4 border-green-500 rounded-lg shadow-sm bg-green-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-green-600 uppercase">Total Debits</p>
                          <p className="mt-1 text-2xl font-bold text-green-700">
                            Rs. {logData.summary.totalDebits?.toLocaleString(undefined, {minimumFractionDigits:2})}
                          </p>
                          <p className="mt-1 text-xs text-green-600">{logData.summary.debitCount} transactions</p>
                        </div>
                        <div className="p-3 bg-green-200 rounded-full">
                          <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border-l-4 border-red-500 rounded-lg shadow-sm bg-red-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-red-600 uppercase">Total Credits</p>
                          <p className="mt-1 text-2xl font-bold text-red-700">
                            Rs. {logData.summary.totalCredits?.toLocaleString(undefined, {minimumFractionDigits:2})}
                          </p>
                          <p className="mt-1 text-xs text-red-600">{logData.summary.creditCount} transactions</p>
                        </div>
                        <div className="p-3 bg-red-200 rounded-full">
                          <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border-l-4 border-blue-500 rounded-lg shadow-sm bg-blue-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-blue-600 uppercase">Net Balance</p>
                          <p className="mt-1 text-2xl font-bold text-blue-700">
                            {logData.summary.netBalance >= 0 ? 'Debit' : 'Credit'} Rs. {Math.abs(logData.summary.netBalance).toLocaleString(undefined, {minimumFractionDigits:2})}
                          </p>
                          <p className="mt-1 text-xs text-blue-600">From filtered logs</p>
                        </div>
                        <div className="p-3 bg-blue-200 rounded-full">
                          <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border-l-4 border-gray-500 rounded-lg shadow-sm bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-600 uppercase">Total Logs</p>
                          <p className="mt-1 text-2xl font-bold text-gray-700">{logData.transactions?.length}</p>
                          <p className="mt-1 text-xs text-gray-600">In current filter</p>
                        </div>
                        <div className="p-3 bg-gray-200 rounded-full">
                          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">#</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Description</th>
                      <th className="px-6 py-3 text-right">Debit</th>
                      <th className="px-6 py-3 text-right">Credit</th>
                      <th className="px-6 py-3">Performed By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logData && logData.transactions && logData.transactions.length > 0 ? (
                      logData.transactions.map((t, idx) => (
                        <tr key={t.id || idx} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium">{idx + 1}</td>
                          <td className="px-6 py-4">{t.date ? new Date(t.date).toLocaleString() : ''}</td>
                          <td className="px-6 py-4 capitalize">{t.transactionType || t.type}</td>
                          <td className="px-6 py-4">{t.description}</td>
                          <td className="px-6 py-4 text-right text-green-600 font-medium">
                            {t.type === 'debit' ? `Rs. ${Number(t.amount).toLocaleString(undefined, {minimumFractionDigits:2})}` : ''}
                          </td>
                          <td className="px-6 py-4 text-right text-red-600 font-medium">
                            {t.type === 'credit' ? `Rs. ${Number(t.amount).toLocaleString(undefined, {minimumFractionDigits:2})}` : ''}
                          </td>
                          <td className="px-6 py-4">{t.performedBy}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-6">No transactions found.</td>
                      </tr>
                    )}
                  </tbody>
                  {logData && logData.transactions && logData.transactions.length > 0 && (
                    <tfoot className="font-bold bg-gray-100">
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-right">Totals:</td>
                        <td className="px-6 py-4 text-right text-green-600">
                          Rs. {logData.summary?.totalDebits?.toLocaleString(undefined, {minimumFractionDigits:2})}
                        </td>
                        <td className="px-6 py-4 text-right text-red-600">
                          Rs. {logData.summary?.totalCredits?.toLocaleString(undefined, {minimumFractionDigits:2})}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TransactionLog;