import React, { useMemo, useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import '../../../assets/customer-pages.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

// Backend-to-frontend field mapping helper
const mapBackendCustomer = (c) => ({
  ...c,
  id: c.id ?? c.customer_id ?? c.rowid,
  customerCode: c.customer_code,
  customerName: c.customer_name,
  mobileNumber: c.contact_number,
  address: [c.address_line_1, c.address_line_2].filter(Boolean).join(', '),
  email: c.email,
  dueAmount: c.due_amount,
  userId: c.user_id,
  cityId: c.cities_id,
  statusId: c.status_id,
  cityName: c.city_name,
  active: c.status_id === 1,
});

const columns = [
  { key: 'customerCode', label: 'Customer Code' },
  { key: 'customerName', label: 'Customer Name' },
  { key: 'mobileNumber', label: 'Mobile Number' },
  { key: 'address', label: 'Address' },
  { key: 'email', label: 'Email' },
  { key: 'dueAmount', label: 'Due Amount', hidden: true },
  { key: 'userId', label: 'User ID', hidden: true },
  { key: 'cityId', label: 'City ID', hidden: true },
  { key: 'statusId', label: 'Status ID', hidden: true },
  { key: 'cityName', label: 'City Name', hidden: true },
];

const CustomerList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState(30);
  const [showPopover, setShowPopover] = useState(false);
  const [customers, setCustomers] = useState([]);
  
  // Fetch customers from backend on mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/customers', {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.customers)) {
          setCustomers(data.customers.map(mapBackendCustomer));
        } else {
          setCustomers([]);
        }
      } catch (err) {
        setCustomers([]);
      }
    };
    fetchCustomers();
  }, []);
  
  const [visibleColumns, setVisibleColumns] = useState(columns.map((column) => column.key));
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');

  // Pagination logic (frontend only)
  const totalPages = Math.max(1, Math.ceil(customers.length / entries));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  
  const filteredCustomers = useMemo(() => {
    // Filter and paginate
    const filtered = customers.filter((customer) => 
      customer.customerName.toLowerCase().includes(search.toLowerCase())
    );
    const start = (safePage - 1) * entries;
    return filtered.slice(start, start + entries);
  }, [customers, search, entries, safePage]);

  const totalFilteredCount = customers.filter((customer) => 
    customer.customerName.toLowerCase().includes(search.toLowerCase())
  ).length;
  
  const startIndex = totalFilteredCount === 0 ? 0 : (safePage - 1) * entries + 1;
  const endIndex = totalFilteredCount === 0 ? 0 : Math.min((safePage - 1) * entries + filteredCustomers.length, totalFilteredCount);
  
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

  const handleCopy = () => {
    const tableRows = [
      ['#', ...columns.filter((column) => visibleColumns.includes(column.key)).map((column) => column.label), 'Manage'],
      ...filteredCustomers.map((customer, index) => [
        index + 1,
        ...columns.filter((column) => visibleColumns.includes(column.key)).map((column) => customer[column.key]),
        'Edit / Disable / Transactions',
      ]),
    ];

    navigator.clipboard.writeText(tableRows.map((row) => row.join('\t')).join('\n'));
  };

  const handleCSV = () => {
    const csvRows = [
      ['#', ...columns.filter((column) => visibleColumns.includes(column.key)).map((column) => column.label), 'Manage'],
      ...filteredCustomers.map((customer, index) => [
        index + 1,
        ...columns.filter((column) => visibleColumns.includes(column.key)).map((column) => `"${String(customer[column.key] ?? '').replace(/"/g, '""')}"`),
        '"Edit / Disable / Transactions"',
      ]),
    ];

    const blob = new Blob(csvRows.map((row) => `${row.join(',')}\n`), { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'customers.csv';
    link.click();
  };

  const handleExcel = () => {
    const wsData = [
      ['#', ...columns.filter((column) => visibleColumns.includes(column.key)).map((column) => column.label), 'Manage'],
      ...filteredCustomers.map((customer, index) => [
        index + 1,
        ...columns.filter((column) => visibleColumns.includes(column.key)).map((column) => customer[column.key]),
        'Edit / Disable / Transactions',
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    XLSX.writeFile(workbook, 'customers.xlsx');
  };

  const handlePDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const head = [['#', ...columns.filter((column) => visibleColumns.includes(column.key)).map((column) => column.label), 'Manage']];
    const body = filteredCustomers.map((customer, index) => [
      index + 1,
      ...columns.filter((column) => visibleColumns.includes(column.key)).map((column) => customer[column.key]),
      'Edit / Disable / Transactions',
    ]);
    autoTable(doc, { head, body });
    doc.save('customers.pdf');
  };

  const toggleColumn = (key) => {
    setVisibleColumns((current) => (
      current.includes(key) ? current.filter((columnKey) => columnKey !== key) : [...current, key]
    ));
  };

  const updateCustomerStatus = (customerId, nextStatus) => {
    setCustomers((current) => current.map((customer) => (
      customer.id === customerId ? { ...customer, active: nextStatus === 'enable' } : customer
    )));
  };

  const handleEditButton = (e, customerId) => {
    e.preventDefault();
    if (!customerId || customerId === 'null' || customerId === 'undefined') return;
    navigate(`/customers/updateCustomer/${customerId}`);
  };

  const handleViewTransactions = (e, customerId) => {
    e.preventDefault();
    navigate(`/customers/transactions/history/${customerId}`);
  };

  const handleViewTransactionsLog = (e, customerId) => {
    e.preventDefault();
    navigate(`/customers/transaction-log/${customerId}`);
  };

  const handleViewBalanceTransactionsLog = (e, customerId) => {
    e.preventDefault();
    navigate(`/customers/balance-transaction-log/${customerId}`);
  };

  return (
    <Layout>
      <div className="customer-page customer-page-shell bg-white">
        <div className="customer-content flex flex-col grow bg-white">
          <div className="h-[90vh] max-lg:h-[92vh] flex flex-col grow bg-white">
            {/* Breadcrumbs - White background */}
            <div className="px-12 py-5 max-sm:px-6 bg-white">
              <nav className="flex flex-col items-center justify-between md:flex-row" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                  <li className="inline-flex items-center">
                    <p className="inline-flex items-center text-sm font-medium text-gray-700">
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
                      <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2 text-nowrap">Customers List</p>
                    </div>
                  </li>
                </ol>

                <div className="relative w-full md:w-auto">
                  <div className="flex items-center justify-end w-full gap-3 mt-4 md:mt-0 flex-wrap">
                    <button type="button" className="px-4 py-2 text-white bg-[#3c8c2c] rounded-lg max-sm:px-3 max-sm:py-1" onClick={handleCopy}>Copy</button>
                    <button type="button" className="px-4 py-2 text-white bg-[#3c8c2c] rounded-lg max-sm:px-3 max-sm:py-1" onClick={handleCSV}>CSV</button>
                    <button type="button" className="px-4 py-2 text-white bg-[#3c8c2c] rounded-lg max-sm:px-3 max-sm:py-1" onClick={handleExcel}>Excel</button>
                    <button type="button" className="px-4 py-2 text-white bg-[#3c8c2c] rounded-lg max-sm:px-3 max-sm:py-1" onClick={handlePDF}>PDF</button>
                    <button type="button" className="px-4 py-2 text-white bg-[#3c8c2c] rounded-lg" onClick={() => setShowPopover((value) => !value)}>
                      Column Visibility
                    </button>

                    {showPopover && (
                      <div className="customer-toolbar-popover" role="tooltip">
                        <ul className="flex flex-col w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg overflow-hidden">
                          {columns.map((column) => (
                            <li key={column.key} className="w-full">
                              <label className="customer-toolbar-popover-item">
                                <input
                                  type="checkbox"
                                  checked={visibleColumns.includes(column.key)}
                                  onChange={() => toggleColumn(column.key)}
                                />
                                {column.label}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </nav>
            </div>

            {/* Search and Entries section - White background */}
            <div className="flex items-center justify-between w-full gap-3 px-12 py-5 max-sm:px-6 max-md:flex-col bg-white">
              <div className="flex items-center w-1/2 gap-3 max-md:w-full">
                <label htmlFor="search_cat" className="text-gray-700">Search</label>
                <input
                  type="text"
                  id="search_cat"
                  className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter customer name"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  required
                />
                <button type="button" className="py-3 px-4 bg-[#3c8c2c] text-white rounded-lg hover:bg-[#2d6e20]" onClick={() => setPage(1)}>
                  Search
                </button>
              </div>
              <span className="flex items-center gap-3 w-fit max-md:w-full">
                <label className="text-gray-700">Show</label>
                <input
                  type="number"
                  id="col_num"
                  className="block w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="30"
                  min="1"
                  value={entries}
                  onChange={(event) => {
                    setEntries(Number(event.target.value || 30));
                    setPage(1);
                    setPageInput('1');
                  }}
                  required
                />
                <span className="text-gray-700">Entries</span>
              </span>
            </div>

            {/* Table section with sticky header */}
            <div className="flex flex-col flex-grow px-12 py-5 overflow-auto bg-white max-sm:px-6 max-lg:min-h-full">
              <div className="relative overflow-x-auto">
                <table id="customersTable" className="w-full text-sm text-left text-gray-500 rtl:text-right border-spacing-0">
                  <thead className="text-xs text-white uppercase bg-[#3c8c2c] sticky top-0 z-10">
                    <tr>
                      <th scope="col" className="px-4 py-2 rounded-tl-lg">#</th>
                      {columns.map((column) => (
                        <th key={column.key} scope="col" className={`${column.hidden ? 'hidden' : ''} px-4 py-2`}>
                          {column.label}
                        </th>
                      ))}
                      <th scope="col" className="px-4 py-2 rounded-tr-lg">Manage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer, index) => (
                      <tr key={customer.id} className="text-black bg-white border-b hover:bg-gray-50">
                        <td scope="row" className="px-4 py-2 font-medium whitespace-nowrap">{index + 1}</td>
                        {columns.map((column) => (
                          <td key={column.key} className={`${column.hidden ? 'hidden' : ''} px-4 py-2`}>
                            {customer[column.key]}
                          </td>
                        ))}
                        <td className="px-4 py-2 flex flex-wrap gap-3">
                          <button type="button" className="px-3 py-1 border rounded bg-white hover:bg-gray-50" onClick={(e) => handleEditButton(e, customer.id)}>Edit</button>
                          {customer.active ? (
                            <button type="button" className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700" onClick={() => updateCustomerStatus(customer.id, 'disable')}>Disable</button>
                          ) : (
                            <button type="button" className="px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700" onClick={() => updateCustomerStatus(customer.id, 'enable')}>Enable</button>
                          )}
                          <button type="button" className="px-3 py-1 border rounded bg-blue-50 hover:bg-blue-100" onClick={(e) => handleViewTransactions(e, customer.id)}>Transactions</button>
                          <button type="button" className="px-3 py-1 border rounded bg-blue-50 hover:bg-blue-100" onClick={(e) => handleViewTransactionsLog(e, customer.id)}>Transactions Log</button>
                          <button type="button" className="px-3 py-1 border rounded bg-blue-50 hover:bg-blue-100" onClick={(e) => handleViewBalanceTransactionsLog(e, customer.id)}>Balance Transactions Log</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination - Below the table */}
            <div className="flex justify-center p-1 mt-1 mb-6 bg-white">
              <div className="pagination" style={{ width: '100%', margin: '0px 50px' }}>
                <nav role="navigation" aria-label="Pagination Navigation" className="flex items-center justify-between">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between w-full">
                    <div>
                      <p className="text-sm leading-5 text-gray-700">
                        Showing <span className="font-medium">{startIndex}</span> to <span className="font-medium">{endIndex}</span> of <span className="font-medium">{totalFilteredCount}</span> results
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-end gap-3 mb-2">
                        <label className="text-sm text-gray-700">Entries</label>
                        <select
                          className="p-2 text-sm border border-gray-300 rounded bg-white"
                          value={entries}
                          onChange={(e) => {
                            setEntries(Number(e.target.value));
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
                          onChange={(e) => setPageInput(e.target.value)}
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
                            setPage((p) => Math.max(1, p - 1));
                            setPageInput((p) => String(Math.max(1, Number(p) - 1)));
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
                            setPage((p) => Math.min(totalPages, p + 1));
                            setPageInput((p) => String(Math.min(totalPages, Number(p) + 1)));
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

export default CustomerList;