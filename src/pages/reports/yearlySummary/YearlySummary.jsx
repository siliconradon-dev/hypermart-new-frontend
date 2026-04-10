import React, { useEffect, useMemo, useState } from 'react';
import './YearlySummary.css';

const yearlyRows = [
  {
    no: 1,
    itemName: 'test',
    category: 'sample category',
    unit: 'Pieces',
    qtySold: '2.00',
    qtyReturned: '1.00',
    netQty: '1.00',
    totalCost: 'Rs. 2,200.00',
    grossRevenue: 'Rs. 2,250.00',
    totalDiscount: 'Rs. 250.00',
    returns: 'Rs. 1,500.00',
    netRevenue: 'Rs. 750.00',
    netProfit: 'Rs. -250.00',
    profitPercent: '-33.33%',
    rowClass: 'bg-red-50',
    profitClass: 'text-red-600',
  },
  {
    no: 2,
    itemName: 'Alli Kadala Piti 200g',
    category: 'sample category',
    unit: 'Pieces',
    qtySold: '1.00',
    qtyReturned: '0.00',
    netQty: '1.00',
    totalCost: 'Rs. 1,000.00',
    grossRevenue: 'Rs. 1,200.00',
    totalDiscount: 'Rs. 0.00',
    returns: 'Rs. 0.00',
    netRevenue: 'Rs. 1,200.00',
    netProfit: 'Rs. 200.00',
    profitPercent: '16.67%',
    rowClass: 'bg-white',
    profitClass: 'text-green-600',
  },
  {
    no: 3,
    itemName: 'Alli Atta piti 400g',
    category: 'sample category',
    unit: 'Pieces',
    qtySold: '2.00',
    qtyReturned: '0.00',
    netQty: '2.00',
    totalCost: 'Rs. 2,000.00',
    grossRevenue: 'Rs. 2,400.00',
    totalDiscount: 'Rs. 0.00',
    returns: 'Rs. 0.00',
    netRevenue: 'Rs. 2,400.00',
    netProfit: 'Rs. 400.00',
    profitPercent: '16.67%',
    rowClass: 'bg-white',
    profitClass: 'text-green-600',
  },
  {
    no: 4,
    itemName: 'Alli Kurakkan kanda 60g',
    category: 'sample category',
    unit: 'Pieces',
    qtySold: '10.00',
    qtyReturned: '0.00',
    netQty: '10.00',
    totalCost: 'Rs. 10,000.00',
    grossRevenue: 'Rs. 12,000.00',
    totalDiscount: 'Rs. 0.00',
    returns: 'Rs. 0.00',
    netRevenue: 'Rs. 12,000.00',
    netProfit: 'Rs. 2,000.00',
    profitPercent: '16.67%',
    rowClass: 'bg-white',
    profitClass: 'text-green-600',
  },
];

function YearlySummary() {
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState('2026');
  const [categoryId, setCategoryId] = useState('');
  const [itemsId, setItemsId] = useState('');

  useEffect(() => {
    setLoading(false);

    const showLoading = () => setLoading(true);
    const hideLoading = () => setLoading(false);

    const handleClick = (event) => {
      const target = event.target;
      const element = target.tagName === 'A' ? target : target.closest('a') || target.closest('button');

      if (!element) {
        return;
      }

      const href = element.href || element.getAttribute('onclick');
      const heavyPages = [
        '/dashboard',
        '/item/item_list',
        '/item/add_item',
        '/item/edit',
        '/sales/billing',
        '/sales/budget',
        '/item/importItem',
        '/item/exportPanel',
      ];

      if (href && heavyPages.some((page) => href.includes(page))) {
        showLoading();
        window.setTimeout(hideLoading, 10000);
      }
    };

    const handleSubmit = () => {
      showLoading();
      window.setTimeout(hideLoading, 3000);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        hideLoading();
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    window.showPageLoading = showLoading;
    window.hidePageLoading = hideLoading;

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleSubmit);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      delete window.showPageLoading;
      delete window.hidePageLoading;
    };
  }, []);

  const exportTableToPDF = () => {
    const table = document.getElementById('YearlySummary');

    if (!table) {
      return;
    }

    const tbody = table.querySelector('tbody');
    const itemsData = [];
    let grandTotal = 0;

    if (tbody) {
      const rows = tbody.querySelectorAll('tr');
      rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0 && !cells[0].hasAttribute('colspan')) {
          const qty = cells[6]?.textContent.trim() ?? '';
          const name = cells[1]?.textContent.trim() ?? '';
          const unit = cells[3]?.textContent.trim() ?? '';
          const totalText = cells[11]?.textContent.trim() ?? 'Rs. 0.00';
          const total = Number.parseFloat(totalText.replace('Rs. ', '').replace(/,/g, '')) || 0;

          itemsData.push({ qty, name, unit, total });
          grandTotal += total;
        }
      });
    }

    const summaryData = {
      totalSales: document.querySelector('.bg-blue-100 p.text-xl')?.textContent.trim() ?? 'Rs. 0.00',
      totalReturns: document.querySelector('.bg-red-100 p.text-xl')?.textContent.trim() ?? 'Rs. 0.00',
      totalExpenses: document.querySelector('.bg-orange-100 p.text-xl')?.textContent.trim() ?? 'Rs. 0.00',
      netSales: document.querySelector('.bg-green-100 p.text-xl')?.textContent.trim() ?? 'Rs. 0.00',
    };

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://hypermart-new.onlinesytems.com/print/custom-summary';
    form.target = '_blank';

    const csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = '_token';
    csrfInput.value = 'lV3JlfzCkgPECFRBCdzhJF9SqMhIjHSHrPuXtcvI';
    form.appendChild(csrfInput);

    const filters = {
      from_date: `${year}-01-01`,
      to_date: `${year}-12-31`,
      category_id: categoryId,
      item_id: itemsId,
      items_data: JSON.stringify(itemsData),
      summary_data: JSON.stringify(summaryData),
      grand_total: String(grandTotal),
    };

    Object.entries(filters).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const resetReport = () => {
    window.location.href = '/reports/yearlySummary';
  };

  const summaryCards = useMemo(() => ([
    { title: 'Total Sales', value: 'Rs. 16,450.00', note: '3 transactions', bg: 'bg-blue-100', titleColor: 'text-blue-800', valueColor: 'text-blue-900', noteColor: 'text-blue-700' },
    { title: 'Total Returns', value: 'Rs. 1,500.00', note: '1 items returned', bg: 'bg-red-100', titleColor: 'text-red-800', valueColor: 'text-red-900', noteColor: 'text-red-700' },
    { title: 'Total Expenses', value: 'Rs. 0.00', note: '0 expense records', bg: 'bg-orange-100', titleColor: 'text-orange-800', valueColor: 'text-orange-900', noteColor: 'text-orange-700' },
    { title: 'Net Sales', value: 'Rs. 16,350.00', note: 'After returns deduction', bg: 'bg-green-100', titleColor: 'text-green-800', valueColor: 'text-green-900', noteColor: 'text-green-700' },
    { title: 'Total Cost', value: 'Rs. 15,200.00', bg: 'bg-blue-100', titleColor: 'text-blue-800', valueColor: 'text-blue-900' },
    { title: 'Revenue Before Discount', value: 'Rs. 18,100.00', bg: 'bg-orange-100', titleColor: 'text-orange-800', valueColor: 'text-orange-900' },
    { title: 'Total Discounts', value: 'Rs. 250.00', note: '1.38%', bg: 'bg-red-100', titleColor: 'text-red-800', valueColor: 'text-red-900', noteColor: 'text-red-700' },
    { title: 'Gross Revenue', value: 'Rs. 17,850.00', note: 'Before returns', bg: 'bg-green-100', titleColor: 'text-green-800', valueColor: 'text-green-900', noteColor: 'text-green-700' },
    { title: 'Net Profit', value: 'Rs. 1,150.00', note: 'After returns', bg: 'bg-yellow-100', titleColor: 'text-yellow-800', valueColor: 'text-yellow-900', noteColor: 'text-yellow-700' },
    { title: 'Net Margin', value: '7.03%', note: 'Net profit margin', bg: 'bg-purple-100', titleColor: 'text-purple-800', valueColor: 'text-purple-900', noteColor: 'text-purple-700' },
  ]), []);

  return (
    <div className="yearly-summary-page min-h-dvh max-lg:h-fit flex flex-col h-dvh">
      <div className="nav bg-[#3c8c2c] w-full h-[10%] max-lg:h-[17dvh] py-6 flex justify-between items-center max-md:justify-center max-md:flex-col md:px-14 lg:px-0">
        <span className="flex items-center gap-3 ml-20 max-lg:ml-0 max-sm:scale-75">
          <button type="button" onClick={() => window.history.go(-1)} className="rounded-full w-[50px] aspect-square bg-white flex justify-center items-center hover:scale-90 transition-all">
            <i className="text-xl text-[#000000] fas fa-arrow-left" />
          </button>
          <button type="button" onClick={() => { window.location.href = '/dashboard'; }} className="p-2 text-[#000000] rounded-lg bg-white flex gap-3 justify-center items-center hover:scale-90 transition-all">
            <i className="text-xl text-[#000000] fas fa-city" />
            Go to Main Panel
          </button>
          <a href="/sales/billing" className="p-2 text-[#000000] rounded-lg bg-white flex gap-3 justify-center items-center hover:scale-90 transition-all">
            POS
          </a>
        </span>

        <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
          <img src="/images/logo.png" alt="Logo" className="h-14 max-sm:h-8 bg-white p-1 rounded-full" />
        </div>

        <span className="flex items-center gap-3 mr-20 max-lg:mr-0 max-sm:scale-75">
          <div className="flex flex-col items-end text-right">
            <h3 className="text-2xl max-md:text-sm text-[#ffffff]">Good Morning!</h3>
            <h3 className="text-sm text-[#ffffff]">Welcome HYPERMART</h3>
          </div>
          <form method="POST" action="/logout">
            <input type="hidden" name="_token" value="" autoComplete="off" />
            <button type="submit" className="rounded-full w-[50px] aspect-square bg-white flex justify-center items-center hover:scale-90 transition-all">
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
                <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Reports</p>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                </svg>
                <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Yearly Summary Report</p>
              </div>
            </li>
          </ol>
          <button type="button" className="py-3 px-3 bg-[#000000] text-white rounded-lg text-xs ml-auto" onClick={exportTableToPDF}>
            Generate Report
          </button>
        </nav>
      </div>

      <div className="px-12 max-sm:px-6">
        <form onSubmit={(event) => {
          event.preventDefault();
          setLoading(true);
          window.setTimeout(() => setLoading(false), 3000);
        }}>
          <div className="grid gap-4 py-4 md:grid-cols-5">
            <div>
              <label htmlFor="year" className="block mb-1 text-xs font-medium text-black">Year</label>
              <select id="year" name="year" value={year} onChange={(event) => setYear(event.target.value)} className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>
            <div>
              <label htmlFor="category_id" className="block mb-1 text-xs font-medium text-black">Category</label>
              <select id="category_id" name="category_id" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
                <option value="">All Categories</option>
                <option value="1">sample category</option>
              </select>
            </div>
            <div>
              <label htmlFor="items_id" className="block mb-1 text-xs font-medium text-black">Item</label>
              <div className="flex w-full gap-3 custom-select">
                <select id="items_id" name="items_id" value={itemsId} onChange={(event) => setItemsId(event.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 hidden">
                  <option value="">All Items</option>
                  <option value="a16a738e-997e-4258-873d-797a762e30b8">10*5(medium bag)</option>
                  <option value="a16a738e-997e-4258-873d-797a762e30b9">11*5(large bag)</option>
                  <option value="a16a738e-997e-4258-873d-797a762e30ba">11*5(large)</option>
                  <option value="a16a738e-997e-4258-873d-797a762e30bb">14*16(jumbo bag)</option>
                  <option value="a16a738e-997e-4258-873d-797a762e30bc">16*16(lunch sheet)</option>
                  <option value="a16a738e-997e-4258-873d-797a762e30bd">16*20(king jumbo bag)</option>
                  <option value="a16a738e-997e-4258-873d-797a762e30be">4rever Fair &amp; beauty25g</option>
                  <option value="a16a738e-997e-4258-873d-797a762e30bf">4rever Gold Brightening day cream30g</option>
                  <option value="a16a738e-997e-4258-873d-797a762e30c0">4rever Gold Face wash 100ml</option>
                  <option value="a16a738e-997e-4258-873d-797a762e30c1">4rever Hibicus body wash 300ml</option>
                </select>
                <div className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-3 text-xs text-gray-500">All Items</div>
              </div>
            </div>
            <div className="flex justify-start gap-4 md:col-span-2">
              <button type="submit" className="py-0.5 px-3 w-auto bg-[#3c8c2c] text-white rounded-lg text-xs">Filter</button>
              <button type="button" className="py-0.5 px-3 w-auto bg-[#000000] text-white rounded-lg text-xs" onClick={resetReport}>Reset</button>
            </div>
          </div>
        </form>
      </div>

      <div className="px-12 py-5 max-sm:px-6">
        <div className="grid gap-4 md:grid-cols-4 mb-4">
          {summaryCards.slice(0, 4).map((card) => (
            <div key={card.title} className={`p-4 ${card.bg} rounded-lg`}>
              <h3 className={`text-sm font-semibold ${card.titleColor}`}>{card.title}</h3>
              <p className={`text-xl font-bold ${card.valueColor}`}>{card.value}</p>
              {card.note ? <p className={`text-xs ${card.noteColor}`}>{card.note}</p> : null}
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-6">
          {summaryCards.slice(4).map((card) => (
            <div key={card.title} className={`p-4 ${card.bg} rounded-lg`}>
              <h3 className={`text-sm font-semibold ${card.titleColor}`}>{card.title}</h3>
              <p className={`text-xl font-bold ${card.valueColor}`}>{card.value}</p>
              {card.note ? <p className={`text-xs ${card.noteColor}`}>{card.note}</p> : null}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col px-12 py-5 overflow-y-auto bg-white max-sm:px-6 max-lg:min-h-full">
        <div className="relative h-[500px] overflow-x-auto">
          <table id="YearlySummary" className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-white uppercase bg-[#3c8c2c] sticky top-0">
              <tr>
                <th className="px-3 py-2 rounded-tl-lg">No</th>
                <th className="px-3 py-2">Item Name</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2 text-right">Unit</th>
                <th className="px-3 py-2 text-right">Qty Sold</th>
                <th className="px-3 py-2 text-right">Qty Returned</th>
                <th className="px-3 py-2 text-right">Net Qty</th>
                <th className="px-3 py-2 text-right">Total Cost</th>
                <th className="px-3 py-2 text-right">Gross Revenue</th>
                <th className="px-3 py-2 text-right">Total Discount</th>
                <th className="px-3 py-2 text-right">Returns</th>
                <th className="px-3 py-2 text-right">Net Revenue</th>
                <th className="px-3 py-2 text-right">Net Profit</th>
                <th className="px-3 py-2 text-right rounded-tr-lg">Profit %</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {yearlyRows.map((row) => (
                <tr key={row.no} className={row.rowClass}>
                  <td className="px-3 py-2">{row.no}</td>
                  <td className="px-3 py-2 font-medium">{row.itemName}</td>
                  <td className="px-3 py-2">{row.category}</td>
                  <td className="px-3 py-2 text-right text-xs">{row.unit}</td>
                  <td className="px-3 py-2 text-right">{row.qtySold}</td>
                  <td className="px-3 py-2 text-right text-red-600">{row.qtyReturned}</td>
                  <td className="px-3 py-2 text-right font-bold">{row.netQty}</td>
                  <td className="px-3 py-2 text-right">{row.totalCost}</td>
                  <td className="px-3 py-2 text-right">{row.grossRevenue}</td>
                  <td className="px-3 py-2 text-right text-red-600">{row.totalDiscount}</td>
                  <td className="px-3 py-2 text-right text-red-600 font-medium">{row.returns}</td>
                  <td className="px-3 py-2 text-right font-bold">{row.netRevenue}</td>
                  <td className={`px-3 py-2 text-right font-bold ${row.profitClass}`}>{row.netProfit}</td>
                  <td className={`px-3 py-2 text-right ${row.profitClass}`}>{row.profitPercent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex-grow" />

      <footer className="bg-[#3c8c2c] py-4 text-center text-[#ffffff]">
        <p>2026 © All Rights Reserved | Hypermart | Designed and Developed by Silicon Radon Networks (Pvt) Ltd</p>
      </footer>
    </div>
  );
}

export default YearlySummary;
