import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './TransactionHistory.css';

const TransactionHistory = () => {
  const { id } = useParams(); // Get customer ID from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('Transaction Details');
  
  // State for data
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  
  // Filter state
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(id || '');

  // Keep state in sync with route param
  useEffect(() => {
    setSelectedCustomer(id || '');
  }, [id]);
  
  // Customer dropdown state (for customer selection)
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Fetch customers list for dropdown
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/customers', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.customers)) {
          const customerOptions = data.customers.map(c => ({
            value: c.id,
            label: c.customer_name
          }));
          setCustomers(customerOptions);
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
      }
    };
    fetchCustomers();
  }, []);
  
  // Fetch transactions when customer ID or filters change
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);
      if (transactionType) {
        // UI uses legacy HTML values; backend expects source_type values
        const typeMap = {
          invoice: 'customer_invoice',
          deposit: 'customer_deposit',
          cheque: 'cheque',
          oil_sale: 'oil_sale'
        };
        params.append('transaction_type', typeMap[transactionType] || transactionType);
      }

      const url = selectedCustomer
        ? `/api/customers/${selectedCustomer}/transactions${params.toString() ? '?' + params.toString() : ''}`
        : `/api/customers/transactions${params.toString() ? '?' + params.toString() : ''}`;

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        if (selectedCustomer) {
          setCustomer(data.customer);
          setSummary(data.summary);
          setTransactions(data.transactions || []);
        } else {
          setCustomer(null);
          setSummary(data.summary || null);
          setTransactions(data.transactions || []);
        }
      } else {
        console.error('Error fetching transactions:', data.error);
        setTransactions([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCustomer, dateFrom, dateTo, transactionType]);
  
  // Initial fetch when component mounts or customer changes
  useEffect(() => {
    fetchTransactions();
  }, [selectedCustomer, fetchTransactions]);
  
  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCustomerDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Filtered customer options
  const filteredCustomers = customers.filter(opt =>
    opt.label.toLowerCase().includes(customerSearch.toLowerCase())
  );
  
  // Modal logic
  const openModal = async (customerId, transactionId) => {
    setModalOpen(true);
    setModalTitle('Transaction Details');
    setModalContent(
      <div className="flex items-center justify-center py-8">
        <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
    
    try {
      const token = localStorage.getItem('token');
      const resolvedCustomerId = customerId || selectedCustomer;
      if (!resolvedCustomerId) {
        setModalContent(
          <div className="text-center text-red-600 p-4">
            Missing customer for this transaction
          </div>
        );
        return;
      }

      const res = await fetch(`/api/customers/${resolvedCustomerId}/transaction-detail/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setModalContent(
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Transaction Date</p>
                <p className="font-medium">{new Date(data.transaction.transaction_date).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className={`font-medium ${data.transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {data.transaction.type === 'credit' ? '+' : '-'} Rs. {parseFloat(data.transaction.amount).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium capitalize">{data.transaction.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Source</p>
                <p className="font-medium capitalize">{data.transaction.source_type?.replace('_', ' ')}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{data.transaction.description || 'N/A'}</p>
              </div>
              {data.transaction.reference_number && (
                <div>
                  <p className="text-sm text-gray-500">Reference Number</p>
                  <p className="font-medium">{data.transaction.reference_number}</p>
                </div>
              )}
              {data.transaction.performed_by && (
                <div>
                  <p className="text-sm text-gray-500">Performed By</p>
                  <p className="font-medium">{data.transaction.performed_by}</p>
                </div>
              )}
            </div>
            {data.details && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold mb-2">Additional Details</h4>
                <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto">
                  {JSON.stringify(data.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        );
      } else {
        setModalContent(
          <div className="text-center text-red-600 p-4">
            Failed to load transaction details
          </div>
        );
      }
    } catch (err) {
      console.error('Error fetching transaction details:', err);
      setModalContent(
        <div className="text-center text-red-600 p-4">
          Error loading transaction details
        </div>
      );
    }
  };
  
  const closeModal = () => setModalOpen(false);

  // Close modal on ESC key (matches legacy HTML behavior)
  useEffect(() => {
    if (!modalOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);
  
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchTransactions();
  };
  
  const clearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setTransactionType('');
    fetchTransactions();
  };

  const printModal = () => {
    const contentEl = document.getElementById('transactionModalContent');
    if (!contentEl) return;

    const printWindow = window.open('', '_blank', 'width=1000,height=700');
    if (!printWindow) return;

    const safeTitle = modalTitle || 'Transaction Details';
    printWindow.document.write(`
      <html>
        <head>
          <title>${safeTitle}</title>
          <style>
            body { font-family: Helvetica, Arial, sans-serif; padding: 24px; }
            h1 { font-size: 18px; margin: 0 0 12px; }
            pre { white-space: pre-wrap; word-break: break-word; }
          </style>
        </head>
        <body>
          <h1>${safeTitle}</h1>
          ${contentEl.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });

    const title = selectedCustomer
      ? `Customer Transactions${customer?.name ? ` - ${customer.name}` : ''}`
      : 'All Customer Transactions';

    doc.setFontSize(12);
    doc.text(title, 14, 14);

    const head = [[
      '#',
      'Date',
      'Type',
      ...(!selectedCustomer ? ['Customer'] : []),
      'Description',
      'Debit',
      'Credit',
      'Reference'
    ]];

    const body = (transactions || []).map((t, index) => {
      const typeLabel = (t.transactionType || t.sourceType || '').toString();
      const customerLabel = t.customerName || t.customerCode || t.customerId || '';
      const debit = t.type === 'debit' ? `Rs. ${Number(t.amount || 0).toLocaleString()}` : '';
      const credit = t.type === 'credit' ? `Rs. ${Number(t.amount || 0).toLocaleString()}` : '';
      const ref = t.referenceNumber || t.invoiceCode || t.chequeNumber || '';

      return [
        index + 1,
        formatDate(t.date),
        typeLabel.replace('_', ' '),
        ...(!selectedCustomer ? [customerLabel] : []),
        t.description || '',
        debit,
        credit,
        ref
      ];
    });

    autoTable(doc, {
      head,
      body,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [243, 244, 246], textColor: [55, 65, 81] }
    });

    const fileName = selectedCustomer ? 'customer-transactions.pdf' : 'all-customer-transactions.pdf';
    doc.save(fileName);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  
  // Get transaction type badge color
  const getTypeBadgeClass = (transactionType) => {
    switch (transactionType) {
      case 'invoice': return 'bg-blue-100 text-blue-800';
      case 'deposit': return 'bg-green-100 text-green-800';
      case 'cheque': return 'bg-purple-100 text-purple-800';
      case 'oil_sale': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="transaction-history-root min-h-dvh max-lg:h-fit flex flex-col h-dvh">
      {/* Nav */}
      <div className="nav bg-[#3c8c2c] w-full h-[10%] max-lg:h-[17dvh] py-6 flex justify-between items-center max-md:justify-center max-md:flex-col md:px-14 lg:px-0">
        <span className="flex items-center gap-3 ml-20 max-lg:ml-0 max-sm:scale-75">
          <button type="button" onClick={() => navigate(-1)} className="rounded-full w-[50px] aspect-square bg-white flex justify-center items-center hover:scale-90 transition-all">
            <i className="text-xl text-[#000000] fas fa-arrow-left"></i>
          </button>
          <button type="button" onClick={() => navigate('/dashboard')} className="p-2 text-[#000000] rounded-lg bg-white flex gap-3 justify-center items-center hover:scale-90 transition-all">
            Dashboard
          </button>
          <button type="button" onClick={() => navigate('/sales/billing')} className="p-2 text-[#000000] rounded-lg bg-white flex gap-3 justify-center items-center hover:scale-90 transition-all">
            POS
          </button>
        </span>
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
          <img src="https://hypermart-new.onlinesytems.com/Company Logo/1774375149_1771770442_Screenshot 2026-02-22 195640.png" alt="Logo" className="h-14 max-sm:h-8 bg-white p-1 rounded-full" />
        </div>
        <span className="flex items-center gap-3 mr-20 max-lg:mr-0 max-sm:scale-75">
          <div className="flex flex-col items-end text-right">
            <h3 className="text-2xl max-md:text-sm text-[#ffffff]">Good Afternoon!</h3>
            <h3 className="text-sm text-[#ffffff]">Welcome HYPERMART</h3>
          </div>
          <form method="POST" action="https://hypermart-new.onlinesytems.com/logout">
            <input type="hidden" name="_token" value="w60AGsOgpzTar61Q5IStjmzQHtGFA4bgGu0ewCzn" autoComplete="off" />
            <button type="submit" className="rounded-full w-[50px] aspect-square bg-white flex justify-center items-center hover:scale-90 transition-all">
              <i className="text-xl font-bold text-[#000000] fas fa-sign-out-alt"></i>
            </button>
          </form>
        </span>
      </div>
      
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-white">Loading transactions...</p>
          </div>
        </div>
      )}
      
      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-xl font-semibold text-gray-900">{modalTitle}</h3>
                <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[70vh]" id="transactionModalContent">
                {modalContent}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-between items-center gap-3 p-4 border-t">
                <button
                  type="button"
                  onClick={printModal}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  Print
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
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
                  <span className="text-sm font-medium text-gray-500 ms-1 md:ms-2">
                    {selectedCustomer
                      ? (customer ? `${customer.name} - Transactions` : 'Customer Transactions History')
                      : 'All Customers - Transactions'}
                  </span>
                </div>
              </li>
            </ol>
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => navigate('/customers/transactions')} 
                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                + New Transaction
              </button>
              <button
                onClick={exportPDF}
                disabled={!selectedCustomer}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Export PDF
              </button>
            </div>
          </nav>
        </div>
        
        {/* Filters */}
        <div className="px-4 py-4 sm:px-6 lg:px-12">
          <form className="p-4 bg-white rounded-lg shadow" onSubmit={handleFilterSubmit} autoComplete="off">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {/* Customer Filter (matches legacy HTML placement) */}
              <div className="custom-select">
                <label className="block mb-2 text-sm font-medium text-gray-700">Customer</label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left bg-white"
                    onClick={() => setCustomerDropdownOpen((open) => !open)}
                  >
                    {selectedCustomer
                      ? (customers.find(opt => opt.value === selectedCustomer)?.label || 'Select customer')
                      : 'All customers'}
                  </button>
                  {customerDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
                        placeholder="Search customer..."
                        value={customerSearch}
                        onChange={e => setCustomerSearch(e.target.value)}
                        autoFocus
                      />
                      <ul className="max-h-48 overflow-y-auto">
                        <li
                          className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${!selectedCustomer ? 'bg-blue-50 font-semibold' : ''}`}
                          onClick={() => {
                            setSelectedCustomer('');
                            setCustomerDropdownOpen(false);
                            navigate('/customers/transactions/history');
                          }}
                        >
                          All customers
                        </li>
                        {filteredCustomers.length === 0 && (
                          <li className="px-3 py-2 text-gray-400">No results</li>
                        )}
                        {filteredCustomers.map(opt => (
                          <li
                            key={opt.value}
                            className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${selectedCustomer === opt.value ? 'bg-blue-50 font-semibold' : ''}`}
                            onClick={() => {
                              setSelectedCustomer(opt.value);
                              setCustomerDropdownOpen(false);
                              navigate(`/customers/transactions/history/${opt.value}`);
                            }}
                          >
                            {opt.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Transaction Type</label>
                <select 
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg"
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="deposit">Customer Deposits</option>
                  <option value="invoice">Invoices (Credit Bills)</option>
                  <option value="cheque">Cheques</option>
                  <option value="oil_sale">Oil Sales</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">From Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">To Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">Apply Filters</button>
              <button type="button" onClick={clearFilters} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Clear Filters</button>
            </div>
          </form>
        </div>
        
        {/* Transactions Table & Summary */}
        <div className="flex-1 px-4 pb-6 md:overflow-auto sm:px-6 lg:px-12">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              {selectedCustomer
                ? `Transactions for ${customer ? customer.name : 'Customer'}`
                : 'Transactions for all customers'}
            </h2>
            
            {/* Summary Cards */}
            {summary && (
              <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Debits Card */}
                <div className="p-4 border-l-4 border-red-500 rounded-lg shadow-sm bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-red-600 uppercase">Total Debits</p>
                      <p className="mt-1 text-2xl font-bold text-red-700">
                        Rs. {parseFloat(summary.totalDebits).toLocaleString()}
                      </p>
                      <p className="mt-1 text-xs text-red-600">{summary.debitCount} transactions</p>
                    </div>
                    <div className="p-3 bg-red-200 rounded-full">
                      <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Total Credits Card */}
                <div className="p-4 border-l-4 border-green-500 rounded-lg shadow-sm bg-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-green-600 uppercase">Total Credits</p>
                      <p className="mt-1 text-2xl font-bold text-green-700">
                        Rs. {parseFloat(summary.totalCredits).toLocaleString()}
                      </p>
                      <p className="mt-1 text-xs text-green-600">{summary.creditCount} transactions</p>
                    </div>
                    <div className="p-3 bg-green-200 rounded-full">
                      <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Net Balance Card */}
                <div className={`p-4 border-l-4 ${summary.netBalance >= 0 ? 'border-blue-500 bg-blue-50' : 'border-orange-500 bg-orange-50'} rounded-lg shadow-sm`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase">Net Balance</p>
                      <p className={`mt-1 text-2xl font-bold ${summary.netBalance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                        {summary.netBalance >= 0 ? 'Credit' : 'Debit'} Rs. {Math.abs(parseFloat(summary.netBalance)).toLocaleString()}
                      </p>
                      <p className="mt-1 text-xs">From filtered transactions</p>
                    </div>
                    <div className={`p-3 rounded-full ${summary.netBalance >= 0 ? 'bg-blue-200' : 'bg-orange-200'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Current Balance Card (single customer only) */}
                {selectedCustomer ? (
                  <div className="p-4 border-l-4 border-yellow-500 rounded-lg shadow-sm bg-yellow-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-yellow-600 uppercase">Current Balance</p>
                        <p className="mt-1 text-2xl font-bold text-yellow-700">
                          {customer?.currentBalance >= 0 ? 'Credit' : 'Debit'} Rs. {Math.abs(customer?.currentBalance || 0).toLocaleString()}
                        </p>
                        <p className="mt-1 text-xs text-yellow-600">Customer</p>
                      </div>
                      <div className="p-3 bg-yellow-200 rounded-full">
                        <svg className="w-6 h-6 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-l-4 border-gray-500 rounded-lg shadow-sm bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-600 uppercase">Total Transactions</p>
                        <p className="mt-1 text-2xl font-bold text-gray-800">
                          {(Number(summary.debitCount) || 0) + (Number(summary.creditCount) || 0)}
                        </p>
                        <p className="mt-1 text-xs text-gray-600">From filtered transactions</p>
                      </div>
                      <div className="p-3 bg-gray-200 rounded-full">
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 6H7a2 2 0 01-2-2V4a2 2 0 012-2h7l5 5v13a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Transaction Type Breakdown */}
            {summary && (
              <div className="grid grid-cols-2 gap-4 p-4 mb-6 border rounded-lg md:grid-cols-3 bg-gray-50">
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-600">Deposits</p>
                  <p className="mt-1 text-lg font-bold text-green-700">
                    Rs. {parseFloat(summary.breakdown?.deposits?.total || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{summary.breakdown?.deposits?.count || 0} items</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-600">Invoices</p>
                  <p className="mt-1 text-lg font-bold text-blue-700">
                    Rs. {parseFloat(summary.breakdown?.invoices?.total || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{summary.breakdown?.invoices?.count || 0} items</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-600">Oil Sales</p>
                  <p className="mt-1 text-lg font-bold text-yellow-700">
                    Rs. {parseFloat(summary.breakdown?.oilSales?.total || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{summary.breakdown?.oilSales?.count || 0} items</p>
                </div>
              </div>
            )}
            
            {/* Transactions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Type</th>
                    {!selectedCustomer && <th className="px-6 py-3">Customer</th>}
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3 text-right">Debit</th>
                    <th className="px-6 py-3 text-right">Credit</th>
                    <th className="px-6 py-3">Reference</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={selectedCustomer ? 8 : 9} className="px-6 py-8 text-center text-gray-500">
                        {selectedCustomer ? 'No transactions found for this customer' : 'No transactions found'}
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction, index) => (
                      <tr key={transaction.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{index + 1}</td>
                        <td className="px-6 py-4">{formatDate(transaction.date)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded ${getTypeBadgeClass(transaction.transactionType)}`}>
                            {transaction.transactionType?.replace('_', ' ') || transaction.sourceType}
                          </span>
                        </td>
                        {!selectedCustomer && (
                          <td className="px-6 py-4">
                            {transaction.customerName || transaction.customerCode || transaction.customerId || '-'}
                          </td>
                        )}
                        <td className="px-6 py-4 max-w-xs truncate">
                          {transaction.description || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-right text-red-600 font-medium">
                          {transaction.type === 'debit' ? `Rs. ${parseFloat(transaction.amount).toLocaleString()}` : '-'}
                        </td>
                        <td className="px-6 py-4 text-right text-green-600 font-medium">
                          {transaction.type === 'credit' ? `Rs. ${parseFloat(transaction.amount).toLocaleString()}` : '-'}
                        </td>
                        <td className="px-6 py-4">
                          {transaction.referenceNumber || transaction.invoiceCode || transaction.chequeNumber || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            type="button" 
                            className="px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
                            onClick={() => openModal(transaction.customerId, transaction.id)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {transactions.length > 0 && summary && selectedCustomer && (
                  <tfoot className="font-bold bg-gray-100">
                    <tr>
                      <td className="px-6 py-4 text-right" colSpan={4}>Totals:</td>
                      <td className="px-6 py-4 text-right text-red-600">
                        Rs. {parseFloat(summary?.totalDebits || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-green-600">
                        Rs. {parseFloat(summary?.totalCredits || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4" colSpan={2}></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-[#3c8c2c] py-4 text-center text-[#ffffff]">
        <p>2026 © All Rights Reserved | Hypermart | Designed and Developed by Silicon Radon Networks (Pvt) Ltd</p>
      </footer>
    </div>
  );
};

export default TransactionHistory;