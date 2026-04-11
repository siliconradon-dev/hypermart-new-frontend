import React, { useState, useEffect } from 'react';
import './EditSupplier.css';

const EditSupplier = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: 'sample supplier',
    mobile_number: '1223567870',
    email: 'sample@gmail.com',
    vat_no: '',
    address: 'Colombo',
    city_name: '',
    city: '1',
  });

  useEffect(() => {
    const hideLoading = () => setLoading(false);
    hideLoading();
    document.addEventListener('visibilitychange', hideLoading);
    return () => document.removeEventListener('visibilitychange', hideLoading);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simulate form submission
      window.location.href = '/suppliers/supplierList';
    }, 1200);
  };

  const handleReset = () => {
    setForm({
      name: '',
      mobile_number: '',
      email: '',
      vat_no: '',
      address: '',
      city_name: '',
      city: '1',
    });
  };

  return (
    <div className="min-h-dvh max-lg:h-fit flex flex-col h-dvh">
      {/* Nav */}
      <div className="nav bg-[#3c8c2c] w-full h-[10%] max-lg:h-[17dvh] py-6 flex justify-between items-center max-md:justify-center max-md:flex-col md:px-14 lg:px-0">
        <span className="flex items-center gap-3 ml-20 max-lg:ml-0 max-sm:scale-75">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-full w-[50px] aspect-square bg-white flex justify-center items-center hover:scale-90 transition-all"
          >
            <i className="text-xl text-[#000000] fas fa-arrow-left"></i>
          </button>
          <button
            type="button"
            onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); window.location.href = '/dashboard'; }, 800); }}
            className="p-2 text-[#000000] rounded-lg bg-white flex gap-3 justify-center items-center hover:scale-90 transition-all"
          >
            <i className="text-xl text-[#000000] fas fa-city"></i>
            Go to Main Panel
          </button>
          <a
            href="/sales/billing"
            className="p-2 text-[#000000] rounded-lg bg-white flex gap-3 justify-center items-center hover:scale-90 transition-all"
          >
            POS
          </a>
        </span>
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
          <img
            src="https://hypermart-new.onlinesytems.com/Company Logo/1774375149_1771770442_Screenshot 2026-02-22 195640.png"
            alt="Logo"
            className="h-14 max-sm:h-8 bg-white p-1 rounded-full"
          />
        </div>
        <span className="flex items-center gap-3 mr-20 max-lg:mr-0 max-sm:scale-75">
          <div className="flex flex-col items-end text-right">
            <h3 className="text-2xl max-md:text-sm text-[#ffffff]">Good Afternoon!</h3>
            <h3 className="text-sm text-[#ffffff]">Welcome HYPERMART</h3>
          </div>
          <form method="POST" action="https://hypermart-new.onlinesytems.com/logout">
            <input type="hidden" name="_token" value="w60AGsOgpzTar61Q5IStjmzQHtGFA4bgGu0ewCzn" autoComplete="off" />
            <button type="submit" className="rounded-full w-[50px] aspect-square bg-white flex justify-center items-center hover:scale-90 transition-all">
              <i className="text-xl font-bold text-[#000000] fas fa-sign-out-alt"></i>
            </button>
          </form>
        </span>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="text-center">
            <div className="spinner"></div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        {/* Breadcrumbs */}
        <div className="px-12 py-5 max-sm:px-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <p className="inline-flex items-center text-sm font-medium text-gray-700 text-nowrap">
                  <svg className="w-3 h-3 me-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Main Panel
                </p>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2 text-nowrap">Suppliers</p>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2 text-nowrap">Update Supplier</p>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Main Panel */}
        <div className="p-6">
          <div className="flex flex-col flex-grow h-full p-6 border-2 rounded-lg">
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="grid gap-6 mb-6 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-black">Supplier Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Enter supplier name"
                  />
                </div>
                <div>
                  <label htmlFor="m_no" className="block mb-2 text-sm font-medium text-black">Mobile Number</label>
                  <input
                    id="m_no"
                    name="mobile_number"
                    type="text"
                    value={form.mobile_number}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>

              <div className="grid gap-6 mb-6">
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="grid gap-6 mb-6">
                <div>
                  <label htmlFor="vat_no" className="block mb-2 text-sm font-medium text-black">
                    VAT Number
                    <span className="text-xs text-gray-500">(Optional)</span>
                  </label>
                  <input
                    id="vat_no"
                    name="vat_no"
                    type="text"
                    value={form.vat_no}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Enter VAT number (e.g., 123456789V)"
                  />
                </div>
              </div>

              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                  <label htmlFor="addl1" className="block mb-2 text-sm font-medium text-gray-900">Address</label>
                  <input
                    id="addl1"
                    name="address"
                    type="text"
                    value={form.address}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Enter address"
                  />
                </div>
                <div>
                  <label htmlFor="addl2" className="block mb-2 text-sm font-medium text-black">City Name</label>
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
                <div className="hidden">
                  <label htmlFor="city" className="block mb-2 text-sm font-medium text-black">City</label>
                  <div className="w-full custom-select">
                    <select
                      id="city"
                      name="city"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      value={form.city}
                      onChange={handleChange}
                    >
                      <option value="1">Select city</option>
                      <option value="1" selected>default</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center w-full gap-4 max-sm:flex-col max-sm:p-0">
                <button
                  type="submit"
                  className="py-3 px-6 bg-[#3c8c2c] text-white rounded-lg max-sm:py-1 max-sm:px-3 max-sm:w-full"
                >
                  Update
                </button>
                <button
                  type="button"
                  className="px-6 py-3 text-white bg-[#3c8c2c] rounded-lg max-sm:py-1 max-sm:px-3 max-sm:w-full"
                  onClick={handleReset}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="px-6 py-3 text-white bg-red-600 rounded-lg max-sm:py-1 max-sm:px-3 max-sm:w-full"
                  onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); window.location.href = '/suppliers/supplierList'; }, 800); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex-grow"></div>
        <footer className="bg-[#3c8c2c] py-4 text-center text-[#ffffff]">
          <p>2026 © All Rights Reserved | Hypermart | Designed and Developed by Silicon Radon Networks (Pvt) Ltd</p>
        </footer>
      </div>
    </div>
  );
};

export default EditSupplier;