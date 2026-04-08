import React, { useState, useRef, useEffect } from 'react';
import Layout from '../../../components/Layout';
import './ItemListPage.css';

const ItemListPage = () => {
    // Sorting state
    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
  // State for filter dropdowns (must be at the top before usage)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  // Demo: one hardcoded item with random data
  const items = [
    {
      id: 1,
      item_code: '3020',
      item_name: 'Zesta green 25 tea bags box 37.5g  - (Zesta green 25 tea bags box 37.5g)',
      qty: 10000,
      unit_type: 'Pieces',
      value_id: 1,
      min_qty: 1,
      purchase_price: '1000.00',
      retail_price: '1200.00',
      wholesale_price: '1100.00',
      status_id: 1,
      status: 'In Stock',
      image: '',
    },
    {
      id: 2,
      item_code: '3019',
      item_name: 'Zesta 95g',
      qty: 10000,
      unit_type: 'Pieces',
      value_id: 1,
      min_qty: 1,
      purchase_price: '1000.00',
      retail_price: '1200.00',
      wholesale_price: '1100.00',
      status_id: 1,
      status: 'In Stock',
      image: '',
    },
  ];

  // Sort items based on sortKey and sortOrder
  const sortedItems = React.useMemo(() => {
    if (!sortKey) return items;
    const sorted = [...items].sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];
      // Numeric sort for qty, else string
      if (sortKey === 'qty') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else {
        aVal = (aVal || '').toString().toLowerCase();
        bVal = (bVal || '').toString().toLowerCase();
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [items, sortKey, sortOrder]);

  // Column definitions
  const allColumns = [
    { key: 'item_code', label: 'Item Code', align: 'left' },
    { key: 'image', label: 'Item image', align: 'left' },
    { key: 'item_name', label: 'Item Name', align: 'left' },
    { key: 'qty', label: 'Qty', align: 'right' },
    { key: 'unit_type', label: 'Unit Type', align: 'left' },
    { key: 'status', label: 'Status', align: 'left' },
    { key: 'manage', label: 'Manage', align: 'center' },
  ];

  // Default: all columns visible
  const [visibleCols, setVisibleCols] = useState(allColumns.map(col => col.key));
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef(null);

  const handleColToggle = (key) => {
    setVisibleCols((prev) =>
      prev.includes(key)
        ? prev.filter((col) => col !== key)
        : [...prev, key]
    );
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Breadcrumbs */}
        <div className="px-12 py-1 max-sm:px-6">
          <nav className="flex justify-between w-full" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <span className="inline-flex items-center text-sm font-medium text-gray-700">
                  <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Main Panel
                </span>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Items</span>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Items List</span>
                </div>
              </li>
            </ol>
            {/* Right side buttons (hidden for now) */}
            <span className="w-fit max-md:w-full max-md:justify-center flex gap-3 max-sm:gap-1 max-[350px]:scale-75 relative">
              <button className="hidden px-2 py-1.5 text-white bg-[#3c8c2c] rounded-lg max-sm:px-2 max-sm:py-1">Copy</button>
              <button className="hidden px-2 py-3 text-white bg-[#3c8c2c] rounded-lg max-sm:px-2 max-sm:py-1">CSV</button>
              <button className="hidden px-2 py-1.5 text-white bg-[#3c8c2c] rounded-lg max-sm:px-2 max-sm:py-1">Excel</button>
              <button className="hidden px-2 py-1.5 text-white bg-[#3c8c2c] rounded-lg max-sm:px-2 max-sm:py-1">PDF</button>
              {/* Category List navigation button */}
              <a href="/item/category-list" className="px-2 py-3 text-white bg-[#3c8c2c] rounded-lg max-sm:px-2 max-sm:py-1 flex items-center" style={{ textDecoration: 'none' }}>
                Category List
              </a>
              <button
                type="button"
                className="px-2 py-3 text-white bg-[#3c8c2c] rounded-lg max-sm:px-2 max-sm:py-1 focus:outline-none relative"
                onClick={() => setPopoverOpen((v) => !v)}
                style={{ boxShadow: '0 1px 2px #0002' }}
              >
                Column Visibility
              </button>
              {/* Popover */}
              {popoverOpen && (
                <div
                  ref={popoverRef}
                  className="absolute z-10 right-0 mt-2 w-fit bg-white border border-gray-200 rounded-lg shadow-sm p-0 animate-fade-in"
                  style={{ top: '110%' }}
                >
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
          </nav>
        </div>

        {/* Search, Filter, and Sort */}
        <div className="flex flex-col gap-2 bg-[#f6f6f6] border-b border-gray-200 px-12 py-4 w-full">
          {/* Search Row */}
          <div className="flex flex-wrap items-center justify-between w-full gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="search_item" className="text-xs font-semibold mr-2">Search</label>
              <input type="text" name="search" id="searchItemName" className="block w-48 p-2 text-sm text-gray-900 border border-gray-300 rounded focus:ring-[#3c8c2c] focus:border-[#3c8c2c] bg-white" placeholder="Enter item name" />
              <button className="px-4 py-2 bg-[#3c8c2c] text-white rounded hover:bg-[#25661c] ml-2">Search</button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 ml-1">Reset</button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="sort_by" className="text-xs font-semibold">Sort by:</label>
              <select name="sort_by" id="sort_by" className="p-2 text-sm border border-gray-300 rounded bg-white focus:ring-[#3c8c2c] focus:border-[#3c8c2c]">
                <option value="item_code">Item Code</option>
                <option value="item_name">Item Name</option>
                <option value="unit_type_id">Unit Type</option>
                <option value="status_id">Status</option>
              </select>
              <select name="sort_order" id="sort_order" className="p-2 text-sm border border-gray-300 rounded bg-white focus:ring-[#3c8c2c] focus:border-[#3c8c2c]">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-4 mt-2 relative">
            <label className="text-xs font-semibold whitespace-nowrap mr-2">Filter by:</label>
            {/* Category Custom Select */}
            <div className="relative w-56">
              <div
                className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white cursor-pointer select-none"
                onClick={() => {
                  setShowCategoryDropdown((v) => !v);
                  setShowSupplierDropdown(false);
                }}
              >
                {selectedCategory ? selectedCategory : "Select Category"}
              </div>
              {showCategoryDropdown && (
                <div className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={categorySearch}
                    onChange={e => setCategorySearch(e.target.value)}
                    className="block w-full mb-1 p-2 text-sm text-gray-900 border-b border-gray-200 rounded-t-lg bg-white focus:ring-[#3c8c2c] focus:border-[#3c8c2c]"
                  />
                  <div className="max-h-40 overflow-y-auto">
                    {(["All Categories", "Sample Category"]).filter(cat => cat.toLowerCase().includes(categorySearch.toLowerCase())).map(cat => (
                      <div
                        key={cat}
                        className="px-3 py-2 hover:bg-[#f6f6f6] cursor-pointer text-sm"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setShowCategoryDropdown(false);
                          setCategorySearch("");
                        }}
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Supplier Custom Select */}
            <div className="relative w-56">
              <div
                className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white cursor-pointer select-none"
                onClick={() => {
                  setShowSupplierDropdown((v) => !v);
                  setShowCategoryDropdown(false);
                }}
              >
                {selectedSupplier ? selectedSupplier : "Select Supplier"}
              </div>
              {showSupplierDropdown && (
                <div className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                  <input
                    type="text"
                    placeholder="Search suppliers..."
                    value={supplierSearch}
                    onChange={e => setSupplierSearch(e.target.value)}
                    className="block w-full mb-1 p-2 text-sm text-gray-900 border-b border-gray-200 rounded-t-lg bg-white focus:ring-[#3c8c2c] focus:border-[#3c8c2c]"
                  />
                  <div className="max-h-40 overflow-y-auto">
                    {(["All Suppliers", "Sample Supplier"]).filter(sup => sup.toLowerCase().includes(supplierSearch.toLowerCase())).map(sup => (
                      <div
                        key={sup}
                        className="px-3 py-2 hover:bg-[#f6f6f6] cursor-pointer text-sm"
                        onClick={() => {
                          setSelectedSupplier(sup);
                          setShowSupplierDropdown(false);
                          setSupplierSearch("");
                        }}
                      >
                        {sup}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>


        </div>

        {/* Table */}
        <div className="flex flex-col px-12 py-1 overflow-y-auto bg-white max-sm:px-6">
          <div className="relative overflow-x-auto">
            <table id="itemsTable" className="w-full text-sm text-left rtl:text-right" style={{ minWidth: 900 }}>
              <thead className="text-xs text-white uppercase bg-[#3c8c2c]">
                <tr>
                  {allColumns.map((col, idx) => {
                    if (!visibleCols.includes(col.key)) return null;
                    const sortable = ['item_code', 'item_name', 'unit_type', 'status'];
                    const isActive = sortKey === col.key;
                    return (
                      <th
                        key={col.key}
                        className={
                          `px-4 py-2 ` +
                          (idx === 0 ? 'rounded-tl-lg ' : '') +
                          (idx === allColumns.length - 1 ? 'rounded-tr-lg ' : '')
                        }
                      >
                        <div className={col.key === 'qty' ? 'flex items-center justify-end' : 'flex items-center'}>
                          {col.label}
                          {sortable.includes(col.key) && (
                            <button
                              type="button"
                              className={
                                `ml-2 text-white hover:text-gray-300 focus:outline-none` +
                                (isActive ? ' font-bold' : '')
                              }
                              style={{ fontSize: '1.1em', verticalAlign: 'middle' }}
                              onClick={() => {
                                if (sortKey === col.key) {
                                  setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                                } else {
                                  setSortKey(col.key);
                                  setSortOrder('asc');
                                }
                              }}
                              aria-label={`Sort by ${col.label}`}
                            >
                              {isActive ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                            </button>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {sortedItems.length === 0 ? (
                  <tr>
                    <td colSpan={visibleCols.length} className="text-center py-8 text-gray-400">No items in the list</td>
                  </tr>
                ) : (
                  sortedItems.map((item, idx) => (
                    <tr key={item.id} className="text-black bg-white border-2">
                      {allColumns.map((col) => {
                        if (!visibleCols.includes(col.key)) return null;
                        if (col.key === 'item_code')
                          return <td key={col.key} className="px-4 py-2 font-medium whitespace-nowrap">{item.item_code}</td>;
                        if (col.key === 'image') {
                          const imgSrc = item.image && item.image.trim() !== '' ? item.image : '/images/upload/default.png';
                          return (
                            <td key={col.key}>
                              <img
                                src={imgSrc}
                                alt="item"
                                style={{ width: 40, height: 40, borderRadius: 50 }}
                                onError={e => { e.target.onerror = null; e.target.src = '/images/upload/default.png'; }}
                              />
                            </td>
                          );
                        }
                        if (col.key === 'item_name')
                          return <td key={col.key} className="px-4 py-2 item-name">{item.item_name}</td>;
                        if (col.key === 'qty')
                          return <td key={col.key} className="px-4 py-2 text-right">{item.qty}</td>;
                        if (col.key === 'unit_type')
                          return <td key={col.key} className="px-4 py-2">{item.unit_type}</td>;
                        if (col.key === 'status')
                          return <td key={col.key} className="px-4 py-2">
                            <span
                              style={{ padding: '5px 10px', border: '1px solid green', borderRadius: 5, backgroundColor: 'transparent', color: 'green', cursor: 'pointer' }}
                              className="text-nowrap"
                            >
                              {item.status}
                            </span>
                          </td>;
                        if (col.key === 'manage')
                          return <td key={col.key} className="px-4 py-2 flex flex-wrap gap-2">
                            <button className="p-2 border-2 rounded-lg">Edit</button>
                            <button className="p-2 text-white bg-red-600 border-2 rounded-lg">Out Of stock</button>
                          </td>;
                        return null;
                      })}
                    </tr>
                  ))
                )}
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
                    Showing <span className="font-medium">0</span> to <span className="font-medium">0</span> of <span className="font-medium">0</span> results
                  </p>
                </div>
                <div>
                  <span className="relative z-0 inline-flex rounded-md shadow-sm rtl:flex-row-reverse">
                    <span aria-disabled="true" aria-label="&laquo; Previous">
                      <span className="relative inline-flex items-center px-2 py-2 text-sm font-medium leading-5 text-gray-500 bg-white border border-gray-300 cursor-default rounded-l-md" aria-hidden="true">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </span>
                    <a className="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium leading-5 text-white bg-blue-600 border-blue-600 border cursor-default" aria-label="Go to page 1">1</a>
                    <span aria-disabled="true" aria-label="Next &raquo;">
                      <span className="relative inline-flex items-center px-2 py-2 -ml-px text-sm font-medium leading-5 text-gray-500 bg-white border border-gray-300 rounded-r-md cursor-default">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </span>
                  </span>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </Layout>
  );

}
export default ItemListPage;
