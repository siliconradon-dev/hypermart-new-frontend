import React, { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '../../../components/Layout';
import './SupplierList.css';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const columnDefinitions = [
  { key: 'supplierCode', label: 'Supplier Code' },
  { key: 'supplierName', label: 'Supplier Name' },
  { key: 'mobileNumber', label: 'Mobile Number' },
  { key: 'emailAddress', label: 'Email Address' },
  { key: 'address', label: 'Address' },
  { key: 'manage', label: 'Manage' },
];

const SupplierList = () => {
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState('30');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    supplierCode: true,
    supplierName: true,
    mobileNumber: true,
    emailAddress: true,
    address: true,
    manage: true,
  });
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [totalCount, setTotalCount] = useState(0);

  const normalizeRow = (supplier) => {
    const statusId = Number(supplier?.status_id) || 1;
    const isActive = statusId === 1;

    return {
      id: supplier.id,
      supplierCode: String(supplier.id),
      supplierName: supplier.supplier_name || '',
      mobileNumber: supplier.contact_number || '',
      emailAddress: supplier.email || '',
      address: supplier.address || '',
      userId: supplier.user_id ? String(supplier.user_id) : '',
      cityId: supplier.city_id ? String(supplier.city_id) : '',
      statusId: String(statusId),
      cityName: supplier.city_name || '',
      statusButtonLabel: isActive ? 'Deactivate' : 'Activate',
      statusButtonClass: isActive ? 'bg-green-600' : 'bg-red-600',
    };
  };

  const fetchSuppliers = async (pageArg = page, entriesArg = entries, searchArg = searchTerm) => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem('user');
      window.location.assign('/');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const limit = Number.parseInt(entriesArg, 10);
      const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 30;
      const safePage = Math.max(1, Number(pageArg) || 1);
      const offset = (safePage - 1) * safeLimit;
      const search = searchArg.trim();
      const qs = new URLSearchParams();
      qs.set('limit', String(safeLimit));
      qs.set('offset', String(offset));
      if (search) qs.set('search', search);

      const resp = await fetch(`/api/suppliers?${qs.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await resp.json().catch(() => ({}));

      if (resp.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.assign('/');
        return;
      }

      if (!resp.ok) {
        setError(data?.error || 'Failed to load suppliers.');
        setRows([]);
        setTotalCount(0);
        return;
      }

      const nextRows = Array.isArray(data?.suppliers) ? data.suppliers.map(normalizeRow) : [];
      setRows(nextRows);
      setTotalCount(Number(data?.totalCount) || 0);
    } catch {
      setError('Network error. Please try again.');
      setRows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers(page, entries, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, entries]);

  // Pagination calculations
  const safeEntries = Math.max(1, Number(entries) || 30);
  const totalPages = Math.max(1, Math.ceil(totalCount / safeEntries));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = totalCount === 0 ? 0 : (safePage - 1) * safeEntries + 1;
  const endIndex = totalCount === 0 ? 0 : Math.min((safePage - 1) * safeEntries + rows.length, totalCount);
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxButtons = 5;
    const last = totalPages;
    const current = safePage;
    let start = Math.max(1, current - Math.floor(maxButtons / 2));
    let end = Math.min(last, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    for (let p = start; p <= end; p += 1) pages.push(p);
    return pages;
  }, [safePage, totalPages]);

  const toggleColumn = (key) => {
    setVisibleColumns((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };


  const exportTableRows = () => {
    const header = columnDefinitions.map((column) => column.label).join('\t');
    const body = rows
      .map((row) => [row.supplierCode, row.supplierName, row.mobileNumber, row.emailAddress, row.address, row.statusButtonLabel].join('\t'))
      .join('\n');
    return `${header}\n${body}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportTableRows());
      window.alert('Table data copied to clipboard in a structured format!');
    } catch (error) {
      window.alert('Failed to copy table data.');
    }
  };

  const handleCsvExport = () => {
    const csvContent = [
      columnDefinitions.map((column) => column.label).join(','),
      ...rows.map((row) => [row.supplierCode, row.supplierName, row.mobileNumber, row.emailAddress, row.address, row.statusButtonLabel].join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'suppliers.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExcelExport = () => {
    const workbookData = [
      columnDefinitions.map((column) => column.label),
      ...rows.map((row) => [row.supplierCode, row.supplierName, row.mobileNumber, row.emailAddress, row.address, row.statusButtonLabel]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(workbookData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Suppliers');
    XLSX.writeFile(workbook, 'suppliers.xlsx');
  };

  const handlePdfExport = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [columnDefinitions.map((column) => column.label)],
      body: rows.map((row) => [row.supplierCode, row.supplierName, row.mobileNumber, row.emailAddress, row.address, row.statusButtonLabel]),
    });
    doc.save('supplier.pdf');
  };

  const handleEditSupplier = (e, supplierId) => {
    e.preventDefault();
    navigate(`/suppliers/edit_supplier?id=${supplierId}`);
  };

  const handleToggleStatus = async (supplierId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem('user');
      window.location.assign('/');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const resp = await fetch(`/api/suppliers/${supplierId}/toggle-status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await resp.json().catch(() => ({}));

      if (resp.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.assign('/');
        return;
      }

      if (!resp.ok) {
        setError(data?.error || 'Failed to update status.');
        return;
      }

      const updated = data?.supplier ? normalizeRow(data.supplier) : null;
      if (updated) {
        setRows((current) => current.map((r) => (r.id === supplierId ? updated : r)));
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSupplier = (supplierId) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      window.alert(`Delete supplier ${supplierId} is not wired in the React demo.`);
    }
  };

  const handleSearch = () => {
    setPage(1);
    setPageInput('1');
    fetchSuppliers(1, entries, searchTerm);
  };

  return (
    <Layout>
      <div className="supplier-list-page flex flex-col flex-grow">
        {loading && (
          <div id="loading-overlay" className="loading-overlay">
            <div className="text-center">
              <div className="spinner" />
            </div>
          </div>
        )}

        {error && (
          <div className="px-12 max-sm:px-6">
            <div className="mb-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          </div>
        )}

        <div className="flex flex-col grow">
          <div className="px-12 py-5 max-sm:px-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <p className="inline-flex items-center text-sm font-medium text-gray-700">
                    <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 1 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    Main Panel
                  </p>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Suppliers</p>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Suppliers List</p>
                  </div>
                </li>
              </ol>

              <div className="flex items-center justify-end w-full gap-3 px-12 py-5 max-sm:px-6 max-md:flex-col">
                <span className="flex flex-wrap gap-2 w-fit max-md:w-full max-md:justify-center">
                  <button id="copyButton" type="button" className="px-4 py-2 text-white bg-[#3c8c2c] rounded-lg max-sm:px-2 max-sm:py-1" onClick={handleCopy}>Copy</button>
                  <button type="button" className="px-4 py-2 text-white bg-[#3c8c2c] rounded-lg max-sm:px-2 max-sm:py-1" onClick={handleCsvExport}>CSV</button>
                  <button type="button" className="px-4 py-2 text-white bg-[#3c8c2c] rounded-lg max-sm:px-2 max-sm:py-1" onClick={handleExcelExport}>Excel</button>
                  <button type="button" className="px-4 py-2 text-white bg-[#3c8c2c] rounded-lg max-sm:px-2 max-sm:py-1" onClick={handlePdfExport}>PDF</button>
                  <div className="relative">
                    <button
                      type="button"
                      className="px-4 py-2 text-white bg-[#3c8c2c] rounded-lg"
                      onClick={() => setIsPopoverOpen((current) => !current)}
                    >
                      Column Visibility
                    </button>
                    <div
                      id="popover-click"
                      role="tooltip"
                      className={`absolute z-10 inline-block text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm w-fit column-popover ${isPopoverOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'}`}
                    >
                      <ul className="flex flex-col w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
                        {columnDefinitions.map((column) => (
                          <li key={column.key}>
                            <input id={`filter_${column.key}`} type="checkbox" checked={visibleColumns[column.key]} onChange={() => toggleColumn(column.key)} className="hidden peer" />
                            <label htmlFor={`filter_${column.key}`} className="flex w-full px-4 py-2 border-b border-gray-200 select-none peer-checked:bg-blue-300"> {column.label} </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </span>
              </div>
            </nav>
          </div>

          <div className="flex items-center justify-between w-full gap-3 px-12 py-5 max-sm:px-6 max-md:flex-col">
            <div className="flex items-center w-1/2 gap-3 max-md:w-full">
              <label htmlFor="search_cat">Search</label>
              <input
                type="text"
                id="search_cat"
                className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter supplier name"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <button type="button" onClick={handleSearch} className="py-2 px-4 bg-[#3c8c2c] text-white rounded-lg">Search</button>
            </div>

            <span className="flex items-center gap-3 w-fit max-md:w-full">
              Show
              <input
                type="number"
                id="col_num"
                className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="30"
                min="1"
                value={entries}
                onChange={(event) => setEntries(event.target.value)}
              />
              Entries
            </span>
          </div>

          <div className="flex flex-col flex-grow px-12 py-5 bg-white max-sm:px-6 max-lg:min-h-full">
            <div className="relative overflow-x-auto">
              <table ref={tableRef} id="suppliersTable" className="w-full text-sm text-left text-gray-500 rtl:text-right">
                <thead className="text-xs text-white uppercase bg-[#3c8c2c]">
                  <tr>
                    <th scope="col" className="px-4 py-2 rounded-tl-lg">#</th>
                    <th scope="col" className={`px-4 py-2 ${visibleColumns.supplierCode ? '' : 'hidden'}`}>Supplier Code</th>
                    <th scope="col" className={`px-4 py-2 ${visibleColumns.supplierName ? '' : 'hidden'}`}>Supplier Name</th>
                    <th scope="col" className={`px-4 py-2 ${visibleColumns.mobileNumber ? '' : 'hidden'}`}>Mobile Number</th>
                    <th scope="col" className={`px-4 py-2 ${visibleColumns.emailAddress ? '' : 'hidden'}`}>Email Address</th>
                    <th scope="col" className={`px-4 py-2 ${visibleColumns.address ? '' : 'hidden'}`}>Address</th>
                    <th scope="col" className="hidden px-4 py-2">User ID</th>
                    <th scope="col" className="hidden px-4 py-2">City ID</th>
                    <th scope="col" className="hidden px-4 py-2">Status ID</th>
                    <th scope="col" className="hidden px-4 py-2">City Name</th>
                    <th scope="col" className={`px-4 py-2 rounded-tr-lg ${visibleColumns.manage ? '' : 'hidden'}`}>Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.id} className="text-black bg-white border border-gray-200">
                      <td className="px-4 py-2 font-medium whitespace-nowrap">{startIndex + index}</td>
                      <td className={`px-4 py-2 ${visibleColumns.supplierCode ? '' : 'hidden'}`}>{row.supplierCode}</td>
                      <td className={`px-4 py-2 ${visibleColumns.supplierName ? '' : 'hidden'}`}>{row.supplierName}</td>
                      <td className={`px-4 py-2 ${visibleColumns.mobileNumber ? '' : 'hidden'}`}>{row.mobileNumber}</td>
                      <td className={`px-4 py-2 ${visibleColumns.emailAddress ? '' : 'hidden'}`}>{row.emailAddress}</td>
                      <td className={`px-4 py-2 ${visibleColumns.address ? '' : 'hidden'}`}>{row.address}</td>
                      <td className="hidden px-4 py-2">{row.userId}</td>
                      <td className="hidden px-4 py-2">{row.cityId}</td>
                      <td className="hidden px-4 py-2">{row.statusId}</td>
                      <td className="hidden px-4 py-2">{row.cityName}</td>
                      <td className={`px-4 py-2 ${visibleColumns.manage ? '' : 'hidden'}`}> 
                        <button type="button" className="p-2 border border-gray-300 rounded-md" onClick={(e) => handleEditSupplier(e, row.id)}>Edit</button>
                        <button
                          id={`status-button-${row.id}`}
                          type="button"
                          className={`p-2 text-white border border-gray-300 rounded-md ${row.statusButtonClass}`}
                          onClick={() => handleToggleStatus(row.id)}
                        >
                          {row.statusButtonLabel}
                        </button>
                        <button type="button" className="hidden p-2 text-white bg-red-600 border border-gray-300 rounded-md" onClick={() => handleDeleteSupplier(row.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination - Below the table */}
            <div className="flex justify-center p-1 mt-1 mb-6 bg-white">
              <div className="pagination" style={{ width: '100%', margin: '0px 50px' }}>
                <nav role="navigation" aria-label="Pagination Navigation" className="flex items-center justify-between">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between w-full">
                    <div>
                      <p className="text-sm leading-5 text-gray-700">
                        Showing <span className="font-medium">{startIndex}</span> to <span className="font-medium">{endIndex}</span> of <span className="font-medium">{totalCount}</span> results
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-end gap-3 mb-2">
                        <label className="text-sm text-gray-700">Entries</label>
                        <select
                          className="p-2 text-sm border border-gray-300 rounded bg-white"
                          value={entries}
                          onChange={e => {
                            setEntries(e.target.value);
                            setPage(1);
                            setPageInput('1');
                          }}
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={30}>30</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                        <label className="text-sm text-gray-700 ml-2">Page</label>
                        <input
                          type="number"
                          min={1}
                          className="w-20 p-2 text-sm border border-gray-300 rounded bg-white"
                          value={pageInput}
                          onChange={e => setPageInput(e.target.value)}
                        />
                        <button
                          type="button"
                          className="px-3 py-2 text-sm text-white bg-[#3c8c2c] rounded hover:bg-[#2d6e20]"
                          onClick={() => {
                            const next = Number(pageInput);
                            if (!Number.isFinite(next)) return;
                            const clamped = Math.min(Math.max(1, Math.trunc(next)), totalPages);
                            setPage(clamped);
                            setPageInput(String(clamped));
                          }}
                        >
                          Go
                        </button>
                      </div>
                      <span className="relative z-0 inline-flex rounded-md shadow-sm rtl:flex-row-reverse">
                        <button
                          type="button"
                          aria-label="&laquo; Previous"
                          disabled={safePage <= 1}
                          onClick={() => {
                            setPage(p => Math.max(1, p - 1));
                            setPageInput(p => String(Math.max(1, Number(p) - 1)));
                          }}
                          className={
                            `relative inline-flex items-center px-2 py-2 text-sm font-medium leading-5 border border-gray-300 rounded-l-md ` +
                            (safePage <= 1 ? 'text-gray-400 bg-white cursor-default' : 'text-gray-700 bg-white hover:bg-gray-50')
                          }
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {pageNumbers.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => {
                              setPage(p);
                              setPageInput(String(p));
                            }}
                            className={
                              `relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium leading-5 border ` +
                              (p === safePage
                                ? 'text-white bg-blue-600 border-blue-600 cursor-default'
                                : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50')
                            }
                            aria-label={`Go to page ${p}`}
                            disabled={p === safePage}
                          >
                            {p}
                          </button>
                        ))}
                        <button
                          type="button"
                          aria-label="Next &raquo;"
                          disabled={safePage >= totalPages}
                          onClick={() => {
                            setPage(p => Math.min(totalPages, p + 1));
                            setPageInput(p => String(Math.min(totalPages, Number(p) + 1)));
                          }}
                          className={
                            `relative inline-flex items-center px-2 py-2 -ml-px text-sm font-medium leading-5 border border-gray-300 rounded-r-md ` +
                            (safePage >= totalPages ? 'text-gray-400 bg-white cursor-default' : 'text-gray-700 bg-white hover:bg-gray-50')
                          }
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SupplierList;