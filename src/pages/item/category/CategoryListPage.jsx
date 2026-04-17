import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout';

const allColumns = [
  { key: 'id', label: '#' },
  { key: 'name', label: 'Category' },
  { key: 'description', label: 'Description' },
  { key: 'manage', label: 'Manage' },
];

const CategoryListPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState(30);
  const [visibleCols, setVisibleCols] = useState(allColumns.map(col => col.key));
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    const load = async () => {
      try {
        const res = await fetch('/api/item-categories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/', { replace: true });
          }
          return;
        }

        const rows = Array.isArray(data?.categories) ? data.categories : [];
        setCategories(
          rows.map((c) => ({
            id: c.id,
            name: c.categories,
            description: c.description,
          }))
        );
      } catch {
        // ignore network errors; table will show empty state
      }
    };

    load();
  }, [navigate]);

  // Filtered and paginated categories
  const filtered = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );
  const shown = filtered.slice(0, entries);

  const handleColToggle = (key) => {
    setVisibleCols((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  const handleEditCategory = (id) => {
    navigate(`/item/category/edit_category?id=${encodeURIComponent(String(id))}`);
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Breadcrumbs */}
        <div className="px-12 py-5 max-sm:px-6">
          <nav className="flex items-center justify-between" aria-label="Breadcrumb">
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
                  <span className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Item</span>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Category List</span>
                </div>
              </li>
            </ol>
            {/* Buttons */}
            <div className="flex items-center gap-2 relative">
              <button className="hidden px-4 py-2 text-sm text-white bg-[#3c8c2c] rounded-md max-sm:px-2 max-sm:py-1">Copy</button>
              <button className="hidden px-4 py-2 text-sm text-white bg-[#3c8c2c] rounded-md max-sm:px-2 max-sm:py-1">CSV</button>
              <button className="hidden px-4 py-2 text-sm text-white bg-[#3c8c2c] rounded-md max-sm:px-2 max-sm:py-1">Excel</button>
              <button className="hidden px-4 py-2 text-sm text-white bg-[#3c8c2c] rounded-md max-sm:px-2 max-sm:py-1">PDF</button>
              <button
                type="button"
                className="px-4 py-2 text-sm text-white bg-[#3c8c2c] rounded-md max-sm:px-2 max-sm:py-1"
                onClick={() => setPopoverOpen((v) => !v)}
              >
                Column Visibility
              </button>
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
            </div>
          </nav>
        </div>

        {/* Search and entries */}
        <div className="flex max-md:flex-col items-center justify-between w-1/2 gap-3 px-12 py-5 max-sm:px-6 w-full">
          <div className="flex items-center gap-3 w-fit max-md:w-full">
            <label htmlFor="searchCatName">Search</label>
            <input
              type="text"
              id="searchCatName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              placeholder="Enter Category name"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              className="py-2 px-4 bg-[#3c8c2c] text-white rounded-lg text-sm"
              onClick={() => {}}
            >
              Search
            </button>
          </div>
          <span className="flex items-center gap-3 w-fit max-md:w-full">
            <input
              type="number"
              id="col_num"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="30"
              min="1"
              value={entries}
              onChange={e => setEntries(Number(e.target.value) || 30)}
            />
            Entries
          </span>
        </div>

        {/* Table */}
        <div className="flex flex-col px-12 py-5 overflow-y-auto bg-white max-sm:px-6">
          <div className="relative overflow-x-auto">
            <table id="catTable" className="w-full text-sm text-left text-gray-500 rtl:text-right">
              <thead className="text-xs text-white uppercase bg-[#3c8c2c]">
                <tr>
                  {allColumns.map((col, idx) => {
                    if (!visibleCols.includes(col.key)) return null;
                    return (
                      <th
                        key={col.key}
                        className={
                          `px-4 py-2 ` +
                          (idx === 0 ? 'rounded-tl-lg ' : '') +
                          (idx === allColumns.length - 1 ? 'rounded-tr-lg ' : '')
                        }
                      >
                        {col.label}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {shown.length === 0 ? (
                  <tr>
                    <td colSpan={visibleCols.length} className="text-center py-8 text-gray-400">No categories found</td>
                  </tr>
                ) : (
                  shown.map((cat) => (
                    <tr key={cat.id} className="text-black bg-white border-2">
                      {visibleCols.includes('id') && (
                        <td className="px-4 py-2 font-medium whitespace-nowrap">{cat.id}</td>
                      )}
                      {visibleCols.includes('name') && (
                        <td className="px-4 py-2 catName">{cat.name}</td>
                      )}
                      {visibleCols.includes('description') && (
                        <td className="px-4 py-2">{cat.description}</td>
                      )}
                      {visibleCols.includes('manage') && (
                        <td className="px-4 py-2">
                          <button onClick={() => handleEditCategory(cat.id)} className="px-2 py-1 border-2 rounded-lg">Edit</button>
                          <button className="hidden px-2 py-1 text-white bg-red-600 border-2 rounded-lg ml-2">Delete</button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex-grow"></div>

       
      </div>
    </Layout>
  );
};

export default CategoryListPage;
