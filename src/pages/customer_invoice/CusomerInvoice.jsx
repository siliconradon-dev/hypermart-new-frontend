import React from 'react';
import './CustomerInvoice.css';

const CustomerInvoice = () => {
	// Static data for demonstration
	const invoice = {
		status: 'PAID',
		number: '20260410003',
		date: '2026-04-06 14:08:31',
		customer: 'Customer',
		address: 'bnnnnn, nnnnnn',
		items: [
			{ description: '11*5(large)', qty: 1, rate: '1,200.00', amount: '1,200.00' },
		],
		vat: '0.00',
		total: '1,200.00',
		amountWords: 'one thousand two hundred',
	};

	return (
		<div className="bg-gray-100 p-4 min-h-screen">
			<div className="max-w-4xl mx-auto bg-white shadow-md p-5 print:shadow-none">
				{/* Header */}
				<div className="flex justify-between items-start mb-1">
					{/* Left: Logo + Company Info */}
					<div className="flex items-start space-x-3">
						<div className="w-12 h-12 flex-shrink-0">
							<img src="\images\logo.png" alt="Logo" className="w-full h-full object-contain" />
						</div>
						<div>
							<h1 className="text-base font-bold text-gray-900">Hypermart</h1>
							<p className="text-xs text-gray-600 mt-0.5">8th Mile Post, Kandy Road, Mawathagama</p>
							<p className="text-xs text-gray-600">VAT Reg. No: </p>
						</div>
					</div>
					{/* Right: Payment status badge + Invoice label + Number */}
					<div className="flex flex-col items-end space-y-1">
						<div className="flex items-center space-x-2">
							<span className="paid-badge">{invoice.status}</span>
							<span className="invoice-pill" style={{ backgroundColor: '#21ad1f' }}>
								INVOICE
							</span>
						</div>
						<div className="text-xs text-gray-700">
							<span className="font-medium">No:</span>
							<span className="text-sm font-semibold text-gray-900 ml-1">{invoice.number}</span>
						</div>
					</div>
				</div>
				<hr className="divider mb-3" />
				{/* Bill To + Date */}
				<div className="flex justify-between items-start mb-2">
					<div className="text-xs">
						<p className="font-bold text-gray-800 mb-0.5">Bill To:</p>
						<p className="text-gray-800">{invoice.customer}</p>
						<p className="text-gray-800">{invoice.address}</p>
					</div>
					<div className="text-xs text-gray-700 text-right">
						<span className="font-medium">Date:</span>
						<span className="ml-1 text-gray-900">{invoice.date}</span>
					</div>
				</div>
				{/* Items Table */}
				<table className="w-full mb-0 border-collapse">
					<thead>
						<tr>
							<th className="text-left">Description</th>
							<th className="text-center">Qty</th>
							<th className="text-right">Rate (Rs.)</th>
							<th className="text-right">Amount (Rs.)</th>
						</tr>
					</thead>
					<tbody>
						{invoice.items.map((item, idx) => (
							<tr key={idx}>
								<td className="text-gray-800">{item.description}</td>
								<td className="text-center text-gray-800">{item.qty}</td>
								<td className="text-right text-gray-800">{item.rate}</td>
								<td className="text-right text-gray-800">{item.amount}</td>
							</tr>
						))}
						{/* Bottom row: Amount in Words + Totals */}
						<tr>
							<td colSpan={2} rowSpan={3} className="align-top" style={{ borderRight: '1px solid #c9d3de' }}>
								<p className="font-bold text-gray-800 mb-0.5" style={{ fontSize: '0.72rem' }}>Amount in Words:</p>
								<p className="text-gray-700 capitalize" style={{ fontSize: '0.68rem' }}>{invoice.amountWords}</p>
							</td>
						</tr>
						<tr>
							<td className="text-right text-gray-700 font-medium">VAT 18% :</td>
							<td className="text-right text-gray-800">{invoice.vat}</td>
						</tr>
						<tr>
							<td className="text-right font-bold text-gray-900">Grand Total :</td>
							<td className="text-right font-bold text-gray-900">{invoice.total}</td>
						</tr>
					</tbody>
				</table>
				{/* Signature */}
				<div className="mt-6 text-xs text-gray-700">
					<span>Authorized Signature: </span>
					<span className="inline-block border-b border-gray-500 w-40 ml-1">&nbsp;</span>
				</div>
			</div>
			{/* Print Button */}
			<button
				onClick={() => window.print()}
				className="no-print fixed top-8 right-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
			>
				Print
			</button>
		</div>
	);
};

export default CustomerInvoice;
