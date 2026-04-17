import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../../../components/Layout'
import './EditItemPage.css'

const EditItemPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = String(searchParams.get('id') || '').trim();
  const returnTo = String(searchParams.get('returnTo') || '');

  // Show correct image preview for all path types
  const BACKEND_URL = 'http://localhost:3000';
  const normalizeImageSrc = (src) => {
    const value = String(src || '').trim();
    if (!value) return BACKEND_URL + '/upload/items/default.png';
    if (value.startsWith('data:')) return value;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;

    // Handle absolute server path (legacy/incorrect DB value)
    // e.g. backend\\hypermart-new-backend\\public\\images\\upload\\items\\images-1776413132646.jpg
    const absMatch = value.match(/[\\/]images[\\/]upload[\\/]items[\\/](.+)$/i);
    if (absMatch) {
      return BACKEND_URL + '/upload/items/' + absMatch[1];
    }

    // If path starts with /upload/items or upload/items, serve from backend
    if (value.startsWith('/upload/items/')) {
      return BACKEND_URL + value;
    }
    if (value.startsWith('upload/items/')) {
      return BACKEND_URL + '/' + value;
    }
    // If path starts with /images/upload/items or images/upload/items, convert to /upload/items/
    if (value.startsWith('/images/upload/items/')) {
      return BACKEND_URL + '/upload/items/' + value.replace('/images/upload/items/', '');
    }
    if (value.startsWith('images/upload/items/')) {
      return BACKEND_URL + '/upload/items/' + value.replace('images/upload/items/', '');
    }
    // If value is just a filename, serve from backend
    if (/^[^\/]+\.(jpg|jpeg|png|gif|webp)$/i.test(value)) {
      return BACKEND_URL + '/upload/items/' + value;
    }
    // Fallback to backend default
    return BACKEND_URL + '/upload/items/default.png';
  };

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const [categoryOptions, setCategoryOptions] = React.useState([]);
  const [supplierOptions, setSupplierOptions] = React.useState([]);

  const [itemCode, setItemCode] = React.useState('');
  const [barcode, setBarcode] = React.useState('');
  const [itemName, setItemName] = React.useState('');
  const [categoryId, setCategoryId] = React.useState('');
  const [supplierId, setSupplierId] = React.useState('');
  const [quantity, setQuantity] = React.useState('');
  const [minimumQty, setMinimumQty] = React.useState('');
  const [purchasePrice, setPurchasePrice] = React.useState('');
  const [retailPrice, setRetailPrice] = React.useState('');
  const [wholesalePrice, setWholesalePrice] = React.useState('');
  const [posOrderNo, setPosOrderNo] = React.useState('');
  const [description, setDescription] = React.useState('');

  // Demo state for image preview
  const [image, setImage] = React.useState('/images/upload/default.png');
  const [imageName, setImageName] = React.useState('');
  const [imageFile, setImageFile] = React.useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageName(file.name);
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setImage('/images/upload/default.png');
      setImageName('');
      setImageFile(null);
    }
  };

  useEffect(() => {
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem('user');
      window.location.assign('/');
      return;
    }

    if (!id) {
      setError('Missing item id.');
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const [itemResp, catResp, supResp] = await Promise.all([
          fetch(`/api/items/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/item-categories', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/suppliers?limit=500', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const itemData = await itemResp.json().catch(() => ({}));
        const cats = await catResp.json().catch(() => ({}));
        const sups = await supResp.json().catch(() => ({}));

        if (itemResp.status === 401 || catResp.status === 401 || supResp.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.assign('/');
          return;
        }

        if (!itemResp.ok) {
          setError(itemData?.error || 'Failed to load item.');
          return;
        }

        const item = itemData?.item || {};

        setItemCode(String(item.item_code || ''));
        setBarcode(String(item.barcode || ''));
        setItemName(String(item.item_name || ''));
        setCategoryId(item.item_categories_id ? String(item.item_categories_id) : '');
        setSupplierId(item.suppliers_id ? String(item.suppliers_id) : '');
        setQuantity(item.quantity !== undefined && item.quantity !== null ? String(item.quantity) : '');
        setMinimumQty(item.minimum_qty !== undefined && item.minimum_qty !== null ? String(item.minimum_qty) : '');
        setPurchasePrice(item.purchase_price !== undefined && item.purchase_price !== null ? String(item.purchase_price) : '');
        setRetailPrice(item.retail_price !== undefined && item.retail_price !== null ? String(item.retail_price) : '');
        setWholesalePrice(item.wholesale_price !== undefined && item.wholesale_price !== null ? String(item.wholesale_price) : '');
        setPosOrderNo(item.pos_order_no !== undefined && item.pos_order_no !== null ? String(item.pos_order_no) : '');
        setDescription(String(item.description || ''));

        setImage(normalizeImageSrc(item.image_path));

        const nextCategoryOptions = Array.isArray(cats?.categories)
          ? cats.categories.map((c) => ({ value: String(c.id), label: String(c.categories || '') }))
          : [];
        const nextSupplierOptions = Array.isArray(sups?.suppliers)
          ? sups.suppliers.map((s) => ({ value: String(s.id), label: String(s.supplier_name || '') }))
          : [];

        setCategoryOptions(nextCategoryOptions);
        setSupplierOptions(nextSupplierOptions);
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!id) {
      setError('Missing item id.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem('user');
      window.location.assign('/');
      return;
    }

    if (!String(itemName || '').trim()) {
      setError('Item name is required.');
      return;
    }
    // If a new image file is selected, upload it first
    let image_path = '';
    if (imageFile) {
      const imgForm = new FormData();
      imgForm.append('image', imageFile);
      try {
        const imgResp = await fetch('/api/upload/item-image', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: imgForm,
        });
        const imgData = await imgResp.json().catch(() => ({}));
        if (imgResp.ok && imgData.image_path) {
          image_path = imgData.image_path;
        } else {
          setError(imgData?.error || 'Failed to upload image.');
          setLoading(false);
          return;
        }
      } catch {
        setError('Network error during image upload.');
        setLoading(false);
        return;
      }
    } else if (image && !image.startsWith('data:')) {
      // Use existing image path if not a data URL
      const match = image.match(/\/images\/upload\/items\/([^\/]+)$/);
      if (match) image_path = `images/upload/items/${match[1]}`;
    }
    const payload = {
      barcode: String(barcode || '').trim(),
      item_name: String(itemName || '').trim(),
      item_categories_id: Number(categoryId),
      suppliers_id: Number(supplierId),
      minimum_qty: Number(minimumQty),
      pos_order_no: String(posOrderNo || '').trim(),
      description: String(description || '').trim(),
      image_path,
    };

    setLoading(true);
    try {
      const resp = await fetch(`/api/items/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await resp.json().catch(() => ({}));

      if (resp.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.assign('/');
        return;
      }

      if (!resp.ok) {
        setError(data?.error || 'Failed to update item.');
        return;
      }

      setSuccess('Item updated successfully.');
      if (returnTo) {
        navigate(`/item/item_list${returnTo}`);
      } else {
        navigate('/item/item_list');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
    <div className="edit-item-form">
      {/* Breadcrumbs */}
      <nav className="px-12 py-5 max-sm:px-6" aria-label="Breadcrumb">
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
              <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Update Items {itemCode || ''}</p>
            </div>
          </li>
        </ol>
      </nav>
      {error && <div className="px-12 pb-2 text-sm text-red-600">{error}</div>}
      {success && <div className="px-12 pb-2 text-sm text-green-700">{success}</div>}
      <form className="flex-grow p-6" autoComplete="off" onSubmit={handleSubmit}>
        <div className="flex flex-col flex-grow h-full p-6 border-2 rounded-lg">
          <div className="form-row">
            <div>
              <label htmlFor="item_code">Item Code</label>
              <input type="text" id="item_code" value={itemCode} disabled readOnly />
            </div>
            <div>
              <label htmlFor="barcode">Barcode <span className="text-gray-500">(Optional)</span></label>
              <input type="text" id="barcode" placeholder="Barcode No" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
              <p className="mt-1 text-sm text-red-500" id="barcode_error"></p>
            </div>
            <div>
              <label htmlFor="item_name">Item name <span className="text-red-500">*</span></label>
              <input type="text" id="item_name" placeholder="Your Item name" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">Select category</option>
                {categoryOptions.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div>
              <label htmlFor="supplier">Supplier <span className="text-red-500">*</span></label>
              <select id="supplier" value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required>
                <option value="" disabled>Your supplier name</option>
                {supplierOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="quantity">Quantity</label>
              <input type="number" id="quantity" value={quantity} disabled readOnly />
            </div>
            <div>
              <label htmlFor="minimum_qty">Minimum Quantity <span className="text-red-500">*</span></label>
              <input type="number" id="minimum_qty" placeholder="Enter Minimum Qty" value={minimumQty} onChange={(e) => setMinimumQty(e.target.value)} step="1" required />
            </div>
            <div>
              <label htmlFor="purchase_price">Purchase Price</label>
              <input type="number" id="purchase_price" placeholder="Enter purchase price" value={purchasePrice} step="0.01" disabled readOnly />
            </div>
            <div>
              <label htmlFor="retail_price">Retail Price</label>
              <input type="number" id="retail_price" placeholder="Enter retail price" value={retailPrice} step="0.01" disabled readOnly />
            </div>
            <div>
              <label htmlFor="wholesale_price">Wholesale Price</label>
              <input type="number" id="wholesale_price" placeholder="Enter wholesale price" value={wholesalePrice} step="0.01" disabled readOnly />
            </div>
            <div>
              <label htmlFor="pos_order_no">POS Order No <span className="text-gray-500">(For POS Ordering)</span></label>
              <input type="number" id="pos_order_no" placeholder="Enter POS order number" min="1" step="1" value={posOrderNo} onChange={(e) => setPosOrderNo(e.target.value)} />
              <p className="mt-1 text-sm text-red-500" id="pos_order_no_error"></p>
            </div>
            <div>
              <label htmlFor="product_image">Current Item Image</label>
              <img
                src={image}
                alt="Current Item"
                className="image-preview"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/upload/default.png';
                }}
              />
            </div>
          </div>
          <div className="form-row full-width-row">
            <div className="full-width-description">
              <label htmlFor="description">Description <span className="text-gray-500">(Optional)</span></label>
              <textarea id="description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              <p className="mt-1 text-sm text-red-500" id="description_error"></p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            <label htmlFor="imageInput">Add image</label>
            <input type="file" id="imageInput" onChange={handleImageChange} />
            {imageName && <div className="mb-2 text-sm text-gray-500">{imageName}</div>}
            {image && (
              <img
                src={image}
                alt="Preview"
                className="image-preview"
                style={{ width: 200, height: 200, marginTop: 10, marginBottom: 10 }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/upload/default.png';
                }}
              />
            )}
            <p className="mt-1 text-sm text-red-500" id="image_path_error"></p>
          </div>
          <div className="form-actions">
            <button className="update-btn" type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update'}</button>
            <button
              className="cancel-btn"
              type="button"
              onClick={() => {
                if (returnTo) {
                  navigate(`/item/item_list${returnTo}`);
                } else {
                  navigate('/item/item_list');
                }
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
      
    </div>
    </Layout>
  );
}

export default EditItemPage