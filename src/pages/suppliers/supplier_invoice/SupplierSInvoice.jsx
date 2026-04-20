import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../../components/Layout';
import './SupplierSInvoice.css';

const statusToneMap = {
  paid: 'bg-green-100 text-green-800',
  unpaid: 'bg-red-100 text-red-800',
  partial: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-orange-100 text-orange-800',
  pending: 'bg-gray-100 text-gray-800',
};
const transactionTypeToneMap = {
  credit: 'bg-red-100 text-red-800',
  debit: 'bg-blue-100 text-blue-800',
};

const initialPaymentFilter = {
  reportDateFrom: '2026-04-01',
  reportDateTo: '2026-04-30',
  search: '',
  transactionType: '',
  paymentStatus: '',
};

const initialInvoiceFilter = {
  search: '',
  invoiceCode: '',
  paymentStatus: '',
  dateFrom: '2026-04-01',
  dateTo: '2026-04-30',
  minAmount: '',
  maxAmount: '',
};

const formatNumber = (value) => Number(value || 0).toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const SupplierSInvoice = ({ onBackToMain }) => {
  const [loading, setLoading] = useState(false);
  const [reportFilter, setReportFilter] = useState(initialPaymentFilter);
  const [invoiceFilter, setInvoiceFilter] = useState(initialInvoiceFilter);
  const [paymentsModal, setPaymentsModal] = useState({ open: false, invoice: null, loading: false });
  const [reversalDialog, setReversalDialog] = useState({ open: false, type: '', invoiceId: null, invoiceCode: '', reason: '' });
  const [invoices, setInvoices] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [entries, setEntries] = useState(30);

  // Fetch invoices from backend
  const fetchInvoices = async (filters = invoiceFilter, pageArg = page, entriesArg = entries) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const limit = Number(entriesArg) || 30;
      const offset = ((Number(pageArg) || 1) - 1) * limit;
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.invoiceCode) params.set('reference_number', filters.invoiceCode);
      if (filters.paymentStatus) params.set('payment_status', filters.paymentStatus);
      if (filters.dateFrom) params.set('date_from', filters.dateFrom);
      if (filters.dateTo) params.set('date_to', filters.dateTo);
      if (filters.minAmount) params.set('min_amount', filters.minAmount);
      if (filters.maxAmount) params.set('max_amount', filters.maxAmount);
      params.set('limit', limit);
      params.set('offset', offset);
      const resp = await fetch(`/api/supplier-invoices?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setInvoices([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }
      setInvoices(Array.isArray(data.invoices) ? data.invoices : []);
      setTotalCount(Number(data.totalCount) || 0);
    } catch {
      setInvoices([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(invoiceFilter, page, entries);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, entries]);

  // Pagination calculations
  const safeEntries = Math.max(1, Number(entries) || 30);
  const totalPages = Math.max(1, Math.ceil(totalCount / safeEntries));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = totalCount === 0 ? 0 : (safePage - 1) * safeEntries + 1;
  const endIndex = totalCount === 0 ? 0 : Math.min((safePage - 1) * safeEntries + invoices.length, totalCount);
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxButtons = 5;
    const last = totalPages;
    const current = safePage;
    let start = Math.max(1, current - Math.floor(maxButtons / 2));
    let end = Math.min(last, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    for (let p = start; p <= end; p += 1) pages.push(p);
    return pages;
  }, [safePage, totalPages]);

  const openPaymentsModal = (invoice) => {
    setPaymentsModal({ open: true, invoice, loading: false });
  };

  const closePaymentsModal = () => {
    setPaymentsModal({ open: false, invoice: null, loading: false });
  };

  const openReversalDialog = (type, invoiceId, invoiceCode) => {
    setReversalDialog({ open: true, type, invoiceId, invoiceCode, reason: '' });
  };

  const closeReversalDialog = () => {
    setReversalDialog({ open: false, type: '', invoiceId: null, invoiceCode: '', reason: '' });
  };

  const handleReversalSubmit = (event) => {
    event.preventDefault();
    if (!reversalDialog.reason.trim()) {
      window.alert('Please enter a reason for the reversal.');
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      closeReversalDialog();
    }, 400);
  };

  const paymentSummary = useMemo(() => {
    const invoice = paymentsModal.invoice;
    if (!invoice) {
      return { total: 0, paid: 0, balance: 0, records: [] };
    }
    let records = [];
    try {
      records = invoice.payment_records ? JSON.parse(invoice.payment_records) : [];
    } catch { records = []; }
    const paid = Number(invoice.paid_amount) || 0;
    return {
      total: Number(invoice.amount) || 0,
      paid,
      balance: Math.max(0, (Number(invoice.amount) || 0) - paid),
      records,
    };
  }, [paymentsModal.invoice]);

  return (
    <Layout onBackToMain={onBackToMain}>
      <div className="supplier-invoice-page flex flex-col flex-grow">
        {loading && (
          <div id="loading-overlay" className="loading-overlay">
            <div className="text-center">
              <div className="spinner" />
            </div>
          </div>
        )}

        <div className="flex flex-col flex-grow">
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
                    <a href="/suppliers/invoices" className="text-sm font-medium text-gray-700 hover:text-blue-600 ms-1 md:ms-2">Supplier Invoices</a>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div className="flex-1 px-4 pb-6 sm:px-6 lg:px-12">
            <div className="flex items-center justify-between mb-6 invoice-toolbar">
              <h1 className="text-2xl font-bold text-gray-900">Supplier Invoices</h1>
              <div className="flex gap-3 invoice-toolbar-actions">
                <a href="/suppliers/transaction_log" className="px-4 py-2 text-white rounded-lg bg-indigo-600 hover:opacity-90 flex items-center gap-2">
                  <i className="fas fa-list-alt" />
                  Transaction Log
                </a>
                <a href="/suppliers/cheques" className="px-4 py-2 text-white rounded-lg bg-yellow-600 hover:opacity-90 flex items-center gap-2">
                  <i className="fas fa-money-check-alt" />
                  Cheques List
                </a>
                <a href="/suppliers/invoice_report" target="_blank" rel="noreferrer" className="px-4 py-2 text-white rounded-lg bg-purple-600 hover:opacity-90 flex items-center gap-2">
                  <i className="fas fa-file-pdf" />
                  Report (PDF)
                </a>
                <a href="/suppliers/add_invoice" className="px-4 py-2 text-white rounded-lg bg-[#3c8c2c] hover:opacity-90 flex items-center gap-2">
                  <i className="fas fa-plus" />
                  Add New Invoice
                </a>
              </div>
            </div>

            <div className="p-6 mb-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-file-pdf mr-2 text-purple-600" />Generate Report (PDF)
              </h3>
              <form className="grid grid-cols-1 gap-4 md:grid-cols-6" onSubmit={(event) => event.preventDefault()}>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">From Date</label>
                  <input type="date" name="report_date_from" value={reportFilter.reportDateFrom} onChange={(event) => setReportFilter((current) => ({ ...current, reportDateFrom: event.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">To Date</label>
                  <input type="date" name="report_date_to" value={reportFilter.reportDateTo} onChange={(event) => setReportFilter((current) => ({ ...current, reportDateTo: event.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Supplier</label>
                  <input type="text" name="search" value={reportFilter.search} onChange={(event) => setReportFilter((current) => ({ ...current, search: event.target.value }))} placeholder="Supplier name..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Type</label>
                  <select name="transaction_type" value={reportFilter.transactionType} onChange={(event) => setReportFilter((current) => ({ ...current, transactionType: event.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option value="">All Types</option>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Status</label>
                  <select name="payment_status" value={reportFilter.paymentStatus} onChange={(event) => setReportFilter((current) => ({ ...current, paymentStatus: event.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option value="">All Statuses</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full px-4 py-2 text-white rounded-lg bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2">
                    <i className="fas fa-file-pdf" />
                    Generate PDF
                  </button>
                </div>
              </form>
            </div>

            <div className="p-6 mb-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-filter mr-2" />Filter Invoices
              </h3>
              <form className="grid grid-cols-1 gap-4 md:grid-cols-4" onSubmit={e => { e.preventDefault(); setPage(1); setPageInput('1'); fetchInvoices(invoiceFilter, 1, entries); }}>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Search Supplier</label>
                  <input type="text" name="search" value={invoiceFilter.search} onChange={(event) => setInvoiceFilter((current) => ({ ...current, search: event.target.value }))} placeholder="Supplier name..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Invoice Code</label>
                  <input type="text" name="invoice_code" value={invoiceFilter.invoiceCode} onChange={(event) => setInvoiceFilter((current) => ({ ...current, invoiceCode: event.target.value }))} placeholder="Invoice code..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Payment Status</label>
                  <select name="payment_status" value={invoiceFilter.paymentStatus} onChange={(event) => setInvoiceFilter((current) => ({ ...current, paymentStatus: event.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option value="">All Statuses</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">From Date</label>
                  <input type="date" name="date_from" value={invoiceFilter.dateFrom} onChange={(event) => setInvoiceFilter((current) => ({ ...current, dateFrom: event.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">To Date</label>
                  <input type="date" name="date_to" value={invoiceFilter.dateTo} onChange={(event) => setInvoiceFilter((current) => ({ ...current, dateTo: event.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Min Amount</label>
                  <input type="number" name="min_amount" value={invoiceFilter.minAmount} onChange={(event) => setInvoiceFilter((current) => ({ ...current, minAmount: event.target.value }))} placeholder="0.00" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Max Amount</label>
                  <input type="number" name="max_amount" value={invoiceFilter.maxAmount} onChange={(event) => setInvoiceFilter((current) => ({ ...current, maxAmount: event.target.value }))} placeholder="0.00" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="flex items-end space-x-2 md:col-span-4">
                  <button type="submit" className="px-6 py-2 text-white rounded-lg bg-[#3c8c2c] hover:opacity-90">
                    <i className="mr-2 fas fa-filter" />Apply Filters
                  </button>
                  <a href="/suppliers/invoices" className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200" onClick={e => { e.preventDefault(); setInvoiceFilter(initialInvoiceFilter); setPage(1); setPageInput('1'); fetchInvoices(initialInvoiceFilter, 1, entries); }}>
                    <i className="mr-2 fas fa-redo" />Reset
                  </a>
                </div>
              </form>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-4">Supplier Invoices (Credit Bills, Debit Bills, VAT Invoices)</h2>

            <div className="overflow-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="text-xs text-white uppercase bg-[#3c8c2c]">
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Invoice Code</th>
                    <th className="px-4 py-2">Supplier</th>
                    <th className="px-4 py-2">Total</th>
                    <th className="px-4 py-2">Transaction Type</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500 text-lg">No data found</td>
                    </tr>
                  ) : (
                    invoices.map((invoice, index) => (
                      <tr key={invoice.id}>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{startIndex + index}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{invoice.invoice_code}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{invoice.supplier_id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">Rs. {formatNumber(invoice.amount)}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${transactionTypeToneMap[(invoice.transaction_type || '').toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>{invoice.transaction_type}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusToneMap[(invoice.payment_status || '').toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>{invoice.payment_status}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap justify-end flex gap-3">
                          <span className="text-green-600 text-xs">
                            <i className="fas fa-check-circle" /> {Number(invoice.paid_amount) >= Number(invoice.amount) ? 'Paid' : 'Unpaid'}
                          </span>
                          <button type="button" onClick={() => openPaymentsModal(invoice)} className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-md text-xs" title="View Payment Records">
                            <i className="fas fa-receipt mr-1" />Payments
                          </button>
                          <a href={`/suppliers/invoices/${invoice.id}/invoice`} className="bg-gray-600 text-white px-2 py-1 rounded-md hover:bg-gray-700" target="_blank" rel="noreferrer" title="View Invoice">
                            <i className="fas fa-file-invoice mr-1" />Invoice
                          </a>
                          <a href={`/suppliers/invoices/${invoice.id}/show`} className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600" title="View Invoice Details">
                            <i className="fas fa-eye mr-1" />Show
                          </a>
                          <button type="button" onClick={() => openReversalDialog('payment', invoice.id, invoice.invoice_code)} className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded-md text-xs" title="Reverse Payment">
                            <i className="fas fa-undo mr-1" />Reverse Payment
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="p-4" />
              {/* Pagination - Below the table */}
              <div className="flex justify-center p-1 mt-1 mb-6 bg-white">
                <div className="pagination" style={{ width: '100%', margin: '0px 50px' }}>
                  <nav role="navigation" aria-label="Pagination Navigation" className="flex items-center justify-between">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between w-full">
                      <div>
                        <p className="text-sm leading-5 text-gray-700">
                          Showing <span className="font-medium">{startIndex}</span> to <span className="font-medium">{endIndex}</span> of <span className="font-medium">{totalCount}</span> results
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center justify-end gap-3 mb-2">
                          <label className="text-sm text-gray-700">Entries</label>
                          <select
                            className="p-2 text-sm border border-gray-300 rounded bg-white"
                            value={entries}
                            onChange={e => {
                              setEntries(Number(e.target.value));
                              setPage(1);
                              setPageInput('1');
                            }}
                          >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                          <label className="text-sm text-gray-700 ml-2">Page</label>
                          <input
                            type="number"
                            min={1}
                            className="w-20 p-2 text-sm border border-gray-300 rounded bg-white"
                            value={pageInput}
                            onChange={e => setPageInput(e.target.value)}
                          />
                          <button
                            type="button"
                            className="px-3 py-2 text-sm text-white bg-[#3c8c2c] rounded hover:bg-[#2d6e20]"
                            onClick={() => {
                              const next = Number(pageInput);
                              if (!Number.isFinite(next)) return;
                              const clamped = Math.min(Math.max(1, Math.trunc(next)), totalPages);
                              setPage(clamped);
                              setPageInput(String(clamped));
                            }}
                          >
                            Go
                          </button>
                        </div>
                        <span className="relative z-0 inline-flex rounded-md shadow-sm rtl:flex-row-reverse">
                          <button
                            type="button"
                            aria-label="&laquo; Previous"
                            disabled={safePage <= 1}
                            onClick={() => {
                              setPage(p => Math.max(1, p - 1));
                              setPageInput(p => String(Math.max(1, Number(p) - 1)));
                            }}
                            className={
                              `relative inline-flex items-center px-2 py-2 text-sm font-medium leading-5 border border-gray-300 rounded-l-md ` +
                              (safePage <= 1 ? 'text-gray-400 bg-white cursor-default' : 'text-gray-700 bg-white hover:bg-gray-50')
                            }
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          {pageNumbers.map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => {
                                setPage(p);
                                setPageInput(String(p));
                              }}
                              className={
                                `relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium leading-5 border ` +
                                (p === safePage
                                  ? 'text-white bg-blue-600 border-blue-600 cursor-default'
                                  : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50')
                              }
                              aria-label={`Go to page ${p}`}
                              disabled={p === safePage}
                            >
                              {p}
                            </button>
                          ))}
                          <button
                            type="button"
                            aria-label="Next &raquo;"
                            disabled={safePage >= totalPages}
                            onClick={() => {
                              setPage(p => Math.min(totalPages, p + 1));
                              setPageInput(p => String(Math.min(totalPages, Number(p) + 1)));
                            }}
                            className={
                              `relative inline-flex items-center px-2 py-2 -ml-px text-sm font-medium leading-5 border border-gray-300 rounded-r-md ` +
                              (safePage >= totalPages ? 'text-gray-400 bg-white cursor-default' : 'text-gray-700 bg-white hover:bg-gray-50')
                            }
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </span>
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        {paymentsModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(event) => event.target === event.currentTarget && closePaymentsModal()}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Payment Records</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Invoice: {paymentsModal.invoice?.invoiceCode}</p>
                </div>
                <button type="button" onClick={closePaymentsModal} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
                  <i className="fas fa-times" />
                </button>
              </div>

              <div className={`grid grid-cols-3 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm ${paymentsModal.loading ? 'hidden' : ''}`}>
                <div>
                  <span className="text-gray-500">Invoice Total</span>
                  <p className="font-semibold text-gray-800">Rs. {formatNumber(paymentSummary.total)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Amount Paid</span>
                  <p className="font-semibold text-green-700">Rs. {formatNumber(paymentSummary.paid)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Balance Due</span>
                  <p className="font-semibold text-red-600">Rs. {formatNumber(paymentSummary.balance)}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                {paymentsModal.loading && (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <i className="fas fa-spinner fa-spin fa-2x mb-3" />
                    <span className="text-sm">Loading payments…</span>
                  </div>
                )}

                {!paymentsModal.loading && paymentSummary.records.length > 0 && (
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                      <tr>
                        <th className="px-4 py-2 text-left">#</th>
                        <th className="px-4 py-2 text-left">Payment Source</th>
                        <th className="px-4 py-2 text-left">Mode</th>
                        <th className="px-4 py-2 text-right">Amount (Rs.)</th>
                        <th className="px-4 py-2 text-left">Recorded At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {paymentSummary.records.map((record, index) => (
                        <tr key={`${record.source}-${index}`} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-gray-500">{index + 1}</td>
                          <td className="px-4 py-2 font-medium text-gray-800">{record.source}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${record.mode.toLowerCase() === 'cheque' ? 'bg-purple-100 text-purple-800' : record.mode.toLowerCase() === 'transfer' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                              {record.mode}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-right font-semibold text-gray-800">{formatNumber(record.amount)}</td>
                          <td className="px-4 py-2 text-gray-500 text-xs">{new Date(record.recordedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 font-semibold text-sm">
                        <td colSpan={3} className="px-4 py-2 text-right text-gray-700">Total Paid</td>
                        <td className="px-4 py-2 text-right text-green-700">Rs. {formatNumber(paymentSummary.paid)}</td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                )}

                {!paymentsModal.loading && paymentSummary.records.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <i className="fas fa-inbox fa-2x mb-2" />
                    <p className="text-sm mt-1">No payment records found.</p>
                  </div>
                )}
              </div>

              <div className="px-6 py-3 border-t border-gray-200 flex justify-end">
                <button type="button" onClick={closePaymentsModal} className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg">Close</button>
              </div>
            </div>
          </div>
        )}

        {reversalDialog.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(event) => event.target === event.currentTarget && closeReversalDialog()}>
            <form onSubmit={handleReversalSubmit} className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">
                  {reversalDialog.type === 'payment' ? 'Reverse Payment' : 'Reverse Invoice'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Invoice: {reversalDialog.invoiceCode}</p>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-gray-600 mb-4">
                  {reversalDialog.type === 'payment'
                    ? `Reverse ALL recorded payments on credit invoice ${reversalDialog.invoiceCode}? Cash will be restored to the original sources and the invoice will be reset to pending.`
                    : `Permanently reverse this invoice action for ${reversalDialog.invoiceCode}?`}
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter reason for reversal..."
                  value={reversalDialog.reason}
                  onChange={(event) => setReversalDialog((current) => ({ ...current, reason: event.target.value }))}
                  maxLength={255}
                />
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
                <button type="button" onClick={closeReversalDialog} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-white rounded-lg bg-orange-500 hover:bg-orange-600">Confirm</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SupplierSInvoice;