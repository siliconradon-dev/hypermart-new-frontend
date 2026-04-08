import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import './Billing.css';
import Footer from '../../components/Footer';

function Billing({ onBackToMain }) {
  const paymentSourceOptions = ['Cash Book', 'Cash', 'Card', 'Cheque', 'Credit', 'Bank Transfer'];
  const createPaymentSourceRow = () => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    source: 'Cash Book',
    amount: '0.00',
    query: '',
    isOpen: false,
  });

  const [pricingMode, setPricingMode] = useState('retail');
  const [itemCount, setItemCount] = useState('1.00');
  const [paymentRows, setPaymentRows] = useState([createPaymentSourceRow()]);
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBillNameModal, setShowBillNameModal] = useState(false);
  const [billName, setBillName] = useState('');
  const [billNameError, setBillNameError] = useState(false);

  const frontendOnlyNotice = (action) => {
    alert(`Frontend-only mode: ${action}`);
  };

  const handleToggleFullscreen = async () => {
    const doc = document;
    const element = doc.documentElement;
    const isFullscreen = Boolean(doc.fullscreenElement);

    try {
      if (!isFullscreen) {
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        }
      } else if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      }
    } catch {
      frontendOnlyNotice('Fullscreen is blocked by the browser');
    }
  };

  const getItemCountNumber = () => {
    const parsed = Number.parseFloat(itemCount);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatCount = (value) => {
    const rounded = Math.max(0, Math.round(value * 100) / 100);
    return rounded.toFixed(2);
  };

  const decreaseItemCount = () => {
    setItemCount((prev) => {
      const current = Number.isFinite(Number.parseFloat(prev)) ? Number.parseFloat(prev) : 0;
      return formatCount(Math.max(0, current - 1));
    });
  };

  const increaseItemCount = () => {
    setItemCount((prev) => {
      const current = Number.isFinite(Number.parseFloat(prev)) ? Number.parseFloat(prev) : 0;
      return formatCount(current + 1);
    });
  };

  const handleItemCountChange = (value) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setItemCount(value);
    }
  };

  const handleItemCountBlur = () => {
    if (itemCount === '' || itemCount === '.') {
      setItemCount('0.00');
      return;
    }
    setItemCount(formatCount(getItemCountNumber()));
  };

  const updatePaymentRow = (rowId, updater) => {
    setPaymentRows((prev) => prev.map((row) => (row.id === rowId ? updater(row) : row)));
  };

  const handleAddPaymentRow = () => {
    setPaymentRows((prev) => [...prev.map((row) => ({ ...row, isOpen: false })), createPaymentSourceRow()]);
  };

  const handleRemovePaymentRow = (rowId) => {
    setPaymentRows((prev) => {
      const remaining = prev.filter((row) => row.id !== rowId);
      if (remaining.length === 0) {
        return [createPaymentSourceRow()];
      }
      return remaining;
    });
  };

  const handleTogglePaymentSourceDropdown = (rowId) => {
    setPaymentRows((prev) =>
      prev.map((row) => {
        if (row.id === rowId) {
          return { ...row, isOpen: !row.isOpen };
        }
        return { ...row, isOpen: false };
      }),
    );
  };

  const handlePaymentSourceQueryChange = (rowId, query) => {
    updatePaymentRow(rowId, (row) => ({ ...row, query }));
  };

  const handleSelectPaymentSource = (rowId, source) => {
    updatePaymentRow(rowId, (row) => ({ ...row, source, query: '', isOpen: false }));
  };

  const handlePaymentAmountChange = (rowId, value) => {
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }
    updatePaymentRow(rowId, (row) => ({ ...row, amount: value }));
  };

  const handlePaymentAmountBlur = (rowId) => {
    updatePaymentRow(rowId, (row) => {
      const parsed = Number.parseFloat(row.amount);
      if (!Number.isFinite(parsed)) {
        return { ...row, amount: '0.00' };
      }
      return { ...row, amount: Math.max(0, parsed).toFixed(2) };
    });
  };

  const splitTotal = paymentRows
    .reduce((total, row) => total + (Number.isFinite(Number.parseFloat(row.amount)) ? Number.parseFloat(row.amount) : 0), 0)
    .toFixed(2);

  useEffect(() => {
    const handleShortcut = (event) => {
      if (!event.ctrlKey) {
        return;
      }

      const isIncrease = event.key === '+' || event.key === '=' || event.code === 'NumpadAdd';
      const isDecrease = event.key === '-' || event.code === 'NumpadSubtract';

      if (isIncrease) {
        event.preventDefault();
        increaseItemCount();
      }

      if (isDecrease) {
        event.preventDefault();
        decreaseItemCount();
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => {
      window.removeEventListener('keydown', handleShortcut);
    };
  }, []);

  return (
    <>
      <div className="billing-page h-dvh max-lg:h-fit">
        <Header onBackToMain={onBackToMain} showFullscreen onToggleFullscreen={handleToggleFullscreen} />

        <div className="h-[90%] flex flex-col">
          <div className="px-12 py-5 max-sm:px-6">
            <nav className="flex max-md:flex-col max-md:gap-3" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <p className="inline-flex items-center text-sm font-medium text-gray-700 text-nowrap">
                    <svg className="w-3 h-3.5 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    Main Panel
                  </p>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2 text-nowrap">Sales</p>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2 text-nowrap">Billing</p>
                  </div>
                </li>
              </ol>
              <p className="md:ml-auto text-xs text-gray-600 italic">
                <strong>Shortcuts:</strong> Ctrl+Z: Focus Search | Enter: Payment
              </p>
            </nav>
          </div>

          <div className="flex h-full gap-2 px-12 pb-5 overflow-y-auto max-sm:px-6 max-xl:flex-col">
            <div className="bg-white flex flex-col w-2/3 rounded-lg border-2 border-[#00000096] max-xl:w-full">
              <div className="flex flex-col">
                <span className="bg-[#3c8c2c] h-20 max-sm:h-fit rounded-t-md flex max-lg:flex-col max-lg:py-1 justify-between px-4 items-center">
                  <span className="flex gap-3 text-white max-sm:text-sm max-sm:w-full">
                    <p>Billing system</p>
                  </span>
                  <span className="flex justify-end gap-3 max-sm:p-2 max-sm:text-sm max-sm:flex-col max-sm:w-full">
                    <button type="button" onClick={() => setShowHoldModal(true)} className="relative px-6 py-1 text-black bg-white border-2 rounded-lg">
                      View Hold List
                      <span className="absolute right-0 flex items-center justify-center w-6 h-6 text-sm text-white bg-red-500 border-2 rounded-full top-1">0</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPricingMode('retail')}
                      className={`px-6 py-1 border-2 rounded-lg ${pricingMode === 'retail' ? 'bg-[#3c8c2c] text-white' : 'text-black bg-white'}`}
                    >
                      Retail
                    </button>
                    <button
                      type="button"
                      onClick={() => setPricingMode('wholesale')}
                      className={`px-6 py-1 border-2 rounded-lg ${pricingMode === 'wholesale' ? 'bg-[#3c8c2c] text-white' : 'text-black bg-white'}`}
                    >
                      Wholesale
                    </button>
                  </span>
                </span>

                <div className="flex gap-3 p-2 h-fit max-sm:flex-col max-sm:items-center">
                  <div className="custom-select sm:w-1/3">
                    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" defaultValue="">
                      <option value="">No customers available</option>
                    </select>
                  </div>

                  <button type="button" onClick={() => setShowCustomerModal(true)} className="text-white w-fit bg-[#3c8c2c] rounded-lg text-sm px-5 py-2.5 inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-1">
                      <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Enter a valid barcode" />
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                      <button type="button" onClick={decreaseItemCount} className="px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-l-lg"><i className="fas fa-minus text-sm" /></button>
                      <input
                        type="text"
                        inputMode="decimal"
                        className="w-16 text-center border-0 bg-transparent text-sm font-medium"
                        value={itemCount}
                        onChange={(e) => handleItemCountChange(e.target.value)}
                        onBlur={handleItemCountBlur}
                      />
                      <button type="button" onClick={increaseItemCount} className="px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-r-lg"><i className="fas fa-plus text-sm" /></button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative h-full max-h-screen overflow-x-auto overflow-y-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-black uppercase bg-[#00000042]">
                    <tr>
                      <th className="px-6 py-3 rounded-tl-lg">Item Name</th>
                      <th className="px-6 py-3">Qty</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3">Discount (%)</th>
                      <th className="px-6 py-3">Discount (Rs)</th>
                      <th className="px-6 py-3">Subtotal</th>
                      <th className="px-6 py-3 rounded-tr-lg" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">No items available.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-[#0000000F] h-[200px] max-xl:h-fit flex flex-col rounded-b-lg">
                <span className="flex gap-3 h-fit w-full justify-evenly py-3 border-[#00000096] border-t-2 border-b-2 max-md:text-sm max-sm:text-xs max-md:flex-col max-md:p-2">
                  <p>Total Items: <span>0</span></p>
                  <p>Total Quantity: <span>0</span></p>
                  <p>Total Amount: Rs.<span>0.00</span></p>
                  <p>Grand Total: Rs. <span>0.00</span></p>
                </span>

                <div className="flex items-center max-lg:flex-col">
                  <div className="p-0 mt-4 text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-800 sm:p-6 lg:p-4" />

                  <div className="flex flex-col w-1/2 gap-2 p-2 max-lg:w-full">
                    <div className="flex items-center justify-between max-sm:flex-col">
                      <label htmlFor="itemDiscount" className="block text-sm font-medium text-gray-900 lg:w-full text-end lg:pr-2 max-sm:text-xs">Discount</label>
                      <input type="text" id="itemDiscount" className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-100 sm:w-fit" placeholder="0" value="0" readOnly />
                    </div>
                  </div>

                  <div className="grid w-1/2 grid-flow-col grid-cols-2 grid-rows-2 gap-4 p-2 max-lg:w-full">
                    <button type="button" onClick={() => setShowPaymentModal(true)} className="row-span-2 gap-2 flex justify-center items-center text-white bg-[#3c8c2c] rounded-lg text-sm px-5 py-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cash" viewBox="0 0 16 16">
                        <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                        <path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2z" />
                      </svg>
                      Pay All (Enter)
                    </button>
                    <button type="button" onClick={() => setShowBillNameModal(true)} className="col-span-2 px-5 py-2 text-sm text-white bg-[#3c8c2c] rounded-lg flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                      </svg>
                      Hold All
                    </button>
                    <button type="button" onClick={() => frontendOnlyNotice('Cancel billing')} className="col-span-2 px-5 py-2 text-sm text-white bg-red-600 rounded-lg flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-slash-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708" />
                      </svg>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-1/3 border-2 rounded-lg max-md:w-full max-xl:w-full overflow-hidden">
              <span className="flex-shrink-0 p-3 bg-[#0000000F] border-b-2 min-h-[65px] relative">
                <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Search for items..." />
                <button type="button" className="absolute right-5 top-5" onClick={() => frontendOnlyNotice('Stop searching')}><i className="fas fa-times" /></button>
                <button type="button" className="absolute right-10 top-5" onClick={() => frontendOnlyNotice('Search items')}><i className="fas fa-search" /></button>
              </span>
              <div className="flex-1 grid grid-cols-3 gap-3 overflow-y-auto p-3 auto-rows-max">
                <div className="col-span-full py-10 text-center text-sm text-gray-500">No items available.</div>
              </div>
              <nav className="flex items-center justify-between px-3 py-2 border-t border-gray-200 bg-white">
                <p className="text-sm leading-5 text-gray-700">Showing 0 to 0 of 0 results</p>
                <div className="relative z-0 inline-flex rounded-md shadow-sm">
                  <button type="button" className="px-3 py-1 text-sm border border-gray-300 bg-white text-gray-700 rounded-l-md">Prev</button>
                  <button type="button" className="px-3 py-1 text-sm border-t border-b border-gray-300 bg-blue-600 text-white">1</button>
                  <button type="button" className="px-3 py-1 text-sm border border-gray-300 bg-white text-gray-700 rounded-r-md">Next</button>
                </div>
              </nav>
            </div>
          </div>
        </div>

        {showBillNameModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="p-6 bg-white rounded-lg shadow-lg w-96">
              <h2 className="mb-4 text-xl font-semibold">Enter Bill Name</h2>
              <input
                type="text"
                className="w-full p-2 mb-2 border rounded"
                placeholder="Enter a name for this bill"
                value={billName}
                onChange={(e) => {
                  setBillName(e.target.value);
                  if (billNameError) setBillNameError(false);
                }}
              />
              {billNameError && <p className="mt-1 mb-3 text-xs text-red-500">Bill name is required!</p>}
              <div className="flex justify-end space-x-2">
                <button type="button" className="px-4 py-2 text-gray-700 bg-gray-300 rounded" onClick={() => setShowBillNameModal(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-white bg-blue-500 rounded"
                  onClick={() => {
                    if (!billName.trim()) {
                      setBillNameError(true);
                      return;
                    }
                    frontendOnlyNotice('Hold order saved locally');
                    setShowBillNameModal(false);
                    setBillName('');
                    setBillNameError(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {showHoldModal && (
          <div className="fixed inset-0 z-50 flex justify-center items-center overflow-y-auto overflow-x-hidden bg-black/50">
            <div className="relative w-full max-w-2xl max-h-full p-4">
              <div className="relative bg-white rounded-lg shadow">
                <div className="flex items-center justify-between p-4 border-b rounded-t md:p-5">
                  <h3 className="text-xl font-semibold text-gray-900">Hold List</h3>
                  <button type="button" className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900" onClick={() => setShowHoldModal(false)}>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                  </button>
                </div>
                <div className="p-4 space-y-4 md:p-5">
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th className="px-6 py-3">ID</th>
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3">Ref Name</th>
                          <th className="px-6 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No hold orders found.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showCustomerModal && (
          <div className="fixed inset-0 z-50 flex justify-center items-center overflow-y-auto overflow-x-hidden bg-black/50">
            <form
              className="relative w-full max-w-2xl max-h-full p-4"
              onSubmit={(e) => {
                e.preventDefault();
                frontendOnlyNotice('Add customer save');
                setShowCustomerModal(false);
              }}
            >
              <div className="relative bg-white rounded-lg shadow">
                <div className="flex items-center justify-between p-4 border-b rounded-t md:p-5">
                  <h3 className="text-xl font-semibold text-gray-900">Add Customer</h3>
                  <button type="button" className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900" onClick={() => setShowCustomerModal(false)}>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                  </button>
                </div>
                <div className="p-4 space-y-4 md:p-5">
                  <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-black">Customer Name</label>
                      <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Enter Customer name" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-black">Mobile Number</label>
                      <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Enter Mobile Number" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-black">Email</label>
                      <input type="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Enter email" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-black">City</label>
                      <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Enter city" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-black">Address Line</label>
                      <textarea rows="2" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300" placeholder="Enter address" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-black">Due Amount</label>
                      <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Enter due amount" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b md:p-5">
                  <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5">Save</button>
                  <button type="button" onClick={() => setShowCustomerModal(false)} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4">
            <form
              className="relative w-full max-w-3xl max-h-full p-4"
              onSubmit={(e) => {
                e.preventDefault();
                frontendOnlyNotice('Payment submission');
                setShowPaymentModal(false);
              }}
            >
              <div className="relative bg-white rounded-lg shadow">
                <div className="flex items-center justify-between p-4 border-b rounded-t md:p-5">
                  <h3 className="text-xl font-semibold text-gray-900">Make Payment</h3>
                  <button type="button" className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 ms-auto" onClick={() => setShowPaymentModal(false)}>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                  </button>
                </div>

                <div className="p-4 space-y-4 md:p-5">
                  <div className="billing-payment-card mb-4 p-4 rounded-lg">
                    <label htmlFor="ci_received_amount" className="block mb-2 text-sm font-semibold text-[#2847a5]">
                      <i className="fas fa-hand-holding-usd mr-1" /> Received Amount (Cash in hand)
                    </label>
                    <input
                      type="number"
                      id="ci_received_amount"
                      name="ci_received_amount"
                      step="0.01"
                      min="0"
                      defaultValue="0.00"
                      className="billing-payment-input text-gray-900 text-lg font-semibold rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                      placeholder="Enter amount received from customer (e.g., 5000.00)"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      <i className="fas fa-info-circle mr-1" /> Enter the actual cash/amount received from the customer. Change will be calculated automatically.
                    </p>
                  </div>

                  <div className="billing-invoice-card mb-4 p-4 rounded-lg">
                    <h4 className="text-sm font-bold text-[#2f3fa3] mb-3 flex items-center gap-2">
                      <i className="fas fa-file-invoice" /> Customer Invoice
                    </h4>
                    <label className="inline-flex items-center gap-3 cursor-pointer select-none mb-3">
                      <span className="text-sm text-gray-600">Credit Bill (pay later)</span>
                      <div className="relative w-14 h-7 flex items-center">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-14 h-7 rounded-full bg-gray-300 peer-checked:bg-emerald-500 transition-colors duration-200" />
                        <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-7" />
                      </div>
                      <span className="text-sm text-gray-600">Debit Bill (paid now)</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-3">Unchecked = Credit Bill  ·  Checked = Debit Bill (requires split payment below)</p>

                    <input type="hidden" name="ci_credit_debit" value="credit" />
                    <input type="hidden" name="ci_payment_records_json" value="" />
                    <input type="hidden" name="for_oil_billings" value="yes" />

                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          <i className="fas fa-money-bill-wave text-green-600 mr-1" /> Payment Sources
                        </span>
                        <button type="button" onClick={handleAddPaymentRow} className="billing-payment-add-row px-4 py-1 text-sm font-semibold rounded">
                          <i className="fas fa-plus mr-1" /> Add Row
                        </button>
                      </div>
                      <div className="space-y-2">
                        {paymentRows.map((row) => {
                          const filteredOptions = paymentSourceOptions.filter((option) => option.toLowerCase().includes(row.query.toLowerCase()));
                          return (
                            <div key={row.id} className="billing-source-row">
                              <div className="relative col-span-7">
                                <button
                                  type="button"
                                  onClick={() => handleTogglePaymentSourceDropdown(row.id)}
                                  className="billing-source-selector w-full border border-gray-300 text-gray-900 text-sm rounded-lg py-2.5 px-3 flex items-center justify-between"
                                >
                                  <span>{row.source}</span>
                                  <i className={`fas fa-chevron-${row.isOpen ? 'up' : 'down'} text-xs text-gray-500`} />
                                </button>

                                {row.isOpen && (
                                  <div className="billing-source-dropdown absolute z-20 mt-1 w-full bg-white rounded-lg p-2">
                                    <div className="relative mb-2">
                                      <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                      <input
                                        type="text"
                                        value={row.query}
                                        onChange={(e) => handlePaymentSourceQueryChange(row.id, e.target.value)}
                                        className="billing-source-search w-full rounded-lg py-2 pl-8 pr-2 text-sm"
                                        placeholder="Search"
                                      />
                                    </div>
                                    <div className="max-h-36 overflow-y-auto">
                                      {filteredOptions.length > 0 ? (
                                        filteredOptions.map((option) => (
                                          <button
                                            key={`${row.id}-${option}`}
                                            type="button"
                                            onClick={() => handleSelectPaymentSource(row.id, option)}
                                            className="billing-source-option w-full text-left px-2 py-2 text-sm rounded"
                                          >
                                            {option}
                                          </button>
                                        ))
                                      ) : (
                                        <p className="px-2 py-2 text-xs text-gray-500">No sources found</p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <input
                                type="text"
                                inputMode="decimal"
                                value={row.amount}
                                onChange={(e) => handlePaymentAmountChange(row.id, e.target.value)}
                                onBlur={() => handlePaymentAmountBlur(row.id)}
                                className="billing-source-amount col-span-4 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                              />

                              <button type="button" onClick={() => handleRemovePaymentRow(row.id)} className="billing-source-remove col-span-1 h-[44px] text-lg font-bold rounded">×</button>
                            </div>
                          );
                        })}
                      </div>
                      <div className="billing-split-total mt-3 flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <span className="font-semibold text-gray-600 text-sm">Split Total:</span>
                        <span className="font-bold text-gray-800 text-sm">Rs. {splitTotal}</span>
                      </div>
                    </div>
                  </div>

                  <input type="hidden" name="t_products" value="0" />
                  <input type="hidden" name="t_amount" value="0.00" />
                  <input type="hidden" name="discount" value="0.00" />
                  <input type="hidden" name="order_discount_percentage" value="0" />
                  <input type="hidden" name="order_discount_amount" value="0" />
                  <input type="hidden" name="final_order_discount" value="0" />
                  <input type="hidden" name="order_discount_display" value="0" />
                  <input type="hidden" name="additional_fees_amount" value="0" />
                  <input type="hidden" name="grand_total" value="0.00" />

                  <div className="billing-summary-card rounded-lg border border-gray-200 divide-y divide-gray-200 text-sm">
                    <div className="flex justify-between px-4 py-2">
                      <span className="text-gray-500 uppercase text-xs font-medium">Total Products</span>
                      <span className="font-semibold text-gray-800">0</span>
                    </div>
                    <div className="flex justify-between px-4 py-2">
                      <span className="text-gray-500 uppercase text-xs font-medium">Total Amount</span>
                      <span className="font-semibold text-gray-800">Rs. 0.00</span>
                    </div>
                    <div className="flex justify-between px-4 py-2">
                      <span className="text-gray-500 uppercase text-xs font-medium">Discount</span>
                      <span className="font-semibold text-gray-800">Rs. 0.00</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-2">
                      <span className="text-gray-500 uppercase text-xs font-medium">Additional Discount</span>
                      <span className="flex items-center gap-2 text-xs">
                        <button type="button" className="billing-additional-clear px-3 py-1 rounded">Clear</button>
                        <input type="text" value="Discount amount" readOnly className="billing-additional-input w-32 px-2 py-1 rounded" />
                      </span>
                    </div>
                    <div className="flex justify-between px-4 py-2 bg-white">
                      <span className="text-gray-700 uppercase text-xs font-bold">Grand Total</span>
                      <span className="font-bold text-gray-900 text-base">Rs. 0.00</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b md:p-5">
                  <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5">Pay</button>
                  <button type="button" onClick={() => setShowPaymentModal(false)} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Billing;
