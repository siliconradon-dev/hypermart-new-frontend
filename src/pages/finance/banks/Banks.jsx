import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import './Banks.css';

const Banks = ({ onBackToMain }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Layout onBackToMain={onBackToMain}>
      <div className="banks-page min-h-dvh max-lg:h-fit flex flex-col w-full">
        <div id="loading-overlay" className={`loading-overlay${loading ? ' show' : ''}`}>
          <div className="text-center">
            <div className="spinner" />
          </div>
        </div>

        <div className="w-full px-4 py-5 sm:px-6 lg:px-12">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <a href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                  <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Main Panel
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <a href="/finance" className="text-sm font-medium text-gray-700 hover:text-blue-600 ms-1 md:ms-2">Finance</a>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <span className="text-sm font-medium text-gray-500 ms-1 md:ms-2">Bank Management</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex-1 px-4 pb-6 overflow-auto sm:px-6 lg:px-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Bank Management</h1>
            <a href="/finance/banks/create" className="px-4 py-2 text-white rounded-lg bg-[#3c8c2c] hover:opacity-90">
              <i className="mr-2 fas fa-plus" />Add New Bank
            </a>
          </div>

          <div className="p-6 mb-6 bg-white rounded-lg shadow">
            <form className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Search</label>
                <input
                  type="text"
                  name="search"
                  defaultValue=""
                  placeholder="Bank name, branch, code..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  type="text"
                  name="contact"
                  defaultValue=""
                  placeholder="Phone number..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Status</label>
                <select name="status" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option value="">All Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>

              <div className="flex items-end space-x-2">
                <button type="submit" className="px-4 py-2 text-white rounded-lg bg-[#3c8c2c] hover:opacity-90">
                  <i className="mr-2 fas fa-filter" />Filter
                </button>
                <a href="/finance/banks" className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <i className="mr-2 fas fa-redo" />Reset
                </a>
              </div>
            </form>
          </div>

          <div className="overflow-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="text-xs text-white uppercase bg-[#3c8c2c]">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Bank Name</th>
                  <th className="px-4 py-2">Bank Code</th>
                  <th className="px-4 py-2">Contact</th>
                  <th className="px-4 py-2">Accounts</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No banks found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Banks;