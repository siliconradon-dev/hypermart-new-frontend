import React from 'react';
import Layout from '../../components/Layout';
import './ReportsPage.css';

function ReportsPage() {
    // Navigation handlers for report buttons
    const handleSalesReport = () => window.location.href = '/sales/salesItems';
    const handleStockReports = () => window.location.href = '/reports/stockReports';
    const handleItemReport = () => window.location.href = '/item/item_list';
    const handleExpensesList = () => window.location.href = '/expenses/expensesList';
    const handleStockLog = () => window.location.href = '/reports/stockLog';
    const handleLoyaltyPointReport = () => window.location.href = '/reports/loyaltyPointReport';
    const handleCustomSummary = () => window.location.href = '/reports/customSummary';
    const handleDailySummary = () => window.location.href = '/reports/dailySummary';
    const handleMonthlySummary = () => window.location.href = '/reports/monthlySummary';
    const handleYearlySummary = () => window.location.href = '/reports/yearlySummary';
  return (
    <Layout onBackToMain={() => (window.location.href = '/dashboard')}>
      <div className="flex flex-col flex-grow justify-start items-center bg-[#f6f9ff]">
        <div className="w-full px-12 py-5 max-sm:px-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <p className="inline-flex items-center text-sm font-medium text-gray-700">
                  <svg className="w-3 h-3 me-2.5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Main Panel
                </p>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Report</p>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Button container */}
        <div className="grid h-full p-6 w-fit place-items-center">
          <div className="grid gap-6">
            <div className="grid grid-cols-4 place-items-center max-[700px]:grid-cols-3 max-[500px]:grid-cols-2 max-[375px]:grid-cols-1 place-content-center [375px]:justify-items-center h-full gap-6 text-white 2xl:scale-[110%]">
              {/* Sales Report */}
              <button type="button" onClick={handleSalesReport} className="p-0 bg-transparent border-none" style={{all: 'unset'}}>
                <div className="w-[200px] max-lg:w-[150px] border-2 border-[#1b4f72] h-[200px] max-lg:h-[150px] bg-[#3c8c2c] text-white rounded-lg flex flex-col gap-3 justify-center items-center hover:scale-90 transition-all cursor-pointer">
                  <div className="w-10 h-10" style={{ background: "url('/images/reports/salesReport.png') no-repeat", backgroundSize: 'cover' }} />
                  <p className="text-center max-sm:text-sm">Sales Report</p>
                </div>
              </button>
              {/* Item Stock Count */}
              <button type="button" onClick={handleStockReports} className="p-0 bg-transparent border-none" style={{all: 'unset'}}>
                <div className="w-[200px] max-lg:w-[150px] border-2 border-[#1b4f72] h-[200px] max-lg:h-[150px] bg-[#3c8c2c] text-white rounded-lg flex flex-col gap-3 justify-center items-center hover:scale-90 transition-all cursor-pointer">
                  <div className="w-10 h-10" style={{ background: "url('/images/reports/ItemStockReport.png') no-repeat", backgroundSize: 'cover' }} />
                  <p className="text-center max-sm:text-sm">Item Stock Count</p>
                </div>
              </button>
              {/* Item Report */}
              <button type="button" onClick={handleItemReport} className="p-0 bg-transparent border-none" style={{all: 'unset'}}>
                <div className="w-[200px] max-lg:w-[150px] border-2 border-[#1b4f72] h-[200px] max-lg:h-[150px] bg-[#3c8c2c] text-white rounded-lg flex flex-col gap-3 justify-center items-center hover:scale-90 transition-all cursor-pointer">
                  <div className="w-10 h-10" style={{ background: "url('/images/reports/itemReport.png') no-repeat", backgroundSize: 'cover' }} />
                  <p className="text-center max-sm:text-sm">Item Report</p>
                </div>
              </button>
              {/* Expenses Report */}
              <button type="button" onClick={handleExpensesList} className="p-0 bg-transparent border-none" style={{all: 'unset'}}>
                <div className="w-[200px] max-lg:w-[150px] border-2 border-[#1b4f72] h-[200px] max-lg:h-[150px] bg-[#3c8c2c] text-white rounded-lg flex flex-col gap-3 justify-center items-center hover:scale-90 transition-all cursor-pointer">
                  <div className="w-10 h-10" style={{ background: "url('/images/reports/ExpenseReport.png') no-repeat", backgroundSize: 'cover' }} />
                  <p className="text-center max-sm:text-sm">Expences Report</p>
                </div>
              </button>
              {/* Stock Report */}
              <button type="button" onClick={handleStockLog} className="p-0 bg-transparent border-none" style={{all: 'unset'}}>
                <div className="w-[200px] max-lg:w-[150px] border-2 border-[#1b4f72] h-[200px] max-lg:h-[150px] bg-[#3c8c2c] text-white rounded-lg flex flex-col gap-3 justify-center items-center hover:scale-90 transition-all cursor-pointer">
                  <div className="w-10 h-10" style={{ background: "url('/images/reports/itemReport.png') no-repeat", backgroundSize: 'cover' }} />
                  <p className="text-center max-sm:text-sm">Stock Report</p>
                </div>
              </button>
              {/* Loyalty Point Income Report */}
              <button type="button" onClick={handleLoyaltyPointReport} className="p-0 bg-transparent border-none" style={{all: 'unset'}}>
                <div className="w-[200px] max-lg:w-[150px] border-2 border-[#1b4f72] h-[200px] max-lg:h-[150px] bg-[#3c8c2c] text-white rounded-lg flex flex-col gap-3 justify-center items-center hover:scale-90 transition-all cursor-pointer">
                  <div className="w-10 h-10" style={{ background: "url('/images/reports/point-income.png') no-repeat", backgroundSize: 'cover' }} />
                  <p className="text-center max-sm:text-sm">Loyalty Point Income Report</p>
                </div>
              </button>
              {/* Custom Summary Report */}
              <button type="button" onClick={handleCustomSummary} className="p-0 bg-transparent border-none" style={{all: 'unset'}}>
                <div className="w-[200px] max-lg:w-[150px] border-2 border-[#1b4f72] h-[200px] max-lg:h-[150px] bg-[#125ee6] text-white rounded-lg flex flex-col gap-3 justify-center items-center hover:scale-90 transition-all cursor-pointer">
                  <div className="w-10 h-10" style={{ background: "url('/images/reports/salesReport.png') no-repeat", backgroundSize: 'cover' }} />
                  <p className="text-center max-sm:text-sm">Custom Summary Report</p>
                </div>
              </button>
              {/* Daily Summary Report */}
              <button type="button" onClick={handleDailySummary} className="p-0 bg-transparent border-none" style={{all: 'unset'}}>
                <div className="w-[200px] max-lg:w-[150px] border-2 border-[#1b4f72] h-[200px] max-lg:h-[150px] bg-[#4f46e5] text-white rounded-lg flex flex-col gap-3 justify-center items-center hover:scale-90 transition-all cursor-pointer">
                  <div className="w-10 h-10" style={{ background: "url('/images/reports/salesReport.png') no-repeat", backgroundSize: 'cover' }} />
                  <p className="text-center max-sm:text-sm">Daily Summary Report</p>
                </div>
              </button>
              {/* Monthly Summary Report */}
              <button type="button" onClick={handleMonthlySummary} className="p-0 bg-transparent border-none" style={{all: 'unset'}}>
                <div className="w-[200px] max-lg:w-[150px] border-2 border-[#1b4f72] h-[200px] max-lg:h-[150px] bg-[#7c3aed] text-white rounded-lg flex flex-col gap-3 justify-center items-center hover:scale-90 transition-all cursor-pointer">
                  <div className="w-10 h-10" style={{ background: "url('/images/reports/salesReport.png') no-repeat", backgroundSize: 'cover' }} />
                  <p className="text-center max-sm:text-sm">Monthly Summary Report</p>
                </div>
              </button>
              {/* Yearly Summary Report */}
              <button type="button" onClick={handleYearlySummary} className="p-0 bg-transparent border-none" style={{all: 'unset'}}>
                <div className="w-[200px] max-lg:w-[150px] border-2 border-[#1b4f72] h-[200px] max-lg:h-[150px] bg-[#dc2626] text-white rounded-lg flex flex-col gap-3 justify-center items-center hover:scale-90 transition-all cursor-pointer">
                  <div className="w-10 h-10" style={{ background: "url('/images/reports/salesReport.png') no-repeat", backgroundSize: 'cover' }} />
                  <p className="text-center max-sm:text-sm">Yearly Summary Report</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ReportsPage;
