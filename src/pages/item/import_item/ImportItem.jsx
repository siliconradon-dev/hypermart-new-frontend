import React, { useRef, useState } from 'react';
import Layout from '../../../components/Layout';
import './ImportItem.css';

const CSV_HEADERS = [
	'Item Code', 'Barcode', 'Item Name', 'Item Name 2', 'Description', 'Scale Item', 'Scale Group No', 'POS Order No',
	'Supplier ID', 'Category ID', 'Qty', 'Unit Type ID', 'Min Qty', 'Purchase Price', 'Market Price', 'Retail Price',
	'Wholesale Price', 'Additional Fees Percentage', 'Additional Fees Amount', 'Status ID', 'Start Qty'
];

const SAMPLE_ROW = [
	'ITEM001', '1234567890123', 'Sample Item', 'Sample Item Alt Name', 'Sample item description', '0', '', '', '1', '1',
	'100', '1', '10', '50.00', '55.00', '75.00', '65.00', '2.5', '0', '1', '100'
];

function parseCSV(text) {
	const lines = text.trim().split(/\r?\n/);
	const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
	return lines.slice(1).map(line => {
		const values = line.split(',').map(v => v.replace(/"/g, '').trim());
		const row = {};
		headers.forEach((h, i) => { row[h] = values[i] || ''; });
		return row;
	});
}

const ImportItem = () => {
	const [csvRows, setCsvRows] = useState([]);
	const [loading, setLoading] = useState(false);
	const fileInputRef = useRef();

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		if (!file.name.endsWith('.csv')) {
			alert('Invalid file format. Please upload a CSV file.');
			return;
		}
		setLoading(true);
		const reader = new FileReader();
		reader.onload = (evt) => {
			const text = evt.target.result;
			try {
				const rows = parseCSV(text);
				setCsvRows(rows);
			} catch (err) {
				alert('Failed to parse CSV.');
			}
			setLoading(false);
		};
		reader.readAsText(file);
	};

	const handleImport = () => {
		if (!fileInputRef.current.files[0]) {
			alert('Please upload a CSV file.');
			return;
		}
		if (csvRows.length === 0) {
			alert('No data to import.');
			return;
		}
		// Simulate import
		alert('Import simulated. Data rows: ' + csvRows.length);
	};

	const handleDownloadTemplate = () => {
		const csvContent = CSV_HEADERS.join(',') + '\n' + SAMPLE_ROW.join(',');
		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'item_import_template.csv';
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<Layout>
			{loading && (
				<div className="loading-overlay">
					<div className="spinner" />
				</div>
			)}
			<div className="flex flex-col min-h-screen bg-gray-50">
				{/* Breadcrumbs */}
				<div className="px-12 py-5 max-sm:px-6">
					<nav className="flex" aria-label="Breadcrumb">
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
									<span className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Import Items</span>
								</div>
							</li>
						</ol>
					</nav>
				</div>

				{/* File upload and controls */}
				<div className="flex items-end justify-between w-full gap-3 px-12 py-5 max-sm:px-6 max-md:flex-col">
					<span className="flex gap-3 w-fit max-md:w-full max-md:justify-center max-sm:gap-3 max-sm:flex-col">
						{/* File input */}
						<div className="flex items-center justify-center sm:w-[100px] h-[100px]">
							<label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
								<div className="flex flex-col items-center justify-center">
									<svg className="w-8 h-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m5 4v8m0 0l-4-4m4 4l4-4" /></svg>
									<span className="text-xs text-gray-500">Upload CSV</span>
								</div>
								<input id="dropzone-file" ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
							</label>
						</div>
						{/* Controls */}
						<div className="flex flex-col justify-between max-md:w-full max-sm:gap-3">
							<div className="space-y-2 flex items-center gap-3">
								<p>File must be in CSV format</p>
								<button type="button" className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleDownloadTemplate}>
									Download CSV Template
								</button>
							</div>
							<span className="flex justify-between w-fit gap-3">
								<button type="button" className="py-2 px-5 bg-[#3c8c2c] text-white rounded-lg" onClick={handleImport}>Import</button>
								<button type="button" className="px-5 py-2 text-white bg-red-600 rounded-lg" onClick={() => setCsvRows([])}>Cancel</button>
							</span>
						</div>
					</span>
				</div>

				{/* CSV Format Guidelines */}
				<div className="px-12 py-5 max-sm:px-6">
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<h3 className="text-sm font-semibold text-blue-800 mb-2">CSV Format Guidelines:</h3>
						<ul className="text-xs text-blue-700 space-y-1">
							<li>• <strong>Item Code:</strong> Unique identifier (optional, will auto-generate if empty)</li>
							<li>• <strong>Item Name:</strong> Required field</li>
							<li>• <strong>Scale Item:</strong> Use 1 for true, 0 for false</li>
							<li>• <strong>Supplier ID, Category ID, Unit Type ID:</strong> Must exist in respective tables</li>
							<li>• <strong>Prices:</strong> Use decimal format (e.g., 10.50). Market Price is optional</li>
							<li>• <strong>Additional Fees Percentage:</strong> Enter as percentage (e.g., 2.5 for 2.5%)</li>
							<li>• <strong>Status ID:</strong> 1 for Active, 2 for Inactive</li>
						</ul>
					</div>
				</div>

				{/* Table preview */}
				<div className="flex flex-col flex-grow gap-6 px-12 py-5 overflow-y-auto bg-white max-sm:px-6 max-lg:min-h-full">
					<span className="flex items-center justify-between h-10 max-sm:flex-col max-sm:h-fit max-sm:gap-3">
						<button type="button" className="p-3 border-2 rounded-lg flex gap-3 text-white bg-[#3c8c2c] max-sm:text-sm max-sm:w-full max-sm:justify-center" onClick={handleImport}>
							Add Data On Database
						</button>
					</span>
					<div className="relative overflow-x-auto">
						<table id="impTable" className="w-full text-sm text-left text-gray-500 rtl:text-right">
							<thead className="text-xs text-white uppercase bg-[#3c8c2c]">
								<tr>
									<th className="px-6 py-3 rounded-tl-lg">#</th>
									{CSV_HEADERS.map((h, i) => (
										<th key={h} className={"px-6 py-3" + (i === CSV_HEADERS.length - 1 ? ' rounded-tr-lg' : '')}>{h}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{csvRows.length === 0 ? (
									<tr><td colSpan={CSV_HEADERS.length + 1} className="text-center py-8 text-gray-400">No data loaded</td></tr>
								) : (
									csvRows.map((row, idx) => (
										<tr key={idx} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
											{CSV_HEADERS.map((h) => (
												<td key={h} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row[h] || ''}</td>
											))}
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>

				<div className="flex-grow"></div>

				<footer className="bg-[#3c8c2c] py-4 text-center text-[#ffffff]">
					<p>2026 © All Rights Reserved | Hypermart | Designed and Developed by Silicon Radon Networks (Pvt) Ltd</p>
				</footer>
			</div>
		</Layout>
	);
};

export default ImportItem;
