import React, { useMemo, useState } from 'react';
import './Ledger.css';

const summaryCards = [
  {
    id: 'totalSalesModal',
    title: 'Total Sales',
    value: 'LKR 14,300.00',
    description: 'Cash In + Customer Receivable',
    color: 'cyan',
    icon: 'fa-chart-line',
  },
  {
    id: 'cashInModal',
    title: 'Total Cash In',
    value: 'LKR 14,300.00',
    description: 'Invoices: 14,300.00 | Cheques: 0.00',
    color: 'green',
    icon: 'fa-arrow-circle-down',
  },
  {
    id: 'cashOutModal',
    title: 'Total Cash Out',
    value: 'LKR 0.00',
    description: 'Supplier Invoices: 0.00 | Expenses: 0.00',
    color: 'red',
    icon: 'fa-arrow-circle-up',
  },
  {
    id: null,
    title: 'Net Cash',
    value: 'LKR 14,300.00',
    description: 'Total Cash In - Total Cash Out',
    color: 'blue',
    icon: 'fa-dollar-sign',
  },
  {
    id: 'pettyCashModal',
    title: 'Petty Cash',
    value: 'LKR 0.00',
    description: 'Balance (Not Filtered): 0.00',
    color: 'pink',
    icon: 'fa-coins',
  },
  {
    id: 'cashInHandModal',
    title: 'Cash in Hand',
    value: 'LKR 14,300.00',
    description: 'Balance (Not Filtered): 15,250.00',
    color: 'blue',
    icon: 'fa-wallet',
  },
  {
    id: 'bankAccountsModal',
    title: 'Total in Banks',
    value: 'LKR 0.00',
    description: '0 Accounts',
    color: 'purple',
    icon: 'fa-university',
  },
  {
    id: 'unpaidInvoicesModal',
    title: 'Outstanding Invoices',
    value: 'LKR 0.00',
    description: '0 Invoices (Unpaid + Partial)',
    color: 'yellow',
    icon: 'fa-file-invoice-dollar',
  },
  {
    id: 'vatIncomeModal',
    title: 'VAT Income',
    value: 'LKR 0.00',
    description: 'VAT collected on customer invoices',
    color: 'orange',
    icon: 'fa-file-invoice',
  },
  {
    id: 'customerReceivableModal',
    title: 'Customer Receivable',
    value: 'LKR 0.00',
    description: 'Total Amount Customers Owe',
    color: 'indigo',
    icon: 'fa-hand-holding-usd',
  },
  {
    id: 'supplierPayableModal',
    title: 'Supplier Payable',
    value: 'LKR 0.00',
    description: 'Total Amount We Owe to Suppliers',
    color: 'rose',
    icon: 'fa-file-invoice-dollar',
  },
];

const recentTransactions = [
  {
    date: '2026-04-01 00:51',
    typeLabel: 'Customer Invoice',
    statusLabel: 'Paid',
    description: 'Invoice | #20260410002 | Customer',
    cashIn: 14300.0,
    cashOut: 0,
    category: 'customer',
  },
  {
    date: '2026-04-01 00:32',
    typeLabel: 'Customer Invoice',
    statusLabel: 'Paid',
    description: 'Invoice | #20260410001 | BANDULA',
    cashIn: 3300.0,
    cashOut: 0,
    category: 'customer',
  },
  {
    date: '2026-04-01 00:00',
    typeLabel: 'Internal Transfer',
    statusLabel: 'Done',
    description: ' → Cashbook — Sales Billing Invoice - SALE-69CC1A57BD3D7',
    cashIn: 3300.0,
    cashOut: 0,
    category: 'cashbook',
  },
  {
    date: '2026-04-01 00:00',
    typeLabel: 'Internal Transfer',
    statusLabel: 'Done',
    description: ' → Cashbook — Sales Billing Invoice - SALE-69CC1EAAE28F9',
    cashIn: 11000.0,
    cashOut: 0,
    category: 'cashbook',
  },
];

const dailyBreakdown = Array.from({ length: 30 }, (_, index) => {
  const day = String(index + 1).padStart(2, '0');
  const date = `2026-04-${day}`;
  const isFirstDay = index === 0;

  return {
    date,
    cashIn: isFirstDay ? 14300 : 0,
    cashInTitle: 'Invoices: LKR 0.00 | Cleared Cheques: LKR 0.00 | Shift (Cash): LKR 0.00 | Shift (Bank): LKR 0.00',
    cashOut: 0,
    cashOutTitle: 'Supplier Invoices: LKR 0.00 | Cleared Cheques: LKR 0.00 | Expenses: LKR 0.00',
    expenses: 0,
    net: isFirstDay ? 14300 : 0,
  };
});

const modalCopy = {
  totalSalesModal: {
    title: 'Total Sales Breakdown',
    titleColor: 'cyan',
    introTitle: 'How is Total Sales calculated?',
    introBody: 'Total Sales = Total Cash In + Customer Receivable\nThis represents all revenue generated in the period — money already received in cash, plus money customers still owe us (unpaid and partially-paid invoices). It gives the full picture of business activity, not just what\'s in the bank.',
  },
  cashInModal: {
    title: 'Cash In Details',
    titleColor: 'green',
    introTitle: 'Where does Cash In come from?',
    introBody: 'Cash In = Paid Customer Invoices + Cleared Customer Cheques + Shift Deposits\n• Customer Invoices (Paid): Full invoice amount for fully paid invoices.\n• Customer Invoices (Partial): Only the amount actually paid so far.\n• Cleared Customer Cheques: Cheques issued by customers that have been successfully cleared by the bank.\n• Shift Deposits (Cash): Cash collected during operator shifts and deposited into cashbook or petty cash when the accountant confirms the shift.\n• Shift Deposits (Bank): Card/bank payments collected during operator shifts and deposited into a bank account when the accountant confirms the shift.',
  },
  cashOutModal: {
    title: 'Cash Out Details',
    titleColor: 'red',
    introTitle: 'Where does Cash Out go?',
    introBody: 'Cash Out = Paid Supplier Invoices + Cleared Supplier Cheques + Expenses\n• Supplier Invoices (Paid): Full invoice amount for fully paid supplier invoices.\n• Supplier Invoices (Partial): Only the amount actually paid so far.\n• Cleared Supplier Cheques: Cheques we issued to suppliers that have been cleared.\n• Expenses: Direct operating expenses paid in cash (fuel, maintenance, wages, etc.).',
  },
  bankAccountsModal: {
    title: 'Bank Accounts Details',
    titleColor: 'purple',
    introTitle: 'What does this show?',
    introBody: 'Period Net Change is the total movement of money in/out of each bank account during the selected date range (based on bank deposit records). Current Balance is the actual live balance of each account at this moment, regardless of the date filter.',
  },
  unpaidInvoicesModal: {
    title: 'Outstanding Invoices',
    titleColor: 'yellow',
    introTitle: 'What are Outstanding Invoices?',
    introBody: 'These are customer invoices that have not been fully paid yet. Two types are included: Unpaid, where the customer has not paid anything, and Partial, where the remaining balance is counted. This is not filtered by date — it shows all outstanding invoices across all time.',
  },
  customerReceivableModal: {
    title: 'Customer Receivable Details',
    titleColor: 'indigo',
    introTitle: 'What is Customer Receivable?',
    introBody: 'This is the total amount customers still owe the business — money earned but not yet collected in cash. Unpaid invoices count the full invoice amount, partial invoices count only the remaining unpaid balance. This is not filtered by date — it reflects the current state of all outstanding invoices.',
  },
  pettyCashModal: {
    title: 'Petty Cash Transactions',
    titleColor: 'pink',
    introTitle: 'What are Petty Cash Transactions?',
    introBody: 'This lists all transactions involving the Petty Cash account during the selected period — both money going out from petty cash and money coming in to petty cash. The Period Outflow is the net amount that left petty cash in the filtered period. The Current Balance is the live petty cash balance right now, regardless of dates.',
  },
  cashInHandModal: {
    title: 'Cash in Hand — Cashbook Transactions',
    titleColor: 'blue',
    introTitle: 'What are Cashbook Transactions?',
    introBody: 'This lists all transactions involving the Cashbook account during the selected period — both money coming in to the cashbook and money going out from it. The Period In-flow is the total that came into cashbook during the filtered period. The Current Balance is the live cashbook balance right now, regardless of dates.',
  },
  vatIncomeModal: {
    title: 'VAT Income Details',
    titleColor: 'orange',
    introTitle: 'What is VAT Income?',
    introBody: 'This is the total VAT (Value Added Tax) collected on customer invoices during the selected period. Only invoices with VAT enabled are counted here. The amount shown is the VAT portion only, not the full invoice value.',
  },
  supplierPayableModal: {
    title: 'Supplier Payable Details',
    titleColor: 'rose',
    introTitle: 'What is Supplier Payable?',
    introBody: 'This is the total amount the business still owes to suppliers — money we need to pay for goods or services already received. Pending invoices are counted in full, and partial invoices contribute the remaining balance. This is not filtered by date — it reflects all outstanding supplier invoices across all time.',
  },
};

const Ledger = () => {
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeModal, setActiveModal] = useState(null);
  const [fromDate, setFromDate] = useState('2026-04-01');
  const [toDate, setToDate] = useState('2026-04-30');

  React.useEffect(() => {
    setLoading(false);
  }, []);

  const visibleTransactions = useMemo(() => (
    selectedFilter === 'all'
      ? recentTransactions
      : recentTransactions.filter((transaction) => transaction.category === selectedFilter)
  ), [selectedFilter]);

  const visibleCount = visibleTransactions.length;
  const totalCashIn = visibleTransactions.reduce((sum, transaction) => sum + transaction.cashIn, 0);
  const totalCashOut = visibleTransactions.reduce((sum, transaction) => sum + transaction.cashOut, 0);
  const netDifference = totalCashIn - totalCashOut;

  const visibleFilterButtons = [
    { key: 'all', label: 'All Transactions' },
    { key: 'customer', label: 'Customer Invoices' },
    { key: 'supplier', label: 'Supplier Invoices' },
    { key: 'expense', label: 'Expenses' },
    { key: 'bank', label: 'Bank Transactions' },
    { key: 'cashbook', label: 'Cashbook Transfers' },
    { key: 'pettycash', label: 'Petty Cash Transfers' },
  ];

  const renderModal = () => {
    if (!activeModal) {
      return null;
    }

    const modal = modalCopy[activeModal];
    if (!modal) {
      return null;
    }

    const themeClassMap = {
      cyan: { title: 'text-cyan-700', panel: 'bg-cyan-50 border-cyan-200', text: 'text-cyan-700', accent: 'text-cyan-800' },
      green: { title: 'text-green-700', panel: 'bg-green-50 border-green-200', text: 'text-green-700', accent: 'text-green-800' },
      red: { title: 'text-red-700', panel: 'bg-red-50 border-red-200', text: 'text-red-700', accent: 'text-red-800' },
      purple: { title: 'text-purple-700', panel: 'bg-purple-50 border-purple-200', text: 'text-purple-700', accent: 'text-purple-800' },
      yellow: { title: 'text-yellow-700', panel: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', accent: 'text-yellow-800' },
      indigo: { title: 'text-indigo-700', panel: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', accent: 'text-indigo-800' },
      pink: { title: 'text-pink-700', panel: 'bg-pink-50 border-pink-200', text: 'text-pink-700', accent: 'text-pink-800' },
      blue: { title: 'text-blue-700', panel: 'bg-blue-50 border-blue-200', text: 'text-blue-700', accent: 'text-blue-800' },
      rose: { title: 'text-rose-700', panel: 'bg-rose-50 border-rose-200', text: 'text-rose-700', accent: 'text-rose-800' },
      orange: { title: 'text-orange-700', panel: 'bg-orange-50 border-orange-200', text: 'text-orange-700', accent: 'text-orange-800' },
    };

    const theme = themeClassMap[modal.titleColor];

    const modalBody = {
      totalSalesModal: (
        <>
          <div className={`mb-4 p-4 rounded-lg border ${theme.panel}`}>
            <p className={`text-sm font-semibold mb-1 ${theme.accent}`}><i className="fas fa-info-circle mr-1" /> {modal.introTitle}</p>
            <p className={`text-sm ${theme.text}`}><strong>Total Sales = Total Cash In + Customer Receivable</strong><br />This represents all revenue generated in the period — money already received in cash, plus money customers still owe us (unpaid and partially-paid invoices). It gives the full picture of business activity, not just what&apos;s in the bank.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-green-600 font-medium">Total Cash In</p>
              <p className="text-2xl font-bold text-green-700">LKR 14,300.00</p>
              <p className="text-xs text-green-600 mt-1">Money already received from customers</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
              <p className="text-sm text-indigo-600 font-medium">Customer Receivable</p>
              <p className="text-2xl font-bold text-indigo-700">LKR 0.00</p>
              <p className="text-xs text-indigo-600 mt-1">Money customers still owe us</p>
            </div>
          </div>
          <div className={`p-4 rounded-lg border-l-4 border-cyan-500 bg-cyan-50`}>
            <p className="text-sm text-cyan-600 font-medium">Total Sales</p>
            <p className="text-2xl font-bold text-cyan-700">LKR 14,300.00</p>
            <p className="text-xs text-cyan-600 mt-1">Formula: Total Cash In + Customer Receivable</p>
          </div>
        </>
      ),
      cashInModal: (
        <>
          <div className={`mb-4 p-4 rounded-lg border ${theme.panel}`}>
            <p className={`text-sm font-semibold mb-1 ${theme.accent}`}><i className="fas fa-info-circle mr-1" /> {modal.introTitle}</p>
            <p className={`text-sm ${theme.text}`}>
              <strong>Cash In = Paid Customer Invoices + Cleared Customer Cheques + Shift Deposits</strong><br />
              • <strong>Customer Invoices (Paid):</strong> Full invoice amount for fully paid invoices.<br />
              • <strong>Customer Invoices (Partial):</strong> Only the amount actually paid so far.<br />
              • <strong>Cleared Customer Cheques:</strong> Cheques issued by customers that have been successfully cleared by the bank.<br />
              • <strong>Shift Deposits (Cash):</strong> Cash collected during operator shifts and deposited into cashbook or petty cash when the accountant confirms the shift.<br />
              • <strong>Shift Deposits (Bank):</strong> Card/bank payments collected during operator shifts and deposited into a bank account when the accountant confirms the shift.
            </p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs">
              <span className="px-2 py-1 bg-white rounded border border-green-300 text-green-700">Invoices: LKR 14,300.00</span>
              <span className="px-2 py-1 bg-white rounded border border-green-300 text-green-700">Cleared Cheques: LKR 0.00</span>
              <span className="px-2 py-1 bg-white rounded border border-green-300 text-green-700">Shift (Cash): LKR 0.00</span>
              <span className="px-2 py-1 bg-white rounded border border-green-300 text-green-700">Shift (Bank): LKR 0.00</span>
              <span className="px-2 py-1 bg-green-200 rounded text-green-800 font-semibold">Total: LKR 14,300.00</span>
            </div>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase">Description</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-green-700 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm">2026-04-01 00:51</td>
                <td className="px-4 py-2 text-sm"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Customer Invoice (Paid)</span></td>
                <td className="px-4 py-2 text-sm">#20260410002 — Invoice | Customer</td>
                <td className="px-4 py-2 text-sm text-right font-semibold text-green-600">LKR 11,000.00</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">2026-04-01 00:32</td>
                <td className="px-4 py-2 text-sm"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Customer Invoice (Paid)</span></td>
                <td className="px-4 py-2 text-sm">#20260410001 — Invoice | BANDULA</td>
                <td className="px-4 py-2 text-sm text-right font-semibold text-green-600">LKR 3,300.00</td>
              </tr>
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan="3" className="px-4 py-2 text-sm font-bold text-right">Total:</td>
                <td className="px-4 py-2 text-sm font-bold text-right text-green-700">LKR 14,300.00</td>
              </tr>
            </tfoot>
          </table>
        </>
      ),
      cashOutModal: (
        <>
          <div className={`mb-4 p-4 rounded-lg border ${theme.panel}`}>
            <p className={`text-sm font-semibold mb-1 ${theme.accent}`}><i className="fas fa-info-circle mr-1" /> {modal.introTitle}</p>
            <p className={`text-sm ${theme.text}`}>
              <strong>Cash Out = Paid Supplier Invoices + Cleared Supplier Cheques + Expenses</strong><br />
              • <strong>Supplier Invoices (Paid):</strong> Full invoice amount for fully paid supplier invoices.<br />
              • <strong>Supplier Invoices (Partial):</strong> Only the amount actually paid so far.<br />
              • <strong>Cleared Supplier Cheques:</strong> Cheques we issued to suppliers that have been cleared.<br />
              • <strong>Expenses:</strong> Direct operating expenses paid in cash (fuel, maintenance, wages, etc.).
            </p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs">
              <span className="px-2 py-1 bg-white rounded border border-red-300 text-red-700">Supplier Invoices: LKR 0.00</span>
              <span className="px-2 py-1 bg-white rounded border border-red-300 text-red-700">Cleared Cheques: LKR 0.00</span>
              <span className="px-2 py-1 bg-white rounded border border-red-300 text-red-700">Expenses: LKR 0.00</span>
              <span className="px-2 py-1 bg-red-200 rounded text-red-800 font-semibold">Total: LKR 0.00</span>
            </div>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-red-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-red-700 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-red-700 uppercase">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-red-700 uppercase">Description</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-red-700 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr><td colSpan="4" className="px-4 py-4 text-center text-gray-500">No cash out transactions found</td></tr>
            </tbody>
          </table>
        </>
      ),
      bankAccountsModal: (
        <>
          <div className={`mb-4 p-4 rounded-lg border ${theme.panel}`}>
            <p className={`text-sm font-semibold mb-1 ${theme.accent}`}><i className="fas fa-info-circle mr-1" /> {modal.introTitle}</p>
            <p className={`text-sm ${theme.text}`}><strong>Period Net Change</strong> is the total movement of money in/out of each bank account during the selected date range (based on bank deposit records).<br /><strong>Current Balance</strong> is the actual live balance of each account at this moment, regardless of the date filter.</p>
          </div>
          <p className="text-lg font-semibold mb-2">Total Period Net Change: LKR 0.00</p>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase">Bank</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase">Account</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-purple-700 uppercase">Period Net Change</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-purple-700 uppercase">Current Balance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200"><tr><td colSpan="4" className="px-4 py-4 text-center text-gray-500">No bank accounts found</td></tr></tbody>
          </table>
        </>
      ),
      unpaidInvoicesModal: (
        <>
          <div className={`mb-4 p-4 rounded-lg border ${theme.panel}`}>
            <p className={`text-sm font-semibold mb-1 ${theme.accent}`}><i className="fas fa-info-circle mr-1" /> {modal.introTitle}</p>
            <p className={`text-sm ${theme.text}`}>These are customer invoices that <strong>have not been fully paid yet</strong>. Two types are included:<br />• <strong>Unpaid:</strong> Customer has not paid anything — the full invoice amount is outstanding.<br />• <strong>Partial:</strong> Customer has paid some of it — only the remaining balance is counted here.<br />Note: This is <strong>not filtered by date</strong> — it shows all outstanding invoices across all time.</p>
          </div>
          <p className="text-lg font-semibold mb-2">Total Owed: LKR 0.00 (0 invoices)</p>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-yellow-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-yellow-700 uppercase">Invoice</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-yellow-700 uppercase">Customer</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-yellow-700 uppercase">Fuel / Type</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-yellow-700 uppercase">Total</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-yellow-700 uppercase">Paid</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-yellow-700 uppercase">Remaining</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-yellow-700 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-yellow-700 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200"><tr><td colSpan="8" className="px-4 py-4 text-center text-gray-500">No outstanding invoices found</td></tr></tbody>
          </table>
        </>
      ),
      customerReceivableModal: (
        <>
          <div className={`mb-4 p-4 rounded-lg border ${theme.panel}`}>
            <p className={`text-sm font-semibold mb-1 ${theme.accent}`}><i className="fas fa-info-circle mr-1" /> {modal.introTitle}</p>
            <p className={`text-sm ${theme.text}`}>This is the total amount <strong>customers still owe the business</strong> — money earned but not yet collected in cash.<br />• <strong>Unpaid invoices:</strong> The customer hasn&apos;t paid at all — the full invoice amount is receivable.<br />• <strong>Partial invoices:</strong> The customer paid some — only the <em>remaining unpaid balance</em> is counted.<br />This is not filtered by date — it reflects the current state of all outstanding invoices.</p>
          </div>
          <p className="text-lg font-semibold mb-2">Total Receivable: LKR 0.00</p>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-indigo-700 uppercase">Invoice</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-indigo-700 uppercase">Customer</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-indigo-700 uppercase">Total</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-indigo-700 uppercase">Paid</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-indigo-700 uppercase">Remaining</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-indigo-700 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-indigo-700 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200"><tr><td colSpan="7" className="px-4 py-4 text-center text-gray-500">No outstanding customer invoices</td></tr></tbody>
          </table>
        </>
      ),
      pettyCashModal: (
        <>
          <div className={`mb-4 p-4 rounded-lg border ${theme.panel}`}>
            <p className={`text-sm font-semibold mb-1 ${theme.accent}`}><i className="fas fa-info-circle mr-1" /> {modal.introTitle}</p>
            <p className={`text-sm ${theme.text}`}>This lists <strong>all transactions involving the Petty Cash account</strong> during the selected period — both money going out <em>from</em> petty cash and money coming in <em>to</em> petty cash.<br />For example: petty cash sent to the cashbook, petty cash used to pay expenses, or top-ups received into petty cash from the bank — all appear here.<br />The <strong>&quot;Period Outflow&quot;</strong> is the net amount that left petty cash in the filtered period. The <strong>&quot;Current Balance&quot;</strong> is the live petty cash balance right now, regardless of dates.</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs"><span className="px-2 py-1 bg-white rounded border border-pink-300 text-pink-700">Period Outflow: LKR 0.00</span><span className="px-2 py-1 bg-pink-200 rounded text-pink-800 font-semibold">Current Balance: LKR 0.00</span></div>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-pink-50"><tr><th className="px-4 py-2 text-left text-xs font-medium text-pink-700 uppercase">Date</th><th className="px-4 py-2 text-left text-xs font-medium text-pink-700 uppercase">Sent To</th><th className="px-4 py-2 text-left text-xs font-medium text-pink-700 uppercase">Description</th><th className="px-4 py-2 text-left text-xs font-medium text-pink-700 uppercase">Reference</th><th className="px-4 py-2 text-left text-xs font-medium text-pink-700 uppercase">Performed By</th><th className="px-4 py-2 text-right text-xs font-medium text-pink-700 uppercase">Amount</th></tr></thead>
            <tbody className="bg-white divide-y divide-gray-200"><tr><td colSpan="6" className="px-4 py-4 text-center text-gray-500">No petty cash outflow transactions in this period</td></tr></tbody>
          </table>
        </>
      ),
      cashInHandModal: (
        <>
          <div className={`mb-4 p-4 rounded-lg border ${theme.panel}`}>
            <p className={`text-sm font-semibold mb-1 ${theme.accent}`}><i className="fas fa-info-circle mr-1" /> {modal.introTitle}</p>
            <p className={`text-sm ${theme.text}`}>This lists <strong>all transactions involving the Cashbook account</strong> during the selected period — both money coming in <em>to</em> the cashbook and money going out <em>from</em> it.<br />For example: cash received from petty cash, bank withdrawals deposited to cashbook, or payments made out of cashbook — all appear here.<br />The <strong>&quot;Period In-flow&quot;</strong> is the total that came into cashbook during the filtered period. The <strong>&quot;Current Balance&quot;</strong> is the live cashbook balance right now, regardless of dates.</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs"><span className="px-2 py-1 bg-white rounded border border-blue-300 text-blue-700">Period In-flow: LKR 14,300.00</span><span className="px-2 py-1 bg-blue-200 rounded text-blue-800 font-semibold">Current Balance: LKR 15,250.00</span></div>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50"><tr><th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase">Date</th><th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase">Received From</th><th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase">Description</th><th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase">Reference</th><th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase">Performed By</th><th className="px-4 py-2 text-right text-xs font-medium text-blue-700 uppercase">Amount</th></tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr><td className="px-4 py-2 text-sm whitespace-nowrap">2026-04-01 00:00</td><td className="px-4 py-2 text-sm"><span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">Unknown</span></td><td className="px-4 py-2 text-sm">Sales Billing Invoice - SALE-69CC1A57BD3D7</td><td className="px-4 py-2 text-sm text-gray-500">SALE-69CC1A57BD3D7</td><td className="px-4 py-2 text-sm text-gray-600">Admin</td><td className="px-4 py-2 text-sm text-right font-semibold text-blue-600">LKR 3,300.00</td></tr>
              <tr><td className="px-4 py-2 text-sm whitespace-nowrap">2026-04-01 00:00</td><td className="px-4 py-2 text-sm"><span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">Unknown</span></td><td className="px-4 py-2 text-sm">Sales Billing Invoice - SALE-69CC1EAAE28F9</td><td className="px-4 py-2 text-sm text-gray-500">SALE-69CC1EAAE28F9</td><td className="px-4 py-2 text-sm text-gray-600">Admin</td><td className="px-4 py-2 text-sm text-right font-semibold text-blue-600">LKR 11,000.00</td></tr>
            </tbody>
            <tfoot className="bg-gray-50"><tr><td colSpan="5" className="px-4 py-2 text-sm font-bold text-right">Total In-flow:</td><td className="px-4 py-2 text-sm font-bold text-right text-blue-700">LKR 14,300.00</td></tr></tfoot>
          </table>
        </>
      ),
      vatIncomeModal: (
        <>
          <div className={`mb-4 p-4 rounded-lg border ${theme.panel}`}>
            <p className={`text-sm font-semibold mb-1 ${theme.accent}`}><i className="fas fa-info-circle mr-1" /> {modal.introTitle}</p>
            <p className={`text-sm ${theme.text}`}>This is the total <strong>VAT (Value Added Tax) collected</strong> on customer invoices during the selected period.<br />Only invoices with <strong>VAT enabled</strong> are counted here. The amount shown is the VAT portion only, not the full invoice value.</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs"><span className="px-2 py-1 bg-white rounded border border-orange-300 text-orange-700">Invoices with VAT: 0</span><span className="px-2 py-1 bg-orange-200 rounded text-orange-800 font-semibold">Total VAT: LKR 0.00</span></div>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-orange-50"><tr><th className="px-4 py-2 text-left text-xs font-medium text-orange-700 uppercase">Invoice</th><th className="px-4 py-2 text-left text-xs font-medium text-orange-700 uppercase">Customer</th><th className="px-4 py-2 text-right text-xs font-medium text-orange-700 uppercase">Invoice Total</th><th className="px-4 py-2 text-right text-xs font-medium text-orange-700 uppercase">VAT Amount</th><th className="px-4 py-2 text-left text-xs font-medium text-orange-700 uppercase">Payment Status</th><th className="px-4 py-2 text-left text-xs font-medium text-orange-700 uppercase">Date</th></tr></thead>
            <tbody className="bg-white divide-y divide-gray-200"><tr><td colSpan="6" className="px-4 py-4 text-center text-gray-500">No VAT-enabled invoices found in this period</td></tr></tbody>
          </table>
        </>
      ),
      supplierPayableModal: (
        <>
          <div className={`mb-4 p-4 rounded-lg border ${theme.panel}`}>
            <p className={`text-sm font-semibold mb-1 ${theme.accent}`}><i className="fas fa-info-circle mr-1" /> {modal.introTitle}</p>
            <p className={`text-sm ${theme.text}`}>This is the total amount the business <strong>still owes to suppliers</strong> — money we need to pay for goods or services already received.<br />• <strong>Pending invoices:</strong> Not paid at all — the full invoice amount is owed.<br />• <strong>Partial invoices:</strong> Partially paid — only the remaining balance is counted.<br />This is <strong>not filtered by date</strong> — it reflects all outstanding supplier invoices across all time.</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs"><span className="px-2 py-1 bg-white rounded border border-rose-300 text-rose-700">Outstanding Invoices: 0</span><span className="px-2 py-1 bg-rose-200 rounded text-rose-800 font-semibold">Total Owed: LKR 0.00</span></div>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-rose-50"><tr><th className="px-4 py-2 text-left text-xs font-medium text-rose-700 uppercase">Invoice</th><th className="px-4 py-2 text-left text-xs font-medium text-rose-700 uppercase">Supplier</th><th className="px-4 py-2 text-left text-xs font-medium text-rose-700 uppercase">Description</th><th className="px-4 py-2 text-right text-xs font-medium text-rose-700 uppercase">Total</th><th className="px-4 py-2 text-right text-xs font-medium text-rose-700 uppercase">Paid</th><th className="px-4 py-2 text-right text-xs font-medium text-rose-700 uppercase">Remaining</th><th className="px-4 py-2 text-left text-xs font-medium text-rose-700 uppercase">Status</th><th className="px-4 py-2 text-left text-xs font-medium text-rose-700 uppercase">Date</th></tr></thead>
            <tbody className="bg-white divide-y divide-gray-200"><tr><td colSpan="8" className="px-4 py-4 text-center text-gray-500">No outstanding supplier invoices</td></tr></tbody>
          </table>
        </>
      ),
    };

    return (
      <div
        id={activeModal}
        className="modal-container fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setActiveModal(null);
          }
        }}
      >
        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center pb-3 border-b">
            <h3 className={`text-2xl font-bold ${theme.title}`}>{modal.title}</h3>
            <button type="button" onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-2xl" /></button>
          </div>
          <div className="mt-4">{modalBody[activeModal]}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="ledger-page min-h-dvh max-lg:h-fit flex flex-col h-dvh">
      <div className="nav bg-[#3c8c2c] w-full h-[10%] max-lg:h-[17dvh] py-6 flex justify-between items-center max-md:justify-center max-md:flex-col md:px-14 lg:px-0">
        <span className="flex items-center gap-3 ml-20 max-lg:ml-0 max-sm:scale-75">
          <button type="button" onClick={() => window.history.go(-1)} className="rounded-full w-[50px] aspect-square bg-white flex justify-center items-center hover:scale-90 transition-all">
            <i className="text-xl text-[#000000] fas fa-arrow-left" />
          </button>
          <button type="button" onClick={() => { window.location.href = '/dashboard'; }} className="p-2 text-[#000000] rounded-lg bg-white flex gap-3 justify-center items-center hover:scale-90 transition-all">
            <i className="text-xl text-[#000000] fas fa-city" />
            Go to Main Panel
          </button>
          <a href="/sales/billing" className="p-2 text-[#000000] rounded-lg bg-white flex gap-3 justify-center items-center hover:scale-90 transition-all">POS</a>
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
        <div className="text-center"><div className="spinner" /></div>
      </div>

      <div className="flex flex-col h-[85%]">
        <div className="w-full px-4 py-5 sm:px-6 lg:px-12">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <a href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                  <svg className="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" /></svg>
                  Main Panel
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" /></svg>
                  <a href="/finance" className="text-sm font-medium text-gray-700 hover:text-blue-600 ms-1 md:ms-2">Finance</a>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" /></svg>
                  <span className="text-sm font-medium text-gray-500 ms-1 md:ms-2">Ledger</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex-1 px-4 pb-6 overflow-auto sm:px-6 lg:px-12">
          <div className="flex items-center justify-between mb-6 max-sm:flex-col">
            <h1 className="text-2xl font-bold text-gray-900">Financial Ledger</h1>
            <a href="/finance/ledger/guide" className="text-sm font-semibold">Ledger Guide <i className="fas fa-arrow-right ml-3" /></a>
          </div>

          <div className="p-6 mb-6 bg-white rounded-lg shadow">
            <form className="flex flex-wrap gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">From Date</label>
                <input type="date" name="from_date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">To Date</label>
                <input type="date" name="to_date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="flex items-end">
                <button type="submit" className="px-4 py-2 text-white rounded-lg bg-[#3c8c2c] hover:opacity-90"><i className="mr-2 fas fa-search" />Filter</button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {summaryCards.map((card) => {
              const colorClassMap = {
                cyan: 'bg-cyan-50 border-cyan-500 text-cyan-600',
                green: 'bg-green-50 border-green-500 text-green-600',
                red: 'bg-red-50 border-red-500 text-red-600',
                blue: 'bg-blue-50 border-blue-500 text-blue-600',
                pink: 'bg-pink-50 border-pink-500 text-pink-600',
                purple: 'bg-purple-50 border-purple-500 text-purple-600',
                yellow: 'bg-yellow-50 border-yellow-500 text-yellow-600',
                orange: 'bg-orange-50 border-orange-500 text-orange-600',
                indigo: 'bg-indigo-50 border-indigo-500 text-indigo-600',
                rose: 'bg-rose-50 border-rose-500 text-rose-600',
              };

              const cardClasses = colorClassMap[card.color];
              const content = (
                <div className={`p-6 ${cardClasses} border-l-4 rounded-lg shadow ${card.id ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}> 
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${card.color === 'red' ? 'text-red-600' : card.color === 'green' ? 'text-green-600' : card.color === 'cyan' ? 'text-cyan-600' : card.color === 'blue' ? 'text-blue-600' : card.color === 'pink' ? 'text-pink-600' : card.color === 'purple' ? 'text-purple-600' : card.color === 'yellow' ? 'text-yellow-600' : card.color === 'orange' ? 'text-orange-600' : card.color === 'indigo' ? 'text-indigo-600' : 'text-rose-600'}`}>{card.title}</p>
                      <p className={`mt-2 text-2xl font-bold ${card.color === 'red' ? 'text-red-700' : card.color === 'green' ? 'text-green-700' : card.color === 'cyan' ? 'text-cyan-700' : card.color === 'blue' ? 'text-blue-700' : card.color === 'pink' ? 'text-pink-700' : card.color === 'purple' ? 'text-purple-700' : card.color === 'yellow' ? 'text-yellow-700' : card.color === 'orange' ? 'text-orange-700' : card.color === 'indigo' ? 'text-indigo-700' : 'text-rose-700'}`}>{card.value}</p>
                      <p className={`mt-1 text-xs ${card.color === 'red' ? 'text-red-600' : card.color === 'green' ? 'text-green-600' : card.color === 'cyan' ? 'text-cyan-600' : card.color === 'blue' ? 'text-blue-600' : card.color === 'pink' ? 'text-pink-600' : card.color === 'purple' ? 'text-purple-600' : card.color === 'yellow' ? 'text-yellow-600' : card.color === 'orange' ? 'text-orange-600' : card.color === 'indigo' ? 'text-indigo-600' : 'text-rose-600'}`}>{card.description}</p>
                    </div>
                    <i className={`text-4xl ${card.color === 'red' ? 'text-red-500' : card.color === 'green' ? 'text-green-500' : card.color === 'cyan' ? 'text-cyan-500' : card.color === 'blue' ? 'text-blue-500' : card.color === 'pink' ? 'text-pink-500' : card.color === 'purple' ? 'text-purple-500' : card.color === 'yellow' ? 'text-yellow-500' : card.color === 'orange' ? 'text-orange-500' : card.color === 'indigo' ? 'text-indigo-500' : 'text-rose-500'} fas ${card.icon}`} />
                  </div>
                </div>
              );

              if (!card.id) {
                return <div key={card.title}>{content}</div>;
              }

              return (
                <button type="button" key={card.title} onClick={() => setActiveModal(card.id)} className="text-left" style={{ all: 'unset' }}>
                  {content}
                </button>
              );
            })}
          </div>

          <div className="mb-6 overflow-auto bg-white rounded-lg shadow">
            <div className="px-6 py-4 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Bank Account Balances (Period Activity)</h2>
              <p className="mt-1 text-sm text-gray-600">Showing transaction activity from {fromDate} to {toDate}</p>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="text-xs text-white uppercase bg-[#3c8c2c]"><tr><th className="px-4 py-2">Bank</th><th className="px-4 py-2">Account Name</th><th className="px-4 py-2">Account Number</th><th className="px-4 py-2">Account Type</th><th className="px-4 py-2">Period Net Change</th><th className="px-4 py-2">Current Balance</th></tr></thead>
              <tbody className="bg-white divide-y divide-gray-200"><tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No active bank accounts</td></tr><tr className="bg-gray-50"><td colSpan="4" className="px-6 py-4 text-sm font-bold text-right text-gray-900">Total:</td><td className="px-6 py-4 text-sm font-bold text-right text-green-600 whitespace-nowrap">LKR 0.00</td><td className="px-6 py-4 text-sm font-bold text-right text-gray-900 whitespace-nowrap">LKR 0.00</td></tr></tbody>
            </table>
          </div>

          <div className="mb-6 overflow-auto bg-white rounded-lg shadow">
            <div className="px-6 py-4 bg-gray-50"><h2 className="text-lg font-semibold text-gray-900">Supplier Balances</h2><p className="mt-1 text-sm text-gray-600">Positive balance means you owe the supplier, negative means supplier owes you</p></div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="text-xs text-white uppercase bg-[#3c8c2c]"><tr><th className="px-4 py-2">Supplier Name</th><th className="px-4 py-2">Contact Number</th><th className="px-4 py-2">Opening Balance</th><th className="px-4 py-2">Current Balance</th><th className="px-4 py-2">Balance Change</th></tr></thead>
              <tbody className="bg-white divide-y divide-gray-200"><tr><td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">sample supplier</td><td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">1223567870</td><td className="px-6 py-4 text-sm text-right whitespace-nowrap text-red-600">LKR 0.00</td><td className="px-6 py-4 text-sm font-semibold text-right whitespace-nowrap text-green-600">LKR -1,200.00</td><td className="px-6 py-4 text-sm text-right whitespace-nowrap text-green-600">-1,200.00</td></tr><tr className="bg-gray-50"><td colSpan="2" className="px-6 py-4 text-sm font-bold text-right text-gray-900">Total:</td><td className="px-6 py-4 text-sm font-bold text-right whitespace-nowrap text-red-600">LKR 0.00</td><td className="px-6 py-4 text-sm font-bold text-right whitespace-nowrap text-green-600">LKR -1,200.00</td><td className="px-6 py-4 text-sm font-bold text-right whitespace-nowrap text-green-600">-1,200.00</td></tr></tbody>
            </table>
          </div>

          <div className="mb-6 overflow-auto bg-white rounded-lg shadow">
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2></div>
              <div className="flex flex-wrap gap-2 mb-4">
                {visibleFilterButtons.map((button) => (
                  <button key={button.key} type="button" onClick={() => setSelectedFilter(button.key)} className={`transaction-filter-btn px-3 py-1 text-xs font-medium rounded-full ${selectedFilter === button.key ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="text-xs text-white uppercase bg-[#3c8c2c]"><tr><th className="px-4 py-2">Date</th><th className="px-4 py-2">Type</th><th className="px-4 py-2">Description</th><th className="px-4 py-2">Cash In</th><th className="px-4 py-2">Cash Out</th></tr></thead>
              <tbody className="bg-white divide-y divide-gray-200" id="transactions-tbody">
                {visibleTransactions.map((transaction) => (
                  <tr key={`${transaction.date}-${transaction.description}`} className="transaction-row hover:bg-gray-50" data-type={transaction.typeLabel.toLowerCase()} data-category={transaction.category}>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{transaction.date}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${transaction.category === 'customer' ? 'bg-green-100 text-green-800' : transaction.category === 'cashbook' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{transaction.typeLabel}</span>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">{transaction.statusLabel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-right text-green-600 whitespace-nowrap">{transaction.cashIn ? `LKR ${transaction.cashIn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-right text-red-600 whitespace-nowrap">{transaction.cashOut ? `LKR ${transaction.cashOut.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr className="font-bold">
                  <td colSpan="3" className="px-6 py-4 text-sm text-right text-gray-900">Totals ({visibleCount} transactions):</td>
                  <td className="px-6 py-4 text-sm font-bold text-right text-green-700 whitespace-nowrap">LKR {totalCashIn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 text-sm font-bold text-right text-red-700 whitespace-nowrap">LKR {totalCashOut.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                <tr className="font-bold bg-blue-50">
                  <td colSpan="3" className="px-6 py-4 text-sm text-right text-gray-900">Net Difference (Cash In - Cash Out):</td>
                  <td colSpan="2" className={`px-6 py-4 text-sm font-bold text-right whitespace-nowrap ${netDifference >= 0 ? 'text-green-700' : 'text-red-700'}`}>LKR {netDifference.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="overflow-auto bg-white rounded-lg shadow">
            <div className="px-6 py-4 bg-gray-50"><h2 className="text-lg font-semibold text-gray-900">Daily Breakdown</h2><p className="mt-1 text-xs text-gray-500">Hover over Cash In / Cash Out amounts to see sub-totals.</p></div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="text-xs text-white uppercase bg-[#3c8c2c]"><tr><th className="px-4 py-2">Date</th><th className="px-4 py-2 text-right">Cash In</th><th className="px-4 py-2 text-right">Cash Out</th><th className="px-4 py-2 text-right">Expenses</th><th className="px-4 py-2 text-right">Net</th></tr></thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dailyBreakdown.map((day) => (
                  <tr key={day.date} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{day.date}</td>
                    <td className="px-6 py-4 text-sm text-right text-green-700 whitespace-nowrap"><span title={day.cashInTitle} className="cursor-help border-b border-dashed border-green-400">LKR {day.cashIn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></td>
                    <td className="px-6 py-4 text-sm text-right text-red-600 whitespace-nowrap"><span title={day.cashOutTitle} className="cursor-help border-b border-dashed border-red-400">LKR {day.cashOut.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></td>
                    <td className="px-6 py-4 text-sm text-right text-orange-600 whitespace-nowrap">LKR {day.expenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-right whitespace-nowrap text-green-600">LKR {day.net.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr className="font-bold">
                  <td className="px-6 py-4 text-sm text-right text-gray-900">Totals:</td>
                  <td className="px-6 py-4 text-sm text-right text-green-700 whitespace-nowrap">LKR 14,300.00</td>
                  <td className="px-6 py-4 text-sm text-right text-red-600 whitespace-nowrap">LKR 0.00</td>
                  <td className="px-6 py-4 text-sm text-right text-orange-600 whitespace-nowrap">LKR 0.00</td>
                  <td className="px-6 py-4 text-sm font-bold text-right whitespace-nowrap text-green-700">LKR 14,300.00</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {renderModal()}

      <div className="flex-grow" />
      <footer className="bg-[#3c8c2c] py-4 text-center text-[#ffffff]"><p>2026 © All Rights Reserved | Hypermart | Designed and Developed by Silicon Radon Networks (Pvt) Ltd</p></footer>
    </div>
  );
};

export default Ledger;