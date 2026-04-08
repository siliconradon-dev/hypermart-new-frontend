import React, { useState } from 'react';
import Header from '../../../components/Header';
import '../add_item/AddItemPage.css';
import Footer from '../../../components/Footer';

function AddCategoryPage() {
  const [catName, setCatName] = useState('');
  const [description, setDescription] = useState('');
  const [catNameError, setCatNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const handleBackToMain = () => {
    window.location.href = '/dashboard';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCatNameError('');
    setDescriptionError('');
    // Simulate validation (replace with real API call as needed)
    let hasError = false;
    if (!catName.trim()) {
      setCatNameError('Category name is required.');
      hasError = true;
    }
    if (hasError) return;
    // Simulate success
    alert('Category saved! (Demo)');
    setCatName('');
    setDescription('');
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
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Add Category</p>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col flex-grow p-6 border-2 rounded-lg">
            <div className="grid gap-6 mb-6 md:grid-cols-1">
              <div>
                <label htmlFor="cat_name" className="block mb-2 text-sm font-medium text-black ">Category</label>
                <input type="text" id="cat_name" name="categories" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Your Category name" value={catName} onChange={e => setCatName(e.target.value)} />
                <p id="cat_name_error" className="mt-1 text-sm text-red-500">{catNameError}</p>
              </div>
            </div>
            <div className="grid mb-6 md:grid-cols-1">
              <label htmlFor="desc" className="block mb-2 text-sm font-medium text-gray-900">Your description</label>
              <textarea id="description" rows="4" name="description" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter description" value={description} onChange={e => setDescription(e.target.value)}></textarea>
              <p id="description_error" className="mt-1 text-sm text-red-500">{descriptionError}</p>
            </div>
            <div className="flex items-center justify-center w-full gap-4 p-4">
              <input type="submit" value="Save" className="py-3 px-6 bg-[#3c8c2c] text-white rounded-lg cursor-pointer" />
              <input type="reset" value="Reset" className="px-6 py-3 text-white bg-[#3c8c2c] rounded-lg cursor-pointer" onClick={() => { setCatName(''); setDescription(''); setCatNameError(''); setDescriptionError(''); }} />
            </div>
          </form>
        </div>
        <div className="flex-grow"></div>
      </div>
      <Footer />
    </div>
  );
}

export default AddCategoryPage;
