import React from 'react';
import Layout from '../../components/Layout';
import './SalesPage.css';

const SalesPage = () => {
  return (
    <Layout>
      <div className="min-h-dvh max-lg:h-fit flex flex-col h-dvh bg-white">
        {/* Loading Overlay (UI only) */}
        <div className="loading-overlay" style={{ display: 'none' }}>
          <div className="text-center">
            <div className="spinner"></div>
          </div>
        </div>
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
                  <p className="text-sm font-medium text-gray-700 ms-1 md:ms-2">Sales</p>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        {/* Button container */}
        <div className="flex flex-col flex-grow justify-start items-center">
          <div className="h-full w-fit">
            <div className="grid grid-cols-2 place-content-center justify-items-center h-full gap-6 text-white 2xl:scale-[110%] ">
              <a href="#">
                <div className="w-[200px] max-lg:w-[150px] max-sm:w-[100px] border-2 border-[#1b4f72] h-[200px] max-lg:h-[150px] max-sm:h-[100px] bg-[#3c8c2c] text-white rounded-lg flex flex-col gap-3 justify-center items-center hover:scale-90 transition-all">
                  <div className="w-10 h-10" style={{background: "url('../images/sales/salesItemList.png') no-repeat", backgroundSize: 'cover'}}></div>
                  <p className="text-center max-sm:text-sm">Sales Items List</p>
                </div>
              </a>
              <a href="#">
                <div className="w-[200px] max-lg:w-[150px] max-sm:w-[100px] border-2 border-[#1b4f72] h-[200px] max-lg:h-[150px] max-sm:h-[100px] bg-[#3c8c2c] text-white rounded-lg flex flex-col gap-3 justify-center items-center hover:scale-90 transition-all">
                  <div className="w-10 h-10" style={{background: "url('../images/sales/returnLiistView.png') no-repeat", backgroundSize: 'contain', backgroundPosition: 'center'}}></div>
                  <p className="text-center max-sm:text-sm">Returns List View</p>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="flex-grow"></div>
      </div>
    </Layout>
  );
};

export default SalesPage;
