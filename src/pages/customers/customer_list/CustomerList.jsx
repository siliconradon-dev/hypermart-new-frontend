import React, { useMemo, useState } from 'react';
import Layout from '../../../components/Layout';
import '../../../assets/customer-pages.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const customerRows = [
  {
    id: 1,
    customerCode: '',
    customerName: 'Customer',
    mobileNumber: '1234567890',
    address: 'bnnnnn nnnnnn',
    email: 'aa@gmail.com',
    dueAmount: '534.00',
    userId: '',
    cityId: '1',
    statusId: '1',
    cityName: '',
    active: false,
  },
  {
    id: 2,
    customerCode: '2',
    customerName: 'BANDULA',
    mobileNumber: '0777608679',
    address: '',
    email: '',
    dueAmount: '1,320.00',
    userId: '1',
    cityId: '1',
    statusId: '1',
    cityName: '',
    active: false,
  },
];

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
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState(30);
  const [showPopover, setShowPopover] = useState(false);
  const [customers, setCustomers] = useState(customerRows);
  const [visibleColumns, setVisibleColumns] = useState(columns.map((column) => column.key));

  const filteredCustomers = useMemo(() => {
    return customers
      .filter((customer) => customer.customerName.toLowerCase().includes(search.toLowerCase()))
      .slice(0, entries);
  }, [customers, search, entries]);

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

  const handleEdit = (customerId) => {
    window.location.href = `/customers/updateCustomer/${customerId}`;
  };

  const handleViewTransactions = (customerId) => {
    window.location.href = `/customers/transactions/history?customer_id=${customerId}`;
  };

  const handleViewTransactionsLog = (customerId) => {
    window.location.href = `/customers/transaction-log?customer_id=${customerId}`;
  };

  const handleViewBalanceTransactionsLog = (customerId) => {
    window.location.href = `/customers/balance-transaction-log?customer_id=${customerId}`;
  };

  return (
    <Layout>
      <div className="customer-page customer-page-shell">
        <div className="customer-content flex flex-col grow">
          <div className="h-[90vh] max-lg:h-[92vh] flex flex-col grow">
            <div className="px-12 py-5 max-sm:px-6">
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

            <div className="flex items-center justify-between w-full gap-3 px-12 py-5 max-sm:px-6 max-md:flex-col">
              <div className="flex items-center w-1/2 gap-3 max-md:w-full">
                <label htmlFor="search_cat">Search</label>
                <input
                  type="text"
                  id="search_cat"
                  className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter customer name"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  required
                />
                <button type="button" className="py-3 px-4 bg-[#3c8c2c] text-white rounded-lg" onClick={() => {}}>
                  Search
                </button>
              </div>
              <span className="flex items-center gap-3 w-fit max-md:w-full">
                Show
                <input
                  type="number"
                  id="col_num"
                  className="block w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="30"
                  min="1"
                  value={entries}
                  onChange={(event) => setEntries(Number(event.target.value || 30))}
                  required
                />
                Entries
              </span>
            </div>

            <div className="flex flex-col flex-grow px-12 py-5 overflow-y-auto bg-white max-sm:px-6 max-lg:min-h-full">
              <div className="relative overflow-x-auto">
                <table id="customersTable" className="w-full text-sm text-left text-gray-500 rtl:text-right border-spacing-0">
                  <thead className="text-xs text-white uppercase bg-[#3c8c2c]">
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
                      <tr key={customer.id} className="text-black bg-white border-b">
                        <td scope="row" className="px-4 py-2 font-medium whitespace-nowrap">{index + 1}</td>
                        {columns.map((column) => (
                          <td key={column.key} className={`${column.hidden ? 'hidden' : ''} px-4 py-2`}>
                            {customer[column.key]}
                          </td>
                        ))}
                        <td className="px-4 py-2 flex flex-wrap gap-3">
                          <button type="button" className="px-3 py-1 border rounded" onClick={() => handleEdit(customer.id)}>Edit</button>
                          {customer.active ? (
                            <button type="button" className="px-3 py-1 text-white bg-red-600 rounded" onClick={() => updateCustomerStatus(customer.id, 'disable')}>Disable</button>
                          ) : (
                            <button type="button" className="px-3 py-1 text-white bg-green-600 rounded" onClick={() => updateCustomerStatus(customer.id, 'enable')}>Enable</button>
                          )}
                          <button type="button" className="px-3 py-1 border rounded bg-blue-50" onClick={() => handleViewTransactions(customer.id)}>Transactions</button>
                          <button type="button" className="px-3 py-1 border rounded bg-blue-50" onClick={() => handleViewTransactionsLog(customer.id)}>Transactions Log</button>
                          <button type="button" className="px-3 py-1 border rounded bg-blue-50" onClick={() => handleViewBalanceTransactionsLog(customer.id)}>Balance Transactions Log</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerList;
