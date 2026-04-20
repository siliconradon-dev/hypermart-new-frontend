import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import './SupplierCheque.css';

const initialBounceState = {
  open: false,
  chequeId: null,
  chequeNumber: '',
  supplierName: '',
  amount: '',
  supplierId: '',
  fuelTypeId: '',
  fuelTypeName: 'N/A',
  replacementChequeNumber: '',
  replacementAccountId: '',
  replacementChequeDate: '',
  replacementClearanceDate: '',
  replacementNotes: '',
  paymentOption: '',
};

const SupplierCheque = ({ onBackToMain }) => {
  const [loading, setLoading] = useState(false);
  const [cheques, setCheques] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState(30);
  const [filters, setFilters] = useState({
    cheque_number: '',
    cheque_customer: '',
    cheque_status: '',
    bank_name: '',
    cheque_date_from: '',
    cheque_date_to: '',
    clearance_date_from: '',
    clearance_date_to: '',
    cheque_min_amount: '',
    cheque_max_amount: '',
    has_replacement: '',
  });
  const [bounceState, setBounceState] = useState(initialBounceState);
  // Fetch cheques from backend
  const fetchCheques = async (filtersArg = filters, pageArg = page, entriesArg = entries) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtersArg.cheque_number) params.set('cheque_number', filtersArg.cheque_number);
      if (filtersArg.cheque_customer) params.set('search', filtersArg.cheque_customer);
      if (filtersArg.cheque_status) params.set('cheque_status', filtersArg.cheque_status);
      if (filtersArg.bank_name) params.set('bank_name', filtersArg.bank_name);
      if (filtersArg.cheque_date_from) params.set('date_from', filtersArg.cheque_date_from);
      if (filtersArg.cheque_date_to) params.set('date_to', filtersArg.cheque_date_to);
      if (filtersArg.clearance_date_from) params.set('clearance_date_from', filtersArg.clearance_date_from);
      if (filtersArg.clearance_date_to) params.set('clearance_date_to', filtersArg.clearance_date_to);
      if (filtersArg.cheque_min_amount) params.set('min_amount', filtersArg.cheque_min_amount);
      if (filtersArg.cheque_max_amount) params.set('max_amount', filtersArg.cheque_max_amount);
      if (filtersArg.has_replacement) params.set('has_replacement', filtersArg.has_replacement);
      params.set('limit', entriesArg);
      params.set('offset', (pageArg - 1) * entriesArg);
      const resp = await fetch(`/api/supplier-cheques?${params.toString()}`);
      const data = await resp.json();
      setCheques(Array.isArray(data.cheques) ? data.cheques : []);
      setTotalCount(Number(data.totalCount) || 0);
    } catch {
      setCheques([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheques(filters, page, entries);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, entries]);

  const openBounceChequeModal = () => {
    setBounceState({
      open: true,
      chequeId: 1,
      chequeNumber: 'CHQ-0001',
      supplierName: 'sample supplier',
      amount: '0',
      supplierId: '1',
      fuelTypeId: '1',
      fuelTypeName: 'N/A',
      replacementChequeNumber: '',
      replacementAccountId: '',
      replacementChequeDate: '',
      replacementClearanceDate: '',
      replacementNotes: '',
      paymentOption: '',
    });
  };

  const closeBounceChequeModal = () => {
    setBounceState(initialBounceState);
  };

  const handleBounceSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      closeBounceChequeModal();
    }, 400);
  };

  const handleClearCheque = () => {
    window.alert('Clear cheque action is not wired in the React demo.');
  };

  const handleReverseSupplierCheque = () => {
    window.alert('Reverse supplier cheque action is not wired in the React demo.');
  };

  return (
    <Layout onBackToMain={onBackToMain}>
      <div className="supplier-cheque-page flex flex-col min-h-[120vh]">
        {loading && (
          <div id="loading-overlay" className="loading-overlay">
            <div className="text-center">
              <div className="spinner" />
            </div>
          </div>
        )}

        <div className="flex flex-col h-[85vh] overflow-y-auto">
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
                    <a href="/suppliers/cheques" className="text-sm font-medium text-gray-700 hover:text-blue-600 ms-1 md:ms-2">Supplier Cheques</a>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div className="flex-1 px-4 pb-6 sm:px-6 lg:px-12 overflow-y-auto">
            <div className="flex items-center justify-between mb-6 cheque-toolbar">
              <h1 className="text-2xl font-bold text-gray-900">Supplier Cheques</h1>
              <div className="flex gap-3 cheque-toolbar-actions">
                <a href="/suppliers/transaction-log" className="px-4 py-2 text-white rounded-lg bg-indigo-600 hover:opacity-90 flex items-center gap-2">
                  <i className="fas fa-list-alt" />
                  Transaction Log
                </a>
                <a href="/suppliers/cheques/create" className="px-4 py-2 text-white rounded-lg bg-green-600 hover:opacity-90 flex items-center gap-2">
                  <i className="fas fa-money-check-alt" />
                  Add Cheque
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-700 font-medium">Pending Cheques</p>
                    <p className="text-2xl font-bold text-yellow-900">0</p>
                    <p className="text-xs text-yellow-600">Rs. 0.00</p>
                  </div>
                  <svg className="w-10 h-10 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 font-medium">Cleared Cheques</p>
                    <p className="text-2xl font-bold text-green-900">0</p>
                    <p className="text-xs text-green-600">Rs. 0.00</p>
                  </div>
                  <svg className="w-10 h-10 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-700 font-medium">Bounced Cheques</p>
                    <p className="text-2xl font-bold text-red-900">0</p>
                    <p className="text-xs text-red-600">Rs. 0.00</p>
                  </div>
                  <svg className="w-10 h-10 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Total Cheques</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-xs text-gray-600">Rs. 0.00</p>
                  </div>
                  <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="p-6 mb-6 bg-white rounded-lg shadow hidden">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-filter mr-2" />Filter VAT Report (PDF)
              </h3>
              <form className="grid grid-cols-1 gap-4 md:grid-cols-6" onSubmit={(event) => event.preventDefault()}>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">From Date</label>
                  <input type="date" name="report_date_from" defaultValue="2026-04-01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">To Date</label>
                  <input type="date" name="report_date_to" defaultValue="2026-04-30" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="md:col-span-4 flex items-end justify-end">
                  <button type="submit" className="px-4 py-2 text-white rounded-lg bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Generate Report (PDF)
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Supplier Cheques (VAT / Non VAT)</h2>

              <div className="p-6 mb-6 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <i className="fas fa-filter mr-2" />Filter Cheques
                </h3>
                <form className="grid grid-cols-1 gap-4 md:grid-cols-4" onSubmit={e => { e.preventDefault(); setPage(1); fetchCheques(filters, 1, entries); }}>
                  <input type="hidden" name="search" defaultValue="" />
                  <input type="hidden" name="invoice_code" defaultValue="" />
                  <input type="hidden" name="payment_status" defaultValue="" />
                  <input type="hidden" name="fuel_type" defaultValue="" />
                  <input type="hidden" name="date_from" defaultValue="" />
                  <input type="hidden" name="date_to" defaultValue="" />
                  <input type="hidden" name="min_amount" defaultValue="" />
                  <input type="hidden" name="max_amount" defaultValue="" />

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Cheque Number</label>
                    <input type="text" name="cheque_number" value={filters.cheque_number} onChange={e => setFilters(f => ({ ...f, cheque_number: e.target.value }))} placeholder="Cheque number..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Supplier Name</label>
                    <input type="text" name="cheque_customer" value={filters.cheque_customer} onChange={e => setFilters(f => ({ ...f, cheque_customer: e.target.value }))} placeholder="Supplier name..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Cheque Status</label>
                    <select name="cheque_status" value={filters.cheque_status} onChange={e => setFilters(f => ({ ...f, cheque_status: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="cleared">Cleared</option>
                      <option value="bounced">Bounced</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Bank Name</label>
                    <input type="text" name="bank_name" value={filters.bank_name} onChange={e => setFilters(f => ({ ...f, bank_name: e.target.value }))} placeholder="Bank name..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Cheque Date From</label>
                    <input type="date" name="cheque_date_from" value={filters.cheque_date_from} onChange={e => setFilters(f => ({ ...f, cheque_date_from: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Cheque Date To</label>
                    <input type="date" name="cheque_date_to" value={filters.cheque_date_to} onChange={e => setFilters(f => ({ ...f, cheque_date_to: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Clearance Date From</label>
                    <input type="date" name="clearance_date_from" value={filters.clearance_date_from} onChange={e => setFilters(f => ({ ...f, clearance_date_from: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Clearance Date To</label>
                    <input type="date" name="clearance_date_to" value={filters.clearance_date_to} onChange={e => setFilters(f => ({ ...f, clearance_date_to: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Min Cheque Amount</label>
                    <input type="number" name="cheque_min_amount" value={filters.cheque_min_amount} onChange={e => setFilters(f => ({ ...f, cheque_min_amount: e.target.value }))} placeholder="0.00" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Max Cheque Amount</label>
                    <input type="number" name="cheque_max_amount" value={filters.cheque_max_amount} onChange={e => setFilters(f => ({ ...f, cheque_max_amount: e.target.value }))} placeholder="0.00" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Replacement Status</label>
                    <select name="has_replacement" value={filters.has_replacement} onChange={e => setFilters(f => ({ ...f, has_replacement: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                      <option value="">All Cheques</option>
                      <option value="yes">Has Replacement</option>
                      <option value="no">No Replacement</option>
                      <option value="is_replacement">Is Replacement</option>
                    </select>
                  </div>
                  <div className="flex items-end space-x-2 md:col-span-4">
                    <button type="submit" className="px-6 py-2 text-white rounded-lg bg-[#3c8c2c] hover:opacity-90">
                      <i className="mr-2 fas fa-filter" />Apply Cheque Filters
                    </button>
                    <a href="/suppliers/invoices" className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200" onClick={e => { e.preventDefault(); setFilters({
                      cheque_number: '',
                      cheque_customer: '',
                      cheque_status: '',
                      bank_name: '',
                      cheque_date_from: '',
                      cheque_date_to: '',
                      clearance_date_from: '',
                      clearance_date_to: '',
                      cheque_min_amount: '',
                      cheque_max_amount: '',
                      has_replacement: '',
                    }); setPage(1); fetchCheques({}, 1, entries); }}>
                      <i className="mr-2 fas fa-redo" />Reset All
                    </a>
                  </div>
                </form>
              </div>

              <div className="overflow-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="text-xs text-white uppercase bg-[#3c8c2c]">
                    <tr>
                      <th className="px-4 py-2">#</th>
                      <th className="px-4 py-2">Cheque Number</th>
                      <th className="px-4 py-2">Supplier</th>
                      <th className="px-4 py-2">Bank</th>
                      <th className="px-4 py-2">Amount</th>
                      <th className="px-4 py-2">Cheque Date</th>
                      <th className="px-4 py-2">Clearance Date</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Actions</th>
                      <th className="px-4 py-2">Replacements</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cheques.length === 0 && !loading ? (
                      <tr>
                        <td colSpan="10" className="px-6 py-12 text-center text-gray-500">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="mt-2">No cheques found</p>
                        </td>
                      </tr>
                    ) : (
                      cheques.map((cheque, idx) => (
                        <tr key={cheque.id}>
                          <td className="px-4 py-2">{(page - 1) * entries + idx + 1}</td>
                          <td className="px-4 py-2">{cheque.cheque_number}</td>
                          <td className="px-4 py-2">{cheque.supplier_id}</td>
                          <td className="px-4 py-2">{cheque.bank_name}</td>
                          <td className="px-4 py-2">Rs. {Number(cheque.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          <td className="px-4 py-2">{cheque.cheque_date}</td>
                          <td className="px-4 py-2">{cheque.clearance_date}</td>
                          <td className="px-4 py-2">{cheque.cheque_status}</td>
                          <td className="px-4 py-2">-</td>
                          <td className="px-4 py-2">-</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className="p-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow min-h-[30vh]" />

        {bounceState.open && (
          <div id="bounceChequeModal" className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" onClick={(event) => event.target === event.currentTarget && closeBounceChequeModal()}>
            <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true" onClick={closeBounceChequeModal} />

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block overflow-y-auto text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form id="bounceChequeForm" onSubmit={handleBounceSubmit}>
                  <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Bounce Cheque</h3>
                        <div className="mt-4">
                          <p className="text-sm text-gray-500 mb-4">Cheque #<span className="font-semibold">{bounceState.chequeNumber}</span> will be marked as bounced.</p>

                          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-yellow-700">Optionally assign a replacement cheque to track the new payment arrangement.</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <h4 className="text-sm font-semibold text-green-900 mb-3">Create Replacement Cheque</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input type="hidden" name="replacement_supplier_id" id="replacement_supplier_id" value={bounceState.supplierId} readOnly />
                              <input type="hidden" name="replacement_amount" id="replacement_amount" value={bounceState.amount} readOnly />
                              <input type="hidden" name="replacement_fuel_type_id" id="replacement_fuel_type_id" value={bounceState.fuelTypeId} readOnly />

                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                                <input type="text" id="replacement_supplier_name" readOnly value={bounceState.supplierName} className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed" />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                <input type="text" id="replacement_amount_display" readOnly value={`Rs. ${Number(bounceState.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed" />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                                <input type="text" id="replacement_fuel_type_name" readOnly value={bounceState.fuelTypeName} className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed" />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Cheque Number *</label>
                                <input type="text" name="replacement_cheque_number" id="replacement_cheque_number" required value={bounceState.replacementChequeNumber} onChange={(event) => setBounceState((current) => ({ ...current, replacementChequeNumber: event.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="Enter new cheque number" />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account *</label>
                                <select name="replacement_account_id" id="replacement_account_id" required value={bounceState.replacementAccountId} onChange={(event) => setBounceState((current) => ({ ...current, replacementAccountId: event.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500">
                                  <option value="">Select Bank Account</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cheque Date *</label>
                                <input type="date" name="replacement_cheque_date" id="replacement_cheque_date" required value={bounceState.replacementChequeDate} onChange={(event) => setBounceState((current) => ({ ...current, replacementChequeDate: event.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Clearance Date</label>
                                <input type="date" name="replacement_clearance_date" id="replacement_clearance_date" value={bounceState.replacementClearanceDate} onChange={(event) => setBounceState((current) => ({ ...current, replacementClearanceDate: event.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea name="replacement_notes" id="replacement_notes" rows="2" value={bounceState.replacementNotes} onChange={(event) => setBounceState((current) => ({ ...current, replacementNotes: event.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="Enter any additional notes about the replacement cheque" />
                              </div>
                            </div>
                          </div>

                          <style>{`@media (min-width: 640px) {.custom-select-trigger { max-width: 32rem; width: 100%; }} .custom-select-dropdown {}`}</style>

                          <div className="custom-select z-[9999] mt-5">
                            <label htmlFor="payment_option">Or select payment option</label>
                            <select name="payment_option" id="payment_option" className="hidden" value={bounceState.paymentOption} onChange={(event) => setBounceState((current) => ({ ...current, paymentOption: event.target.value }))}>
                              <option value="">-- No Payment Option --</option>
                              <option data-header>System Cash</option>
                              <option value="petty-cash">Petty Cash - Rs 0</option>
                              <option value="cashbook">Cash Book - Rs 15,250</option>
                              <option data-header>Bank Accounts</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="submit" className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">Bounce Cheque</button>
                    <button type="button" onClick={closeBounceChequeModal} className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="flex-grow" />
      </div>
    </Layout>
  );
};

export default SupplierCheque;