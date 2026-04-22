import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditCustomer.css';
import Layout from '../../../components/Layout';

const initialState = {
  name: '',
  isCompany: false,
  vatNumber: '',
  vatDocument: null,
  vatDocumentName: '',
  Mobile_Number: '',
  contact_number_2: '',
  city: '',
  email: '',
  gender: '',
  dob: '',
  nic: '',
  city_name: '',
  addl1: '',
  addl2: '',
  due: '',
  opening_balance: '',
  opening_balance_type: 'credit',
  current_balance: '',
  credit_limit: '',
};

const EditCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCompanyFields, setShowCompanyFields] = useState(false);
  const vatDocInput = useRef();

  useEffect(() => {
    if (!id || id === 'null' || id === 'undefined') {
      setForm(initialState);
      setShowCompanyFields(false);
      return;
    }

    const fetchCustomer = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/customers/${id}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.success || !data?.customer) {
          setForm(initialState);
          setShowCompanyFields(false);
          setErrorMessage(data?.error || data?.message || `Failed to load customer (HTTP ${res.status}).`);
          return;
        }

        const c = data.customer;
        const next = {
          ...initialState,
          name: c.customer_name || '',
          isCompany: Number(c.is_company) === 1,
          vatNumber: c.vat_number || '',
          vatDocument: null,
          vatDocumentName: c.vat_document || '',
          Mobile_Number: c.contact_number || '',
          contact_number_2: c.contact_number_2 || '',
          city: (c.cities_id ?? c.city_id) ? String(c.cities_id ?? c.city_id) : '',
          email: c.email || '',
          gender: c.gender || '',
          dob: c.dob || '',
          nic: c.nic || '',
          city_name: c.city_name || '',
          addl1: c.address_line_1 || '',
          addl2: c.address_line_2 || '',
          due: c.due_amount ?? '',
          opening_balance: c.opening_balance ?? '',
          opening_balance_type: c.opening_balance_type || 'credit',
          current_balance: c.current_balance ?? '',
          credit_limit: c.credit_limit ?? '',
        };

        setForm(next);
        setShowCompanyFields(next.isCompany);
        if (vatDocInput.current) vatDocInput.current.value = '';
      } catch {
        setForm(initialState);
        setShowCompanyFields(false);
        setErrorMessage('Network or server error.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
      setShowCompanyFields(checked);
    } else if (type === 'file') {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Reset form to initial state
  const handleReset = () => {
    setForm((prev) => ({
      ...initialState,
      vatDocumentName: prev.vatDocumentName || '',
    }));
    setShowCompanyFields(false);
    setErrorMessage('');
    if (vatDocInput.current) vatDocInput.current.value = '';
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      setErrorMessage('Missing customer id in URL.');
      return;
    }

    setLoading(true);
    setSuccess(false);
    setErrorMessage('');

    const payload = {
      customer_name: form.name,
      is_company: form.isCompany ? 1 : 0,
      vat_number: form.vatNumber,
      vat_document: form.vatDocument ? form.vatDocument.name : (form.vatDocumentName || ''),
      contact_number: form.Mobile_Number,
      contact_number_2: form.contact_number_2,
      email: form.email,
      gender: form.isCompany ? '' : form.gender,
      dob: form.isCompany ? '' : form.dob,
      nic: form.isCompany ? '' : form.nic,
      cities_id: form.city ? Number(form.city) : null,
      city_name: form.city_name,
      address_line_1: form.addl1,
      address_line_2: form.addl2,
      due_amount: form.due,
      opening_balance: form.opening_balance,
      opening_balance_type: form.opening_balance_type,
      credit_limit: form.credit_limit,
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        setSuccess(true);
        setForm((prev) => ({
          ...prev,
          vatDocumentName: prev.vatDocument ? prev.vatDocument.name : prev.vatDocumentName,
          vatDocument: null,
        }));
        if (vatDocInput.current) vatDocInput.current.value = '';
        window.setTimeout(() => setSuccess(false), 4000);
      } else {
        setErrorMessage(data?.error || data?.message || `Failed to update customer (HTTP ${res.status}).`);
      }
    } catch {
      setErrorMessage('Network or server error.');
    } finally {
      setLoading(false);
    }
  };

  // Render city name field
  const renderCityNameField = () => (
    <div className={showCompanyFields ? 'grid gap-6 mb-6 md:grid-cols-1' : ''}>
      <div id="city_name_field">
        <label htmlFor="city_name" className="block mb-2 text-sm font-medium text-black">City Name</label>
        <input 
          id="city_name" 
          name="city_name" 
          type="text" 
          value={form.city_name}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Enter City Name" 
        />
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="edit-customer-root min-h-screen flex flex-col">
        {/* Loading Overlay */}
        {loading && (
          <div className="loading-overlay">
            <div className="text-center">
              <div className="spinner"></div>
            </div>
          </div>
        )}

        {/* Success Banner */}
        {success && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 flex items-center bg-green-500 text-white px-6 py-3 rounded shadow-lg transition-all">
            <span className="mr-2">
              <i className="fas fa-check-circle"></i>
            </span>
            Customer updated successfully!
            <button className="ml-4 text-white" onClick={() => setSuccess(false)}>&times;</button>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 flex items-center bg-red-600 text-white px-6 py-3 rounded shadow-lg transition-all">
            <span className="mr-2">
              <i className="fas fa-times-circle"></i>
            </span>
            {errorMessage}
            <button className="ml-4 text-white" onClick={() => setErrorMessage('')}>&times;</button>
          </div>
        )}

        <div className="flex flex-col flex-grow">
          {/* Breadcrumbs */}
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
                    <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2 text-nowrap">Customers</p>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2 text-nowrap">Update Customer</p>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Main Panel */}
          <div className="p-6 pt-0 md:px-12">
            <div className="flex flex-col flex-grow h-full p-6 border-2 rounded-lg bg-white">
              <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off">
                {/* Name & Company toggle */}
                <div className="grid gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-black">
                      Customer / Company Name <span className="text-red-700">*</span>
                    </label>
                    <input 
                      id="name" 
                      name="name" 
                      type="text" 
                      value={form.name} 
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter customer name" 
                      required 
                    />

                    <div>
                      <label htmlFor="is_company" className="block mb-2 text-sm font-medium text-black mt-4">
                        Is this a Company? 
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="hidden" name="is_company" value="0" />
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          name="isCompany" 
                          id="is_company" 
                          checked={form.isCompany} 
                          onChange={handleChange} 
                        />
                        <div className="relative h-6 bg-gray-200 rounded-full w-11 peer peer-checked:bg-green-600">
                          <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 left-0.5 transition-transform ${form.isCompany ? 'translate-x-5' : ''}`}></div>
                        </div>
                      </label>
                    </div>

                    {/* Company-specific fields */}
                    {form.isCompany && (
                      <div id="company_fields" className="mt-4">
                        <div className="mb-4">
                          <label htmlFor="vat_number" className="block mb-2 text-sm font-medium text-black">
                            VAT Number
                          </label>
                          <input 
                            id="vat_number" 
                            name="vatNumber" 
                            type="text" 
                            value={form.vatNumber} 
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Enter VAT number" 
                          />
                        </div>
                        <div>
                          <label htmlFor="vat_document" className="block mb-2 text-sm font-medium text-black">
                            VAT Document
                          </label>
                          <input 
                            id="vat_document" 
                            name="vatDocument" 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            ref={vatDocInput} 
                            onChange={handleChange}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2" 
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Accepted formats: PDF, JPG, PNG (Max 2MB) - Leave empty to keep existing document
                          </p>
                          {form.vatDocumentName ? (
                            <p className="mt-1 text-xs text-gray-600">Current: {form.vatDocumentName}</p>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Hidden Customer ID */}
                  <div className="hidden">
                    <label htmlFor="id" className="block mb-2 text-sm font-medium text-black">Customer ID</label>
                    <input 
                      id="id" 
                      name="id" 
                      type="text" 
                      value="" 
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                      placeholder="Enter id number" 
                      required 
                      readOnly 
                    />
                  </div>
                </div>

                {/* Mobile, Contact, City */}
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="Mobile_Number" className="block mb-2 text-sm font-medium text-black">
                      Mobile Number <span className="text-red-700">*</span>
                    </label>
                    <input 
                      id="Mobile_Number" 
                      name="Mobile_Number" 
                      type="text" 
                      value={form.Mobile_Number} 
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter mobile number" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="contact_number_2" className="block mb-2 text-sm font-medium text-black">
                      Second Mobile Number
                    </label>
                    <input 
                      id="contact_number_2" 
                      name="contact_number_2" 
                      type="text" 
                      value={form.contact_number_2} 
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter second mobile number" 
                    />
                  </div>
                  <div className="hidden md:col-span-1">
                    <label htmlFor="city" className="block mb-2 text-sm font-medium text-black">City</label>
                    <select 
                      id="city" 
                      name="city" 
                      value={form.city} 
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      <option value="">Select city</option>
                      <option value="1">default</option>
                    </select>
                  </div>
                </div>

                {/* Email */}
                <div className="grid gap-6 mb-6 md:grid-cols-1">
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">Email</label>
                    <input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={form.email} 
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter customer email" 
                    />
                  </div>
                </div>

                {/* Individual/Company fields */}
                {!form.isCompany && (
                  <div id="individual_fields_row" className="grid gap-6 mb-6 md:grid-cols-2">
                    <div id="gender_field">
                      <label htmlFor="gender" className="block mb-2 text-sm font-medium text-black">Gender</label>
                      <select 
                        id="gender" 
                        name="gender" 
                        value={form.gender} 
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div id="dob_field">
                      <label htmlFor="dob" className="block mb-2 text-sm font-medium text-black">Date of Birth</label>
                      <input 
                        id="dob" 
                        name="dob" 
                        type="date" 
                        value={form.dob} 
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Select date of birth" 
                      />
                    </div>
                  </div>
                )}

                {/* NIC/City Name fields */}
                <div id="nic_city_row" className="grid gap-6 mb-6 md:grid-cols-2">
                  {!form.isCompany && (
                    <div id="nic_field">
                      <label htmlFor="nic" className="block mb-2 text-sm font-medium text-black">NIC</label>
                      <input 
                        id="nic" 
                        name="nic" 
                        type="text" 
                        value={form.nic} 
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Enter NIC" 
                      />
                    </div>
                  )}
                  {renderCityNameField()}
                </div>

                {/* Address fields */}
                <div id="address_row" className="grid gap-6 mb-6 md:grid-cols-2">
                  <div id="gs_division_field">
                    <label htmlFor="addl1" className="block mb-2 text-sm font-medium text-black">Address Line 1</label>
                    <input 
                      id="addl1" 
                      name="addl1" 
                      type="text" 
                      value={form.addl1} 
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Address Line 1" 
                    />
                  </div>
                  <div id="address_field2">
                    <label htmlFor="addl2" className="block mb-2 text-sm font-medium text-black">Address Line 2</label>
                    <input 
                      id="addl2" 
                      name="addl2" 
                      type="text" 
                      value={form.addl2} 
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Address Line 2" 
                    />
                  </div>
                </div>

                {/* Due Amount (hidden) */}
                <div className="grid hidden gap-6 mb-6 md:grid-cols-3">
                  <div>
                    <label htmlFor="due" className="block mb-2 text-sm font-medium text-black">Due Amount</label>
                    <input 
                      id="due" 
                      name="due" 
                      type="text" 
                      value={form.due} 
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter due amount" 
                    />
                  </div>
                </div>

                {/* Super Admin Only: Opening Balance & Credit Limit */}
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl border-2 border-amber-300 mb-6">
                  <div className="flex items-center mb-4">
                    <svg className="w-6 h-6 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-amber-900">Super Admin Only - Financial Settings</h3>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="opening_balance" className="block mb-2 text-sm font-semibold text-amber-900">
                        Opening Balance (LKR)
                      </label>
                      <div className="flex gap-2">
                        <select
                          id="opening_balance_type"
                          name="opening_balance_type"
                          value={form.opening_balance_type}
                          onChange={handleChange}
                          className="bg-white border-2 border-amber-300 text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 p-2.5 w-32"
                        >
                          <option value="credit">Credit</option>
                          <option value="debit">Debit</option>
                        </select>
                        <input
                          id="opening_balance"
                          name="opening_balance"
                          type="number"
                          step="0.01"
                          value={form.opening_balance}
                          onChange={handleChange}
                          className="bg-white border-2 border-amber-300 text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5"
                          placeholder="Enter opening balance"
                        />
                      </div>
                      <p className="mt-1 text-xs text-amber-700">
                        <span className="text-green-700">Payable (Debit):</span> Customer has prepaid credit<br />
                        <span className="text-red-700">Receivable (Credit):</span> Customer owes money (reduces credit limit)
                      </p>
                    </div>
                    <div>
                      <label htmlFor="credit_limit" className="block mb-2 text-sm font-semibold text-amber-900">
                        Credit Limit (LKR)
                      </label>
                      <input 
                        id="credit_limit" 
                        name="credit_limit" 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        value={form.credit_limit} 
                        onChange={handleChange}
                        className="bg-white border-2 border-amber-300 text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5"
                        placeholder="Enter credit limit" 
                      />
                      <p className="mt-1 text-xs text-amber-700">
                        Maximum credit allowed. Set to 0 to disable credit bills.<br />
                        <span className="font-semibold">Current Balance:</span> Rs. {Number(form.current_balance || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                      <div>
                        <p className="text-gray-600">Credit Limit:</p>
                        <p className="font-bold text-blue-600">Rs. {Number(form.credit_limit || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Current Balance:</p>
                        <p className="font-bold text-purple-600">Rs. {Number(form.current_balance || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Due Amount:</p>
                        <p className="font-bold text-orange-600">Rs. {Number(form.due || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Available Credit:</p>
                        <p className="font-bold text-red-600">Rs. {Math.max(0, Number(form.credit_limit || 0) - Number(form.current_balance || 0)).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center w-full gap-4 max-sm:flex-col max-sm:p-0">
                  <button 
                    type="submit" 
                    className="py-3 px-6 bg-[#029ED9] text-white rounded-lg max-sm:py-1 max-sm:px-3 max-sm:w-full"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </button>
                  <button 
                    type="button" 
                    className="px-6 py-3 text-white bg-black rounded-lg max-sm:py-1 max-sm:px-3 max-sm:w-full" 
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                  <button 
                    type="button" 
                    className="px-6 py-3 text-white bg-red-600 rounded-lg max-sm:py-1 max-sm:px-3 max-sm:w-full" 
                    onClick={() => navigate('/customers/customer_list')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditCustomer;