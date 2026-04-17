import React, { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '../../../components/Layout';
import './ItemListPage.css';
import { useLocation, useNavigate } from 'react-router-dom'; // <-- Add this import

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
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [pageInput, setPageInput] = useState('1');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedCategoryLabel = selectedCategory
    ? (categoryOptions.find((c) => c.id === selectedCategory)?.label || 'Select Category')
    : (categoryOptions.find((c) => c.id === '')?.label || 'Select Category');
  const selectedSupplierLabel = selectedSupplier
    ? (supplierOptions.find((s) => s.id === selectedSupplier)?.label || 'Select Supplier')
    : (supplierOptions.find((s) => s.id === '')?.label || 'Select Supplier');

  // Backend already sorts; keep rendering order as received.
  const sortedItems = useMemo(() => items, [items]);

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

  // Add navigate hook
  const navigate = useNavigate();
  const location = useLocation();

  // Backend server URL for images
  const BACKEND_URL = 'http://localhost:3000';
  const normalizeImageSrc = (src) => {
    const value = String(src || '').trim();
    if (!value) return BACKEND_URL + '/upload/items/default.png';
    if (value.startsWith('data:')) return value;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;

    // Handle absolute server path (legacy/incorrect DB value)
    // e.g. backend\\hypermart-new-backend\\public\\images\\upload\\items\\images-1776413132646.jpg
    const absMatch = value.match(/[\\/]images[\\/]upload[\\/]items[\\/](.+)$/i);
    if (absMatch) {
      return BACKEND_URL + '/upload/items/' + absMatch[1];
    }

    // If path starts with /upload/items or upload/items, serve from backend
    if (value.startsWith('/upload/items/')) {
      return BACKEND_URL + value;
    }
    if (value.startsWith('upload/items/')) {
      return BACKEND_URL + '/' + value;
    }
    // If path starts with /images/upload/items or images/upload/items, convert to /upload/items/
    if (value.startsWith('/images/upload/items/')) {
      return BACKEND_URL + '/upload/items/' + value.replace('/images/upload/items/', '');
    }
    if (value.startsWith('images/upload/items/')) {
      return BACKEND_URL + '/upload/items/' + value.replace('images/upload/items/', '');
    }
    // If value is just a filename, serve from backend
    if (/^[^\/]+\.(jpg|jpeg|png|gif|webp)$/i.test(value)) {
      return BACKEND_URL + '/upload/items/' + value;
    }
    // Fallback to backend default
    return BACKEND_URL + '/upload/items/default.png';
  };

  const ensureToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem('user');
      window.location.assign('/');
      return null;
    }
    return token;
  };

  const loadFilters = async (token) => {
    try {
      const [catResp, supResp] = await Promise.all([
        fetch('/api/item-categories', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/suppliers?limit=500', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const cats = await catResp.json().catch(() => ({}));
      const sups = await supResp.json().catch(() => ({}));

      if (catResp.status === 401 || supResp.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.assign('/');
        return;
      }

      const nextCats = Array.isArray(cats?.categories)
        ? cats.categories.map((c) => ({ id: String(c.id), label: String(c.categories || '') }))
        : [];
      const nextSups = Array.isArray(sups?.suppliers)
        ? sups.suppliers.map((s) => ({ id: String(s.id), label: String(s.supplier_name || '') }))
        : [];

      setCategoryOptions([{ id: '', label: 'All Categories' }, ...nextCats]);
      setSupplierOptions([{ id: '', label: 'All Suppliers' }, ...nextSups]);
    } catch {
      // keep page usable even if filter lists fail
    }
  };

  const loadItems = async ({ token, search, categoryId, supplierId }) => {
    setError('');
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (categoryId) params.set('categoryId', categoryId);
      if (supplierId) params.set('supplierId', supplierId);
      if (sortKey) params.set('sort_by', sortKey === 'qty' ? 'quantity' : sortKey);
      if (sortOrder) params.set('sort_order', sortOrder);
      params.set('limit', String(pageSize));
      params.set('offset', String((page - 1) * pageSize));

      const url = `/api/items${params.toString() ? `?${params.toString()}` : ''}`;
      const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await resp.json().catch(() => ({}));

      if (resp.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.assign('/');
        return;
      }

      if (!resp.ok) {
        setError(data?.error || 'Failed to load items.');
        setItems([]);
        setTotal(0);
        return;
      }

      const normalized = Array.isArray(data?.items)
        ? data.items.map((it) => {
          const qty = Number(it.quantity ?? 0);
          const statusText = qty > 0 ? 'In Stock' : 'Out of Stock';
          return {
            id: it.id,
            item_code: it.item_code,
            item_name: it.item_name,
            qty,
            unit_type_id: it.unit_type_id,
            unit_type: it.unit_type_id ? String(it.unit_type_id) : '',
            status_id: it.status_id,
            status: statusText,
            image: normalizeImageSrc(it.image_path),
          };
        })
        : [];

      setItems(normalized);
      setTotal(Number(data?.total) || 0);
    } catch {
      setError('Network error. Please try again.');
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const buildQueryFromState = () => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(pageSize));
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (selectedCategory) params.set('categoryId', selectedCategory);
    if (selectedSupplier) params.set('supplierId', selectedSupplier);
    if (sortKey) params.set('sort_by', sortKey);
    if (sortOrder) params.set('sort_order', sortOrder);
    return params;
  };

  // Restore state from URL (supports back/forward without refresh)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nextPage = Math.max(1, Number(params.get('page') || 1));
    const nextLimit = Number(params.get('limit') || 30);
    const nextPageSize = Number.isInteger(nextLimit) && nextLimit > 0 ? nextLimit : 30;
    const nextSearch = String(params.get('search') || '');
    const nextCategoryId = String(params.get('categoryId') || '');
    const nextSupplierId = String(params.get('supplierId') || '');
    const nextSortBy = String(params.get('sort_by') || '');
    const nextSortOrder = String(params.get('sort_order') || 'asc');

    setPage((prev) => (prev === nextPage ? prev : nextPage));
    setPageSize((prev) => (prev === nextPageSize ? prev : nextPageSize));
    setPageInput(String(nextPage));
    setSearchTerm((prev) => (prev === nextSearch ? prev : nextSearch));
    setSearchInput((prev) => (prev === nextSearch ? prev : nextSearch));
    setSelectedCategory((prev) => (prev === nextCategoryId ? prev : nextCategoryId));
    setSelectedSupplier((prev) => (prev === nextSupplierId ? prev : nextSupplierId));
    setSortKey((prev) => (prev === nextSortBy ? prev : nextSortBy));
    setSortOrder((prev) => (prev === nextSortOrder ? prev : nextSortOrder));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Keep URL in sync when state changes (no refresh)
  useEffect(() => {
    const next = buildQueryFromState().toString();
    const current = String(location.search || '').replace(/^\?/, '');
    if (next !== current) {
      navigate({ pathname: location.pathname, search: `?${next}` }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, searchTerm, selectedCategory, selectedSupplier, sortKey, sortOrder]);

  useEffect(() => {
    const token = ensureToken();
    if (!token) return;

    loadFilters(token);
    loadItems({ token, search: searchTerm.trim(), categoryId: selectedCategory, supplierId: selectedSupplier });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const token = ensureToken();
    if (!token) return;
    loadItems({
      token,
      search: searchTerm.trim(),
      categoryId: selectedCategory,
      supplierId: selectedSupplier,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortKey, sortOrder, page, pageSize, searchTerm, selectedCategory, selectedSupplier]);

  // Edit button handler
  const handleEditItem = (e, id) => {
    e.preventDefault();
    const returnTo = encodeURIComponent(location.search || '');
    navigate(`/item/edit_item?id=${encodeURIComponent(String(id))}&returnTo=${returnTo}`);
  };

  const handleSearch = async () => {
    setPage(1);
    setPageInput('1');
    setSearchTerm(searchInput);
  };

  const handleReset = async () => {
    setSearchInput('');
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSupplier('');
    setCategorySearch('');
    setSupplierSearch('');
    setSortKey('');
    setSortOrder('asc');
    setPage(1);
    setPageInput('1');
  };

  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = total === 0 ? 0 : Math.min((safePage - 1) * pageSize + items.length, total);

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
              <input
                type="text"
                name="search"
                id="searchItemName"
                className="block w-48 p-2 text-sm text-gray-900 border border-gray-300 rounded focus:ring-[#3c8c2c] focus:border-[#3c8c2c] bg-white"
                placeholder="Enter item name"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="button" onClick={handleSearch} className="px-4 py-2 bg-[#3c8c2c] text-white rounded hover:bg-[#25661c] ml-2">Search</button>
              <button type="button" onClick={handleReset} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 ml-1">Reset</button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="sort_by" className="text-xs font-semibold">Sort by:</label>
              <select
                name="sort_by"
                id="sort_by"
                className="p-2 text-sm border border-gray-300 rounded bg-white focus:ring-[#3c8c2c] focus:border-[#3c8c2c]"
                value={sortKey || 'item_code'}
                onChange={(e) => setSortKey(e.target.value)}
              >
                <option value="item_code">Item Code</option>
                <option value="item_name">Item Name</option>
                <option value="unit_type_id">Unit Type</option>
                <option value="status_id">Status</option>
                <option value="qty">Qty</option>
              </select>
              <select
                name="sort_order"
                id="sort_order"
                className="p-2 text-sm border border-gray-300 rounded bg-white focus:ring-[#3c8c2c] focus:border-[#3c8c2c]"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
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
                {selectedCategoryLabel}
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
                    {categoryOptions
                      .filter((cat) => cat.label.toLowerCase().includes(categorySearch.toLowerCase()))
                      .map((cat) => (
                      <div
                        key={cat.id || cat.label}
                        className="px-3 py-2 hover:bg-[#f6f6f6] cursor-pointer text-sm"
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setShowCategoryDropdown(false);
                          setCategorySearch("");
                          setPage(1);
                          setPageInput('1');
                        }}
                      >
                        {cat.label}
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
                {selectedSupplierLabel}
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
                    {supplierOptions
                      .filter((sup) => sup.label.toLowerCase().includes(supplierSearch.toLowerCase()))
                      .map((sup) => (
                      <div
                        key={sup.id || sup.label}
                        className="px-3 py-2 hover:bg-[#f6f6f6] cursor-pointer text-sm"
                        onClick={() => {
                          setSelectedSupplier(sup.id);
                          setShowSupplierDropdown(false);
                          setSupplierSearch("");
                          setPage(1);
                          setPageInput('1');
                        }}
                      >
                        {sup.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="px-12 py-2 text-sm text-red-600">{error}</div>
        )}

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
                {loading ? (
                  <tr>
                    <td colSpan={visibleCols.length} className="text-center py-8 text-gray-400">Loading...</td>
                  </tr>
                ) : sortedItems.length === 0 ? (
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
                            <button onClick={(e) => handleEditItem(e, item.id)} className="p-2 border-2 rounded-lg">Edit</button>
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
                    Showing <span className="font-medium">{startIndex}</span> to <span className="font-medium">{endIndex}</span> of <span className="font-medium">{total}</span> results
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-end gap-3 mb-2">
                    <label className="text-sm text-gray-700">Entries</label>
                    <select
                      className="p-2 text-sm border border-gray-300 rounded bg-white"
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
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
    </Layout>
  );
};

export default ItemListPage;
