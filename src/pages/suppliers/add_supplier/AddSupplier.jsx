import React, { useRef, useState } from 'react';
import Layout from '../../../components/Layout';
import './AddSupplier.css';

const AddSupplier = ({ onBackToMain }) => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    formRef.current?.reset();
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem('user');
      setLoading(false);
      window.location.assign('/');
      return;
    }

    try {
      const formData = new FormData(formRef.current);

      const payload = {
        supplier_name: String(formData.get('supplier_name') || '').trim(),
        contact_number: String(formData.get('contact_number') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        vat_no: String(formData.get('vat_no') || '').trim(),
        address: String(formData.get('address') || '').trim(),
        city_id: String(formData.get('city_id') || '').trim(),
        city_name: String(formData.get('city_name') || '').trim(),
        opening_balance_type: String(formData.get('opening_balance_type') || 'debit').trim(),
        opening_balance: String(formData.get('opening_balance') || '0').trim(),
      };

      // Convert empty city_id to null-like on backend via '' check.
      if (payload.city_id === '') payload.city_id = '';

      const resp = await fetch('/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await resp.json().catch(() => ({}));

      if (resp.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.assign('/');
        return;
      }

      if (!resp.ok) {
        setError(data?.error || 'Failed to add supplier.');
        return;
      }

      setSuccess('Supplier added successfully.');
      resetForm();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout onBackToMain={onBackToMain}>
      <div className="add-supplier-page flex flex-col flex-grow">
        {loading && (
          <div id="loading-overlay" className="loading-overlay">
            <div className="text-center">
              <div className="spinner" />
            </div>
          </div>
        )}

        <div className="flex flex-col flex-grow">
          <div className="px-12 py-5 max-sm:px-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <p className="inline-flex items-center text-sm font-medium text-gray-700 text-nowrap">
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
                    <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2 text-nowrap">Suppliers</p>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2 text-nowrap">Add New Supplier</p>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div className="flex flex-col flex-grow">
            <div className="p-6">
              <div className="flex flex-col flex-grow h-full p-6 border-2 rounded-lg bg-white">
                <form ref={formRef} onSubmit={handleSubmit}>

                  {error && (
                    <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="mb-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
                      {success}
                    </div>
                  )}

                  <div className="grid gap-6 mb-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-black">Supplier Name <span className="text-red-700">*</span></label>
                      <input id="name" name="supplier_name" type="text" required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter supplier name" />
                    </div>

                    <div>
                      <label htmlFor="Contact_Number" className="block mb-2 text-sm font-medium text-black">Mobile Number <span className="text-red-700">*</span></label>
                      <input id="Contact_Number" name="contact_number" type="text" required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter mobile number" />
                    </div>
                  </div>

                  <div className="grid gap-6 mb-6">
                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">Email Address</label>
                      <input id="email" name="email" type="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter email address" />
                    </div>
                  </div>

                  <div className="grid gap-6 mb-6">
                    <div>
                      <label htmlFor="vat_no" className="block mb-2 text-sm font-medium text-black">VAT Number <span className="text-xs text-gray-500">(Optional)</span></label>
                      <input id="vat_no" name="vat_no" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter VAT number (e.g., 123456789V)" />
                    </div>
                  </div>

                  <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">Address <span className="text-red-700">*</span></label>
                      <input id="address" name="address" type="text" required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter address" />
                    </div>

                    <div className="hidden">
                      <label htmlFor="city_id" className="block mb-2 text-sm font-medium text-black">City</label>
                      <select id="city_id" name="city_id" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" defaultValue="">
                        <option value="">Select city</option>
                        <option value="1">default</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="city_name" className="block mb-2 text-sm font-medium text-black">City Name</label>
                      <input id="city_name" name="city_name" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter City Name" />
                    </div>
                  </div>

                  <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="opening_balance" className="block mb-2 text-sm font-medium text-black">Opening Balance (Rs.) <span className="text-red-700">*</span></label>
                      <div className="flex gap-2">
                        <select id="opening_balance_type" name="opening_balance_type" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 w-32" defaultValue="debit">
                          <option value="debit">Recievable (Debit)</option>
                          <option value="credit">Payable (Credit)</option>
                        </select>
                        <input id="opening_balance" name="opening_balance" type="number" step="0.01" min="0" required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter opening balance amount" defaultValue="0" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center w-full gap-4 max-sm:flex-col max-sm:p-0">
                    <button type="submit" className="py-3 px-6 bg-[#3c8c2c] text-white rounded-lg max-sm:py-1 max-sm:px-3 max-sm:w-full">Add</button>
                    <button type="reset" className="px-6 py-3 text-white bg-[#3c8c2c] rounded-lg max-sm:py-1 max-sm:px-3 max-sm:w-full" onClick={resetForm}>Reset</button>
                    <button type="button" className="px-6 py-3 text-white bg-red-600 rounded-lg max-sm:py-1 max-sm:px-3 max-sm:w-full" onClick={() => window.location.assign('/suppliers/suppliers')}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddSupplier;