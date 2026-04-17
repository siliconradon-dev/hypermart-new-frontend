import React, { useEffect, useMemo, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Layout from '../../components/Layout';
import './Stock.css';
import { useNavigate } from 'react-router-dom'; // <-- Add this import

const Stock = () => {
  const [showColumnsPopover, setShowColumnsPopover] = useState(false);
  const tableRef = useRef();

  const token = useMemo(() => localStorage.getItem('token'), []);

  const [categories, setCategories] = useState([]);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [categoryId, setCategoryId] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState(30);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');

  const totalPages = Math.max(1, Math.ceil((total || 0) / entries));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const offset = total === 0 ? 0 : (safePage - 1) * entries;
  const startIndex = total === 0 ? 0 : (safePage - 1) * entries + 1;
  const endIndex = total === 0 ? 0 : Math.min((safePage - 1) * entries + rows.length, total);

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

  const ensureToken = () => {
    const t = localStorage.getItem('token');
    if (!t) {
      localStorage.removeItem('user');
      window.location.assign('/');
      return null;
    }
    return t;
  };

  useEffect(() => {
    const loadCats = async () => {
      try {
        const t = ensureToken();
        if (!t) return;
        const resp = await fetch('/api/item-categories', { headers: { Authorization: `Bearer ${t}` } });
        const data = await resp.json().catch(() => ({}));
        if (resp.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.assign('/');
          return;
        }
        const next = Array.isArray(data?.categories) ? data.categories : [];
        setCategories(next);
      } catch {
        setCategories([]);
      }
    };
    loadCats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadStock = async () => {
      setLoading(true);
      try {
        const t = ensureToken();
        if (!t) return;
        const params = new URLSearchParams();
        params.set('limit', String(entries));
        params.set('offset', String(offset));
        if (categoryId) params.set('categoryId', categoryId);
        if (searchTerm.trim()) params.set('search', searchTerm.trim());

        const resp = await fetch(`/api/stock?${params.toString()}`, { headers: { Authorization: `Bearer ${t}` } });
        const data = await resp.json().catch(() => ({}));
        if (resp.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.assign('/');
          return;
        }
        if (!resp.ok) {
          setRows([]);
          setTotal(0);
          return;
        }
        setRows(Array.isArray(data?.items) ? data.items : []);
        setTotal(Number(data?.total) || 0);
      } catch {
        setRows([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    loadStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, offset, categoryId, searchTerm]);

  // Copy table data to clipboard (skip Manage column)
  const handleCopy = () => {
    const table = tableRef.current;
    let data = '';
    for (let i = 0; i < table.rows.length; i++) {
      let row = table.rows[i];
      let rowData = [];
      for (let j = 0; j < row.cells.length - 1; j++) {
        rowData.push(row.cells[j].innerText.trim());
      }
      data += rowData.join('\t') + '\n';
    }
    navigator.clipboard.writeText(data).then(() => {
      alert('Table data copied to clipboard in a structured format!');
    }).catch(err => {
      alert('Failed to copy table data.');
    });
  };

  // Export table to CSV (skip Manage column)
  const handleExportCSV = () => {
    const table = tableRef.current;
    let csvContent = '';
    for (let i = 0; i < table.rows.length; i++) {
      let row = table.rows[i];
      let rowData = [];
      for (let j = 0; j < row.cells.length - 1; j++) {
        rowData.push('"' + row.cells[j].innerText.replace(/"/g, '""') + '"');
      }
      csvContent += rowData.join(',') + '\n';
    }
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'stockTable.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export table to Excel (skip Manage column)
  const handleExportExcel = () => {
    const table = tableRef.current.cloneNode(true);
    const rows = table.rows;
    for (let i = 0; i < rows.length; i++) {
      rows[i].deleteCell(-1);
    }
    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'stockTable');
    XLSX.writeFile(workbook, 'stockTable.xlsx');
  };

  // Export table to PDF (skip Manage column)
  const handleExportPDF = () => {
    const table = tableRef.current;
    const rows = [];
    const tableRows = table.querySelectorAll('tr');
    let manageColumnIndex = -1;
    const headerCells = tableRows[0].querySelectorAll('th');
    headerCells.forEach((cell, index) => {
      if (cell.innerText.toLowerCase() === 'manage') {
        manageColumnIndex = index;
      }
    });
    tableRows.forEach(row => {
      const cols = row.querySelectorAll('td, th');
      const rowData = [];
      cols.forEach((col, index) => {
        if (index !== manageColumnIndex) {
          rowData.push(col.innerText);
        }
      });
      if (rowData.length > 0) {
        rows.push(rowData);
      }
    });
    const doc = new jsPDF();
    autoTable(doc, { head: [rows[0]], body: rows.slice(1) });
    doc.save('stockTable.pdf');
  };

  const navigate = useNavigate();

  const handleAddStock = (e) => {
    e.preventDefault();
    navigate('/stock/update_stock');
  };

  const handleViewRelatedStock = (e) => {   
    e.preventDefault();
    navigate('/stock/view_related_stock');
 };  
    


  return (
    <Layout>
      <div className="h-[95vh] max-lg:h-[95vh] flex flex-col grow bg-white" onClick={() => showColumnsPopover && setShowColumnsPopover(false)}>
        {/* Breadcrumbs and controls */}
        <div className="px-12 py-5 max-sm:px-6">
          <nav className="flex flex-wrap max-md:flex-col max-md:w-full" aria-label="Breadcrumb">
            <ol
              className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse flex-nowrap whitespace-nowrap flex-shrink-0"
              style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}
            >
              <li className="inline-flex items-center flex-shrink-0" style={{ display: 'flex', alignItems: 'center' }}>
                <p className="inline-flex items-center text-sm font-medium text-gray-700 text-nowrap">
                  <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Main Panel
                </p>
              </li>
              <li aria-current="page">
                <div className="flex items-center flex-shrink-0" style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
                  <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2 text-nowrap">Stock List</p>
                </div>
              </li>
            </ol>
            {/* Buttons - match HTML, UI only */}
            <div className="flex items-center justify-end w-full md:w-auto md:ml-auto gap-2 px-6 py-3 max-sm:px-6 flex-wrap max-md:gap-2 max-md:justify-center relative">
              <button className="px-3 py-2 text-xs text-white bg-[#3c8c2c] rounded-lg max-sm:px-2 max-sm:py-1" onClick={handleCopy}>Copy</button>
              <button className="px-3 py-2 text-xs text-white bg-[#3c8c2c] rounded-lg max-sm:px-2 max-sm:py-1" onClick={handleExportCSV}>CSV</button>
              <button className="px-3 py-2 text-xs text-white bg-[#3c8c2c] rounded-lg max-sm:px-2 max-sm:py-1" onClick={handleExportExcel}>Excel</button>
              <button className="px-3 py-2 text-xs text-white bg-[#3c8c2c] rounded-lg max-sm:px-2 max-sm:py-1" onClick={handleExportPDF}>PDF</button>
              {/* Column Visibility Popover Trigger */}
              <button
                type="button"
                className="px-3 py-2 text-xs text-white bg-[#3c8c2c] rounded-lg"
                onClick={e => { e.stopPropagation(); setShowColumnsPopover(v => !v); }}
              >
                Column Visibility
              </button>
              {/* Popover UI (UI only, no logic) */}
              {showColumnsPopover && (
                <div
                  className="absolute z-10 top-12 right-0 inline-block text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm w-fit"
                  style={{ minWidth: 180 }}
                  onClick={e => e.stopPropagation()}
                >
                  <ul className="flex flex-col w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
                    <li>
                      <input id="filter_item_code" type="checkbox" checked readOnly className="hidden peer" />
                      <label htmlFor="filter_item_code" className="flex w-full px-4 py-2 border-b border-gray-200 select-none peer-checked:bg-blue-300 cursor-pointer"> Item Code </label>
                    </li>
                    <li>
                      <input id="filter_item_name" type="checkbox" checked readOnly className="hidden peer" />
                      <label htmlFor="filter_item_name" className="flex w-full px-4 py-2 border-b border-gray-200 select-none peer-checked:bg-blue-300 cursor-pointer"> Item Name </label>
                    </li>
                    <li>
                      <input id="filter_category" type="checkbox" checked readOnly className="hidden peer" />
                      <label htmlFor="filter_category" className="flex w-full px-4 py-2 border-b border-gray-200 select-none peer-checked:bg-blue-300 cursor-pointer"> Category </label>
                    </li>
                    <li>
                      <input id="filter_quantity" type="checkbox" checked readOnly className="hidden peer" />
                      <label htmlFor="filter_quantity" className="flex w-full px-4 py-2 border-b border-gray-200 select-none peer-checked:bg-blue-300 cursor-pointer"> Quantity </label>
                    </li>
                    <li>
                      <input id="filter_manage" type="checkbox" checked readOnly className="hidden peer" />
                      <label htmlFor="filter_manage" className="flex w-full px-4 py-2 rounded-b-lg select-none peer-checked:bg-blue-300 cursor-pointer"> Manage </label>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </nav>
        </div>
        {/* Search controls */}
        <div className="flex items-center justify-between w-full gap-3 px-12 py-3 max-sm:px-6 max-lg:flex-col">
          <form
            className="flex items-center lg:justify-between w-full gap-3  max-lg:flex-col max-md:w-full"
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setPageInput('1');
              setSearchTerm(searchInput);
            }}
          >
            <div className="flex items-center gap-2">
              <label htmlFor="category_id" className="text-sm">Category:</label>
              <select
                id="category_id"
                value={categoryId}
                onChange={(e) => { setCategoryId(e.target.value); setPage(1); setPageInput('1'); }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-3 px-2.5"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>{c.categories}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 max-md:flex-col max-md:w-full">
              <div className="flex items-center gap-2">
                <label htmlFor="search" className="text-sm">Search:</label>
                <input
                  type="text"
                  id="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-3 px-2.5"
                  placeholder="Enter Item name or code"
                />
              </div>
              <button type="submit" className="py-3 px-5 bg-[#3c8c2c] text-white rounded-lg text-sm">Filter</button>
              <button
                type="button"
                className="py-3 px-5 bg-gray-500 text-white rounded-lg text-sm max-md:text-center"
                onClick={() => {
                  setCategoryId('');
                  setSearchInput('');
                  setSearchTerm('');
                  setPage(1);
                  setPageInput('1');
                }}
              >
                Clear
              </button>
            </div>
            <span className="flex items-center gap-3 w-fit max-md:w-full">
              Show
              <input
                type="number"
                id="col_num"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-2.5"
                placeholder="30"
                min="1"
                value={entries}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setEntries(Number.isFinite(v) && v > 0 ? v : 30);
                  setPage(1);
                  setPageInput('1');
                }}
              />
              Entries
            </span>
          </form>
        </div>
        {/* Table */}
        <div className="flex flex-col flex-grow px-12 py-5 overflow-y-auto bg-white max-sm:px-6 max-lg:min-h-full">
          <div className="relative overflow-x-auto">
            <table ref={tableRef} id="stockTable" className="w-full text-sm text-left text-gray-500 border-collapse rtl:text-right">
              <thead className="text-xs text-white uppercase bg-[#3c8c2c]">
                <tr>
                  <th className="px-4 py-2 rounded-tl-lg">#</th>
                  <th className="px-4 py-2">Item Code</th>
                  <th className="px-4 py-2">Item Name</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2 text-right">Quantity</th>
                  <th className="px-4 py-2">Unit Type</th>
                  <th className="px-4 py-2 rounded-tr-lg">Manage</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="text-black bg-white border-b">
                    <td className="px-4 py-6 text-center" colSpan={7}>Loading…</td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr className="text-black bg-white border-b">
                    <td className="px-4 py-6 text-center" colSpan={7}>No items found</td>
                  </tr>
                ) : rows.map((row, idx) => (
                  <tr key={row.id} className="text-black bg-white border-b">
                    <td className="px-4 py-2 font-medium whitespace-nowrap">{offset + idx + 1}</td>
                    <td className="px-4 py-2">{row.item_code}</td>
                    <td className="px-4 py-2">{row.item_name}</td>
                    <td className="px-4 py-2">
                      {categories.find((c) => String(c.id) === String(row.item_categories_id))?.categories || row.item_categories_id || ''}
                    </td>
                    <td className="px-4 py-2 text-right">{row.quantity}</td>
                    <td className="px-4 py-2">{row.unit_type_id ?? ''}</td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-3">
                        <button onClick={handleAddStock} className="p-2 border rounded-md bg-blue-100">Add Stock</button>
                        <button onClick={handleViewRelatedStock} className="p-2 border rounded-md bg-green-100">View Related Stocks</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pagination */}
        <div className="flex justify-center p-1 mt-1 mb-6">
          <div className="pagination">
            <nav role="navigation" aria-label="Pagination Navigation" className="flex items-center justify-between">
              <div className="flex justify-between flex-1 sm:hidden">
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium leading-5 text-gray-500 bg-white border border-gray-300 rounded-md cursor-default">&laquo; Previous</span>
                <span className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium leading-5 text-gray-500 bg-white border border-gray-300 rounded-md cursor-default">Next &raquo;</span>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm leading-5 text-gray-700">
                    Showing <span className="font-medium">{startIndex}</span> to <span className="font-medium">{endIndex}</span> of <span className="font-medium">{total}</span> results
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
                      className="px-3 py-2 text-sm text-white bg-[#3c8c2c] rounded"
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
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                        onClick={() => setPage(p)}
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
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className={
                        `relative inline-flex items-center px-2 py-2 -ml-px text-sm font-medium leading-5 border border-gray-300 rounded-r-md ` +
                        (safePage >= totalPages ? 'text-gray-400 bg-white cursor-default' : 'text-gray-700 bg-white hover:bg-gray-50')
                      }
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Stock;