
import React, { useEffect, useState, useRef } from 'react';
import Layout from '../../../components/Layout';
import './UserList.css';
import { useNavigate } from 'react-router-dom'; 

import * as XLSX from 'xlsx';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const allColumns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'gender', label: 'Gender' },
  { key: 'branch', label: 'Branch' },
  { key: 'status', label: 'Status' },
  { key: 'manage', label: 'Manage' },
];

const UserList = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState(30);
  const [users, setUsers] = useState([]);
  const [visibleCols, setVisibleCols] = useState(allColumns.map(col => col.key));
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef(null);

  // Load users from database (no static/mock data)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUsers([]);
      return;
    }

    fetch('/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'Failed to load users');
        return data;
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.users || []);
        setUsers(list);
      })
      .catch(() => setUsers([]));
  }, []);

  // Filtered users by search
  const filteredUsers = users
    .filter((user) => {
      const name = (user?.name || '').toLowerCase();
      const email = (user?.email || '').toLowerCase();
      const q = search.toLowerCase();
      return name.includes(q) || email.includes(q);
    })
    .slice(0, entries);

  const handleEdit = (e) => {
    e.preventDefault();
    navigate(`/users/edit_users`);
  };

  



  // Copy to clipboard
  const handleCopy = () => {
    let data = '';
    filteredUsers.forEach((user, idx) => {
      let row = [idx + 1];
      allColumns.forEach(col => {
        if (col.key !== 'manage' && visibleCols.includes(col.key)) row.push(user[col.key]);
      });
      data += row.join('\t') + '\n';
    });
    navigator.clipboard.writeText(data).then(() => {
      alert('Table data copied to clipboard!');
    });
  };

  // Export CSV
  const handleCSV = () => {
    let csv = '';
    csv += ['#', ...allColumns.filter(col => col.key !== 'manage' && visibleCols.includes(col.key)).map(col => col.label)].join(',') + '\n';
    filteredUsers.forEach((user, idx) => {
      let row = [idx + 1];
      allColumns.forEach(col => {
        if (col.key !== 'manage' && visibleCols.includes(col.key)) row.push(user[col.key]);
      });
      csv += row.join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'userTable.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Excel
  const handleExcel = () => {
    const wsData = [
      ['#', ...allColumns.filter(col => col.key !== 'manage' && visibleCols.includes(col.key)).map(col => col.label)],
      ...filteredUsers.map((user, idx) => [
        idx + 1,
        ...allColumns.filter(col => col.key !== 'manage' && visibleCols.includes(col.key)).map(col => user[col.key])
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'userTable.xlsx');
  };

  // Export PDF
  const handlePDF = () => {
    const doc = new jsPDF();
    const head = [['#', ...allColumns.filter(col => col.key !== 'manage' && visibleCols.includes(col.key)).map(col => col.label)]];
    const body = filteredUsers.map((user, idx) => [
      idx + 1,
      ...allColumns.filter(col => col.key !== 'manage' && visibleCols.includes(col.key)).map(col => user[col.key])
    ]);
    autoTable(doc, { head, body });
    doc.save('userTable.pdf');
  };

  // Column visibility
  const handleColToggle = (key) => {
    setVisibleCols((prev) =>
      prev.includes(key)
        ? prev.filter((col) => col !== key)
        : [...prev, key]
    );
  };

  return (
    <Layout>
      <div className="h-[90vh] max-lg:h-[92vh] flex flex-col grow bg-white">
        {/* Breadcrumbs and controls */}
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
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2 text-nowrap">Users List</p>
                </div>
              </li>
            </ol>
            {/* Controls */}
            <div className="flex items-center justify-end w-full gap-2 px-6 py-3 max-sm:px-6 max-md:flex-col">
              <span className="w-fit max-md:w-full max-md:justify-center flex gap-2 max-sm:gap-1 max-[350px]:scale-75 relative">
                <button className="px-3 py-3 text-xs text-white bg-[#3c8c2c] rounded-sm max-sm:px-2 max-sm:py-1" onClick={handleCopy}>Copy</button>
                <button className="px-3 py-3 text-xs text-white bg-[#3c8c2c] rounded-sm max-sm:px-2 max-sm:py-1" onClick={handleCSV}>CSV</button>
                <button className="px-3 py-3 text-xs text-white bg-[#3c8c2c] rounded-sm max-sm:px-2 max-sm:py-1" onClick={handleExcel}>Excel</button>
                <button className="px-3 py-3 text-xs text-white bg-[#3c8c2c] rounded-sm max-sm:px-2 max-sm:py-1" onClick={handlePDF}>PDF</button>
                <button type="button" className="px-3 py-1.5 text-white bg-[#3c8c2c] rounded-sm text-xs" onClick={() => setPopoverOpen((v) => !v)}>Column Visibility</button>
                {popoverOpen && (
                  <div ref={popoverRef} className="absolute z-10 right-0 mt-2 w-fit bg-white border border-gray-200 rounded-lg shadow-sm p-0 animate-fade-in" style={{ top: '110%' }}>
                    <ul className="flex flex-col w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg overflow-hidden">
                      {allColumns.map((col, i) => {
                        const checked = visibleCols.includes(col.key);
                        return (
                          <li key={col.key} className="w-full">
                            <input
                              id={`filter_${col.key}`}
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleColToggle(col.key)}
                              className="hidden peer"
                            />
                            <label
                              htmlFor={`filter_${col.key}`}
                              className={
                                `flex w-full px-3 py-1.5 select-none cursor-pointer border-b border-gray-200 ` +
                                (i === 0 ? 'rounded-t-lg ' : '') +
                                (i === allColumns.length - 1 ? 'rounded-b-lg border-b-0 ' : '') +
                                'peer-checked:bg-blue-300 transition-all'
                              }
                              style={{ userSelect: 'none' }}
                            >
                              {col.label}
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </span>
            </div>
          </nav>
        </div>
        {/* Search and entries */}
        <div className="flex items-center w-1/2 gap-2 px-6 py-3 max-sm:px-3 max-md:w-full">
          <label htmlFor="search_cat" className="text-sm">Search</label>
          <input type="text" id="search_cat" value={search} onChange={e => setSearch(e.target.value)} className="block w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter User name" required />
          <button className="py-3 px-4 bg-[#3c8c2c] text-white rounded-lg text-xs">Search</button>
          <span className="flex items-center gap-2 w-fit max-md:w-full">
            <input type="number" id="col_num" value={entries} onChange={e => setEntries(Number(e.target.value))} className="block w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="30" min="1" required />
            Entries
          </span>
        </div>
        {/* Table */}
        <div className="flex flex-col flex-grow px-12 py-5 overflow-y-auto bg-white max-sm:px-6 max-lg:min-h-full">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 rtl:text-right">
              <thead className="text-xs text-white uppercase bg-[#3c8c2c]">
                <tr>
                  <th className="px-4 py-2 rounded-tl-lg">#</th>
                  {allColumns.map((col, idx) =>
                    col.key !== 'manage' && visibleCols.includes(col.key) ? (
                      <th key={col.key} className={
                        `px-4 py-2` +
                        (idx === allColumns.length - 2 ? ' rounded-tr-lg' : '')
                      }>{col.label}</th>
                    ) : null
                  )}
                  {visibleCols.includes('manage') && <th className="px-4 py-2 rounded-tr-lg">Manage</th>}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => (
                  <tr key={user.id} className="text-black bg-white border-2">
                    <td className="px-4 py-2 font-medium whitespace-nowrap">{idx + 1}</td>
                    {allColumns.map(col =>
                      col.key !== 'manage' && visibleCols.includes(col.key) ? (
                        <td key={col.key} className="px-4 py-2">{user[col.key]}</td>
                      ) : null
                    )}
                    {visibleCols.includes('manage') && (
                      <td className="px-4 py-2 flex gap-2">
                        <button className="p-2 border-2 rounded-lg" onClick={handleEdit} >Edit</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </Layout>
  );
};

export default UserList;