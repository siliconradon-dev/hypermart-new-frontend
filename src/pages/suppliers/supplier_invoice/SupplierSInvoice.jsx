import React, { useMemo, useState } from 'react';
import Layout from '../../../components/Layout';
import './SupplierSInvoice.css';

const invoiceRows = [
  {
    id: 2,
    invoiceCode: '758979jbhxgdx',
    supplier: 'sample supplier',
    total: 1200,
    transactionType: 'Credit',
    transactionTypeTone: 'bg-red-100 text-red-800',
    status: 'Paid',
    statusTone: 'bg-green-100 text-green-800',
    actionLabel: 'Paid',
    paymentRecords: [
      { source: 'Cash', mode: 'Cash', amount: 1200, recordedAt: '2026-04-10T10:15:00' },
    ],
  },
];

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

  const filteredRows = useMemo(() => invoiceRows, []);

  const openPaymentsModal = (invoice) => {
    setPaymentsModal({ open: true, invoice, loading: true });

    window.setTimeout(() => {
      setPaymentsModal((current) => ({
        ...current,
        loading: false,
      }));
    }, 300);
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

    const paid = invoice.paymentRecords.reduce((sum, record) => sum + record.amount, 0);
    return {
      total: invoice.total,
      paid,
      balance: Math.max(0, invoice.total - paid),
      records: invoice.paymentRecords,
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
              <form className="grid grid-cols-1 gap-4 md:grid-cols-4" onSubmit={(event) => event.preventDefault()}>
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
                  <a href="/suppliers/invoices" className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
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
                  {filteredRows.map((invoice, index) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{index + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{invoice.invoiceCode}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{invoice.supplier}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">Rs. {formatNumber(invoice.total)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${invoice.transactionTypeTone}`}>{invoice.transactionType}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${invoice.statusTone}`}>{invoice.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap justify-end flex gap-3">
                        <span className="text-green-600 text-xs">
                          <i className="fas fa-check-circle" /> {invoice.actionLabel}
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
                        <button type="button" onClick={() => openReversalDialog('payment', invoice.id, invoice.invoiceCode)} className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded-md text-xs" title="Reverse Payment">
                          <i className="fas fa-undo mr-1" />Reverse Payment
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4" />
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