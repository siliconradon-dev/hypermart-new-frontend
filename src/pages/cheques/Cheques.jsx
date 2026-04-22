import React, { useState } from 'react';
import './Cheques.css';
import '../../components/Layout'
import Layout from '../../components/Layout';

const Cheques = () => {
  const [loading, setLoading] = useState(false);
  const [bounceModalOpen, setBounceModalOpen] = useState(false);

  // Simulate loading overlay for navigation or form submit
  React.useEffect(() => {
    const hideLoading = () => setLoading(false);
    hideLoading();
    document.addEventListener('visibilitychange', hideLoading);
    return () => document.removeEventListener('visibilitychange', hideLoading);
  }, []);

  const showLoading = () => setLoading(true);
  const handleNav = (url) => {
    showLoading();
    setTimeout(() => {
      setLoading(false);
      window.location.href = url;
    }, 800);
  };

  // Modal logic (stubbed, no real data)
  const openBounceModal = () => setBounceModalOpen(true);
  const closeBounceModal = () => setBounceModalOpen(false);

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

      <div className="flex flex-col h-[85%]">
        {/* Breadcrumbs */}
        <div className="w-full px-4 py-5 sm:px-6 lg:px-12">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <a href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                  <svg className="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V18a2 2 0 002 2h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a2 2 0 002-2v-7.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Main Panel
                </a>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <span className="text-sm font-semibold text-blue-600 ms-1">Customer Cheques</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex-1 px-4 pb-6 overflow-auto sm:px-6 lg:px-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Customer Cheques</h1>
            <a href="/cheques/create" className="px-4 py-2 text-white rounded-lg bg-[#3c8c2c] hover:opacity-90 flex items-center gap-2">
              <i className="fas fa-plus"></i>
              Add New Cheque
            </a>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-700 font-medium">Pending Cheques</p>
                  <p className="text-2xl font-bold text-yellow-900">0</p>
                  <p className="text-xs text-yellow-600">Rs. 0.00</p>
                </div>
                <svg className="w-10 h-10 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"></path>
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
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
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
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
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
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 mb-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-filter mr-2"></i>Filter Cheques
            </h3>
            <form className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Cheque Number</label>
                <input type="text" name="cheque_number" placeholder="Cheque number..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Customer Name</label>
                <input type="text" name="cheque_customer" placeholder="Customer name..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Cheque Status</label>
                <select name="cheque_status" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="cleared">Cleared</option>
                  <option value="bounced">Bounced</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Bank Name</label>
                <input type="text" name="bank_name" placeholder="Bank name..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">VAT Status</label>
                <select name="cheque_vat_filter" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option value="">All Cheques</option>
                  <option value="vat">VAT Enabled</option>
                  <option value="no_vat">No VAT</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Cheque Date From</label>
                <input type="date" name="cheque_date_from" defaultValue="2026-04-01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Cheque Date To</label>
                <input type="date" name="cheque_date_to" defaultValue="2026-04-30" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Clearance Date From</label>
                <input type="date" name="clearance_date_from" defaultValue="2026-04-01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Clearance Date To</label>
                <input type="date" name="clearance_date_to" defaultValue="2026-04-30" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Min Amount</label>
                <input type="number" name="cheque_min_amount" placeholder="0.00" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Max Amount</label>
                <input type="number" name="cheque_max_amount" placeholder="0.00" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Replacement Status</label>
                <select name="has_replacement" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option value="">All Cheques</option>
                  <option value="yes">Has Replacement</option>
                  <option value="no">No Replacement</option>
                  <option value="is_replacement">Is Replacement</option>
                </select>
              </div>
              <div className="flex items-end space-x-2 md:col-span-4">
                <button type="submit" className="px-6 py-2 text-white rounded-lg bg-[#3c8c2c] hover:opacity-90">
                  <i className="mr-2 fas fa-filter"></i>Apply Filters
                </button>
                <a href="/cheques" className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <i className="mr-2 fas fa-redo"></i>Reset
                </a>
              </div>
            </form>
          </div>

          {/* Table */}
          <div className="overflow-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="text-xs text-white uppercase bg-[#3c8c2c]">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Cheque Number</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Bank</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Cheque Date</th>
                  <th className="px-4 py-2">Clearance Date</th>
                  <th className="px-4 py-2">Usage / Assigned To</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                  <th className="px-4 py-2">Replacements</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2">No cheques found</p>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="p-4"></div>
          </div>
        </div>
      </div>

      {/* Bounce Cheque Modal (stub, not functional) */}
      {bounceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center" role="dialog" aria-modal="true">
          <div className="inline-block overflow-y-auto text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form>
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
                      <p className="text-sm text-gray-500 mb-4">Cheque #<span className="font-semibold">123456</span> will be marked as bounced.</p>
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <p className="text-sm text-yellow-700"><i className="fas fa-exclamation-triangle mr-1"></i>Optionally assign a replacement cheque to track the new payment arrangement.</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-semibold text-green-900 mb-3">Create Replacement Cheque</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                            <input type="text" readOnly className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed" value="" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                            <input type="text" readOnly className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed" value="" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Types</label>
                            <input type="text" readOnly className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed" value="" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Cheque Number *</label>
                            <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="Enter new cheque number" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account *</label>
                            <select required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500">
                              <option value="">Select Bank Account</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cheque Date *</label>
                            <input type="date" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Clearance Date</label>
                            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="Enter any additional notes"></textarea>
                          </div>
                        </div>
                      </div>
                      <div className="custom-select z-[9999] mt-5">
                        <label>Or select payment option</label>
                        <select className="hidden">
                          <option value="">-- No Payment Option --</option>
                          <option>System Cash</option>
                          <option value="petty-cash">Petty Cash - Rs 0</option>
                          <option value="cashbook">Cash Book - Rs 16,450</option>
                          <option>Bank Accounts</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="submit" className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm">Bounce Cheque</button>
                <button type="button" onClick={closeBounceModal} className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      
    </div>
    </Layout>
  );
};

export default Cheques;
