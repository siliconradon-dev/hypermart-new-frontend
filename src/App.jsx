import React from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DashbordDashboard from './pages/dashbord/Dashboard';
import Billing from './pages/sales/Billing';
import ItemPage from './pages/item/ItemPage';
import AddItemPage from './pages/item/add_item/AddItemPage';
import AddCategoryPage from './pages/item/add_category/AddCategoryPage';
import ItemListPage from './pages/item/item_list/ItemListPage';
import CategoryListPage from './pages/item/category/CategoryListPage';
import ImportItem from './pages/item/import_item/ImportItem';
import SalesPage from './pages/sales/SalesPage';
import UsersPage from './pages/users/UsersPage';
import CustomersPage from './pages/customers/CustomersPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';
import ExpensesPage from './pages/expenses/ExpensesPage';
import FinancePage from './pages/finance/FinancePage';
import ReportsPage from './pages/reports/ReportsPage';
import SettingsPage from './pages/settings/SettingsPage';


function App() {
  const navigate = useNavigate();
  const goToMainPanel = () => navigate('/dashboard');

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <Dashboard
              onOpenDashbord={() => navigate('/dashboard/dashboard')}
              onOpenBilling={() => navigate('/sales/billing')}
              onOpenItem={() => navigate('/item')}
              onOpenSales={() => navigate('/sales/sales')}
              onOpenUsers={() => navigate('/users/users')}
              onOpenCustomers={() => navigate('/customers/customers')}
              onOpenSuppliers={() => navigate('/suppliers/suppliers')}
              onOpenExpenses={() => navigate('/expenses/expenses')}
              onOpenFinance={() => navigate('/finance')}
              onOpenReports={() => navigate('/reports/reports')}
              onOpenSettings={() => navigate('/settings/settings')}
            />
          }
        />

        <Route path="/dashboard/dashboard" element={<DashbordDashboard onBackToMain={goToMainPanel} />} />

        <Route path="/sales/billing" element={<Billing onBackToMain={goToMainPanel} />} />
        <Route path="/sales/sales" element={<SalesPage onBackToMain={goToMainPanel} />} />

        <Route path="/item" element={<ItemPage onBackToMain={goToMainPanel} />} />
        <Route path="/item/add_item" element={<AddItemPage />} />
        <Route path="/item/add_category" element={<AddCategoryPage />} />
        <Route path="/item/item_list" element={<ItemListPage />} />
        <Route path="/item/category_list" element={<CategoryListPage />} />
        <Route path="/item/importItem" element={<ImportItem />} />
        <Route path="/item/import_item" element={<Navigate to="/item/importItem" replace />} />
        <Route path="/users/users" element={<UsersPage onBackToMain={goToMainPanel} />} />
        <Route path="/customers/customers" element={<CustomersPage onBackToMain={goToMainPanel} />} />
        <Route path="/suppliers/suppliers" element={<SuppliersPage onBackToMain={goToMainPanel} />} />
        <Route path="/expenses/expenses" element={<ExpensesPage onBackToMain={goToMainPanel} />} />
        <Route path="/finance" element={<FinancePage onBackToMain={goToMainPanel} />} />
        <Route path="/reports/reports" element={<ReportsPage onBackToMain={goToMainPanel} />} />
        <Route path="/settings/settings" element={<SettingsPage onBackToMain={goToMainPanel} />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;