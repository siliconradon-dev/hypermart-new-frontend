import React, { useRef, useState } from 'react';
// Simple custom searchable dropdown component
function SearchableSelect({ label, options, value, onChange, placeholder, name, required, error }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef();
  const filtered = options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));
  const selectedLabel = value ? options.find(o => o.value === value)?.label : '';
  return (
    <div className="mb-2 relative">
      <label className="block mb-2 text-sm font-medium text-black">{label}{required && <span className="text-red-500">*</span>}</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder={placeholder}
          value={open ? search : selectedLabel}
          onFocus={() => { setOpen(true); setSearch(selectedLabel); }}
          onChange={e => { setSearch(e.target.value); setOpen(true); onChange(null); }}
          autoComplete="off"
        />
        {value && (
          <button type="button" className="absolute right-2 top-2 text-gray-400" onClick={() => { onChange(null); setSearch(''); inputRef.current.focus(); }}>&times;</button>
        )}
      </div>
      {open && (
        <div className="absolute z-10 bg-white border border-gray-300 rounded w-full max-h-40 overflow-y-auto shadow">
          {filtered.length === 0 && <div className="p-2 text-gray-400">No results</div>}
          {filtered.map(opt => (
            <div
              key={opt.value}
              className="p-2 hover:bg-blue-100 cursor-pointer"
              onMouseDown={() => { onChange(opt.value); setOpen(false); setSearch(''); }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
import Header from '../../../components/Header';
import './AddItemPage.css';

function AddItemPage() {
  const [expiryEnabled, setExpiryEnabled] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState('');
  const [category, setCategory] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [categoryError, setCategoryError] = useState('');
  const [supplierError, setSupplierError] = useState('');
  const fileInputRef = useRef();

  // Example options (replace with real data as needed)
  const categoryOptions = [
    { value: '', label: 'Select category' },
    { value: '1', label: 'Sample Category' },
    { value: '2', label: 'Electronics' },
    { value: '3', label: 'Groceries' },
    { value: '4', label: 'Clothing' },
  ];
  const supplierOptions = [
    { value: '', label: 'Your supplier name' },
    { value: '1', label: 'Sample Supplier' },
    { value: '2', label: 'ABC Traders' },
    { value: '3', label: 'XYZ Distributors' },
  ];

  const handleBackToMain = () => {
    window.location.href = '/dashboard';
  };

  const handleExpiryToggle = (e) => {
    setExpiryEnabled(e.target.checked);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setImageName('');
    }
  };

  return (
    <div className="min-h-dvh max-lg:h-fit flex flex-col h-dvh">
      <Header onBackToMain={handleBackToMain} />
      <div className="flex flex-col h-[90%]">
        {/* Breadcrumbs */}
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
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Items</p>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Add Items</p>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="px-6 lg:px-12">
          <div className="flex flex-col flex-grow h-full p-6 border-2 rounded-lg">
            <form id="addItemForm" method="POST" action="#" encType="multipart/form-data">
              <div className="grid gap-6 mb-6 md:grid-cols-4">
                <div>
                  <label htmlFor="item_code" className="block mb-2 text-sm font-medium text-black ">Item Code <span className="text-gray-500">(Optional)</span></label>
                  <input type="number" id="item_code" name="item_code" max="99999" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Leave blank for auto-generate" />
                  <p id="item_code_error" className="mt-1 text-sm text-red-500"></p>
                </div>
                <div>
                  <label htmlFor="barcode" className="block mb-2 text-sm font-medium text-black ">Barcode <span className="text-gray-500">(Optional)</span></label>
                  <input type="text" id="barcode" name="barcode" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Barcode No" />
                  <p id="barcode_error" className="mt-1 text-sm text-red-500"></p>
                </div>
                <div>
                  <label htmlFor="item_name" className="block mb-2 text-sm font-medium text-black ">Item name <span className="text-red-500">*</span></label>
                  <input type="text" id="item_name" name="item_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Your Item name" />
                  <p id="item_name_error" className="mt-1 text-sm text-red-500"></p>
                </div>
                <div>
                  <SearchableSelect
                    label="Category"
                    options={categoryOptions}
                    value={category}
                    onChange={setCategory}
                    placeholder="Select or search category"
                    name="item_categories_id"
                    required
                    error={categoryError}
                  />
                </div>
              </div>
              <div className="grid gap-6 mb-6 md:grid-cols-4">
                <div>
                  <SearchableSelect
                    label="Supplier"
                    options={supplierOptions}
                    value={supplier}
                    onChange={setSupplier}
                    placeholder="Select or search supplier"
                    name="suppliers_id"
                    required
                    error={supplierError}
                  />
                </div>
                <div>
                  <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-black ">Quantity <span className="text-red-500">*</span></label>
                  <input type="number" id="quantity" name="quantity" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Qty" />
                  <p id="quantity_error" className="mt-1 text-sm text-red-500"></p>
                </div>
                <div>
                  <label htmlFor="minimum_qty" className="block mb-2 text-sm font-medium text-black ">Minimum Quantity <span className="text-red-500">*</span></label>
                  <input type="number" id="minimum_qty" name="minimum_qty" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Minimum Qty" />
                  <p id="minimum_qty_error" className="mt-1 text-sm text-red-500"></p>
                </div>
                <div>
                  <label htmlFor="purchase_price" className="block mb-2 text-sm font-medium text-black">Purchase Price <span className="text-red-500">*</span></label>
                  <input type="text" id="purchase_price" name="purchase_price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter purchase price" pattern="^\d+(\.\d{1,2})?$" title="Enter a valid price, e.g., 0.50 or 10.99" />
                  <p id="purchase_price_error" className="mt-1 text-sm text-red-500"></p>
                </div>
                <div>
                  <label htmlFor="retail_price" className="block mb-2 text-sm font-medium text-black">Retail Price <span className="text-red-500">*</span></label>
                  <input type="text" id="retail_price" name="retail_price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter retail price" pattern="^\d+(\.\d{1,2})?$" title="Enter a valid price, e.g., 0.50 or 10.99" />
                  <p id="retail_price_error" className="mt-1 text-sm text-red-500"></p>
                </div>
                <div>
                  <label htmlFor="wholesale_price" className="block mb-2 text-sm font-medium text-black">Wholesale Price <span className="text-gray-500">(Optional)</span></label>
                  <input type="text" id="wholesale_price" name="wholesale_price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter wholesale price" pattern="^\d+(\.\d{1,2})?$" title="Enter a valid price, e.g., 0.50 or 10.99" />
                  <p id="wholesale_price_error" className="mt-1 text-sm text-red-500"></p>
                </div>
                <div>
                  <label htmlFor="pos_order_no" className="block mb-2 text-sm font-medium text-black">POS Order No <span className="text-gray-500">(For POS Ordering)</span></label>
                  <input type="number" id="pos_order_no" name="pos_order_no" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter POS order number" min="1" step="1" />
                  <p id="pos_order_no_error" className="mt-1 text-sm text-red-500"></p>
                </div>
                <div>
                  <label htmlFor="has_expiry_date" className="block mb-2 text-sm font-medium text-black mt-4">Expiry Enabled?</label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" name="has_expiry_date" id="has_expiry_date" value="1" checked={expiryEnabled} onChange={handleExpiryToggle} />
                    <div className={`relative h-6 bg-gray-200 rounded-full w-11 peer ${expiryEnabled ? 'peer-checked:bg-green-600' : ''}`}>
                      <div id="toggleExpiryCircle" className={`absolute w-5 h-5 bg-white rounded-full top-[2px] left-0.5 transition-transform ${expiryEnabled ? 'translate-x-5' : ''}`}></div>
                    </div>
                  </label>
                </div>
                {expiryEnabled && (
                  <div id="expiry_date_container" className="flex gap-3 max-sm:flex-col">
                    <div>
                      <label htmlFor="show_expiry_alert_in" className="block mb-2 text-sm font-medium text-black">Show Expiry Alert In</label>
                      <input type="number" id="show_expiry_alert_in" name="show_expiry_alert_in" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="How many days?" min="1" step="1" />
                      <p id="show_expiry_alert_in_error" className="mt-1 text-sm text-red-500"></p>
                    </div>
                    <div className="w-full">
                      <label htmlFor="exp_date" className="block mb-2 text-sm font-medium text-black">Expiry Date</label>
                      <input id="exp_date" name="exp_date" type="date" min="2026-04-08" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                    </div>
                  </div>
                )}
              </div>
              <div className="grid gap-6 mb-6 ">
                <div>
                  <label htmlFor="description" className="block mb-2 text-sm font-medium text-black">Description <span className="text-gray-500">(Optional)</span></label>
                  <textarea className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" name="description" id="description" rows="5"></textarea>
                  <p id="description_error" className="mt-1 text-sm text-red-500"></p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center w-full">
                <label htmlFor="image_path" className="block mb-2 text-sm font-medium text-black ">Add image <span style={{ color: 'red' }}></span></label>
                <input type="file" className="mb-2 form-control" name="image_path" id="imageInput" ref={fileInputRef} onChange={handleImageChange} />
                <div id="imageName" className="mb-2 text-sm text-gray-500">{imageName}</div>
                {imagePreview && (
                  <div id="imagePreview" style={{ border: '1px solid #ccc', width: 200, height: 200, overflow: 'hidden', marginTop: 10, marginBottom: 10 }}>
                    <img id="previewImage" src={imagePreview} alt="Image Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ color: 'red' }}></div>
                <p id="image_path_error" className="mt-1 text-sm text-red-500"></p>
              </div>
              <br /><br /><br /><br />
              <div className="flex items-center justify-center w-full gap-4 p-4">
                <button type="submit" id="saveButton" className="px-10 py-3 text-white bg-[#3c8c2c] rounded-lg hover:bg-blue-900 disabled:bg-gray-400">
                  <span id="saveButtonText">Save</span>
                  <span id="saveButtonSpinner" className="hidden ml-2">
                    <svg className="w-4 h-4 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                </button>
                <button type="reset" className="px-6 py-3 text-white bg-[#3c8c2c] rounded-lg">Reset</button>
              </div>
            </form>
          </div>
        </div>
        <div className="flex-grow"></div>
        <footer className="bg-[#3c8c2c] py-4 text-center text-[#ffffff]">
          <p>2026 © All Rights Reserved | Hypermart | Designed and Developed by Silicon Radon Networks (Pvt) Ltd</p>
        </footer>
      </div>
    </div>
  );
}

export default AddItemPage;
