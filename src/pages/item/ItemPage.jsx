
import Layout from '../../components/Layout';


function ItemPage({ onBackToMain, onAddNewItem, onAddNewCategory }) {
  const handleAddNewItem = (e) => {
    e.preventDefault();
    if (onAddNewItem) onAddNewItem();
  };
  const handleAddNewCategory = (e) => {
    e.preventDefault();
    if (onAddNewCategory) onAddNewCategory();
  };

  return (
    <Layout onBackToMain={onBackToMain}>
      {/* Loading Overlay (hidden by default, can be implemented with state if needed) */}
      <div id="loading-overlay" className="loading-overlay" style={{ display: 'none' }}>
        <div className="text-center">
          <div className="spinner"></div>
        </div>
      </div>

      <div className="flex flex-col flex-grow justify-start items-center">
        {/* Breadcrumbs */}
        <div className="w-full px-12 py-5 max-sm:px-6">
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
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Items</p>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Center grid of buttons */}
        <div className="grid h-full place-items-center">
          <div className="grid w-full grid-cols-1 gap-4 gap-6 p-6 text-white h-fit sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {/* Add New Items */}
            <button onClick={handleAddNewItem} className="w-[200px] max-lg:w-[150px] border-2 border-[#1b4f72] h-[200px] max-lg:h-[150px] bg-[#3c8c2c] text-white rounded-lg flex flex-col gap-3 justify-center items-center hover:scale-90 transition-all xl:scalee-[110%] 2xl:scale-[110%] cursor-pointer focus:outline-none">
              <div className="w-10 h-10" style={{ background: "url(' /images/items/addNewItem.png') no-repeat", backgroundSize: 'cover' }}></div>
              <p className="text-center max-sm:text-sm">Add New Items</p>
            </button>
            {/* Add New Category */}
            <button onClick={handleAddNewCategory} className="w-[200px] max-lg:w-[150px] border-2 border-[#1b4f72] h-[200px] max-lg:h-[150px] bg-[#3c8c2c] text-white rounded-lg flex flex-col gap-3 justify-center items-center hover:scale-90 transition-all xl:scalee-[110%] 2xl:scale-[110%] cursor-pointer focus:outline-none">
              <div className="w-10 h-10" style={{ background: "url(' /images/items/AddNewCategory.png') no-repeat", backgroundSize: 'cover' }}></div>
              <p className="text-center max-sm:text-sm">Add New Category</p>
            </button>
            {/* Items List */}
            <a href=" /item/item_list">
              <div className="w-[200px] max-lg:w-[150px] h-[200px] max-lg:h-[150px] bg-[#3c8c2c] rounded-lg flex flex-col gap-3 justify-center items-center hover:scale-90 transition-all xl:scalee-[110%] 2xl:scale-[110%] cursor-pointer">
                <div className="w-10 h-10" style={{ background: "url(' /images/items/itemList.png') no-repeat", backgroundSize: 'cover' }}></div>
                <p className="text-center max-sm:text-sm">Items List</p>
              </div>
            </a>
            {/* Category List */}
            <a href=" /item/category_list">
              <div className="w-[200px] max-lg:w-[150px] h-[200px] max-lg:h-[150px] bg-[#3c8c2c] rounded-lg flex flex-col gap-3 justify-center items-center hover:scale-90 transition-all xl:scalee-[110%] 2xl:scale-[110%] cursor-pointer">
                <div className="w-10 h-10" style={{ background: "url(' /images/items/CategoryList.png') no-repeat", backgroundSize: 'cover' }}></div>
                <p className="text-center max-sm:text-sm">Category List</p>
              </div>
            </a>
            {/* Import Item */}
            <a href=" /item/importItem">
              <div className="w-[200px] max-lg:w-[150px] h-[200px] max-lg:h-[150px] bg-[#3c8c2c] rounded-lg flex flex-col gap-3 justify-center items-center hover:scale-90 transition-all xl:scalee-[110%] 2xl:scale-[110%] cursor-pointer ">
                <div className="w-10 h-10" style={{ background: "url(' /images/items/importItems.png') no-repeat", backgroundSize: 'cover' }}></div>
                <p className="text-center max-sm:text-sm">Import Item</p>
              </div>
            </a>
            {/* Genarate QR/Barcode */}
            <a href=" /item/genarateCode">
              <div className="w-[200px] max-lg:w-[150px] border-2 border-[#1b4f72] h-[200px] max-lg:h-[150px] bg-[#3c8c2c] text-white rounded-lg flex flex-col gap-3 justify-center items-center hover:scale-90 transition-all xl:scalee-[110%] 2xl:scale-[110%] cursor-pointer">
                <div className="w-10 h-10" style={{ background: "url(' /images/items/AddNewCategory.png') no-repeat", backgroundSize: 'cover' }}></div>
                <p className="text-center max-sm:text-sm">Genarate QR/Barcode</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ItemPage;
