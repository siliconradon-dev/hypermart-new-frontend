import React from 'react'
import Layout from '../../../components/Layout'
import './ExportPanel.css'

const ExportPanel = () => {
  // Demo: no items found, static state
  return (
      <Layout>
    <div className="export-panel-container">
      {/* Breadcrumbs */}
      <nav className="w-full px-12 py-5 max-sm:px-6" aria-label="Breadcrumb">
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
              <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Items</p>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
              </svg>
              <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Export Items</p>
            </div>
          </li>
        </ol>
      </nav>
      <div className="export-panel-content">
        {/* Filter Controls */}
        <form className="export-panel-controls mb-6">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="type_filter">Item Type</label>
            <div>
              <select name="type_filter" id="type_filter" defaultValue="scale">
                <option value="scale">Scale Items</option>
                <option value="normal">Normal Items</option>
              </select>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <button type="button" className="export-selected">
              <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Export Selected
            </button>
            <a href="#" className="refresh-btn" title="Refresh">
              <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </a>
          </div>
        </form>
        {/* Items Table */}
        <div className="export-panel-table-container">
          <table className="export-panel-table">
            <thead>
              <tr>
                <th><input type="checkbox" id="selectAll" className="rounded" /></th>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Retail Price</th>
                <th>Type - (Scale Group No if any)</th>
                <th>Manage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="center" style={{ color: '#6b7280', padding: '2rem 0' }}>No items found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </Layout>
  );
}

export default ExportPanel