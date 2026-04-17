import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../../../components/Layout'
import './EditCategory.css'


const EditCategory = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const id = searchParams.get('id');

  const [catName, setCatName] = useState('');
  const [description, setDescription] = useState('');
  const [catNameError, setCatNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    const idNum = Number(id);
    if (!id || !Number.isInteger(idNum) || idNum <= 0) {
      navigate('/item/category_list', { replace: true });
      return;
    }

    const load = async () => {
      setIsLoading(true);
      setCatNameError('');
      setDescriptionError('');

      try {
        const res = await fetch(`/api/item-categories/${idNum}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/', { replace: true });
            return;
          }
          navigate('/item/category_list', { replace: true });
          return;
        }

        setCatName(data?.category?.categories ?? '');
        setDescription(data?.category?.description ?? '');
      } catch {
        setDescriptionError('Network error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCatNameError('');
    setDescriptionError('');

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    const idNum = Number(id);
    if (!id || !Number.isInteger(idNum) || idNum <= 0) {
      navigate('/item/category_list', { replace: true });
      return;
    }

    if (!catName.trim()) {
      setCatNameError('Category name is required.');
      return;
    }

    try {
      const res = await fetch(`/api/item-categories/${idNum}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ categories: catName, description }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.error || 'Failed to update category.';
        if (res.status === 400 || res.status === 409) {
          setCatNameError(msg);
        } else if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/', { replace: true });
        } else {
          setDescriptionError(msg);
        }
        return;
      }

      alert('Category updated!');
      navigate('/item/category_list');
    } catch {
      setDescriptionError('Network error. Please try again.');
    }
  };

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
        <form className="flex-grow p-6" autoComplete="off" onSubmit={handleSubmit}>
          <div className="flex flex-col flex-grow h-full p-6 border-2 rounded-lg">
            <div className="form-section">
              <div>
                <label htmlFor="cat_name">Category</label>
                <input
                  type="text"
                  id="cat_name"
                  name="categories"
                  placeholder="Your Category name"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <p className="mt-1 text-sm text-red-500">{catNameError}</p>
              </div>
            </div>
            <div className="form-section">
              <label htmlFor="desc">Your description</label>
              <textarea
                id="desc"
                rows={4}
                name="description"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
              ></textarea>
              <p className="mt-1 text-sm text-red-500">{descriptionError}</p>
            </div>
            <div className="form-actions">
              <button className="save-btn" type="submit">Save</button>
              <button
                className="reset-btn"
                type="button"
                onClick={() => {
                  setCatNameError('');
                  setDescriptionError('');
                }}
              >
                Reset
              </button>
              <button
                className="cancel-btn"
                type="button"
                onClick={() => navigate('/item/category_list')}
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

export default EditCategory