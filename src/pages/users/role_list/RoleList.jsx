

import React, { useState } from 'react';
import Layout from '../../../components/Layout';
import './RoleList.css';
import { exportCopy, exportCSV, exportExcel, exportPDF } from './exportUtils';
import { useNavigate } from 'react-router-dom'; 

const mockRoles = [
  {
    id: 1,
    role_name: 'admin',
    salary_type: 'hourly',
    hourly_wage: '0.00',
    monthly_salary: '-',
    permission_count: 80,
    data: {
      
      id: 1,
      role_name: 'admin',
      hourly_wage: '0.00',
      salary_type: 'hourly',
      monthly_salary: null,
      daily_rate: null,
      no_pay_rate: '0.00',
      allowance: '0.00',
      ot_included: false,
      ot_rate: null,
      double_ot_rate: null,
      triple_ot_rate: null,
      epf_enabled: false,
    },
  },
  {
    id: 2,
    role_name: 'manager',
    salary_type: 'hourly',
    hourly_wage: '0.00',
    monthly_salary: '-',
    permission_count: 26,
    data: {
      id: 2,
      role_name: 'manager',
      hourly_wage: '0.00',
      salary_type: 'hourly',
      monthly_salary: null,
      daily_rate: null,
      no_pay_rate: '0.00',
      allowance: '0.00',
      ot_included: false,
      ot_rate: null,
      double_ot_rate: null,
      triple_ot_rate: null,
      epf_enabled: false,
    },
  },
  {
    id: 3,
    role_name: 'Super Admin',
    salary_type: 'hourly',
    hourly_wage: '0.00',
    monthly_salary: '-',
    permission_count: 80,
    data: {
      id: 3,
      role_name: 'Super Admin',
      hourly_wage: '0.00',
      salary_type: 'hourly',
      monthly_salary: null,
      daily_rate: null,
      no_pay_rate: '0.00',
      allowance: '0.00',
      ot_included: false,
      ot_rate: null,
      double_ot_rate: null,
      triple_ot_rate: null,
      epf_enabled: false,
    },
  },
];

const columns = [
  { key: 'id', label: '#' },
  { key: 'role_name', label: 'Role' },
  { key: 'salary_type', label: 'Salary Type' },
  { key: 'hourly_wage', label: 'Hourly Wage (LKR)' },
  { key: 'monthly_salary', label: 'Monthly Salary (LKR)' },
  { key: 'permission_count', label: 'Permission Count' },
  { key: 'manage', label: 'Manage' },
];

const RoleList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState(30);
  const [showModal, setShowModal] = useState(false);
  const [modalRole, setModalRole] = useState(null);
  const handleManagePermissions = (e) =>{
    e.preventDefault();
    navigate('/users/edit_role');
  }

  // Local state for modal fields (for OT toggle)
  const [modalFields, setModalFields] = useState(null);
  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    role_name: true,
    salary_type: true,
    hourly_wage: true,
    monthly_salary: true,
    permission_count: true,
    manage: true,
  });

  const handleSearch = (e) => setSearch(e.target.value);
  const handleEntries = (e) => setEntries(Number(e.target.value) || 30);
  const handleColumnToggle = (key) => {
    setColumnVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const openSalaryModal = (role) => {
    setModalRole(role);
    setModalFields({ ...role });
    setShowModal(true);
  };
  const closeSalaryModal = () => {
    setShowModal(false);
    setModalRole(null);
    setModalFields(null);
  };

  // Filtered and paginated roles
  const filteredRoles = mockRoles.filter((role) =>
    role.role_name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, entries);



  return (
    <Layout>
      <div className="h-[90vh] max-lg:h-[92vh] flex flex-col grow overflow-y-hidden">
        {/* Breadcrumbs and controls */}
        <div className="px-12 py-5 max-sm:px-6">
          <div className="flex flex-row items-center w-full flex-nowrap">
            <nav className="flex flex-row items-center flex-nowrap" aria-label="Breadcrumb">
              <ol className="flex flex-row flex-nowrap items-center space-x-1 md:space-x-2 rtl:space-x-reverse whitespace-nowrap">
                <li className="flex flex-row items-center flex-nowrap whitespace-nowrap">
                  <span className="inline-flex items-center text-sm font-medium text-gray-700 text-nowrap">
                    <svg className="w-3 h-3 me-2.5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"><path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" /></svg>
                    Main Panel
                  </span>
                </li>
                <li className="flex flex-row items-center flex-nowrap whitespace-nowrap">
                  <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" /></svg>
                  <span className="text-sm font-medium text-gray-700 ms-1 md:ms-2 text-nowrap">Users</span>
                </li>
                <li className="flex flex-row items-center flex-nowrap whitespace-nowrap" aria-current="page">
                  <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" /></svg>
                  <span className="text-sm font-medium text-gray-700 ms-1 md:ms-2 text-nowrap">Role List</span>
                </li>
              </ol>
            </nav>
            {/* Controls */}
            <div className="flex items-center justify-end gap-1 px-4 py-2 flex-nowrap">
              <span className="w-fit flex gap-1 max-sm:gap-1 max-[350px]:scale-75">
                {/* Copy, CSV, Excel, PDF buttons (no-op) */}
                <button className="inline-block px-4 py-1 text-[16px] text-white bg-[#3c8c2c] rounded-md font-medium" onClick={() => exportCopy(columns, filteredRoles, columnVisibility)}>Copy</button>
                <button className="inline-block px-4 py-1 text-[16px] text-white bg-[#3c8c2c] rounded-md font-medium" onClick={() => exportCSV(columns, filteredRoles, columnVisibility)}>CSV</button>
                <button className="inline-block px-4 py-1 text-[16px] text-white bg-[#3c8c2c] rounded-md font-medium" onClick={() => exportExcel(columns, filteredRoles, columnVisibility)}>Excel</button>
                <button className="inline-block px-4 py-1 text-[16px] text-white bg-[#3c8c2c] rounded-md font-medium" onClick={() => exportPDF(columns, filteredRoles, columnVisibility)}>PDF</button>
                {/* Column Visibility Popover */}
                <div className="relative inline-block">
                  <button type="button" className="inline-block px-4 py-1 text-[16px] text-white bg-[#3c8c2c] rounded-md font-medium" onClick={() => setColumnVisibility((v) => ({ ...v, _popover: !v._popover }))}>Column Visibility</button>
                  {columnVisibility._popover && (
                    <div className="absolute z-10 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm w-fit mt-2">
                      <ul className="flex flex-col w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
                        {columns.map((col) => col.key !== '_popover' && (
                          <li key={col.key}>
                            <input id={`filter_${col.key}`} type="checkbox" checked={columnVisibility[col.key]} onChange={() => handleColumnToggle(col.key)} className="hidden peer" />
                            <label htmlFor={`filter_${col.key}`} className="flex w-full px-2 py-1 border-b border-gray-200 select-none peer-checked:bg-blue-300 cursor-pointer">
                              {col.label}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </span>
            </div>
          </div>
        </div>

        {/* Search and entries */}
        <div className="flex items-center w-1/2 gap-2 px-12 max-md:px-6 py-3 max-md:w-full">
          <label htmlFor="search_item" className="text-sm">Search</label>
          <input type="text" id="search_item" value={search} onChange={handleSearch}
            className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter role name" />
          <span className="flex items-center gap-2 w-fit max-md:w-full">
            <input type="number" id="col_num" value={entries} onChange={handleEntries}
              className="block w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="30" min="1" />
            Entries
          </span>
        </div>

        {/* Table */}
        <div className="flex flex-col flex-grow px-12 py-5 max-sm:px-6 max-lg:min-h-full overflow-y-hidden">
          <span></span>
          <div className="relative overflow-x-auto">
            <table id="RoleTable" className="w-full text-sm text-left text-gray-500 rtl:text-right">
              <thead className="text-xs text-white uppercase bg-[#3c8c2c]">
                <tr>
                  {columns.map((col) =>
                    columnVisibility[col.key] && (
                      <th key={col.key} scope="col" className={`px-3 py-2 ${col.key === 'id' ? 'rounded-tl-lg' : ''} ${col.key === 'manage' ? 'rounded-tr-lg text-end' : ''}`}>{col.label}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((role, idx) => (
                  <tr key={role.id} className="text-black bg-white border-2">
                    {columnVisibility.id && <td className="px-3 py-2 font-medium whitespace-nowrap">{idx + 1}</td>}
                    {columnVisibility.role_name && <td className="px-3 py-2">{role.role_name}</td>}
                    {columnVisibility.salary_type && <td className="px-3 py-2"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{role.salary_type.charAt(0).toUpperCase() + role.salary_type.slice(1)}</span></td>}
                    {columnVisibility.hourly_wage && <td className="px-3 py-2">{role.hourly_wage}</td>}
                    {columnVisibility.monthly_salary && <td className="px-3 py-2">{role.monthly_salary}</td>}
                    {columnVisibility.permission_count && <td className="px-3 py-2 text-center">{role.permission_count}</td>}
                    {columnVisibility.manage && (
                      <td className="px-3 py-2 text-end">
                        <button className="p-2 mr-2 text-white bg-blue-600 border-2 rounded-lg" onClick={() => openSalaryModal(role.data)}>Salary Settings</button>
                        <button className="p-2 border-2 rounded-lg" onClick={handleManagePermissions} >Manage Permissions</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Salary Modal */}
        {showModal && modalRole && modalFields && (
          <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative w-full max-w-2xl max-h-full p-4">
              <div className="relative bg-white rounded-lg shadow">
                <div className="flex items-center justify-between p-4 border-b rounded-t md:p-5">
                  <h3 className="text-xl font-semibold text-gray-900">Salary Settings: <span>{modalFields.role_name}</span></h3>
                  <button type="button" className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900" onClick={closeSalaryModal}>
                    <svg className="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" /></svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="p-4 space-y-4 md:p-5 max-h-[70vh] overflow-y-auto">
                  {/* Salary Type Selection */}
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Salary Type</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input type="radio" name="salary_type" value="hourly" checked={modalRole.salary_type === 'hourly'} readOnly className="w-4 h-4 text-blue-600" />
                        <span className="ml-2 text-sm font-medium text-gray-900">Hourly Rate</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="salary_type" value="monthly" checked={modalRole.salary_type === 'monthly'} readOnly className="w-4 h-4 text-blue-600" />
                        <span className="ml-2 text-sm font-medium text-gray-900">Monthly Salary</span>
                      </label>
                    </div>
                  </div>
                  {/* Hourly Rate Section */}
                  {modalFields.salary_type === 'hourly' && (
                    <div id="hourlySection" className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <h4 className="mb-3 text-sm font-semibold text-gray-900">Hourly Rate Configuration</h4>
                      <div className="mb-3">
                        <label htmlFor="hourly_wage" className="block mb-2 text-sm font-medium text-gray-900">Hourly Wage (LKR)</label>
                        <input type="number" id="hourly_wage" step="0.01" min="0" value={modalFields.hourly_wage} readOnly className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="0.00" />
                      </div>
                    </div>
                  )}
                  {/* Monthly Salary Section */}
                  {modalFields.salary_type === 'monthly' && (
                    <div id="monthlySection" className="p-4 border border-green-200 rounded-lg bg-green-50">
                      <h4 className="mb-3 text-sm font-semibold text-gray-900">Monthly Salary Configuration</h4>
                      <div className="mb-3">
                        <label htmlFor="monthly_salary" className="block mb-2 text-sm font-medium text-gray-900">Monthly Basic Salary (LKR)</label>
                        <input type="number" id="monthly_salary" step="0.01" min="0" value={modalFields.monthly_salary || ''} readOnly className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="0.00" />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="daily_rate" className="block mb-2 text-sm font-medium text-gray-900">Daily Rate (LKR) <span className="text-xs text-gray-500">(Auto-calculated: Monthly ÷ 30)</span></label>
                        <input type="number" id="daily_rate" step="0.01" min="0" value={modalFields.daily_rate || ''} readOnly className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="allowance" className="block mb-2 text-sm font-medium text-gray-900">Monthly Allowance (LKR) <span className="text-xs text-gray-500">(Transportation, meals, etc.)</span></label>
                        <input type="number" id="allowance" step="0.01" min="0" value={modalFields.allowance || ''} readOnly className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="0.00" />
                        <p className="mt-1 text-xs text-gray-500">This allowance will be added to the monthly salary</p>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="no_pay_rate" className="block mb-2 text-sm font-medium text-gray-900">No Pay Rate (LKR/day) <span className="text-xs text-gray-500">(Deduction per absent day)</span></label>
                        <input type="number" id="no_pay_rate" step="0.01" min="0" value={modalFields.no_pay_rate || ''} readOnly className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus-border-blue-500 block w-full p-2.5" placeholder="0.00" />
                        <p className="mt-1 text-xs text-gray-500">This amount will be deducted for each absent day (No Pay)</p>
                      </div>
                      {/* EPF/ETF Section */}
                      <div className="p-3 mt-4 border border-orange-200 rounded-lg bg-orange-50">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-semibold text-gray-900">EPF/ETF Deductions</h5>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="epf_enabled" checked={modalFields.epf_enabled} readOnly className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                            <span className="text-sm font-medium text-gray-900 ms-3">Enable EPF/ETF</span>
                          </label>
                        </div>
                        <div className="text-xs text-orange-800">
                          <p><strong>Employee Contribution:</strong> 0% of basic salary (deducted from salary)</p>
                          <p><strong>Employer Contribution:</strong> 0% EPF + 0% ETF = 0% (company pays)</p>
                          <p className="mt-1"><strong>Total:</strong> 0% of basic salary reported to government</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Overtime Settings */}
                  <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-900">Overtime Settings</h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="ot_included"
                          checked={modalFields.ot_included}
                          onChange={e => setModalFields(fields => ({ ...fields, ot_included: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="text-sm font-medium text-gray-900 ms-3">OT Included</span>
                      </label>
                    </div>
                    {modalFields.ot_included && (
                      <div id="otRatesSection" className="space-y-3">
                        <div>
                          <label htmlFor="ot_rate" className="block mb-2 text-sm font-medium text-gray-900">OT Rate (LKR/hour)</label>
                          <input type="number" id="ot_rate" step="0.01" min="0" value={modalFields.ot_rate || ''} readOnly className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="0.00" />
                        </div>
                        <div>
                          <label htmlFor="double_ot_rate" className="block mb-2 text-sm font-medium text-gray-900">Double OT Rate (LKR/hour)</label>
                          <input type="number" id="double_ot_rate" step="0.01" min="0" value={modalFields.double_ot_rate || ''} readOnly className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="0.00" />
                        </div>
                        <div>
                          <label htmlFor="triple_ot_rate" className="block mb-2 text-sm font-medium text-gray-900">Triple OT Rate (LKR/hour)</label>
                          <input type="number" id="triple_ot_rate" step="0.01" min="0" value={modalFields.triple_ot_rate || ''} readOnly className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="0.00" />
                        </div>
                        <div className="p-3 text-xs text-blue-800 rounded-lg bg-blue-100">
                          <strong>Tip:</strong> You can calculate hourly rate from daily price: Daily Price ÷ Hours Worked = Hourly Rate
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center p-4 border-t border-gray-200 rounded-b md:p-5">
                  <button type="button" onClick={closeSalaryModal} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RoleList;