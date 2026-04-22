import React, { useState, useEffect } from 'react';
import './BalanceTransactionLog.css';
import '../../../components/Layout'
import Layout from '../../../components/Layout';

const BalanceTransactionLog = () => {
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalDebits: 0,
    totalCredits: 0,
    netBalance: 0,
    debitCount: 0,
    creditCount: 0,
    breakdown: {
      invoices: { total: 0, count: 0 },
      deposits: { total: 0, count: 0 },
      cheques: { total: 0, count: 0 },
      oilSales: { total: 0, count: 0 }
    }
  });
  const [filters, setFilters] = useState({
    date_from: '',
    date_to: ''
  });

  // Get customer ID from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('customer_id');
    if (id) {
      setCustomerId(id);
    }
  }, []);

  // Fetch transactions for the customer
  const fetchTransactions = async () => {
    if (!customerId) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      
      const url = `/api/customers/${customerId}/balance-transaction-log${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setCustomer(data.customer);
        setTransactions(data.transactions || []);
        if (data.summary) {
          setSummary({
            totalDebits: data.summary.totalDebits || 0,
            totalCredits: data.summary.totalCredits || 0,
            netBalance: data.summary.netBalance || 0,
            debitCount: data.summary.debitCount || 0,
            creditCount: data.summary.creditCount || 0,
            breakdown: data.summary.breakdown || {
              invoices: { total: 0, count: 0 },
              deposits: { total: 0, count: 0 },
              cheques: { total: 0, count: 0 },
              oilSales: { total: 0, count: 0 }
            }
          });
        }
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions when customerId changes
  useEffect(() => {
    if (customerId) {
      fetchTransactions();
    }
  }, [customerId]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  const handleNav = (url) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = url;
    }, 800);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `Rs. ${parseFloat(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get transaction type badge class
  const getTypeBadgeClass = (type, transactionType) => {
    if (type === 'debit') return 'bg-red-100 text-red-800';
    if (type === 'credit') return 'bg-green-100 text-green-800';
    if (transactionType === 'invoice') return 'bg-blue-100 text-blue-800';
    if (transactionType === 'deposit') return 'bg-purple-100 text-purple-800';
    if (transactionType === 'cheque') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Get transaction type label
  const getTypeLabel = (transaction) => {
    if (transaction.transactionType === 'customer_invoice') return 'Invoice';
    if (transaction.transactionType === 'customer_deposit') return 'Deposit';
    if (transaction.transactionType === 'cheque') return 'Cheque';
    if (transaction.transactionType === 'oil_sale') return 'Oil Sale';
    return transaction.type === 'debit' ? 'Debit' : 'Credit';
  };

  // Get net balance display
  const getNetBalanceDisplay = () => {
    const net = summary.netBalance;
    if (net > 0) return `Credit Rs. ${net.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    if (net < 0) return `Debit Rs. ${Math.abs(net).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    return 'Rs. 0.00';
  };

  return (
    <Layout>

    <div className="min-h-dvh max-lg:h-fit flex flex-col h-dvh">
      {/* Nav */}
      

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="text-center">
            <div className="spinner"></div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:h-[90vh]">
        {/* Breadcrumbs */}
        <div className="w-full px-4 py-5 sm:px-6 lg:px-12">
          <nav aria-label="Breadcrumb" className="flex items-center justify-between max-md:flex-col">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <a href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                  <svg className="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V18a2 2 0 002 2h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a2 2 0 002-2v-7.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Main Panel
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <a href="/customers/customers" className="text-sm font-medium text-gray-700 hover:text-blue-600 ms-1 md:ms-2">Customers</a>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <span className="text-sm font-medium text-gray-500 ms-1 md:ms-2">Customer Balance Transaction Log</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Customer Info and Filters */}
        <div className="px-4 py-4 sm:px-6 lg:px-12">
          {/* Customer Information Card */}
          {customer && (
            <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow border border-gray-200">
              <div className="flex flex-wrap justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    {customer.code && <span><span className="font-medium">Code:</span> {customer.code}</span>}
                    {customer.contact && <span><span className="font-medium">Contact:</span> {customer.contact}</span>}
                    {customer.creditLimit > 0 && (
                      <span><span className="font-medium">Credit Limit:</span> {formatCurrency(customer.creditLimit)}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Current Balance</p>
                  <p className={`text-2xl font-bold ${customer.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.abs(customer.currentBalance))}
                    <span className="text-sm ml-1">
                      {customer.currentBalance >= 0 ? '(Credit)' : '(Debit)'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Filters Form */}
          <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Date From */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">From Date</label>
                <input 
                  type="date" 
                  name="date_from" 
                  value={filters.date_from}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                />
              </div>
              {/* Date To */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">To Date</label>
                <input 
                  type="date" 
                  name="date_to" 
                  value={filters.date_to}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                />
              </div>
              <div className="flex items-end">
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 w-full">
                  Apply Filters
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Log Table & Summary */}
        <div className="flex-1 px-4 pb-6 md:overflow-auto sm:px-6 lg:px-12">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Transaction Logs
            </h2>
            
            {/* Summary Cards */}
            {customer && (
              <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-5">
                {/* Total Debits Card */}
                <div className="p-4 border-l-4 border-green-500 rounded-lg shadow-sm bg-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-green-600 uppercase">Total Debits</p>
                      <p className="mt-1 text-2xl font-bold text-green-700">{formatCurrency(summary.totalDebits)}</p>
                      <p className="mt-1 text-xs text-green-600">{summary.debitCount} transactions</p>
                    </div>
                    <div className="p-3 bg-green-200 rounded-full">
                      <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Total Credits Card */}
                <div className="p-4 border-l-4 border-red-500 rounded-lg shadow-sm bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-red-600 uppercase">Total Credits</p>
                      <p className="mt-1 text-2xl font-bold text-red-700">{formatCurrency(summary.totalCredits)}</p>
                      <p className="mt-1 text-xs text-red-600">{summary.creditCount} transactions</p>
                    </div>
                    <div className="p-3 bg-red-200 rounded-full">
                      <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Net Balance Card */}
                <div className="p-4 border-l-4 border-blue-500 rounded-lg shadow-sm bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-600 uppercase">Net Balance</p>
                      <p className="mt-1 text-2xl font-bold text-blue-700">{getNetBalanceDisplay()}</p>
                      <p className="mt-1 text-xs text-blue-600">From filtered logs</p>
                    </div>
                    <div className="p-3 bg-blue-200 rounded-full">
                      <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Current Balance Card */}
                <div className="p-4 border-l-4 border-purple-500 rounded-lg shadow-sm bg-purple-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-purple-600 uppercase">Current Balance</p>
                      <p className="mt-1 text-2xl font-bold text-purple-700">{formatCurrency(Math.abs(customer.currentBalance))}</p>
                      <p className="mt-1 text-xs text-purple-600">
                        {customer.currentBalance >= 0 ? 'Credit Balance' : 'Debit Balance'}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-200 rounded-full">
                      <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Total Logs Card */}
                <div className="p-4 border-l-4 border-gray-500 rounded-lg shadow-sm bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">Total Logs</p>
                      <p className="mt-1 text-2xl font-bold text-gray-700">{transactions.length}</p>
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
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3 text-right">Debit</th>
                    <th className="px-6 py-3 text-right">Credit</th>
                    <th className="px-6 py-3">Performed By</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        {customer ? 'No logs found. Try adjusting your filters.' : 'Loading customer information...'}
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction, index) => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4">{formatDate(transaction.date)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeClass(transaction.type, transaction.transactionType)}`}>
                            {getTypeLabel(transaction)}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {customer?.name || '-'}
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate">
                          {transaction.description || transaction.referenceNumber || '-'}
                          {transaction.invoiceCode && (
                            <span className="ml-1 text-xs text-gray-400">(Inv: {transaction.invoiceCode})</span>
                          )}
                          {transaction.chequeNumber && (
                            <span className="ml-1 text-xs text-gray-400">(Chq: {transaction.chequeNumber})</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right text-red-600">
                          {transaction.type === 'debit' ? formatCurrency(transaction.amount) : '-'}
                        </td>
                        <td className="px-6 py-4 text-right text-green-600">
                          {transaction.type === 'credit' ? formatCurrency(transaction.amount) : '-'}
                        </td>
                        <td className="px-6 py-4">{transaction.performedBy || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination placeholder */}
            <div className="mt-4"></div>
          </div>
        </div>
      </div>

      
    </div>
    </Layout>
  );
};

export default BalanceTransactionLog;