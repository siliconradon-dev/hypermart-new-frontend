import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import DashbordDashboard from './pages/dashbord/Dashboard';
import Billing from './pages/sales/Billing';
import ItemPage from './pages/item/ItemPage';
import AddItemPage from './pages/item/add_item/AddItemPage';
import AddCategoryPage from './pages/item/add_category/AddCategoryPage';
import SalesPage from './pages/sales/SalesPage';
import UsersPage from './pages/users/UsersPage';
import CustomersPage from './pages/customers/CustomersPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';
import ExpensesPage from './pages/expenses/ExpensesPage';
import FinancePage from './pages/finance/FinancePage';
import ReportsPage from './pages/reports/ReportsPage';
import SettingsPage from './pages/settings/SettingsPage';

function App() {
  const [activePage, setActivePage] = useState('main-panel');

  return (
    <div className="App">
      {activePage === 'main-panel' ? (
        <Dashboard
          onOpenDashbord={() => setActivePage('dashbord-dashboard')}
          onOpenBilling={() => setActivePage('billing')}
          onOpenItem={() => setActivePage('item')}
          onOpenSales={() => setActivePage('sales')}
          onOpenUsers={() => setActivePage('users')}
          onOpenCustomers={() => setActivePage('customers')}
          onOpenSuppliers={() => setActivePage('suppliers')}
          onOpenExpenses={() => setActivePage('expenses')}
          onOpenFinance={() => setActivePage('finance')}
          onOpenReports={() => setActivePage('reports')}
          onOpenSettings={() => setActivePage('settings')}
        />
      ) : activePage === 'billing' ? (
        <Billing onBackToMain={() => setActivePage('main-panel')} />
      ) : activePage === 'item' ? (
        <ItemPage 
          onBackToMain={() => setActivePage('main-panel')} 
          onAddNewItem={() => setActivePage('add-item')}
          onAddNewCategory={() => setActivePage('add-category')}
        />
      ) : activePage === 'add-item' ? (
        <AddItemPage />
      ) : activePage === 'add-category' ? (
        <AddCategoryPage />
      ) : activePage === 'sales' ? (
        <SalesPage onBackToMain={() => setActivePage('main-panel')} />
      ) : activePage === 'users' ? (
        <UsersPage onBackToMain={() => setActivePage('main-panel')} />
      ) : activePage === 'customers' ? (
        <CustomersPage onBackToMain={() => setActivePage('main-panel')} />
      ) : activePage === 'suppliers' ? (
        <SuppliersPage onBackToMain={() => setActivePage('main-panel')} />
      ) : activePage === 'expenses' ? (
        <ExpensesPage onBackToMain={() => setActivePage('main-panel')} />
      ) : activePage === 'finance' ? (
        <FinancePage onBackToMain={() => setActivePage('main-panel')} />
      ) : activePage === 'reports' ? (
        <ReportsPage onBackToMain={() => setActivePage('main-panel')} />
      ) : activePage === 'settings' ? (
        <SettingsPage onBackToMain={() => setActivePage('main-panel')} />
      ) : (
        <DashbordDashboard onBackToMain={() => setActivePage('main-panel')} />
      )}
    </div>
  );
}

export default App;