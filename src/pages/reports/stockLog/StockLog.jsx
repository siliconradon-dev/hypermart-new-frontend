import React, { useEffect, useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './StockLog.css';

const stockRows = [
  { no: 1, itemName: 'test', saleCode: 'SALE-69CBA6F433883', quantity: 1, date: '2026-03-31 16:20' },
  { no: 2, itemName: 'test', saleCode: 'SALE-69CBA6F433883', quantity: 1, date: '2026-03-31 16:20' },
  { no: 3, itemName: 'Alli Kadala Piti 200g', saleCode: 'SALE-69CC1A57BD3D7', quantity: 1, date: '2026-04-01 00:32' },
  { no: 4, itemName: 'Alli Atta piti 400g', saleCode: 'SALE-69CC1A57BD3D7', quantity: 2, date: '2026-04-01 00:32' },
  { no: 5, itemName: 'Alli Kurakkan kanda 60g', saleCode: 'SALE-69CC1EAAE28F9', quantity: 10, date: '2026-04-01 00:51' },
];

function StockLog() {
  const [loading, setLoading] = useState(true);
  const [itemName, setItemName] = useState('');
  const [saleCode, setSaleCode] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    setLoading(false);
  }, []);

  const filteredRows = useMemo(() => {
    const normalizedItem = itemName.trim().toLowerCase();
    const normalizedSale = saleCode.trim().toLowerCase();

    return stockRows.filter((row) => {
      const rowDate = row.date.split(' ')[0];
      const matchesItem = !normalizedItem || row.itemName.toLowerCase().includes(normalizedItem);
      const matchesSale = !normalizedSale || row.saleCode.toLowerCase().includes(normalizedSale);
      const matchesFrom = !fromDate || rowDate >= fromDate;
      const matchesTo = !toDate || rowDate <= toDate;

      return matchesItem && matchesSale && matchesFrom && matchesTo;
    });
  }, [itemName, saleCode, fromDate, toDate]);

  const exportTableToPDF = () => {
    const doc = new jsPDF('portrait');
    const dates = filteredRows.map((row) => new Date(row.date.split(' ')[0])).filter((date) => !Number.isNaN(date.getTime()));
    const fromRange = dates.length ? new Date(Math.min(...dates)) : null;
    const toRange = dates.length ? new Date(Math.max(...dates)) : null;
    const formattedFromDate = fromRange ? fromRange.toISOString().split('T')[0] : 'N/A';
    const formattedToDate = toRange ? toRange.toISOString().split('T')[0] : 'N/A';
    const currentDate = new Date();
    const dateString = currentDate.toISOString().split('T')[0];
    let hours = currentDate.getHours();
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours || 12;
    const timeString = `${hours}:${minutes} ${ampm}`;

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const pageWidth = doc.internal.pageSize.getWidth();
    const companyName = 'Hypermart';
    doc.text(companyName, (pageWidth - doc.getTextWidth(companyName)) / 2, 15);

    doc.setFontSize(14);
    doc.text('Stock Log Report', (pageWidth - doc.getTextWidth('Stock Log Report')) / 2, 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${dateString} ${timeString}`, 14, 35);
    doc.text(`Date Range: ${formattedFromDate} to ${formattedToDate}`, 14, 40);

    autoTable(doc, {
      head: [['No', 'Item Name', 'Sale Code', 'Quantity', 'Date']],
      body: filteredRows.map((row) => [row.no, row.itemName, row.saleCode, row.quantity, row.date]),
      startY: 45,
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        textColor: [0, 0, 0],
        fontSize: 9,
      },
      headStyles: {
        fillColor: [11, 43, 100],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      columnStyles: {
        3: { halign: 'right' },
      },
      margin: { top: 50 },
    });

    doc.save('StockLogReport.pdf');
  };

  return (
    <div className="stock-log-page min-h-dvh max-lg:h-fit flex flex-col h-dvh">
      <div className="nav bg-[#3c8c2c] w-full h-[10%] max-lg:h-[17dvh] py-6 flex justify-between items-center max-md:justify-center max-md:flex-col md:px-14 lg:px-0">
        <span className="flex items-center gap-3 ml-20 max-lg:ml-0 max-sm:scale-75">
          <button
            type="button"
            onClick={() => window.history.go(-1)}
            className="rounded-full w-[50px] aspect-square bg-white flex justify-center items-center hover:scale-90 transition-all"
          >
            <i className="text-xl text-[#000000] fas fa-arrow-left" />
          </button>
          <button
            type="button"
            onClick={() => { window.location.href = '/dashboard'; }}
            className="p-2 text-[#000000] rounded-lg bg-white flex gap-3 justify-center items-center hover:scale-90 transition-all"
          >
            <i className="text-xl text-[#000000] fas fa-city" />
            Go to Main Panel
          </button>
          <a
            href="/sales/billing"
            className="p-2 text-[#000000] rounded-lg bg-white flex gap-3 justify-center items-center hover:scale-90 transition-all"
          >
            POS
          </a>
        </span>

        <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-14 max-sm:h-8 bg-white p-1 rounded-full"
          />
        </div>

        <span className="flex items-center gap-3 mr-20 max-lg:mr-0 max-sm:scale-75">
          <div className="flex flex-col items-end text-right">
            <h3 className="text-2xl max-md:text-sm text-[#ffffff]">Good Morning!</h3>
            <h3 className="text-sm text-[#ffffff]">Welcome HYPERMART</h3>
          </div>

          <form method="POST" action="/logout">
            <input type="hidden" name="_token" value="" autoComplete="off" />
            <button
              type="submit"
              className="rounded-full w-[50px] aspect-square bg-white flex justify-center items-center hover:scale-90 transition-all"
            >
              <i className="text-xl font-bold text-[#000000] fas fa-sign-out-alt" />
            </button>
          </form>
        </span>
      </div>

      <div id="loading-overlay" className={`loading-overlay${loading ? ' show' : ''}`}>
        <div className="text-center">
          <div className="spinner" />
        </div>
      </div>

      <div className="flex flex-col h-[680px] max-lg:h-fit">
        <div className="px-12 py-5 max-sm:px-6">
          <nav className="flex" aria-label="Breadcrumb">
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
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Stock Report</p>
                </div>
              </li>
            </ol>
            <button
              type="button"
              className="py-3 px-3 bg-[#000000] text-white rounded-lg text-xs ml-auto"
              onClick={exportTableToPDF}
            >
              Generate Report
            </button>
          </nav>
        </div>

        <div className="px-12 max-sm:px-6">
          <form>
            <div className="grid gap-4 py-4 md:grid-cols-6 items-end">
              <div>
                <label htmlFor="item_name" className="block mb-1 text-xs font-medium text-black">Item Name</label>
                <input
                  id="item_name"
                  name="item_name"
                  value={itemName}
                  onChange={(event) => setItemName(event.target.value)}
                  className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label htmlFor="sale_code" className="block mb-1 text-xs font-medium text-black">Sale Code</label>
                <input
                  id="sale_code"
                  name="sale_code"
                  value={saleCode}
                  onChange={(event) => setSaleCode(event.target.value)}
                  className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter sale code"
                />
              </div>

              <div>
                <label htmlFor="from-date" className="block mb-1 text-xs font-medium text-black">From Date</label>
                <input
                  id="from-date"
                  name="from_date"
                  type="date"
                  value={fromDate}
                  onChange={(event) => setFromDate(event.target.value)}
                  className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Select a date"
                />
              </div>

              <div>
                <label htmlFor="to-date" className="block mb-1 text-xs font-medium text-black">To Date</label>
                <input
                  id="to-date"
                  name="to_date"
                  type="date"
                  value={toDate}
                  onChange={(event) => setToDate(event.target.value)}
                  className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Select a date"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  className="py-3 px-3 w-auto bg-[#3c8c2c] text-white rounded-lg text-xs self-end"
                  onClick={() => setLoading(true)}
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="py-3 px-3 w-auto bg-[#000000] text-white rounded-lg text-xs self-end"
                  onClick={() => {
                    window.location.href = '/reports/stockLog';
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="flex flex-col px-12 py-5 overflow-y-auto bg-white max-sm:px-6 max-lg:min-h-full">
          <span />
          <div className="relative h-[500px] overflow-x-auto">
            <table id="ItemStock" className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-white uppercase bg-[#3c8c2c] sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2 rounded-tl-lg">No</th>
                  <th className="px-3 py-2">Item Name</th>
                  <th className="px-3 py-2">Sale Code</th>
                  <th className="px-3 py-2 text-right">Quantity</th>
                  <th className="px-3 py-2 rounded-tr-lg">Date</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {filteredRows.map((row) => (
                  <tr key={`${row.no}-${row.saleCode}-${row.date}`}>
                    <td className="px-3 py-2">{row.no}</td>
                    <td className="px-3 py-2">{row.itemName}</td>
                    <td className="px-3 py-2">{row.saleCode}</td>
                    <td className="px-3 py-2 text-right">{row.quantity}</td>
                    <td className="px-3 py-2">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4" />
        </div>
      </div>

      <footer className="bg-[#3c8c2c] py-4 text-center text-[#ffffff]">
        <p>2026 © All Rights Reserved | Hypermart | Designed and Developed by Silicon Radon Networks (Pvt) Ltd</p>
      </footer>
    </div>
  );
}

export default StockLog;
