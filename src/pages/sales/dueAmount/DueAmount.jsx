import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../../components/Layout';
import './DueAmount.css';



const DueAmount = () => {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    customer: '',
    customerId: '',
    phone: '',
    itemCode: '',
    createdBy: '',
  });


  const token = useMemo(() => localStorage.getItem('token'), []);
  const ensureToken = () => {
    const t = localStorage.getItem('token');
    if (!t) {
      localStorage.removeItem('user');
      window.location.assign('/');
      return null;
    }
    return t;
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDueAmounts = async () => {
      setLoading(true);
      setError('');
      try {
        const t = ensureToken();
        if (!t) return;
        const resp = await fetch('/api/sales/due-amount', { headers: { Authorization: `Bearer ${t}` } });
        const result = await resp.json().catch(() => ({}));
        if (resp.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.assign('/');
          return;
        }
        setData(Array.isArray(result?.dueAmounts) ? result.dueAmounts : []);
      } catch {
        setError('Failed to load due amounts.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    loadDueAmounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter logic (client-side, only customer for now)
  const filteredData = data.filter(row =>
    (filters.customer === '' || (row.customer || '').toLowerCase().includes(filters.customer.toLowerCase()))
  );

  // Totals
  const totalInvoice = filteredData.length;
  const totalInvoiceAmount = filteredData.reduce((sum, row) => sum + (Number(row.invoiceAmount) || 0), 0);
  const totalReceivedAmount = filteredData.reduce((sum, row) => sum + (Number(row.receivedAmount) || 0), 0);
  const totalSalesDue = filteredData.reduce((sum, row) => sum + (Number(row.due) || 0), 0);

  return (
    <Layout>
      <div className="flex flex-col flex-grow bg-white">
        {/* Breadcrumbs (match SalesItem) */}
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
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Sales</p>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Due Amount</p>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        {/* Submission controls (filters) */}
        <div className="px-12 max-sm:px-6">
          <form className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700">From Date</label>
              <input type="date" className="border rounded px-2 py-1" value={filters.fromDate} onChange={e => setFilters(f => ({ ...f, fromDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">To Date</label>
              <input type="date" className="border rounded px-2 py-1" value={filters.toDate} onChange={e => setFilters(f => ({ ...f, toDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <input type="text" className="border rounded px-2 py-1" value={filters.customer} onChange={e => setFilters(f => ({ ...f, customer: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer ID</label>
              <input type="text" className="border rounded px-2 py-1" value={filters.customerId} onChange={e => setFilters(f => ({ ...f, customerId: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="text" className="border rounded px-2 py-1" value={filters.phone} onChange={e => setFilters(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Item Code</label>
              <input type="text" className="border rounded px-2 py-1" value={filters.itemCode} onChange={e => setFilters(f => ({ ...f, itemCode: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Created By</label>
              <input type="text" className="border rounded px-2 py-1" value={filters.createdBy} onChange={e => setFilters(f => ({ ...f, createdBy: e.target.value }))} />
            </div>
            <button type="button" className="bg-[#3c8c2c] text-white px-4 py-2 rounded">Filter</button>
            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setFilters({ fromDate: '', toDate: '', customer: '', customerId: '', phone: '', itemCode: '', createdBy: '' })}>Reset</button>
          </form>
        </div>
        {/* Table */}
        <div className="flex flex-col px-12 py-5 overflow-y-auto bg-white max-sm:px-6 max-lg:min-h-full">
          <span></span>
          <table className="w-full text-sm text-left text-gray-500 rtl:text-right" id="salesListTable">
            <thead className="text-xs text-white uppercase bg-[#3c8c2c]">
              <tr>
                <th className="px-6 py-4">Invoice</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Invoice Amount</th>
                <th className="px-6 py-4">Received Amount</th>
                <th className="px-6 py-4">Due</th>
                <th className="px-6 py-4">Created By</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="text-center py-6">Loading…</td></tr>
              ) : error ? (
                <tr><td colSpan={9} className="text-center text-red-600 py-6">{error}</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-6">No due invoices found</td></tr>
              ) : filteredData.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4">{row.invoice}</td>
                  <td className="px-6 py-4">{row.customer}</td>
                  <td className="px-6 py-4">{row.phone}</td>
                  <td className="px-6 py-4">{row.item}</td>
                  <td className="px-6 py-4">{Number(row.invoiceAmount).toFixed(2)}</td>
                  <td className="px-6 py-4">{Number(row.receivedAmount).toFixed(2)}</td>
                  <td className="px-6 py-4">{Number(row.due).toFixed(2)}</td>
                  <td className="px-6 py-4">{row.createdBy}</td>
                  <td className="px-6 py-4">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Summary */}
          <div className="mt-4 flex gap-8">
            <div>Total Invoice: <span id="total-invoice">{totalInvoice}</span></div>
            <div>Total Invoice Amount: <span id="total-invoice-amount">{totalInvoiceAmount.toFixed(2)}</span></div>
            <div>Total Received Amount: <span id="total-received-amount">{totalReceivedAmount.toFixed(2)}</span></div>
            <div>Total Sales Due: <span id="total-sales-due">{totalSalesDue.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DueAmount;