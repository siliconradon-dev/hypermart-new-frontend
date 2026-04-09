
import React from 'react';
import Layout from '../../components/Layout';
import './Stock.css';

const stockRows = [
  { id: 1, code: '1001', name: 'test', category: 'sample category', qty: 10000, unit: 'Pieces' },
  { id: 2, code: '1002', name: 'Ratthi milk powder(200g) box', category: 'sample category', qty: 10000, unit: 'Pieces' },
  { id: 3, code: '1003', name: '10*5(medium bag)', category: 'sample category', qty: 10000, unit: 'Pieces' },
  { id: 4, code: '1004', name: '11*5(large bag)', category: 'sample category', qty: 10000, unit: 'Pieces' },
  { id: 5, code: '1005', name: '11*5(large)', category: 'sample category', qty: 10000, unit: 'Pieces' },
];

const Stock = () => {
  return (
    <Layout>
      <div className="h-[95vh] max-lg:h-[95vh] flex flex-col grow bg-white">
        {/* Breadcrumbs and controls */}
        <div className="px-12 py-5 max-sm:px-6">
          <nav className="flex max-md:flex-col max-md:w-full" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <p className="inline-flex items-center text-sm font-medium text-gray-700 text-nowrap">
                  <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Main Panel
                </p>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2 text-nowrap">Stock List</p>
                </div>
              </li>
            </ol>
            {/* Buttons */}
            <div className="flex items-center justify-end w-full gap-2 px-6 py-3 max-sm:px-6 max-md:flex-wrap max-md:gap-2 max-md:justify-center">
              <button className="px-3 py-2 text-xs text-white bg-[#3c8c2c] rounded-lg max-sm:px-2 max-sm:py-1">Copy</button>
              <button className="px-3 py-2 text-xs text-white bg-[#3c8c2c] rounded-lg max-sm:px-2 max-sm:py-1">CSV</button>
              <button className="px-3 py-2 text-xs text-white bg-[#3c8c2c] rounded-lg max-sm:px-2 max-sm:py-1">Excel</button>
              <button className="px-3 py-2 text-xs text-white bg-[#3c8c2c] rounded-lg max-sm:px-2 max-sm:py-1">PDF</button>
              <button className="px-3 py-2 text-xs text-white bg-[#3c8c2c] rounded-lg">Column Visibility</button>
            </div>
          </nav>
        </div>
        {/* Search controls */}
        <div className="flex items-center justify-between w-full gap-3 px-12 py-3 max-sm:px-6 max-lg:flex-col">
          <form className="flex items-center lg:justify-between w-full gap-3  max-lg:flex-col max-md:w-full">
            <div className="flex items-center gap-2">
              <label htmlFor="category_id" className="text-sm">Category:</label>
              <select id="category_id" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-3 px-2.5">
                <option value="">All Categories</option>
                <option value="1">sample category</option>
              </select>
            </div>
            <div className="flex gap-3 max-md:flex-col max-md:w-full">
              <div className="flex items-center gap-2">
                <label htmlFor="search" className="text-sm">Search:</label>
                <input type="text" id="search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-3 px-2.5" placeholder="Enter Item name or code" />
              </div>
              <button type="submit" className="py-3 px-5 bg-[#3c8c2c] text-white rounded-lg text-sm">Filter</button>
              <button type="button" className="py-3 px-5 bg-gray-500 text-white rounded-lg text-sm max-md:text-center">Clear</button>
            </div>
            <span className="flex items-center gap-3 w-fit max-md:w-full">
              Show
              <input type="number" id="col_num" className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-2.5" placeholder="30" min="1" defaultValue={30} />
              Entries
            </span>
          </form>
        </div>
        {/* Table */}
        <div className="flex flex-col flex-grow px-12 py-5 overflow-y-auto bg-white max-sm:px-6 max-lg:min-h-full">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 border-collapse rtl:text-right">
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
                {stockRows.map((row, idx) => (
                  <tr key={row.id} className="text-black bg-white border-b">
                    <td className="px-4 py-2 font-medium whitespace-nowrap">{idx + 1}</td>
                    <td className="px-4 py-2">{row.code}</td>
                    <td className="px-4 py-2">{row.name}</td>
                    <td className="px-4 py-2">{row.category}</td>
                    <td className="px-4 py-2 text-right">{row.qty}</td>
                    <td className="px-4 py-2">{row.unit}</td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-3">
                        <button className="p-2 border rounded-md bg-blue-100">Add Stock</button>
                        <button className="p-2 border rounded-md bg-green-100">View Related Stocks</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pagination - matches HTML exactly */}
        <div className="mt-4">
          <nav role="navigation" aria-label="Pagination Navigation" className="flex items-center justify-between">
            {/* Mobile pagination - only one page */}
            <div className="flex justify-between flex-1 sm:hidden">
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium leading-5 text-gray-500 bg-white border border-gray-300 rounded-md cursor-default">
                &laquo; Previous
              </span>
              <span className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium leading-5 text-gray-500 bg-white border border-gray-300 rounded-md cursor-default">
                Next &raquo;
              </span>
            </div>
            {/* Desktop pagination - only one page */}
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm leading-5 text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">30</span> of <span className="font-medium">30</span> results
                </p>
              </div>
              <div>
                <span className="relative z-0 inline-flex rounded-md shadow-sm rtl:flex-row-reverse">
                  {/* Previous button (disabled) */}
                  <span aria-disabled="true" aria-label="&laquo; Previous">
                    <span className="relative inline-flex items-center px-2 py-2 text-sm font-medium leading-5 text-gray-500 bg-white border border-gray-300 cursor-default rounded-l-md" aria-hidden="true">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </span>
                  {/* Only one page, highlighted */}
                  <a href="#" className="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium leading-5 text-white bg-blue-600 border-blue-600 cursor-default" aria-label="Go to page 1">1</a>
                  {/* Next button (disabled) */}
                  <span aria-disabled="true" aria-label="Next &raquo;">
                    <span className="relative inline-flex items-center px-2 py-2 -ml-px text-sm font-medium leading-5 text-gray-500 bg-white border border-gray-300 cursor-default rounded-r-md" aria-hidden="true">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </Layout>
  );
};

export default Stock;