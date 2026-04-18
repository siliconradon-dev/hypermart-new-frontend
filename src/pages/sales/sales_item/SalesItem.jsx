import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout';
import './SalesItem.css';

const SalesItem = () => {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem('token'), []);

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');

  const ensureToken = () => {
    const t = localStorage.getItem('token');
    if (!t) {
      localStorage.removeItem('user');
      window.location.assign('/');
      return null;
    }
    return t;
  };

  useEffect(() => {
    const loadCats = async () => {
      try {
        const t = ensureToken();
        if (!t) return;
        const resp = await fetch('/api/item-categories', { headers: { Authorization: `Bearer ${t}` } });
        const data = await resp.json().catch(() => ({}));
        if (resp.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.assign('/');
          return;
        }
        setCategories(Array.isArray(data?.categories) ? data.categories : []);
      } catch {
        setCategories([]);
      }
    };
    loadCats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMore = (saleId) => {
    navigate(`/sales/payment_details/${saleId}`);
  };

  // Load sales data
  useEffect(() => {
    const loadSales = async () => {
      setLoading(true);
      setError('');
      try {
        const t = ensureToken();
        if (!t) return;
        const params = new URLSearchParams();
        if (categoryId) params.set('category_id', categoryId);
        // Add more filters as needed
        const resp = await fetch(`/api/sales?${params.toString()}`, { headers: { Authorization: `Bearer ${t}` } });
        const data = await resp.json().catch(() => ({}));
        if (resp.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.assign('/');
          return;
        }
        setSales(Array.isArray(data?.sales) ? data.sales : []);
      } catch {
        setError('Failed to load sales data.');
        setSales([]);
      } finally {
        setLoading(false);
      }
    };
    loadSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);
  return (
    <Layout>
      {/* Loading Overlay (UI only) */}
      <div className="loading-overlay" style={{ display: 'none' }}>
        <div className="text-center">
          <div className="spinner"></div>
        </div>
      </div>
      <div className="flex flex-col flex-grow">
        {/* Breadcrumbs */}
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
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Sales List</p>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        {/* Filter/Search Form (UI only) */}
        <div className="px-12 max-sm:px-6">
          <form className="grid gap-6 py-6 md:grid-cols-6" onSubmit={e => e.preventDefault()}>
            <div className="custom-select">
              <label htmlFor="category_id" className="block mb-2 text-sm font-medium text-black">Category</label>
              <select
                name="category_id"
                id="category_id"
                className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>{c.categories}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sales_code" className="block mb-2 text-sm font-medium text-black">Sales Code</label>
              <div className="w-full">
                <input id="sales_code" name="sales_code" type="text" className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter sales code" />
              </div>
            </div>
            <div>
              <label htmlFor="customer_name" className="block mb-2 text-sm font-medium text-black">Customer</label>
              <div className="w-full">
                <input id="customer_name" name="customer_name" type="text" className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter customer name" />
              </div>
            </div>
            <div>
              <label htmlFor="contact_number" className="block mb-2 text-sm font-medium text-black">Customer Contact</label>
              <div className="w-full">
                <input id="contact_number" name="contact_number" type="text" className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter contact number" />
              </div>
            </div>
            <div>
              <label htmlFor="batch_no" className="block mb-2 text-sm font-medium text-black">Batch No</label>
              <div className="w-full">
                <input id="batch_no" name="batch_no" type="text" className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter batch no" />
              </div>
            </div>
            <div className="hidden">
              <label htmlFor="item_code" className="block mb-2 text-sm font-medium text-black">Item code</label>
              <div className="w-full">
                <input id="item_code" type="number" className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter item code" />
              </div>
            </div>
            <div>
              <label htmlFor="from-date" className="block mb-2 text-sm font-medium text-black">From Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </div>
                <input id="from-date" name="from_date" type="date" className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" placeholder="Select a date" />
              </div>
            </div>
            <div>
              <label htmlFor="to-date" className="block mb-2 text-sm font-medium text-black">To Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </div>
                <input id="to-date" name="to_date" type="date" className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" placeholder="Select a date" />
              </div>
            </div>
          </form>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <button type="submit" className="py-3 px-6 bg-[#3c8c2c] text-white rounded-lg">Filter</button>
            <button type="button" className="py-3 px-6 bg-gray-500 text-white rounded-lg text-center">Clear Filters</button>
          </div>
        </div>
        {/* Table Section (UI only, static) */}
        <div className="flex flex-col px-12 py-5 overflow-y-auto bg-white max-sm:px-6 max-lg:min-h-full">
          <div className="relative h-[500px] overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 rtl:text-right">
              <thead className="text-xs text-white uppercase bg-[#3c8c2c] sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">ID</th>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Customer Name</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Total (RS)</th>
                  <th className="px-6 py-3">Received Amount (RS)</th>
                  <th className="px-6 py-3">Paid Amount (RS)</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Due Amount (RS)</th>
                  <th className="px-6 py-3">Discount (RS)</th>
                  <th className="px-6 py-3">Created At</th>
                  <th className="px-6 py-3 rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={12} className="text-center py-6">Loading…</td></tr>
                ) : sales.length === 0 ? (
                  <tr><td colSpan={12} className="text-center py-6">No sales item found</td></tr>
                ) : sales.map((row, idx) => (
                  <tr key={row.sales_item_id || idx} className="text-black bg-white border-2">
                    <td className="px-6 py-4 font-medium whitespace-nowrap">{row.sale_id}</td>
                    <td className="px-6 py-4">{row.sales_code}</td>
                    <td className="px-6 py-4">{row.customer_name}</td>
                    <td className="px-6 py-4">{row.contact_number}</td>
                    <td className="px-6 py-4">{row.price}</td>
                    <td className="px-6 py-4">{row.price}</td>
                    <td className="px-6 py-4">{row.price}</td>
                    <td className="px-6 py-4">{row.status === '1' ? <span className="text-green-600 font-bold">Paid</span> : <span className="text-red-600 font-bold">Unpaid</span>}</td>
                    <td className="px-6 py-4">0</td>
                    <td className="px-6 py-4">{row.discount}</td>
                    <td className="px-6 py-4">{row.created_at}</td>
                    <td className="flex items-center px-6 py-4 space-x-2">
                      <button className="p-3 border-2 rounded-lg bg-[#029ED9] text-white" onClick={() => handleMore(row.sale_id)}>MORE</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SalesItem;
