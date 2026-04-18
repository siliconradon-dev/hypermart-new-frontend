import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../../components/Layout';
import './PaymentDetails.css';

// Add helper functions
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString();
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const PaymentDetails = () => {
    // Print receipt handler
    const handlePrintReceipt = () => {
      // Print current page
      window.print();
      // After print dialog closes, refresh and go to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    };
  const { saleId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sale, setSale] = useState(null);
  const [payment, setPayment] = useState(null);
  const [items, setItems] = useState([]);

  // Debug: print payment object to console
  useEffect(() => {
    if (payment) {
      console.log('Payment object:', payment);
    }
  }, [payment]);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');
        
        const resp = await fetch(`/api/sales/${saleId}/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (resp.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.assign('/');
          return;
        }
        
        const data = await resp.json();
        setSale(data.sale || null);
        setPayment(data.payment || null);
        setItems(Array.isArray(data.items) ? data.items : []);
      } catch (e) {
        setError(e.message || 'Failed to fetch payment details');
        console.error('Fetch error:', e);
      } finally {
        setLoading(false);
      }
    };

    if (saleId) {
      fetchDetails();
    }
  }, [saleId]);

  // Show loading state
  if (loading) {
    return (
      <Layout>
        <div className="loading-overlay">
          <div className="text-center">
            <div className="spinner"></div>
            <p>Loading payment details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout>
        <div className="error-container">
          <p className="text-red-600">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  // Main render
  return (
    <Layout>
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
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Sales Details</p>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        
        {/* Payment Details Card */}
        <div className="px-12 py-6 max-sm:px-6">
          <div className="p-8 mx-auto bg-white shadow-xl rounded-2xl max-w-7xl">
            <div className="flex justify-between mb-6 max-md:flex-col gap-4">
              <h1 className="text-3xl font-semibold text-gray-800">Payment Details</h1>
              <div className="flex flex-wrap gap-2">
                <button
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
                  onClick={handlePrintReceipt}
                >
                  Print Receipt
                </button>
                <button className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none">View Customer Invoice</button>
              </div>
            </div>
            
            {/* Sale Info */}
            <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-700">Sale Information</h2>
                <p><strong>Sale Code:</strong> {sale?.sales_code || '-'}</p>
                <p><strong>Sale ID:</strong> {sale?.sale_id || '-'}</p>
                <p><strong>Customer:</strong> {sale?.customer_name || '-'}</p>
                <p><strong>Sales Person:</strong> {sale?.sales_person || '-'}</p>
                <p><strong>Payment ID:</strong> {payment?.id || '-'}</p>
                <p><strong>Date:</strong> {formatDate(sale?.created_at)}</p>
              </div>
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-700">Payment Summary</h2>
                <p><strong>Original Amount:</strong> {formatAmount(payment?.original_amount ?? payment?.grand_total ?? payment?.total ?? 0)}</p>
                <p><strong>Total Paid:</strong> {formatAmount(payment?.paid_amount ?? payment?.total_paid ?? payment?.received_amount ?? 0)}</p>
                <p><strong>Remaining Due:</strong> {formatAmount(payment?.due_amount ?? payment?.remaining_due ?? 0)}</p>
                <p><strong>Status:</strong> {typeof payment?.payment_status !== 'undefined' && payment?.payment_status !== null ? (
                  <>
                    <span className={payment?.payment_status === 'PAID' || payment?.payment_status === '1' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                      {payment?.payment_status === '1' || payment?.payment_status === 'PAID' ? 'Paid' : payment?.payment_status === '0' || payment?.payment_status === 'UNPAID' ? 'Unpaid' : payment?.payment_status}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">({String(payment?.payment_status)})</span>
                  </>
                ) : '-'}
                </p>
              </div>
            </div>
            
            {/* Purchased Items */}
            <div className="mt-6">
              <h2 className="mb-4 text-lg font-medium text-gray-700">Purchased Items</h2>
              <div className="overflow-x-auto shadow-sm rounded-xl">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Item</th>
                      <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Quantity</th>
                      <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Sold Price</th>
                      <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Returns</th>
                      <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-4">No items found</td></tr>
                    ) : items.map((item) => (
                      <tr key={item.sales_item_id} className="hover:bg-gray-100">
                        <td className="px-6 py-4">{item.item_name}</td>
                        <td className="px-6 py-4">{item.quantity}</td>
                        <td className="px-6 py-4">{formatAmount(item.price)}</td>
                        <td className="px-6 py-4">{item.return_quantity || 0}</td>
                        <td className="px-6 py-4">{item.status === '1' ? <span className="text-green-600 font-bold">Paid</span> : <span className="text-red-600 font-bold">Unpaid</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentDetails;