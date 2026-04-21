import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../../components/Layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../../../assets/customer-pages.css';

const Transactions = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customerIdFromUrl = searchParams.get('customer_id');
  
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState(customerIdFromUrl || '');
  const [customerOptions, setCustomerOptions] = useState([]);
  const [vehicleId, setVehicleId] = useState('');
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [flowDebit, setFlowDebit] = useState(true);
  const [sourceFrom, setSourceFrom] = useState('');
  const [sources, setSources] = useState({
    systemCash: [],
    bankAccounts: [],
    paymentMachines: [],
    cheques: []
  });
  const [singleAmount, setSingleAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });
  const [referenceNumber, setReferenceNumber] = useState('');
  const [performedBy, setPerformedBy] = useState('');
  const [performedByOptions, setPerformedByOptions] = useState([]);
  const [bankSlip, setBankSlip] = useState(null);
  const [description, setDescription] = useState('');
  const [splitEnabled, setSplitEnabled] = useState(false);
  const [splitRows, setSplitRows] = useState([
    { id: 1, source: '', amount: '' },
  ]);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/customers', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok && data.success && Array.isArray(data.customers)) {
          const options = data.customers.map(c => ({
            id: c.id,
            label: c.customer_name,
            balance: c.current_balance || 0
          }));
          setCustomerOptions(options);
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
      }
    };
    fetchCustomers();
  }, []);

  // Fetch sources (cash, banks, etc.)
  useEffect(() => {
    const fetchSources = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/customers/sources', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setSources(data.sources);
        }
      } catch (err) {
        console.error('Error fetching sources:', err);
        // Set default sources if API fails
        setSources({
          systemCash: [
            { id: 'cashbook', name: 'Cash Book', balance: 0 },
            { id: 'petty_cash', name: 'Petty Cash', balance: 0 }
          ],
          bankAccounts: [],
          paymentMachines: [],
          cheques: []
        });
      }
    };
    fetchSources();
  }, []);

  // Fetch users for performed_by dropdown
  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching users...');
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Users response status:', response.status);
      const data = await response.json();
      console.log('Users data:', data);
      
      if (response.ok && Array.isArray(data.users) && data.users.length > 0) {
        const options = data.users.map(u => ({
          value: u.id,
          label: u.name
        }));
        setPerformedByOptions(options);
        
        // Set current user as default
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.id) {
          setPerformedBy(currentUser.id);
        } else if (options.length > 0) {
          setPerformedBy(options[0].value);
        }
      } else {
        console.warn('No users found or invalid response');
        // Set default user options
        const defaultOptions = [
          { value: '1', label: 'Admin User' }
        ];
        setPerformedByOptions(defaultOptions);
        setPerformedBy('1');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      // Set default user options on error
      setPerformedByOptions([
        { value: '1', label: 'Admin User' }
      ]);
      setPerformedBy('1');
    }
  };
  fetchUsers();
}, []);

  // Fetch vehicles when customer changes
  useEffect(() => {
    if (customerId) {
      const fetchVehicles = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/customers/vehicles/${customerId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (response.ok && data.success && data.vehicles) {
            setVehicleOptions(data.vehicles);
          } else {
            setVehicleOptions([]);
          }
        } catch (err) {
          console.error('Error fetching vehicles:', err);
          setVehicleOptions([]);
        }
      };
      fetchVehicles();
    } else {
      setVehicleOptions([]);
    }
  }, [customerId]);

  const selectedCustomer = useMemo(
    () => customerOptions.find((customer) => customer.id === customerId),
    [customerId, customerOptions],
  );

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
      if (next && splitRows.length === 0) {
        setSplitRows([{ id: Date.now(), source: '', amount: '' }]);
      }
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validation
    if (!customerId) {
      alert('Please select a customer');
      return;
    }
    
    if (!splitEnabled && !sourceFrom) {
      alert('Please select a source');
      return;
    }
    
    if (!splitEnabled && (!singleAmount || parseFloat(singleAmount) <= 0)) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (splitEnabled) {
      const validRows = splitRows.filter(row => row.source && row.amount && parseFloat(row.amount) > 0);
      if (validRows.length === 0) {
        alert('Please add at least one valid split row with source and amount');
        return;
      }
    }
    
    setLoading(true);

    try {
      let bankSlipPath = null;
      
      // Upload bank slip first if exists
      if (bankSlip) {
        const uploadFormData = new FormData();
        uploadFormData.append('bank_slip', bankSlip);
        
        const token = localStorage.getItem('token');
        const uploadRes = await fetch('/api/upload/bank-slip', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: uploadFormData
        });
        
        const uploadData = await uploadRes.json();
        if (uploadRes.ok && uploadData.success) {
          bankSlipPath = uploadData.bank_slip_path;
        } else {
          throw new Error(uploadData.error || 'Failed to upload bank slip');
        }
      }
      
      // Create transaction data
      const transactionData = {
        customer_id: customerId,
        type: flowDebit ? 'debit' : 'credit',
        transaction_date: transactionDate,
        performed_by: performedBy,
        description: description || null,
        reference_number: referenceNumber || null,
        bank_slip_path: bankSlipPath,
        branch_id: null
      };
      
      if (splitEnabled) {
        transactionData.split_enabled = '1';
        const sources = [];
        const amounts = [];
        splitRows.forEach(row => {
          if (row.source && row.amount && parseFloat(row.amount) > 0) {
            sources.push(row.source);
            amounts.push(row.amount);
          }
        });
        transactionData.split_sources = sources;
        transactionData.split_amounts = amounts;
      } else {
        transactionData.split_enabled = '0';
        transactionData.source_from = sourceFrom;
        transactionData.amount = parseFloat(singleAmount);
      }
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/customers/transactions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        alert('Transaction saved successfully!');
        handleReset();
        navigate(`/customers/transactions/history/${customerId}`);
      } else {
        alert(data.error || 'Failed to save transaction');
      }
    } catch (err) {
      console.error('Error saving transaction:', err);
      alert('An error occurred while saving the transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCustomerId(customerIdFromUrl || '');
    setVehicleId('');
    setFlowDebit(true);
    setSourceFrom('');
    setSingleAmount('');
    setTransactionDate(new Date().toISOString().slice(0, 16));
    setReferenceNumber('');
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

  // Helper to render single source options with optgroups
  const renderSingleSourceOptions = () => {
    const hasSystemCash = sources.systemCash && sources.systemCash.length > 0;
    const hasBankAccounts = sources.bankAccounts && sources.bankAccounts.length > 0;
    const hasPaymentMachines = sources.paymentMachines && sources.paymentMachines.length > 0;
    const hasCheques = sources.cheques && sources.cheques.length > 0;
    
    return (
      <>
        {hasSystemCash && (
          <optgroup label="System Cash">
            {sources.systemCash.map(source => (
              <option key={source.id} value={source.id}>
                {source.name} - Rs. {source.balance.toLocaleString()}
              </option>
            ))}
          </optgroup>
        )}
        {hasBankAccounts && (
          <optgroup label="Bank Accounts">
            {sources.bankAccounts.map(source => (
              <option key={source.id} value={source.id}>
                {source.name} - Rs. {source.balance.toLocaleString()}
              </option>
            ))}
          </optgroup>
        )}
        {hasPaymentMachines && (
          <optgroup label="Card / Payment Machines">
            {sources.paymentMachines.map(source => (
              <option key={source.id} value={source.id}>
                {source.name} - Rs. {source.balance.toLocaleString()}
              </option>
            ))}
          </optgroup>
        )}
        {hasCheques && (
          <optgroup label="Cheques">
            {sources.cheques.map(source => (
              <option key={source.id} value={source.id}>
                {source.name} - Available: Rs. {source.balance.toLocaleString()}
              </option>
            ))}
          </optgroup>
        )}
      </>
    );
  };

  // Helper to render split source options for a specific row
  const renderSplitSourceOptions = (rowId) => {
    const hasSystemCash = sources.systemCash && sources.systemCash.length > 0;
    const hasBankAccounts = sources.bankAccounts && sources.bankAccounts.length > 0;
    const hasPaymentMachines = sources.paymentMachines && sources.paymentMachines.length > 0;
    const hasCheques = sources.cheques && sources.cheques.length > 0;
    
    return (
      <>
        {hasSystemCash && (
          <optgroup label="System Cash">
            {sources.systemCash.map(source => (
              <option key={`${rowId}-${source.id}`} value={source.id}>
                {source.name} - Rs. {source.balance.toLocaleString()}
              </option>
            ))}
          </optgroup>
        )}
        {hasBankAccounts && (
          <optgroup label="Bank Accounts">
            {sources.bankAccounts.map(source => (
              <option key={`${rowId}-${source.id}`} value={source.id}>
                {source.name} - Rs. {source.balance.toLocaleString()}
              </option>
            ))}
          </optgroup>
        )}
        {hasPaymentMachines && (
          <optgroup label="Card / Payment Machines">
            {sources.paymentMachines.map(source => (
              <option key={`${rowId}-${source.id}`} value={source.id}>
                {source.name} - Rs. {source.balance.toLocaleString()}
              </option>
            ))}
          </optgroup>
        )}
        {hasCheques && (
          <optgroup label="Cheques">
            {sources.cheques.map(source => (
              <option key={`${rowId}-${source.id}`} value={source.id}>
                {source.name} - Available: Rs. {source.balance.toLocaleString()}
              </option>
            ))}
          </optgroup>
        )}
      </>
    );
  };

  return (
    <Layout>
      <div className="customer-page customer-page-shell">
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-700">Processing transaction...</p>
            </div>
          </div>
        )}

        <div className="customer-content flex flex-col md:h-[85%]">
          <div className="w-full px-4 py-5 sm:px-6 lg:px-12">
            <nav aria-label="Breadcrumb" className="flex items-center justify-between max-md:flex-col">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    Main Panel
                  </button>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <button
                      onClick={() => navigate('/customers/customers')}
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 ms-1 md:ms-2"
                    >
                      Customers
                    </button>
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

              <button
                onClick={() => navigate('/customers/transactions/history')}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 whitespace-nowrap"
              >
                View All Transactions
              </button>
            </nav>
          </div>

          <div className="flex-1 px-4 pb-6 md:overflow-auto sm:px-6 lg:px-12">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">New Customer Transaction</h1>

            <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow">
              {/* Customer Selection */}
              <div className="p-4 mb-6 border-2 border-blue-200 rounded-lg bg-blue-50">
                <label className="block mb-3 text-sm font-semibold text-blue-900">Select Customer *</label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                >
                  <option value="">-- Select Customer --</option>
                  {customerOptions.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.label} (Balance: Rs. {customer.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-blue-700">Select the customer for this transaction</p>
              </div>

              {/* Vehicle Selection (if available) */}
              {vehicleOptions.length > 0 && (
                <div className="p-4 mb-6 border-2 border-blue-200 rounded-lg bg-blue-50">
                  <label className="block mb-3 text-sm font-semibold text-blue-900">Select Vehicle</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                  >
                    <option value="">-- Select Vehicle --</option>
                    {vehicleOptions.map((vehicle) => (
                      <option key={vehicle.value} value={vehicle.value}>{vehicle.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Transaction Type Toggle */}
              <div className="p-4 mb-6 border-2 border-gray-200 rounded-lg bg-gray-50">
                <label className="block mb-3 text-sm font-semibold text-gray-700">Transaction Type *</label>
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-sm font-medium text-gray-700 select-none">{source1Label}</span>
                  <div className="relative inline-block w-16 h-8">
                    <input
                      type="checkbox"
                      id="flowToggle"
                      className="hidden peer"
                      checked={flowDebit}
                      onChange={updateFlowDirection}
                    />
                    <label
                      htmlFor="flowToggle"
                      className="flex items-center justify-center w-full h-full transition-all duration-300 border-2 border-gray-300 rounded-full cursor-pointer bg-gradient-to-r from-blue-500 to-green-500 peer-checked:from-green-500 peer-checked:to-blue-500"
                    >
                      <svg
                        className="w-6 h-6 text-white transition-transform duration-300 transform"
                        style={{ transform: flowDebit ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </label>
                  </div>
                  <span className="text-sm font-medium text-gray-700 select-none">{source2Label}</span>
                </div>
                <p className="mt-2 text-xs text-center text-gray-500 select-none">{transactionTypeLabel}</p>
              </div>

              {/* Source and Amount */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Monetary Source/Destination *</label>

                  {/* Single Source */}
                  {!splitEnabled && (
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      value={sourceFrom}
                      onChange={(e) => setSourceFrom(e.target.value)}
                    >
                      <option value="">Select Source</option>
                      {renderSingleSourceOptions()}
                    </select>
                  )}

                  {/* Split Sources */}
                  {splitEnabled && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        {splitRows.map((row) => (
                          <div key={row.id} className="flex items-center gap-2">
                            <select
                              required
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              value={row.source}
                              onChange={(e) => updateSplitRow(row.id, 'source', e.target.value)}
                            >
                              <option value="">Select Source</option>
                              {renderSplitSourceOptions(row.id)}
                            </select>
                            <input
                              type="number"
                              step="0.01"
                              className="w-36 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Amount"
                              min="0.01"
                              value={row.amount}
                              onChange={(e) => updateSplitRow(row.id, 'amount', e.target.value)}
                            />
                            <button
                              type="button"
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                              onClick={() => removeSplitRow(row.id)}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                        onClick={addSplitRow}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Split Row
                      </button>
                      <p className="text-xs text-gray-500">
                        Total split: <strong>Rs. {splitTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                        splitEnabled
                          ? 'text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100'
                          : 'text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
                      }`}
                      onClick={handleToggleSplit}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      {splitEnabled ? 'Disable Split Payment' : 'Enable Split Payment'}
                    </button>
                  </div>
                </div>

                {/* Single Amount */}
                {!splitEnabled && (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Amount *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={singleAmount}
                      required={!splitEnabled}
                      min="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter amount"
                      onChange={(e) => setSingleAmount(e.target.value)}
                    />
                  </div>
                )}

                {/* Transaction Date */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Transaction Date *</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                  />
                </div>

                {/* Reference Number */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Reference Number</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Receipt #123"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                  />
                </div>

                {/* Performed By */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Performed By *</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={performedBy}
                    onChange={(e) => setPerformedBy(e.target.value)}
                  >
                    <option value="">Select User</option>
                    {performedByOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Bank Slip Upload */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Bank Slip / Receipt (JPG, PNG, PDF - Max 5MB - Optional)</label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => setBankSlip(e.target.files?.[0] || null)}
                  />
                  {bankSlip && (
                    <p className="mt-1 text-xs text-green-600">Selected: {bankSlip.name}</p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Description / Notes</label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter transaction details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  onClick={handleReset}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Save Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Transactions;