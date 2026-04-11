
import React, { useState } from 'react';
import Layout from '../../../components/Layout';
import './EditRole.css';

// Permissions list (should be fetched or imported in real app)
const permissionsList = [
  { id: 10, label: 'dashboards', checked: true },
  { id: 17, label: 'Access_Dashbord', checked: true },
  { id: 18, label: 'Access_Billing', checked: true },
  { id: 19, label: 'Access_Items', checked: true },
  { id: 20, label: 'Access_Stock', checked: true },
  { id: 21, label: 'Access_Sales', checked: true },
  { id: 22, label: 'Access_Users', checked: true },
  { id: 23, label: 'Access_Customers', checked: true },
  { id: 24, label: 'Access_Suppliers', checked: true },
  { id: 25, label: 'Access_Expenses', checked: true },
  { id: 26, label: 'Access_Reports', checked: true },
  { id: 27, label: 'Access_Settings', checked: true },
  { id: 28, label: 'Add new Item', checked: true },
  { id: 29, label: 'Add New User', checked: true },
  { id: 30, label: 'Add New Role', checked: true },
  { id: 31, label: 'Add New Permission', checked: true },
  { id: 32, label: 'User List View', checked: true },
  { id: 33, label: 'Role List View', checked: true },
  { id: 34, label: 'Permission List View', checked: true },
  { id: 35, label: 'User Status Control', checked: true },
  { id: 36, label: 'User Update', checked: true },
  { id: 37, label: 'Role Update', checked: true },
  { id: 38, label: 'Permission Update', checked: true },
  { id: 39, label: 'Add New Customers', checked: true },
  { id: 40, label: 'View Customer List', checked: true },
  { id: 41, label: 'Import Customers', checked: false },
  { id: 42, label: 'Update Customers', checked: false },
  { id: 43, label: 'Delete Customers', checked: false },
  { id: 44, label: 'Add New Supplier', checked: false },
  { id: 45, label: 'View Supplier List', checked: false },
  { id: 46, label: 'Import Suppliers', checked: false },
  { id: 47, label: 'Update Suppliers', checked: false },
  { id: 48, label: 'Delete Suppliers', checked: false },
  { id: 49, label: 'Add New Items', checked: false },
  { id: 50, label: 'Add New Category', checked: false },
  { id: 51, label: 'View Item List', checked: false },
  { id: 52, label: 'View Item Category List', checked: false },
  { id: 53, label: 'Update Item Category List', checked: false },
  { id: 54, label: 'Delete Item Category', checked: false },
  { id: 55, label: 'Delete Items', checked: false },
  { id: 56, label: 'Update Items', checked: false },
  { id: 57, label: 'Add Stock', checked: false },
  { id: 58, label: 'Import Item', checked: false },
  { id: 59, label: 'Suppliers Status Control', checked: false },
  { id: 60, label: 'Billing', checked: false },
  { id: 61, label: 'Add Sales Returns', checked: false },
  { id: 62, label: 'Sales Items List', checked: false },
  { id: 63, label: 'Sales Return List', checked: false },
  { id: 64, label: 'Process Return', checked: false },
  { id: 65, label: 'View Return List', checked: false },
  { id: 66, label: 'Pay Due Amount', checked: false },
  { id: 67, label: 'View Payment Details', checked: false },
  { id: 68, label: 'Site Setting', checked: false },
  { id: 69, label: 'Change Password', checked: false },
  { id: 70, label: 'Add New Expense', checked: false },
  { id: 71, label: 'Add New Expense Category', checked: false },
  { id: 72, label: 'Expenses List', checked: false },
  { id: 73, label: 'Expenses Category List', checked: false },
  { id: 74, label: 'Edit Expenses', checked: false },
  { id: 75, label: 'Delete Expenses', checked: false },
  { id: 76, label: 'Edit Expenses Category', checked: false },
  { id: 77, label: 'Delete Expenses Category', checked: false },
  { id: 78, label: 'Access Due Amount', checked: false },
  { id: 79, label: 'view sales report', checked: false },
  { id: 80, label: 'view item report', checked: false },
  { id: 81, label: 'view expenses report', checked: false },
  { id: 82, label: 'Change Site Setting', checked: false },
  { id: 83, label: 'Generate Stock Report', checked: false },
  { id: 84, label: 'InHouse_admin', checked: false },
  { id: 85, label: 'Add Mobile Items', checked: false },
  { id: 86, label: 'View Mobile Items', checked: false },
  { id: 87, label: 'Update Mobile Items', checked: false },
  { id: 88, label: 'Add Mobile IMEI', checked: false },
  { id: 89, label: 'Control Mobile Item Status', checked: false },
  { id: 90, label: 'Access Mobile Billing', checked: false },
  { id: 91, label: 'Access Mobile Section', checked: false },
  { id: 92, label: 'Finance Management', checked: false },
  { id: 93, label: 'Bank Management', checked: false },
  { id: 94, label: 'Bank Account Management', checked: false },
  { id: 95, label: 'Transactions Management', checked: false },
];

const EditRole = () => {
  const [roleName, setRoleName] = useState('manager');
  const [permissions, setPermissions] = useState(permissionsList);

  const handlePermissionChange = (id) => {
    setPermissions((prev) =>
      prev.map((perm) =>
        perm.id === id ? { ...perm, checked: !perm.checked } : perm
      )
    );
  };

  const handleSelectAll = () => {
    setPermissions((prev) => prev.map((perm) => ({ ...perm, checked: true })));
  };

  const handleDeselectAll = () => {
    setPermissions((prev) => prev.map((perm) => ({ ...perm, checked: false })));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    alert('Role updated!');
  };

  const handleReset = () => {
    setRoleName('manager');
    setPermissions(permissionsList);
  };

  return (
    <Layout>
      <div className="">
        <div className="px-12 py-5 max-sm:px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                <p className="inline-flex items-center text-sm font-medium text-gray-700 text-nowrap">Main Panel</p>
              </li>
              <li aria-current="page" className="inline-flex items-center">
                <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                </svg>
                <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2 text-nowrap">Update Role</p>
              </li>
            </ol>
          </nav>
        </div>

        <div className="p-6">
          <div className="flex flex-col flex-grow h-full p-6 border-2 rounded-lg">
            <form onSubmit={handleSubmit} onReset={handleReset}>
              {/* Role Name */}
              <div>
                <label htmlFor="role" className="block mb-2 text-sm font-medium text-black">Role Name</label>
                <input
                  id="role"
                  name="role"
                  type="text"
                  value={roleName}
                  onChange={e => setRoleName(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Enter role name"
                />
              </div>
              <br />

              {/* select, deselect all buttons */}
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-black">Permissions</label>
                <div className="flex gap-2">
                  <button type="button" onClick={handleSelectAll} className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700">Select All</button>
                  <button type="button" onClick={handleDeselectAll} className="px-4 py-2 text-sm text-white bg-gray-600 rounded-lg hover:bg-gray-700">Deselect All</button>
                </div>
              </div>

              {/* Permissions Checkboxes */}
              <div className="grid gap-6 mb-6 md:grid-cols-5 max-md:grid-cols-3 max-sm:grid-cols-1">
                {permissions.map((perm) => (
                  <div className="flex items-center me-4" key={perm.id}>
                    <input
                      id={`permission-${perm.id}`}
                      type="checkbox"
                      name="permissions[]"
                      value={perm.id}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      checked={perm.checked}
                      onChange={() => handlePermissionChange(perm.id)}
                    />
                    <label htmlFor={`permission-${perm.id}`} className="text-sm font-medium text-gray-900 ms-2">{perm.label}</label>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-center w-full gap-4 max-sm:flex-col max-sm:p-0">
                <button type="submit" className="py-3 px-6 bg-[#029ED9] text-white rounded-lg">Update</button>
                <button type="reset" className="px-6 py-3 text-white bg-black rounded-lg">Reset</button>
                <button type="button" className="px-6 py-3 text-white bg-red-600 rounded-lg" onClick={() => window.location.href='/users/rolesList'}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditRole;