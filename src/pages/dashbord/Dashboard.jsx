import { Fragment, useEffect, useRef, useState } from 'react';
import Layout from '../../components/Layout';
import './Dashboard.css';

const stockRows = [];

const monthlySalesData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const amountCards = [
  {
    label: 'Total Sales Amount',
    icon: ' /images/dash/sa.png',
  },
  {
    label: 'Total Sales Due',
    icon: ' /images/dash/sd.png',
  },
  {
    label: 'Total Expenses Amount',
    icon: ' /images/dash/ea.png',
  },
  {
    label: 'Total Payment Received (Sales)',
    icon: ' /images/dash/sd.png',
  },
  {
    label: 'Today Total Sales',
    icon: ' /images/dash/sa.png',
  },
  {
    label: 'Today Total Expenses',
    icon: ' /images/dash/ea.png',
  },
];

const summaryCards = [
  {
    label: 'Customers',
    icon: ' /images/dash/customer.png',
  },
  {
    label: 'Suppliers',
    icon: ' /images/dash/supplier.png',
  },
  {
    label: 'Items',
    icon: ' /images/dash/purchases.png',
  },
  {
    label: 'Sales Invoice',
    icon: ' /images/dash/invoice.png',
  },
];

function DashbordDashboard({ onBackToMain }) {
  const [activeView, setActiveView] = useState('expiry');
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const hideBrokenImage = (e) => { e.currentTarget.style.display = 'none'; };
  useEffect(() => {
    if (activeView !== 'chart') {
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
      return;
    }
    if (!chartContainerRef.current || typeof window.ApexCharts === 'undefined') { return; }
    const options = {
      xaxis: { show: true, categories: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'], labels: { show: true, style: { fontFamily: 'Inter, sans-serif', cssClass: 'text-xs font-normal fill-gray-500' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { show: true, labels: { show: true, style: { fontFamily: 'Inter, sans-serif', cssClass: 'text-xs font-normal fill-gray-500' }, formatter(value) { return `Rs.${value.toFixed(2)}`; } } },
      series: [{ name: 'Sales', data: monthlySalesData, color: '#1A56DB' }],
      chart: { sparkline: { enabled: false }, height: '100%', width: '100%', type: 'area', fontFamily: 'Inter, sans-serif', dropShadow: { enabled: false }, toolbar: { show: false } },
      tooltip: { enabled: true, x: { show: false } },
      fill: { type: 'gradient', gradient: { opacityFrom: 0.55, opacityTo: 0, shade: '#1C64F2', gradientToColors: ['#1C64F2'] } },
      dataLabels: { enabled: false },
      stroke: { width: 6, curve: 'smooth' },
      legend: { show: false },
      grid: { show: false }
    };
    chartRef.current = new window.ApexCharts(chartContainerRef.current, options);
    chartRef.current.render();
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [activeView]);
  return (
    <Layout onBackToMain={onBackToMain}>
      <div className="px-12 py-2 max-sm:px-6">
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
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                </svg>
                <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Dashboard</p>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-5 py-2">
        {amountCards.map((card) => (
          <div key={card.label} className="w-1/6 max-lg:w-1/3 max-sm:w-1/2 h-[70px] bg-[#029ED914] flex rounded-lg">
            <div className="bg-[#3c8c2c] w-1/3 h-full flex justify-center items-center rounded-l-lg">
              <img src={card.icon} alt="" onError={hideBrokenImage} className="w-1/2" />
            </div>
            <div className="flex flex-col items-center justify-center w-2/3">
              <p className="w-full pl-2 text-xs">{card.label}</p>
              <h3 className="w-full pl-2 text-xl max-lg:text-lg">Rs. 0.00</h3>
            </div>
          </div>
        ))}
      </div>
      <div className="px-12 max-sm:px-6">
        <div className="rounded-2xl border-black border-2 h-[150px] max-md:h-fit flex items-center gap-3 max-md:flex-col">
          {summaryCards.map((card, idx) => (
            <Fragment key={card.label}>
              <div className="flex flex-col items-center justify-center w-1/4 h-full max-md:w-full">
                <div className="flex max-md:items-center">
                  <img src={card.icon} alt="" onError={hideBrokenImage} className="w-1/2" />
                  <span className="flex flex-col w-1/2 h-full justify-evenly">
                    <p className="text-center">{card.label}</p>
                    <h3 className="text-2xl font-bold text-center">0</h3>
                  </span>
                </div>
              </div>
              {idx < summaryCards.length - 1 ? <div className="w-[1px] h-5/6 border-[1px] border-black max-md:w-5/6" /> : null}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="h-fit">
        <div className="flex justify-end gap-3 px-12 py-2 max-sm:px-6">
          <button
            id="expiryBtn"
            onClick={() => setActiveView('expiry')}
            className={`border-black border-[1px] p-3 rounded-lg ${activeView === 'expiry' ? 'bg-[#3c8c2c] text-white' : ''}`}
          >
            Expiry Alert
          </button>
          <button
            id="chartBtn"
            onClick={() => setActiveView('chart')}
            className={`border-black border-[1px] p-3 rounded-lg ${activeView === 'chart' ? 'bg-[#3c8c2c] text-white' : ''}`}
          >
            Sales Chart
          </button>
          <button
            id="tableBtn"
            onClick={() => setActiveView('table')}
            className={`border-black border-[1px] p-3 rounded-lg ${activeView === 'table' ? 'bg-[#3c8c2c] text-white' : ''}`}
          >
            Stock Alert
          </button>
        </div>
        <div className="w-full px-12 py-5 max-sm:px-6">
          {activeView === 'chart' ? (
            <div id="chart" className="flex flex-col w-full">
              <h1 className="pb-5 text-2xl">Sales Chart</h1>
              <div className="w-full h-full bg-white rounded-lg shadow">
                <div className="flex justify-between p-4 pb-0 md:p-6 md:pb-0">
                  <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-black text-center">
                    Sales Per Month
                  </div>
                </div>
                <div ref={chartContainerRef} className="px-2.5" />
              </div>
            </div>
          ) : null}
          {activeView === 'table' ? (
            <div id="table" className="bg-white lg:h-[300px] overflow-y-auto">
              <div className="relative">
                <table className="w-full text-sm text-left text-gray-500 rtl:text-right">
                  <thead className="text-xs text-white uppercase bg-[#3c8c2c]">
                    <tr>
                      <th scope="col" className="px-6 py-3 rounded-tl-lg">#</th>
                      <th scope="col" className="px-6 py-3">Item Name</th>
                      <th scope="col" className="px-6 py-3">Current Stock</th>
                      <th scope="col" className="px-6 py-3 rounded-tr-lg">Minimum Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockRows.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                          No stock data available
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
          {activeView === 'expiry' ? (
            <div id="expiry" className="bg-white lg:h-[300px] overflow-y-auto">
              <div className="flex items-center justify-between p-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Items Expiring Soon</h2>
                <span className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-full">
                  No items expiring soon
                </span>
              </div>
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500">All items are within safe expiry dates!</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}

export default DashbordDashboard;
