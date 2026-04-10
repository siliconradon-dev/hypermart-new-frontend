import React, { useRef, useState } from 'react';
import Layout from '../../../components/Layout';
import '../../../assets/customer-pages.css';

const AddCustomer = () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const hideLoading = () => setLoading(false);

  const resetForm = () => {
    formRef.current?.reset();
    setIsCompany(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const closeMessage = (id) => {
    if (id === 'errorMessage') {
      setErrorMessage('');
    }

    if (id === 'successMessage') {
      setSuccessMessage('');
    }
  };

  const toggleCompany = () => {
    setIsCompany((current) => !current);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    window.setTimeout(() => {
      hideLoading();
      resetForm();
      setSuccessMessage('Operation Successful');

      window.setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    }, 900);
  };

  return (
    <Layout>
      <div className="flex flex-col flex-grow w-full">
        {loading && (
          <div id="loading-overlay" className="loading-overlay">
            <div className="text-center">
              <div className="spinner" />
            </div>
          </div>
        )}

        <div className="flex flex-col flex-grow w-full">
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
                    <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2 text-nowrap">Add New Customer</p>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div className="p-6 pt-0 md:px-12">
            <form ref={formRef} action="https://hypermart-new.onlinesytems.com/customers/store" method="POST" id="addCustomerForm" onSubmit={handleSubmit}>
              <input type="hidden" name="_token" value="lV3JlfzCkgPECFRBCdzhJF9SqMhIjHSHrPuXtcvI" autoComplete="off" />

              <div className="flex flex-col flex-grow h-full p-6 border-2 rounded-lg bg-white">
                <div className="grid gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-black">
                      Customer / Company Name <span className="text-red-700">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter customer name"
                      required
                    />

                    <div>
                      <label htmlFor="is_company" className="block mb-2 text-sm font-medium text-black mt-4">Is this a Company?</label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="hidden" name="is_company" value="0" />
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          name="is_company"
                          id="is_company"
                          value="1"
                          checked={isCompany}
                          onChange={toggleCompany}
                        />
                        <div className={`relative h-6 rounded-full w-11 peer ${isCompany ? 'bg-green-600' : 'bg-gray-200'}`}>
                          <div id="toggleCircle" className={`absolute w-5 h-5 bg-white rounded-full top-0.5 left-0.5 transition-transform ${isCompany ? 'translate-x-5' : ''}`} />
                        </div>
                      </label>
                    </div>

                    <div id="company_fields" className="mt-4">
                      <div className="mb-4">
                        <label htmlFor="vat_number" className="block mb-2 text-sm font-medium text-black">VAT Number</label>
                        <input
                          id="vat_number"
                          name="vat_number"
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="Enter VAT number"
                        />
                      </div>
                      <div>
                        <label htmlFor="vat_document" className="block mb-2 text-sm font-medium text-black">VAT Document</label>
                        <input
                          id="vat_document"
                          name="vat_document"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="customer-file-input"
                        />
                        <p className="mt-1 text-xs text-gray-500">Accepted formats: PDF, JPG, PNG (Max 2MB)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="Mobile_Number" className="block mb-2 text-sm font-medium text-black">Mobile Number <span className="text-red-700">*</span></label>
                    <input
                      id="Mobile_Number"
                      name="Mobile_Number"
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contact_number_2" className="block mb-2 text-sm font-medium text-black">Second Mobile Number</label>
                    <input
                      id="contact_number_2"
                      name="contact_number_2"
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter second mobile number"
                    />
                  </div>
                </div>

                <div className="grid gap-6 mb-6 md:grid-cols-1">
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter customer email"
                    />
                  </div>
                </div>

                {!isCompany ? (
                  <div id="individual_fields_row" className="grid gap-6 mb-6 md:grid-cols-2">
                    <div id="gender_field">
                      <label htmlFor="gender" className="block mb-2 text-sm font-medium text-black">Gender</label>
                      <select
                        id="gender"
                        name="gender"
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
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Select date of birth"
                      />
                    </div>
                  </div>
                ) : (
                  <div id="city_name_company_row" className="grid gap-6 mb-6 md:grid-cols-1">
                    <div>
                      <label htmlFor="city_name" className="block mb-2 text-sm font-medium text-black">City Name</label>
                      <input
                        id="city_name"
                        name="city_name"
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Enter City Name"
                      />
                    </div>
                  </div>
                )}

                {!isCompany ? (
                  <div id="nic_city_row" className="grid gap-6 mb-6 md:grid-cols-2">
                    <div id="nic_field">
                      <label htmlFor="nic" className="block mb-2 text-sm font-medium text-black">NIC</label>
                      <input
                        id="nic"
                        name="nic"
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Enter NIC"
                      />
                    </div>
                    <div id="city_name_field">
                      <label htmlFor="city_name" className="block mb-2 text-sm font-medium text-black">City Name</label>
                      <input
                        id="city_name"
                        name="city_name"
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Enter City Name"
                      />
                    </div>
                  </div>
                ) : null}

                <div id="address_row" className="grid gap-6 mb-6 md:grid-cols-2">
                  <div id="gs_division_field">
                    <label htmlFor="addl1" className="block mb-2 text-sm font-medium text-black">Address Line 1</label>
                    <input
                      id="addl1"
                      name="addl1"
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Address Line 1"
                    />
                  </div>
                  <div id="address_line_2_field">
                    <label htmlFor="addl2" className="block mb-2 text-sm font-medium text-black">Address Line 2</label>
                    <input
                      id="addl2"
                      name="addl2"
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Address Line 2"
                    />
                  </div>
                </div>

                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="due" className="block mb-2 text-sm font-medium text-black">Due Amount</label>
                    <input
                      id="due"
                      name="due"
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter due amount"
                    />
                  </div>
                  <div>
                    <label htmlFor="opening_balance" className="block mb-2 text-sm font-medium text-black">Opening Balance (LKR)</label>
                    <div className="flex gap-2">
                      <select
                        id="opening_balance_type"
                        name="opening_balance_type"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-32"
                        defaultValue="credit"
                      >
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                      </select>
                      <input
                        id="opening_balance"
                        name="opening_balance"
                        type="number"
                        step="0.01"
                        min="0"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Enter opening balance amount"
                        defaultValue="0"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      <span className="text-green-600">Payable (Credit):</span> Customer has money<br />
                      <span className="text-red-600">Receivable (Debit):</span> Customer owes money
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 mb-6 md:grid-cols-1">
                  <div>
                    <label htmlFor="credit_limit" className="block mb-2 text-sm font-medium text-black">Credit Limit (LKR)</label>
                    <input
                      id="credit_limit"
                      name="credit_limit"
                      type="number"
                      step="0.01"
                      min="0"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter credit limit (e.g., 100000)"
                      defaultValue="0"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Maximum credit amount allowed for this customer. Set to 0 to disable credit bills.
                      <span className="text-amber-600">Note:</span> Negative opening balance will reduce available credit limit.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center w-full gap-4 max-sm:flex-col max-sm:p-0">
                  <button type="submit" className="py-3 px-6 bg-[#3c8c2c] text-white rounded-lg max-sm:py-1 max-sm:px-3 max-sm:w-full">Add</button>
                  <button type="button" className="px-6 py-3 text-white bg-[#3c8c2c] rounded-lg max-sm:py-1 max-sm:px-3 max-sm:w-full" onClick={resetForm}>Reset</button>
                  <button type="button" className="px-6 py-3 text-white bg-red-600 rounded-lg max-sm:py-1 max-sm:px-3 max-sm:w-full" onClick={() => { window.location.href = '/customers/customers'; }}>
                    Cancel
                  </button>
                </div>

                <div id="errorMessage" className={`flex-col items-start justify-between px-6 py-4 mt-3 mb-4 text-sm text-red-800 bg-red-100 border border-red-300 rounded-lg shadow-md ${errorMessage ? 'flex' : 'hidden'}`}>
                  <div className="flex items-start justify-between w-full">
                    <span id="errorText" className="flex-1">{errorMessage || 'An error occurred'}</span>
                    <button type="button" className="ml-2 text-red-500" onClick={() => closeMessage('errorMessage')}>×</button>
                  </div>
                </div>

                <div id="successMessage" className={`items-center justify-between px-6 py-4 mt-3 mb-4 text-sm text-green-800 bg-green-100 border border-green-300 rounded-lg shadow-md ${successMessage ? 'flex' : 'hidden'}`}>
                  <span id="successText">{successMessage || 'Operation Successful'}</span>
                  <button type="button" className="ml-2 text-green-500" onClick={() => closeMessage('successMessage')}>×</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddCustomer;
