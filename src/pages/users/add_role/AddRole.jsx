
import React, { useState } from 'react';
import Layout from '../../../components/Layout';
import './AddRole.css';
import { useNavigate } from 'react-router-dom';

const AddRole = () => {
  const navigate = useNavigate();


  // State for form, loading, and error
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handler for cancel button
  const handleCancel = () => {
    navigate('/users/users');
  };

  // Handler for form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!role.trim()) {
      setError('Role name is required.');
      return;
    }
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/users/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role_name: role.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to add role.');
      } else {
        setRole('');
        navigate('/users/users');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Loading Overlay (hidden by default, can be implemented with state if needed) */}
      {loading && (
        <div id="loading-overlay" className="loading-overlay">
          <div className="text-center">
            <div className="spinner"></div>
          </div>
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
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2 text-nowrap">Users</p>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2 text-nowrap">Add New Role</p>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        {/* Main panel */}
        <div className="p-6">
          <div className="flex flex-col flex-grow h-full p-6 border-2 rounded-lg bg-white">
            <form className="w-full" onSubmit={handleSubmit}>
              <div className="grid gap-6 mb-6 md:grid-cols-1">
                <div>
                  <label htmlFor="role" className="block mb-2 text-sm font-medium text-black ">Role</label>
                  <input
                    id="role"
                    name="role"
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="Enter role"
                    required
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              {error && <div className="text-red-600 text-center mb-4">{error}</div>}
              <div className="flex items-center justify-center w-full gap-4 max-sm:flex-col max-sm:p-0">
                <button type="submit" className="py-3 px-6 bg-[#3c8c2c] text-white rounded-lg max-sm:py-1 max-sm:px-3 max-sm:w-full" disabled={loading}>Add</button>
                <button type="reset" className="px-6 py-3 text-white bg-[#3c8c2c] rounded-lg max-sm:py-1 max-sm:px-3 max-sm:w-full" disabled={loading} onClick={() => setRole('')}>Reset</button>
                <button type="button" className="px-6 py-3 text-white bg-red-600 rounded-lg max-sm:py-1 max-sm:px-3 max-sm:w-full" onClick={handleCancel} disabled={loading}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
        <div className="flex-grow"></div>
        
      </div>
    </Layout>
  );
};

export default AddRole;