import React from 'react'
import Layout from '../../../components/Layout'
import './EditCategory.css'


const EditCategory = () => {
  return (
    <Layout>
      <div className="edit-category-form">
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
                <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Edit Category</p>
              </div>
            </li>
          </ol>
        </nav>
        <form className="flex-grow p-6" autoComplete="off">
          <div className="flex flex-col flex-grow h-full p-6 border-2 rounded-lg">
            <div className="form-section">
              <div>
                <label htmlFor="cat_name">Category</label>
                <input type="text" id="cat_name" name="categories" placeholder="Your Category name" defaultValue="sample category" required />
              </div>
            </div>
            <div className="form-section">
              <label htmlFor="desc">Your description</label>
              <textarea id="desc" rows={4} name="description" placeholder="Enter description" defaultValue="sample category"></textarea>
            </div>
            <div className="form-actions">
              <button className="save-btn" type="submit">Save</button>
              <button className="reset-btn" type="reset">Reset</button>
              <button className="cancel-btn" type="button" onClick={() => window.location.href='/item/category_list'}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default EditCategory