import { useEffect, useState, useCallback, useRef } from 'react';
import './Billing.css';
import Layout from '../../components/Layout';
import axios from 'axios';

// Backend API URL
const API_BASE_URL = 'http://localhost:3000';

// Bill Modal Component
const BillModal = ({ billHtml, salesCode, onClose }) => {
  const printTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    printTimeoutRef.current = setTimeout(() => {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(billHtml);
        printWindow.document.close();
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }
    }, 500);

    closeTimeoutRef.current = setTimeout(() => {
      onClose();
    }, 4000);

    return () => {
      if (printTimeoutRef.current) clearTimeout(printTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, [billHtml, onClose, salesCode]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden animate-slideUp">
        <div className="bg-green-500 p-4 text-white text-center">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-xl font-bold">Payment Successful!</h2>
          <p className="text-sm">Invoice: {salesCode}</p>
        </div>
        <div className="p-4 text-center">
          <div className="mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-3"></div>
            <p className="text-gray-600">Printing bill... Please wait.</p>
            <p className="text-xs text-gray-400 mt-2">Window will close automatically</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 h-1">
          <div className="bg-green-500 h-1 animate-progress"></div>
        </div>
        <div className="p-3 bg-gray-50 text-center">
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">Close</button>
        </div>
      </div>
    </div>
  );
};

// Refresh Modal Component
const RefreshModal = ({ onRefresh, onCancel }) => {
  const [countdown, setCountdown] = useState(5);
  const countdownRef = useRef(null);

  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          onRefresh();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [onRefresh]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden animate-slideUp">
        <div className="bg-blue-500 p-4 text-white text-center">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <h2 className="text-xl font-bold">Ready for Next Customer!</h2>
          <p className="text-sm">Refreshing page in {countdown} seconds...</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-gray-600 mb-4">The page will automatically refresh to start a new bill.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={onRefresh} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Refresh Now</button>
            <button onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Stay Here</button>
          </div>
        </div>
        <div className="w-full bg-gray-200 h-1">
          <div className="bg-blue-500 h-1 animate-progress" style={{ animationDuration: '5s' }}></div>
        </div>
      </div>
    </div>
  );
};

function Billing({ onBackToMain }) {
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [billData, setBillData] = useState(null);
  const [showRefreshModal, setShowRefreshModal] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const customerDropdownRef = useRef(null);
  
  const [newCustomerData, setNewCustomerData] = useState({
    customer_name: '',
    contact_number: '',
    email: '',
    city: '',
    address: ''
  });

  const [holdOrders, setHoldOrders] = useState([]);
  const [isLoadingHoldOrders, setIsLoadingHoldOrders] = useState(false);

  const [cartItems, setCartItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchTotal, setSearchTotal] = useState(0);
  const [browseItems, setBrowseItems] = useState([]);
  const [isBrowsing, setIsBrowsing] = useState(false);
  const [browseTotal, setBrowseTotal] = useState(0);
  const [browseLimit] = useState(60);
  const [browseOffset, setBrowseOffset] = useState(0);
  const searchInputRef = useRef(null);
  const barcodeInputRef = useRef(null);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleCancelRefresh = () => {
    setShowRefreshModal(false);
  };

  const handleBillModalClose = () => {
    setBillData(null);
    setTimeout(() => {
      setShowRefreshModal(true);
    }, 500);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target)) {
        setIsCustomerDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calculateTotals = useCallback(() => {
    const totalItems = cartItems.length;
    const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalAmount = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
    const totalDiscount = cartItems.reduce((sum, item) => sum + (item.discount_amount || 0), 0);
    const grandTotal = totalAmount - totalDiscount;
    return { totalItems, totalQuantity, totalAmount, totalDiscount, grandTotal };
  }, [cartItems]);

  const totals = calculateTotals();

  const loadHoldOrders = useCallback(async () => {
    setIsLoadingHoldOrders(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/billing/hold-orders`, getAuthHeaders());
      setHoldOrders(response.data.holdOrders || []);
    } catch (error) {
      console.error('Load hold orders error:', error);
    } finally {
      setIsLoadingHoldOrders(false);
    }
  }, []);

  const loadCustomers = useCallback(async (search = '') => {
    setIsLoadingCustomers(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/billing/customers/search`, {
        ...getAuthHeaders(),
        params: { search: search.trim() || '' }
      });
      setCustomers(response.data.customers || []);
    } catch (error) {
      console.error('Load customers error:', error);
      setCustomers([]);
    } finally {
      setIsLoadingCustomers(false);
    }
  }, []);

  useEffect(() => {
    if (isCustomerDropdownOpen) {
      loadCustomers(customerSearchTerm);
    }
  }, [isCustomerDropdownOpen, customerSearchTerm, loadCustomers]);

  useEffect(() => {
    if (isCustomerDropdownOpen) {
      const delayDebounce = setTimeout(() => {
        loadCustomers(customerSearchTerm);
      }, 300);
      return () => clearTimeout(delayDebounce);
    }
  }, [customerSearchTerm, isCustomerDropdownOpen, loadCustomers]);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerSearchTerm(customer.customer_name);
    setIsCustomerDropdownOpen(false);
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    setCustomerSearchTerm('');
    setIsCustomerDropdownOpen(false);
  };

  const loadBrowseItems = useCallback(async ({ offset }) => {
    setIsBrowsing(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/billing/items`, {
        ...getAuthHeaders(),
        params: {
          pricing_mode: pricingMode,
          limit: browseLimit,
          offset,
          include_out_of_stock: 1,
        },
      });
      const items = Array.isArray(response.data.items) ? response.data.items : [];
      setBrowseItems(items);
      setBrowseTotal(Number.isFinite(Number(response.data.total)) ? Number(response.data.total) : items.length);
    } catch (error) {
      console.error('Browse items error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      setBrowseItems([]);
      setBrowseTotal(0);
    } finally {
      setIsBrowsing(false);
    }
  }, [pricingMode, browseLimit]);

  useEffect(() => {
    setBrowseOffset(0);
  }, [pricingMode]);

  useEffect(() => {
    loadBrowseItems({ offset: browseOffset });
  }, [browseOffset, loadBrowseItems]);

  const searchItems = useCallback(async (search) => {
    if (!search.trim()) {
      setSearchResults([]);
      setSearchTotal(0);
      return;
    }
    setIsSearching(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/billing/search-items`, {
        ...getAuthHeaders(),
        params: {
          search: search.trim(),
          pricing_mode: pricingMode
        }
      });
      if (response.data.items) {
        setSearchResults(response.data.items);
        setSearchTotal(response.data.items.length);
      } else {
        setSearchResults([]);
        setSearchTotal(0);
      }
    } catch (error) {
      console.error('Search error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      setSearchResults([]);
      setSearchTotal(0);
    } finally {
      setIsSearching(false);
    }
  }, [pricingMode]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) {
        searchItems(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, searchItems]);

  const addItemToCart = (item, customQuantity = null) => {
    const quantity = customQuantity !== null ? customQuantity : parseFloat(itemCount);
    if (quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    if (quantity > item.stock_quantity) {
      alert(`Only ${item.stock_quantity} items available in stock`);
      return;
    }
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > item.stock_quantity) {
          alert(`Cannot add ${quantity}. Only ${item.stock_quantity - existingItem.quantity} more available.`);
          return prevItems;
        }
        return prevItems.map(i =>
          i.id === item.id
            ? {
                ...i,
                quantity: newQuantity,
                subtotal: newQuantity * i.price,
                discount_amount: (newQuantity * i.price) * (i.discount_percentage / 100)
              }
            : i
        );
      }
      const subtotal = quantity * item.price;
      const discountAmount = subtotal * (item.discount_percentage || 0) / 100;
      return [...prevItems, {
        id: item.id,
        item_code: item.item_code,
        item_name: item.item_name,
        barcode: item.barcode,
        price: item.price,
        quantity: quantity,
        stock_quantity: item.stock_quantity,
        discount_percentage: item.discount_percentage || 0,
        discount_amount: discountAmount,
        subtotal: subtotal - discountAmount,
        image_path: item.image_path
      }];
    });
    setSearchTerm('');
    setSearchResults([]);
    if (barcodeInputRef.current) {
      barcodeInputRef.current.value = '';
      barcodeInputRef.current.focus();
    }
  };

  const handleBarcodeScan = async (barcode) => {
    if (!barcode.trim()) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/api/billing/search-items`, {
        ...getAuthHeaders(),
        params: {
          search: barcode.trim(),
          pricing_mode: pricingMode
        }
      });
      if (response.data.items && response.data.items.length > 0) {
        const item = response.data.items[0];
        addItemToCart(item);
      } else {
        alert('Item not found');
      }
    } catch (error) {
      console.error('Barcode scan error:', error);
      alert('Error scanning barcode');
    }
    if (barcodeInputRef.current) {
      barcodeInputRef.current.value = '';
      barcodeInputRef.current.focus();
    }
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItemFromCart(itemId);
      return;
    }
    setCartItems(prevItems => {
      const item = prevItems.find(i => i.id === itemId);
      if (!item) return prevItems;
      if (newQuantity > item.stock_quantity) {
        alert(`Only ${item.stock_quantity} items available`);
        return prevItems;
      }
      return prevItems.map(i =>
        i.id === itemId
          ? {
              ...i,
              quantity: newQuantity,
              subtotal: newQuantity * i.price,
              discount_amount: (newQuantity * i.price) * (i.discount_percentage / 100)
            }
          : i
      );
    });
  };

  const removeItemFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateItemDiscount = (itemId, discountPercentage) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const discountAmount = (item.price * item.quantity) * (discountPercentage / 100);
          return {
            ...item,
            discount_percentage: discountPercentage,
            discount_amount: discountAmount,
            subtotal: (item.price * item.quantity) - discountAmount
          };
        }
        return item;
      })
    );
  };

  const saveHoldOrder = async () => {
    if (!billName.trim()) {
      setBillNameError(true);
      return;
    }
    if (cartItems.length === 0) {
      alert('Cannot hold empty cart');
      return;
    }
    setIsProcessing(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/billing/hold`, {
        bill_name: billName,
        cart_items: cartItems,
        totals: {
          totalQuantity: totals.totalQuantity,
          totalAmount: totals.totalAmount,
          grandTotal: totals.grandTotal
        },
        pricing_mode: pricingMode,
        discount: {
          amount: totals.totalDiscount,
          percentage: 0
        }
      }, getAuthHeaders());
      if (response.data.success) {
        alert('Order held successfully');
        setCartItems([]);
        setBillName('');
        setShowBillNameModal(false);
        loadHoldOrders();
      }
    } catch (error) {
      console.error('Save hold order error:', error);
      alert(error.response?.data?.error || 'Failed to save hold order');
    } finally {
      setIsProcessing(false);
    }
  };

  const loadHoldOrder = async (holdId) => {
    setIsProcessing(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/billing/hold/${holdId}`, getAuthHeaders());
      const { cart_items, pricing_mode } = response.data;
      setCartItems(cart_items);
      setPricingMode(pricing_mode);
      setShowHoldModal(false);
      alert('Hold order loaded successfully');
    } catch (error) {
      console.error('Load hold order error:', error);
      alert(error.response?.data?.error || 'Failed to load hold order');
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteHoldOrder = async (holdId) => {
    if (!confirm('Are you sure you want to delete this hold order?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/billing/hold/${holdId}`, getAuthHeaders());
      alert('Hold order deleted');
      loadHoldOrders();
    } catch (error) {
      console.error('Delete hold order error:', error);
      alert(error.response?.data?.error || 'Failed to delete hold order');
    }
  };

  const createNewCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomerData.customer_name.trim()) {
      alert('Customer name is required');
      return;
    }
    if (!newCustomerData.contact_number.trim()) {
      alert('Contact number is required');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/api/billing/customers`, newCustomerData, getAuthHeaders());
      if (response.data.success) {
        alert('Customer created successfully');
        handleSelectCustomer(response.data.customer);
        setNewCustomerData({
          customer_name: '',
          contact_number: '',
          email: '',
          city: '',
          address: ''
        });
        setShowCustomerModal(false);
      }
    } catch (error) {
      console.error('Create customer error:', error);
      alert(error.response?.data?.error || 'Failed to create customer');
    }
  };

  const processPayment = async (e) => {
    e.preventDefault();
    const receivedAmount = parseFloat(document.getElementById('ci_received_amount')?.value || 0);
    const creditCheckbox = document.querySelector('.peer');
    const isCreditBill = creditCheckbox ? !creditCheckbox.checked : false;
    const splitPayments = paymentRows
      .filter(row => parseFloat(row.amount) > 0)
      .map(row => ({
        source_type: row.source,
        amount: parseFloat(row.amount)
      }));
    if (!isCreditBill && splitPayments.length === 0 && receivedAmount === 0) {
      alert('Please enter payment amount');
      return;
    }
    if (cartItems.length === 0) {
      alert('No items in cart');
      return;
    }
    setIsProcessing(true);
    try {
      const paymentData = {
        customer_id: selectedCustomer?.id || null,
        customer_data: null,
        cart_items: cartItems.map(item => ({
          id: item.id,
          item_code: item.item_code,
          item_name: item.item_name,
          quantity: item.quantity,
          price: item.price,
          discount_percentage: item.discount_percentage,
          discount_amount: item.discount_amount,
          subtotal: item.subtotal,
          stock_quantity: item.stock_quantity
        })),
        totals: {
          totalAmount: totals.totalAmount,
          totalQuantity: totals.totalQuantity,
          totalDiscount: totals.totalDiscount
        },
        discount: {
          amount: totals.totalDiscount,
          percentage: 0
        },
        payment: {
          received_amount: receivedAmount,
          payment_type: splitPayments.length > 1 ? 'SPLIT' : (splitPayments[0]?.source_type || 'CASH')
        },
        split_payments: splitPayments,
        pricing_mode: pricingMode,
        sales_note: '',
        is_credit_bill: isCreditBill
      };
      const response = await axios.post(`${API_BASE_URL}/api/billing/process-payment`, paymentData, getAuthHeaders());
      if (response.data.success && response.data.bill_html) {
        setBillData({
          html: response.data.bill_html,
          salesCode: response.data.sales_code
        });
        setCartItems([]);
        handleClearCustomer();
        setShowPaymentModal(false);
        setPaymentRows([createPaymentSourceRow()]);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(error.response?.data?.error || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBarcodeKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBarcodeScan(e.target.value);
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
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        if (barcodeInputRef.current) {
          barcodeInputRef.current.focus();
        }
      }
      if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
      if (event.ctrlKey) {
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
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => {
      window.removeEventListener('keydown', handleShortcut);
    };
  }, []);

  useEffect(() => {
    if (showHoldModal) {
      loadHoldOrders();
    }
  }, [showHoldModal, loadHoldOrders]);

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
      // Silent fail
    }
  };

  return (
    <Layout onBackToMain={onBackToMain} showFullscreen onToggleFullscreen={handleToggleFullscreen}>
      <div className="billing-page h-dvh max-lg:h-fit">
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
                <strong>Shortcuts:</strong> Ctrl+Z: Focus Barcode | Ctrl+F: Focus Search | Ctrl+Plus/Minus: Change Qty
              </p>
            </nav>
          </div>

          <div className="flex h-full gap-2 px-12 pb-5 overflow-y-auto max-sm:px-6 max-xl:flex-col">
            {/* LEFT PANEL - Cart and Billing */}
            <div className="bg-white flex flex-col w-2/3 rounded-lg border-2 border-[#00000096] max-xl:w-full">
              <div className="flex flex-col">
                <span className="bg-[#3c8c2c] h-20 max-sm:h-fit rounded-t-md flex max-lg:flex-col max-lg:py-1 justify-between px-4 items-center">
                  <span className="flex gap-3 text-white max-sm:text-sm max-sm:w-full">
                    <p>Billing system</p>
                  </span>
                  <span className="flex justify-end gap-3 max-sm:p-2 max-sm:text-sm max-sm:flex-col max-sm:w-full">
                    <button type="button" onClick={() => setShowHoldModal(true)} className="relative px-6 py-1 text-black bg-white border-2 rounded-lg">
                      View Hold List
                      <span className="absolute right-0 flex items-center justify-center w-6 h-6 text-sm text-white bg-red-500 border-2 rounded-full top-1">{holdOrders.length}</span>
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

                {/* Customer Selection Row with Searchable Dropdown */}
                <div className="flex gap-3 p-2 h-fit max-sm:flex-col max-sm:items-center">
                  <div className="custom-select sm:w-1/3 relative" ref={customerDropdownRef}>
                    <div className="relative">
                      <input
  type="text"
  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 pr-10"
  placeholder="Search customer..."
  value={customerSearchTerm}
  onChange={(e) => {
    setCustomerSearchTerm(e.target.value);
    setIsCustomerDropdownOpen(true);
  }}
  onFocus={() => setIsCustomerDropdownOpen(true)}
  style={{ minWidth: '250px' }}
/>
                      {selectedCustomer && (
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700"
                          onClick={handleClearCustomer}
                        >
                          ✕
                        </button>
                      )}
                      {!selectedCustomer && (
                        <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Customer Dropdown */}
                    {isCustomerDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        {isLoadingCustomers ? (
                          <div className="p-3 text-center text-gray-500">
                            <div className="inline-block w-4 h-4 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin mr-2"></div>
                            Loading...
                          </div>
                        ) : customers.length > 0 ? (
                          <>
                            {customers.map((customer) => (
                              <div
                                key={customer.id}
                                className="p-3 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-0"
                                onClick={() => handleSelectCustomer(customer)}
                              >
                                <div className="font-medium text-gray-900">{customer.customer_name}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  <span className="mr-3">📞 {customer.contact_number}</span>
                                  {customer.due_amount > 0 && (
                                    <span className="text-red-500">Due: Rs. {customer.due_amount.toFixed(2)}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className="p-3 text-center text-gray-500">
                            {customerSearchTerm ? (
                              <>
                                No customers found matching "{customerSearchTerm}"
                              </>
                            ) : (
                              'Type to search customers'
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Selected Customer Display */}
                    {selectedCustomer && (
                      <div className="mt-1 text-xs text-green-600 flex items-center gap-2">
                        <span>✓ Selected: {selectedCustomer.customer_name}</span>
                        {selectedCustomer.due_amount > 0 && (
                          <span className="text-red-500">(Due: Rs. {selectedCustomer.due_amount.toFixed(2)})</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* New Customer Button */}
                  {/* New Customer Button - Auto width */}
{/* New Customer Button - Maximum size */}
<button 
  type="button" 
  onClick={() => setShowCustomerModal(true)} 
  className="text-white bg-[#3c8c2c] rounded-lg inline-flex items-center justify-center hover:bg-[#2d6b22] transition-colors"
  title="Add New Customer"
  style={{ height: '42px', width: '120px' }}
>
  <img 
    src="/images/sales/billing/user.svg" 
    alt="Add Customer" 
    className="brightness-0 invert"
    style={{ width: '16px', height: '16px' }}
  />
</button>

                  {/* Barcode and Quantity Input */}
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-1">
                      <input
                        ref={barcodeInputRef}
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        placeholder="Scan barcode or enter item code"
                        onKeyPress={handleBarcodeKeyPress}
                        style={{ height: '42px' }}
                      />
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50" style={{ height: '42px' }}>
                      <button type="button" onClick={decreaseItemCount} className="px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-l-lg h-full">
                        <i className="fas fa-minus text-sm" />
                      </button>
                      <input
                        type="text"
                        inputMode="decimal"
                        className="w-16 text-center border-0 bg-transparent text-sm font-medium h-full"
                        value={itemCount}
                        onChange={(e) => handleItemCountChange(e.target.value)}
                        onBlur={handleItemCountBlur}
                      />
                      <button type="button" onClick={increaseItemCount} className="px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-r-lg h-full">
                        <i className="fas fa-plus text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart Items Table */}
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
                    {cartItems.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                          No items added. Scan barcode or search items from the right panel.
                        </td>
                      </tr>
                    ) : (
                      cartItems.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {item.item_name}
                            <span className="block text-xs text-gray-500">{item.item_code}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                              >
                                -
                              </button>
                              <span className="w-12 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4">Rs. {item.price.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              className="w-16 p-1 text-sm border rounded"
                              value={item.discount_percentage}
                              onChange={(e) => updateItemDiscount(item.id, parseFloat(e.target.value) || 0)}
                              min="0"
                              max="100"
                              step="1"
                            />
                          </td>
                          <td className="px-6 py-4">Rs. {item.discount_amount.toFixed(2)}</td>
                          <td className="px-6 py-4 font-medium">Rs. {item.subtotal.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => removeItemFromCart(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer Summary */}
              <div className="bg-[#0000000F] h-[200px] max-xl:h-fit flex flex-col rounded-b-lg">
                <span className="flex gap-3 h-fit w-full justify-evenly py-3 border-[#00000096] border-t-2 border-b-2 max-md:text-sm max-sm:text-xs max-md:flex-col max-md:p-2">
                  <p>Total Items: <span>{totals.totalItems}</span></p>
                  <p>Total Quantity: <span>{totals.totalQuantity}</span></p>
                  <p>Total Amount: Rs.<span>{totals.totalAmount.toFixed(2)}</span></p>
                  <p>Grand Total: Rs. <span>{totals.grandTotal.toFixed(2)}</span></p>
                </span>

                <div className="flex items-center max-lg:flex-col">
                  <div className="p-0 mt-4 text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-800 sm:p-6 lg:p-4" />

                  <div className="flex flex-col w-1/2 gap-2 p-2 max-lg:w-full">
                    <div className="flex items-center justify-between max-sm:flex-col">
                      <label htmlFor="itemDiscount" className="block text-sm font-medium text-gray-900 lg:w-full text-end lg:pr-2 max-sm:text-xs">
                        Discount
                      </label>
                      <input
                        type="text"
                        id="itemDiscount"
                        className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-100 sm:w-fit"
                        placeholder="0"
                        value={totals.totalDiscount.toFixed(2)}
                        readOnly
                      />
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
                    <button type="button" onClick={() => {
                      if (confirm('Clear entire cart?')) {
                        setCartItems([]);
                      }
                    }} className="col-span-2 px-5 py-2 text-sm text-white bg-red-600 rounded-lg flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-slash-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708" />
                      </svg>
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL - Search Results */}
            <div className="flex flex-col w-1/3 border-2 rounded-lg max-md:w-full max-xl:w-full overflow-hidden">
              <span className="flex-shrink-0 p-3 bg-[#0000000F] border-b-2 min-h-[65px] relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 pr-20"
                  placeholder="Search for items by name..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="fas fa-times" />
                  </button>
                )}
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
                  </div>
                )}
              </span>
              
              <div className="flex-1 grid grid-cols-3 gap-3 overflow-y-auto p-3 auto-rows-max">
                {searchResults.length === 0 && !isSearching && searchTerm && (
                  <div className="col-span-full py-10 text-center text-sm text-gray-500">
                    No items found matching "{searchTerm}"
                  </div>
                )}
                {!searchTerm && isBrowsing && (
                  <div className="col-span-full py-10 text-center text-sm text-gray-500">Loading items...</div>
                )}
                {!searchTerm && !isBrowsing && browseItems.length === 0 && (
                  <div className="col-span-full py-10 text-center text-sm text-gray-500">No items available</div>
                )}
                {(searchTerm ? searchResults : browseItems).map((item) => {
                  const outOfStock = Number(item.stock_quantity) === 0;
                  const isLowStock = Number.isFinite(Number(item.minimum_qty)) && Number.isFinite(Number(item.stock_quantity)) && Number(item.minimum_qty) > Number(item.stock_quantity);
                  const imageUrl = item.image_url ? `${API_BASE_URL}${item.image_url}` : '';
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => addItemToCart(item)}
                      disabled={outOfStock}
                      className="relative group add-to-storage"
                      style={{
                        backgroundColor: outOfStock ? '#e0e0e0' : '#ffffff',
                        cursor: outOfStock ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <div className="bg-[#029ED90F] xl:h-[160px] max-xl:aspect-[4/5] flex flex-col justify-between rounded-md">
                        <span className={`bg-[#3c8c2c] h-1/6 rounded-t-md text-white flex justify-center items-center text-sm ${isLowStock ? 'bg-red-500' : ''}`}>
                          <p className="truncate">{item.item_code}</p>
                        </span>
                        <div className="flex flex-col justify-between p-1 h-5/6">
                          <center>
                            {imageUrl ? (
                              <img src={imageUrl} alt="Product image" style={{ width: 80, height: 80, borderRadius: 5 }} />
                            ) : (
                              <div style={{ width: 80, height: 80, borderRadius: 5, background: '#f3f4f6' }} />
                            )}
                          </center>
                          <span className="flex flex-col text-xs text-center h-fit">
                            <p className="truncate">{item.item_name}</p>
                            <p className="truncate">Stock: {item.stock_quantity}</p>
                          </span>
                        </div>
                      </div>
                      <span className="absolute z-10 hidden px-2 py-1 text-xs text-white bg-black rounded-md -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap group-hover:block">
                        {item.item_name}
                      </span>
                    </button>
                  );
                })}
              </div>
              
              <nav className="flex items-center justify-between px-3 py-2 border-t border-gray-200 bg-white">
                <p className="text-sm leading-5 text-gray-700">
                  Showing {(searchTerm ? searchResults : browseItems).length} of {searchTerm ? searchTotal : browseTotal} results
                </p>
                {!searchTerm && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                      disabled={isBrowsing || browseOffset === 0}
                      onClick={() => setBrowseOffset((prev) => Math.max(prev - browseLimit, 0))}
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                      disabled={isBrowsing || browseOffset + browseLimit >= browseTotal}
                      onClick={() => setBrowseOffset((prev) => prev + browseLimit)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </div>

        {/* Modals */}
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
                <button type="button" className="px-4 py-2 text-gray-700 bg-gray-300 rounded" onClick={() => setShowBillNameModal(false)}>Cancel</button>
                <button type="button" className="px-4 py-2 text-white bg-blue-500 rounded" onClick={saveHoldOrder} disabled={isProcessing}>
                  {isProcessing ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hold List Modal */}
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
                    {isLoadingHoldOrders ? (
                      <div className="text-center py-4">Loading...</div>
                    ) : holdOrders.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">No hold orders found.</div>
                    ) : (
                      <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Items</th>
                            <th className="px-6 py-3">Total</th>
                            <th className="px-6 py-3">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {holdOrders.map((order) => (
                            <tr key={order.id} className="border-b">
                              <td className="px-6 py-4">{order.bill_name || order.session_code}</td>
                              <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4">{order.total_items}</td>
                              <td className="px-6 py-4">Rs. {order.grand_total?.toFixed(2)}</td>
                              <td className="px-6 py-4">
                                <button onClick={() => loadHoldOrder(order.id)} className="px-3 py-1 mr-2 text-white bg-green-500 rounded hover:bg-green-600">Load</button>
                                <button onClick={() => deleteHoldOrder(order.id)} className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customer Modal */}
        {showCustomerModal && (
          <div className="fixed inset-0 z-50 flex justify-center items-center overflow-y-auto overflow-x-hidden bg-black/50">
            <form className="relative w-full max-w-2xl max-h-full p-4" onSubmit={createNewCustomer}>
              <div className="relative bg-white rounded-lg shadow">
                <div className="flex items-center justify-between p-4 border-b rounded-t md:p-5">
                  <h3 className="text-xl font-semibold text-gray-900">Add New Customer</h3>
                  <button type="button" className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900" onClick={() => setShowCustomerModal(false)}>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                  </button>
                </div>
                <div className="p-4 space-y-4 md:p-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-black">Customer Name *</label>
                      <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Enter Customer name" value={newCustomerData.customer_name} onChange={(e) => setNewCustomerData({...newCustomerData, customer_name: e.target.value})} required />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-black">Mobile Number *</label>
                      <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Enter Mobile Number" value={newCustomerData.contact_number} onChange={(e) => setNewCustomerData({...newCustomerData, contact_number: e.target.value})} required />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-black">Email</label>
                      <input type="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Enter email" value={newCustomerData.email} onChange={(e) => setNewCustomerData({...newCustomerData, email: e.target.value})} />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-black">City</label>
                      <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Enter city" value={newCustomerData.city} onChange={(e) => setNewCustomerData({...newCustomerData, city: e.target.value})} />
                    </div>
                    <div className="col-span-2">
                      <label className="block mb-2 text-sm font-medium text-black">Address</label>
                      <textarea rows="2" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300" placeholder="Enter address" value={newCustomerData.address} onChange={(e) => setNewCustomerData({...newCustomerData, address: e.target.value})} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b md:p-5">
                  <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5">Save Customer</button>
                  <button type="button" onClick={() => setShowCustomerModal(false)} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4">
            <form className="relative w-full max-w-3xl max-h-full p-4" onSubmit={processPayment}>
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
                      <i className="fas fa-hand-holding-usd mr-1" /> Received Amount
                    </label>
                    <input type="number" id="ci_received_amount" step="0.01" min="0" defaultValue={totals.grandTotal.toFixed(2)} className="billing-payment-input text-gray-900 text-lg font-semibold rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3" placeholder="Enter amount received" />
                    <p className="text-sm text-gray-600 mt-2"><i className="fas fa-info-circle mr-1" /> Grand Total: Rs. {totals.grandTotal.toFixed(2)}</p>
                  </div>

                  <div className="billing-invoice-card mb-4 p-4 rounded-lg">
                    <h4 className="text-sm font-bold text-[#2f3fa3] mb-3 flex items-center gap-2">
                      <i className="fas fa-file-invoice" /> Payment Type
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

                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700"><i className="fas fa-money-bill-wave text-green-600 mr-1" /> Payment Sources</span>
                        <button type="button" onClick={handleAddPaymentRow} className="billing-payment-add-row px-4 py-1 text-sm font-semibold rounded"><i className="fas fa-plus mr-1" /> Add Row</button>
                      </div>
                      <div className="space-y-2">
                        {paymentRows.map((row) => {
                          const filteredOptions = paymentSourceOptions.filter((option) => option.toLowerCase().includes(row.query.toLowerCase()));
                          return (
                            <div key={row.id} className="billing-source-row">
                              <div className="relative col-span-7">
                                <button type="button" onClick={() => handleTogglePaymentSourceDropdown(row.id)} className="billing-source-selector w-full border border-gray-300 text-gray-900 text-sm rounded-lg py-2.5 px-3 flex items-center justify-between">
                                  <span>{row.source}</span>
                                  <i className={`fas fa-chevron-${row.isOpen ? 'up' : 'down'} text-xs text-gray-500`} />
                                </button>
                                {row.isOpen && (
                                  <div className="billing-source-dropdown absolute z-20 mt-1 w-full bg-white rounded-lg p-2">
                                    <div className="relative mb-2">
                                      <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                      <input type="text" value={row.query} onChange={(e) => handlePaymentSourceQueryChange(row.id, e.target.value)} className="billing-source-search w-full rounded-lg py-2 pl-8 pr-2 text-sm" placeholder="Search" />
                                    </div>
                                    <div className="max-h-36 overflow-y-auto">
                                      {filteredOptions.length > 0 ? (
                                        filteredOptions.map((option) => (
                                          <button key={`${row.id}-${option}`} type="button" onClick={() => handleSelectPaymentSource(row.id, option)} className="billing-source-option w-full text-left px-2 py-2 text-sm rounded">{option}</button>
                                        ))
                                      ) : (
                                        <p className="px-2 py-2 text-xs text-gray-500">No sources found</p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <input type="text" inputMode="decimal" value={row.amount} onChange={(e) => handlePaymentAmountChange(row.id, e.target.value)} onBlur={() => handlePaymentAmountBlur(row.id)} className="billing-source-amount col-span-4 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5" />
                              <button type="button" onClick={() => handleRemovePaymentRow(row.id)} className="billing-source-remove col-span-1 h-[44px] text-lg font-bold rounded">×</button>
                            </div>
                          );
                        })}
                      </div>
                      <div className="billing-split-total mt-3 flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <span className="font-semibold text-gray-600">Split Total:</span>
                        <span className="font-bold text-gray-800">Rs. {splitTotal}</span>
                      </div>
                    </div>
                  </div>

                  <div className="billing-summary-card rounded-lg border border-gray-200 divide-y divide-gray-200 text-sm">
                    <div className="flex justify-between px-4 py-2">
                      <span className="text-gray-500 uppercase text-xs font-medium">Total Products</span>
                      <span className="font-semibold text-gray-800">{totals.totalItems}</span>
                    </div>
                    <div className="flex justify-between px-4 py-2">
                      <span className="text-gray-500 uppercase text-xs font-medium">Total Amount</span>
                      <span className="font-semibold text-gray-800">Rs. {totals.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between px-4 py-2">
                      <span className="text-gray-500 uppercase text-xs font-medium">Discount</span>
                      <span className="font-semibold text-gray-800">Rs. {totals.totalDiscount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between px-4 py-2 bg-white">
                      <span className="text-gray-700 uppercase text-xs font-bold">Grand Total</span>
                      <span className="font-bold text-gray-900 text-base">Rs. {totals.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b md:p-5">
                  <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5" disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                  </button>
                  <button type="button" onClick={() => setShowPaymentModal(false)} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Bill Modal - Shows after successful payment */}
        {billData && (
          <BillModal billHtml={billData.html} salesCode={billData.salesCode} onClose={handleBillModalClose} />
        )}

        {/* Refresh Modal - Shows after bill is printed */}
        {showRefreshModal && (
          <RefreshModal onRefresh={handleRefresh} onCancel={handleCancelRefresh} />
        )}
      </div>
    </Layout>
  );
}

export default Billing;