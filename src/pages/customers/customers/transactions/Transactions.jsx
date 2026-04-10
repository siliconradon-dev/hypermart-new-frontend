import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../../../components/Layout';
import '../../../../assets/customer-pages.css';

const customerOptions = [
  { id: '7db14cc2-3519-4bc1-b281-32562caa3309', label: 'BANDULA', balance: '10,000.00' },
  { id: '1', label: 'Customer', balance: '22,000.00' },
];

const sourceOptions = [
  { label: 'System Cash', items: [] },
  {
    label: 'System Cash',
    header: true,
    items: [
      { value: 'petty-cash', label: 'Petty Cash - Rs. 0.00' },
      { value: 'cashbook', label: 'Cash Book - Rs. 15,250.00' },
    ],
  },
  {
    label: 'Bank Accounts',
    header: true,
    items: [
      { value: 'bank-1', label: 'Bank Account 1 - Rs. 0.00' },
    ],
  },
  {
    label: 'Card / Payment Machines',
    header: true,
    items: [
      { value: 'card-1', label: 'Card Machine 1 - Rs. 0.00' },
    ],
  },
  {
    label: 'Cheques',
    header: true,
    items: [
      { value: 'cheque-1', label: 'Cheque 1 - Rs. 0.00' },
    ],
  },
];

const performedByOptions = [
  { value: '1', label: 'Admin (Me)' },
  { value: '5', label: 'Nimal - Super Admin' },
  { value: '2', label: 'aaaa - admin' },
  { value: '4', label: 'abc - manager' },
  { value: 'a13c2164-23b1-4a01-89ba-695a72f15edb', label: 'lakshan Karandeniyage dilupa - admin' },
  { value: '3', label: 'master admin - admin' },
  { value: 'a13c2045-d378-40a3-8e8b-5f71123d3269', label: 'wbs test - Super Admin' },
];

const Transactions = () => {
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [flowDebit, setFlowDebit] = useState(true);
  const [sourceFrom, setSourceFrom] = useState('');
  const [singleAmount, setSingleAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState('2026-04-06T00:00');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [performedBy, setPerformedBy] = useState('1');
  const [bankSlip, setBankSlip] = useState(null);
  const [description, setDescription] = useState('');
  const [splitEnabled, setSplitEnabled] = useState(false);
  const [splitRows, setSplitRows] = useState([
    { id: 1, source: '', amount: '' },
  ]);

  const selectedCustomer = useMemo(
    () => customerOptions.find((customer) => customer.id === customerId),
    [customerId],
  );

  const vehicleOptions = useMemo(() => {
    if (customerId === '7db14cc2-3519-4bc1-b281-32562caa3309') {
      return [
        { value: 'vehicle-1', label: 'ABC-1234 - Toyota Hilux (Diesel)' },
        { value: 'vehicle-2', label: 'KDY-7788 - Bajaj 3W (Petrol)' },
      ];
    }

    if (customerId === '1') {
      return [
        { value: 'vehicle-3', label: 'CAR-100 - Nissan AD (Diesel)' },
      ];
    }

    return [];
  }, [customerId]);

  useEffect(() => {
    setFlowDebit(true);
  }, []);

  useEffect(() => {
    if (vehicleOptions.length === 0) {
      setVehicleId('');
    } else if (!vehicleOptions.some((vehicle) => vehicle.value === vehicleId)) {
      setVehicleId(vehicleOptions[0].value);
    }
  }, [vehicleId, vehicleOptions]);

  const updateFlowDirection = () => {
    setFlowDebit((current) => !current);
  };

  const addSplitRow = () => {
    setSplitRows((current) => [...current, { id: Date.now(), source: '', amount: '' }]);
  };

  const updateSplitRow = (rowId, field, value) => {
    setSplitRows((current) => current.map((row) => (
      row.id === rowId ? { ...row, [field]: value } : row
    )));
  };

  const removeSplitRow = (rowId) => {
    setSplitRows((current) => {
      const remaining = current.filter((row) => row.id !== rowId);
      return remaining.length > 0 ? remaining : [{ id: Date.now(), source: '', amount: '' }];
    });
  };

  const splitTotal = splitRows.reduce((total, row) => total + (Number(row.amount) || 0), 0);

  const handleToggleSplit = () => {
    setSplitEnabled((current) => {
      const next = !current;
      if (next) {
        setSplitRows((existing) => (existing.length > 0 ? existing : [{ id: Date.now(), source: '', amount: '' }, { id: Date.now() + 1, source: '', amount: '' }]));
      }
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    window.setTimeout(() => {
      setLoading(false);
    }, 900);
  };

  const handleReset = () => {
    setCustomerId('');
    setVehicleId('');
    setFlowDebit(true);
    setSourceFrom('');
    setSingleAmount('');
    setTransactionDate('2026-04-06T00:00');
    setReferenceNumber('');
    setPerformedBy('1');
    setBankSlip(null);
    setDescription('');
    setSplitEnabled(false);
    setSplitRows([{ id: 1, source: '', amount: '' }]);
  };

  const transactionTypeLabel = flowDebit
    ? '🏦 Customer physically hands over money — Internal source balance increases, customer balance increases.'
    : '💰 We hand cash/transfer to the customer — Customer takes money home. Customer balance decreases, internal source decreases.';

  const source1Label = flowDebit ? 'Customer' : 'Us';
  const source2Label = flowDebit ? 'Us' : 'Customer';
  const typeValue = flowDebit ? 'debit' : 'credit';

  return (
    <Layout>
      <div className="customer-page customer-page-shell">
        {loading && (
          <div className="loading-overlay">
            <div className="spinner" />
          </div>
        )}

        <div className="customer-content flex flex-col md:h-[85%]">
          <div className="w-full px-4 py-5 sm:px-6 lg:px-12">
            <nav aria-label="Breadcrumb" className="flex items-center justify-between max-md:flex-col">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <p className="inline-flex items-center text-sm font-medium text-gray-700 text-nowrap">
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
                    <a href="/customers/customers" className="text-sm font-medium text-gray-700 hover:text-blue-600 ms-1 md:ms-2">Customers</a>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <span className="text-sm font-medium text-gray-500 ms-1 md:ms-2">New Customer Transaction</span>
                  </div>
                </li>
              </ol>

              <a href="/customers/transactions/history" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 whitespace-nowrap">
                View All Transactions
              </a>
            </nav>
          </div>

          <div className="flex-1 px-4 pb-6 md:overflow-auto sm:px-6 lg:px-12">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">New Customer Transaction</h1>

            <form action="/customers/customerTransactions/store" method="POST" encType="multipart/form-data" className="p-6 bg-white rounded-lg shadow" onSubmit={handleSubmit}>
              <input type="hidden" name="_token" value="lV3JlfzCkgPECFRBCdzhJF9SqMhIjHSHrPuXtcvI" autoComplete="off" />

              <div className="p-4 mb-6 border-2 border-blue-200 rounded-lg bg-blue-50">
                <label className="block mb-3 text-sm font-semibold text-blue-900">Select Customer *</label>
                <div className="custom-select">
                  <select name="customer_id" id="customerSelect" required className="customer-input">
                    <option value="">-- Select Customer --</option>
                    {customerOptions.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.label} (Balance: Rs. {customer.balance})
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 text-xs text-blue-700">Select the customer for this transaction</p>
              </div>

              {vehicleOptions.length > 0 && (
                <div className="p-4 mb-6 border-2 border-blue-200 rounded-lg bg-blue-50">
                  <label className="block mb-3 text-sm font-semibold text-blue-900">Select Vehicle</label>
                  <div className="custom-select">
                    <select name="vehicle_id" id="vehicleSelect" className="customer-input" value={vehicleId} onChange={(event) => setVehicleId(event.target.value)}>
                      <option value="">-- Select Vehicle --</option>
                      {vehicleOptions.map((vehicle) => (
                        <option key={vehicle.value} value={vehicle.value}>{vehicle.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="p-4 mb-6 border-2 border-gray-200 rounded-lg bg-gray-50">
                <label className="block mb-3 text-sm font-semibold text-gray-700">Transaction Type *</label>
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-sm font-medium text-gray-700 select-none" id="source1Label">{source1Label}</span>
                  <div className="relative inline-block w-16 h-8">
                    <input type="checkbox" id="flowToggle" className="hidden peer" checked={flowDebit} onChange={updateFlowDirection} />
                    <label htmlFor="flowToggle" className="flex items-center justify-center w-full h-full transition-all duration-300 border-2 border-gray-300 rounded-full cursor-pointer bg-gradient-to-r from-blue-500 to-green-500 peer-checked:from-green-500 peer-checked:to-blue-500">
                      <svg id="flowArrow" className="w-6 h-6 text-white transition-transform duration-300 transform" style={{ transform: flowDebit ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </label>
                  </div>
                  <span className="text-sm font-medium text-gray-700 select-none" id="source2Label">{source2Label}</span>
                </div>
                <p className="mt-2 text-xs text-center text-gray-500 select-none" id="flowDescription">{transactionTypeLabel}</p>
                <input type="hidden" name="type" id="typeInput" value={typeValue} />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Monetary Source/Destination *</label>

                  <div id="single-source-wrapper" className={splitEnabled ? 'hidden' : ''}>
                    <div className="custom-select">
                      <select name="source_from" id="sourceSelect" required={!splitEnabled} className="customer-input" value={sourceFrom} onChange={(event) => setSourceFrom(event.target.value)}>
                        <option value="">Select Source</option>
                        <optgroup label="System Cash">
                          <option value="petty-cash">Petty Cash - Rs. 0.00</option>
                          <option value="cashbook">Cash Book - Rs. 15,250.00</option>
                        </optgroup>
                        <optgroup label="Bank Accounts">
                          <option value="bank-1">Bank Account 1 - Rs. 0.00</option>
                        </optgroup>
                        <optgroup label="Card / Payment Machines">
                          <option value="card-1">Card Machine 1 - Rs. 0.00</option>
                        </optgroup>
                        <optgroup label="Cheques">
                          <option value="cheque-1">Cheque 1 - Rs. 0.00</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  <div id="split-sources-wrapper" className={splitEnabled ? 'space-y-3' : 'hidden space-y-3'}>
                    <div id="split-rows-container" className="space-y-2">
                      {splitRows.map((row, index) => (
                        <div key={row.id} className="split-row flex items-center gap-2">
                          <div className="custom-select flex-1">
                            <select
                              name="split_sources[]"
                              className="customer-input"
                              required={splitEnabled}
                              value={row.source}
                              onChange={(event) => updateSplitRow(row.id, 'source', event.target.value)}
                            >
                              <option value="">Select Source</option>
                              <optgroup label="System Cash">
                                <option value={`petty-cash-${index}`}>Petty Cash - Rs. 0.00</option>
                                <option value={`cashbook-${index}`}>Cash Book - Rs. 15,250.00</option>
                              </optgroup>
                              <optgroup label="Bank Accounts">
                                <option value={`bank-${index}`}>Bank Account 1 - Rs. 0.00</option>
                              </optgroup>
                              <optgroup label="Card / Payment Machines">
                                <option value={`card-${index}`}>Card Machine 1 - Rs. 0.00</option>
                              </optgroup>
                              <optgroup label="Cheques">
                                <option value={`cheque-${index}`}>Cheque 1 - Rs. 0.00</option>
                              </optgroup>
                            </select>
                          </div>
                          <input
                            type="number"
                            name="split_amounts[]"
                            className="split-amount-input w-36 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Amount"
                            min="0.01"
                            step="0.01"
                            required={splitEnabled}
                            value={row.amount}
                            onChange={(event) => updateSplitRow(row.id, 'amount', event.target.value)}
                          />
                          <button type="button" className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded" onClick={() => removeSplitRow(row.id)}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <button type="button" id="addSplitRowBtn" className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100" onClick={addSplitRow}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                      Add Split Row
                    </button>
                    <p className="text-xs text-gray-500">Total split: <strong id="splitTotal">Rs. {splitTotal.toFixed(2)}</strong></p>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <input type="hidden" name="split_enabled" id="splitEnabledInput" value={splitEnabled ? '1' : '0'} />
                    <button type="button" id="toggleSplitBtn" className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition ${splitEnabled ? 'text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100' : 'text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100'}`} onClick={handleToggleSplit}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                      <span id="splitToggleLabel">{splitEnabled ? 'Disable Split Payment' : 'Enable Split Payment'}</span>
                    </button>
                  </div>
                </div>

                <div id="single-amount-wrapper" className={splitEnabled ? 'hidden' : ''}>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    id="singleAmountInput"
                    value={singleAmount}
                    required={!splitEnabled}
                    min="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount"
                    onChange={(event) => setSingleAmount(event.target.value)}
                  />
                </div>

                <div><label className="block mb-2 text-sm font-medium text-gray-700">Transaction Date *</label><input
                  type="datetime-local"
                  name="transaction_date"
                  value={transactionDate}
                  onChange={(event) => setTransactionDate(event.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                /></div>
                <div><label className="block mb-2 text-sm font-medium text-gray-700">Reference Number</label><input
                  type="text"
                  name="reference_number"
                  value={referenceNumber}
                  onChange={(event) => setReferenceNumber(event.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Receipt #123"
                /></div>
                <div className="custom-select">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Performed By *</label>
                  <select name="performed_by" required className="customer-input" value={performedBy} onChange={(event) => setPerformedBy(event.target.value)}>
                    {performedByOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div><label className="block mb-2 text-sm font-medium text-gray-700">Bank Slip / Receipt (JPG, PNG, PDF - Max 5MB - Optional)</label><input
                  type="file"
                  name="bank_slip"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="transaction-file-input"
                  onChange={(event) => setBankSlip(event.target.files?.[0] || null)}
                /></div>
                <div className="md:col-span-2"><label className="block mb-2 text-sm font-medium text-gray-700">Description / Notes</label><textarea
                  name="description"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter transaction details..."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                /></div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <a href="/customers/customerTransactions" className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</a>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">Save Transaction</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="flex-grow" />
    </Layout>
  );
};

export default Transactions;
