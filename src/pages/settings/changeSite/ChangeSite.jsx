import React, { useEffect, useMemo, useState } from 'react';
import './ChangeSite.css';

const initialSettings = [
  { id: 1, key: 'Login Page Image', value: '/Company Logo/1774375100_1771770442_Screenshot 2026-02-22 195640.png', type: 'image', previewLabel: 'Login Page Image' },
  { id: 2, key: 'Login Page Background Color', value: '#ffffff', type: 'color' },
  { id: 3, key: 'Login Page Header Text Color', value: '#43aa27', type: 'color' },
  { id: 4, key: 'Login Button Color', value: '#31d902', type: 'color' },
  { id: 5, key: 'Login Button Text Color', value: '#ffffff', type: 'color' },
  { id: 6, key: 'Company Name', value: 'Hypermart', type: 'text' },
  { id: 7, key: 'Header Color', value: '#3c8c2c', type: 'color' },
  { id: 8, key: 'Footer Color', value: '#21ad1f', type: 'color' },
  { id: 9, key: 'Company Address', value: '8th Mile Post, Kandy Road, Mawathagama', type: 'text' },
  { id: 10, key: 'Company Contact No', value: '+94773610779', type: 'text' },
  { id: 11, key: 'Company Mobile No', value: '+94773610779', type: 'text' },
  { id: 12, key: 'Company Web site URL', value: 'support@hypermart.com', type: 'text' },
  { id: 13, key: 'Header Icon', value: '/Company Logo/1774375125_1771770442_Screenshot 2026-02-22 195640.png', type: 'image', previewLabel: 'Header Icon' },
  { id: 14, key: 'Header Icon And Font Color', value: '#000000', type: 'color' },
  { id: 15, key: 'Header Title Color', value: '#ffffff', type: 'color' },
  { id: 16, key: 'Footer Text Color', value: '#ffffff', type: 'color' },
  { id: 17, key: 'vat_percentage', value: '18', type: 'text' },
];

const normalizeAssetPath = (value) => `/${String(value).replace(/^\/+/, '')}`;

function ChangeSite() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(initialSettings);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const [editColor, setEditColor] = useState('');
  const [resetBusy, setResetBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

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

  const showToast = (message, type) => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2000);
  };

  const openEditModal = (setting) => {
    setEditingSetting(setting);
    setEditValue(setting.value);
    setEditImageFile(null);
    setEditImagePreview(setting.type === 'image' ? normalizeAssetPath(setting.value) : '');
    setEditColor(setting.type === 'color' ? setting.value : '');
    setModalOpen(true);
  };

  const closeEditModal = () => {
    setModalOpen(false);
    setEditingSetting(null);
    setEditValue('');
    setEditImageFile(null);
    setEditImagePreview('');
    setEditColor('');
  };

  const onImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setEditImageFile(null);
      setEditImagePreview(editingSetting?.type === 'image' ? `/${editingSetting.value}` : '');
      return;
    }

    setEditImageFile(file);
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setEditImagePreview(loadEvent.target?.result || '');
    };
    reader.readAsDataURL(file);
  };

  const saveSetting = async () => {
    if (!editingSetting) {
      return;
    }

    const nextValue = editingSetting.type === 'color' ? editColor : editValue;
    const formData = new FormData();
    formData.append('id', String(editingSetting.id));
    formData.append('value', nextValue);

    if (editImageFile) {
      formData.append('image_login', editImageFile);
    }

    try {
      const response = await fetch('/settings/update', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': '0QWDdrFGyZ41V8aij087hIY5Tp8vhZRdNCZrEcGu',
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSettings((currentSettings) => currentSettings.map((setting) => {
          if (setting.id !== editingSetting.id) {
            return setting;
          }

          return {
            ...setting,
            value: nextValue,
            type: editingSetting.type,
          };
        }));

        showToast('Setting updated successfully!', 'success');
        closeEditModal();
      } else {
        showToast(data.message || 'Error updating setting.', 'error');
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      showToast('An error occurred while updating the setting.', 'error');
    }
  };

  const confirmResetSystem = async () => {
    setResetBusy(true);

    try {
      const response = await fetch('/reset-system', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': '0QWDdrFGyZ41V8aij087hIY5Tp8vhZRdNCZrEcGu',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      showToast(data.message, 'success');
      window.setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('Error:', error);
      showToast('An error occurred while clearing the cache.', 'error');
    } finally {
      setResetBusy(false);
      setConfirmResetOpen(false);
    }
  };

  const tableRows = useMemo(() => settings, [settings]);

  return (
    <div className="change-site-page min-h-dvh max-lg:h-fit flex flex-col h-dvh">
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
            <h3 className="text-2xl max-md:text-sm text-[#ffffff]">Good Afternoon!</h3>
            <h3 className="text-sm text-[#ffffff]">Welcome HYPERMART</h3>
          </div>
          <form method="POST" action="/logout">
            <input type="hidden" name="_token" value="0QWDdrFGyZ41V8aij087hIY5Tp8vhZRdNCZrEcGu" autoComplete="off" />
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

      {toast ? (
        <div className={`site-settings-toast ${toast.type}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      ) : null}

      <div className="flex flex-col flex-grow">
        <div className="px-12 py-5 max-sm:px-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
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
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2 text-nowrap">Settings</p>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2 text-nowrap">Manage Site Settings</p>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="px-12 pb-6 max-sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
            <button type="button" onClick={() => { window.location.href = '/settings/addSetting'; }} className="px-6 py-3 text-white bg-[#029ED9] rounded-lg hover:opacity-90 max-sm:py-2 max-sm:px-4">
              <i className="mr-2 fas fa-plus" />Add New Setting
            </button>
          </div>

          <div className="overflow-auto bg-white border-2 rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">KEY</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">VALUE</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-700 uppercase">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableRows.map((setting) => (
                  <tr key={setting.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{setting.key}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {setting.type === 'image' ? (
                        <img src={normalizeAssetPath(setting.value)} alt={setting.previewLabel || setting.key} className="object-cover w-16 h-16 rounded" />
                      ) : setting.type === 'color' ? (
                        <div className="flex items-center gap-2">
                          <div style={{ backgroundColor: setting.value }} className="w-10 h-10 border border-gray-300 rounded" />
                          <span className="font-mono">{setting.value}</span>
                        </div>
                      ) : (
                        <span className="break-words">{setting.value}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                      <button type="button" onClick={() => openEditModal(setting)} className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
                        <i className="mr-1 fas fa-edit" />Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mt-6 gap-4 max-sm:flex-col">
            <button type="button" id="reset-system-btn" onClick={() => setConfirmResetOpen(true)} className="px-6 py-3 text-white bg-[#0c0c0c] rounded-lg hover:opacity-90 max-sm:w-full">
              <i className="mr-2 fas fa-sync-alt" />Reset System
            </button>
            <button type="button" className="px-6 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 max-sm:w-full" onClick={() => { window.location.href = '/settings/settings'; }}>
              <i className="mr-2 fas fa-arrow-left" />Back to Settings
            </button>
          </div>
        </div>

        <div className="flex-grow" />

        <footer className="bg-[#3c8c2c] py-4 text-center text-[#ffffff]">
          <p>2026 © All Rights Reserved | Hypermart | Designed and Developed by Silicon Radon Networks (Pvt) Ltd</p>
        </footer>
      </div>

      {modalOpen && editingSetting ? (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={(event) => { if (event.target === event.currentTarget) closeEditModal(); }}>
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true" />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900" id="modal-title">Edit Setting</h3>
                <input type="hidden" value={editingSetting.id} readOnly />
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Key</label>
                  <input type="text" value={editingSetting.key} disabled className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" />
                </div>

                <div className="mb-4" style={{ display: editingSetting.type === 'text' ? 'block' : 'none' }}>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Value</label>
                  <input type="text" value={editValue} onChange={(event) => setEditValue(event.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                </div>

                <div className="mb-4" style={{ display: editingSetting.type === 'image' ? 'block' : 'none' }}>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Upload Image</label>
                  <input type="file" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" accept="image/*" onChange={onImageChange} />
                  <img src={editImagePreview} alt="Image Preview" className="object-cover w-24 h-24 mt-2 rounded" style={{ display: editImagePreview ? 'block' : 'none' }} />
                </div>

                <div className="mb-4" style={{ display: editingSetting.type === 'color' ? 'block' : 'none' }}>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Select Color</label>
                  <input type="color" value={editColor} onChange={(event) => setEditColor(event.target.value)} className="h-10 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full" />
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" onClick={saveSetting} className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                  Update
                </button>
                <button type="button" onClick={closeEditModal} className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {confirmResetOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Are you sure?</h3>
            <p className="mt-2 text-sm text-gray-600">This will reset the system and clear all caches.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmResetOpen(false)} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={confirmResetSystem} disabled={resetBusy} className="rounded-md bg-[#3085d6] px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60">{resetBusy ? 'Resetting...' : 'Yes, reset it!'}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ChangeSite;
