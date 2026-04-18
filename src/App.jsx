import PaymentDetails from './pages/sales/payment_details/PaymentDetails';
import CustomerInvoice from './pages/sales/customer_invoice/CusomerInvoice';
import ReturnListView from './pages/sales/return_list_view/ReturnListView';
import React from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import RequireAuth from './components/RequireAuth';

import Home from './pages/Home';
// Dashboard and Main Panel
import Dashboard from './pages/Dashboard';
import DashbordDashboard from './pages/dashbord/Dashboard';
// Billing and Sales
import Billing from './pages/sales/Billing';
// Item Management
import ItemPage from './pages/item/ItemPage';
import AddItemPage from './pages/item/add_item/AddItemPage';
import AddCategoryPage from './pages/item/add_category/AddCategoryPage';
import ItemListPage from './pages/item/item_list/ItemListPage';
import CategoryListPage from './pages/item/category/CategoryListPage';
import EditItemPage from './pages/item/item_list/EditItemPage';
import EditCategory from './pages/item/category/EditCategory';
import ImportItem from './pages/item/import_item/ImportItem';
import GenerateQRCode from './pages/item/GenerateQRCode/GenerateQRCode';
import ExportPanel from './pages/item/ExportPanel/ExportPanel';

// Stock Management
import Stock from './pages/stock/Stock';
import UpdateStock from './pages/stock/update_stock/UpdateStock';
import ViewRelatedStock from './pages/stock/view_related_stock/ViewRelatedStock';
// Sales Management
import SalesPage from './pages/sales/SalesPage';
import SalesItem from './pages/sales/sales_item/SalesItem';

// Due Amount
import DueAmount from './pages/sales/dueAmount/DueAmount';

// User Management
import UsersPage from './pages/users/UsersPage';
import AddUsers from './pages/users/add_users/AddUsers';
import EditUsers from './pages/users/edit_users/EditUsers';
import UserList from './pages/users/user_list/UserList';
import AddRole from './pages/users/add_role/AddRole';
import EditRole from './pages/users/edit_role/EditRole';
import RoleList from './pages/users/role_list/RoleList';
import AddPermission from './pages/users/add_permission/AddPermission';
import EditPermission from './pages/users/edit_permission/EditPermission';
import PermissionList from './pages/users/permission_list/PermissionList';

  

// Customer Management
import CustomersPage from './pages/customers/CustomersPage';
import AddCustomer from './pages/customers/add_customer/AddCustomer';
import CustomerList from './pages/customers/customer_list/CustomerList';
import Transactions from './pages/customers/transactions/Transactions';
import EditCustomer from './pages/customers/edit_customer/EditCustomer';
// import Transactions from './pages/customers/transactions/Transactions';
// import customerTransctions from './pages/customers/transactions/Transactions';
import CustomerTransactionHistory from './pages/customers/transaction_history/TransactionHistory';
import BalanceTransactionLog  from './pages/customers/balance_transaction_log/BalanceTransactionLog'; 
import TransactionLog from './pages/customers/transaction-log/TransactionLog';

// Cheques 
import Cheques from './pages/cheques/Cheques';
import CreateCheques from './pages/cheques/create/CreateCheques';

// Supplier Management
import SuppliersPage from './pages/suppliers/SuppliersPage';
import AddSupplier from './pages/suppliers/add_supplier/AddSupplier';
import EditSupplier from './pages/suppliers/edit_supplier/EditSupplier';
import SupplierList from './pages/suppliers/supplier_list/SupplierList';
import SupplierInvoice from './pages/suppliers/supplier_invoice/SupplierSInvoice';
import SupplierCheque from './pages/suppliers/supplier_cheque/SupplierCheque';
import TransactionHistory from './pages/suppliers/transactions/TransactionHistory';
import SupplierTransactionLog from './pages/suppliers/transaction_log/TransactionLog';
import ChequeList from './pages/suppliers/cheques/ChequeList';
import AddNewInvoice from './pages/suppliers/invoice/AddNewInvoice';
import InvoiceReport from './pages/suppliers/invoice/InvoiceReport';
// Expenses Management
import ExpensesPage from './pages/expenses/ExpensesPage';
import ExpensesList from './pages/expenses/expensesList/ExpensesList';
import ExpensesCategoryList from './pages/expenses/expensesCategoryList/ExpensesCategoryList';

const AddExpense = React.lazy(() => import('./pages/expenses/addExpense/AddExpense'));
const AddExpenseCategory = React.lazy(() => import('./pages/expenses/addExpenseCategory/AddExpenseCategory'));

// Finance Management
import FinancePage from './pages/finance/FinancePage';
// Finance subpages
import Banks from './pages/finance/banks/Banks';
import Accounts from './pages/finance/accounts/Accounts';
import TransactionsFinance from './pages/finance/transactions/Transactions';
import Ledger from './pages/finance/ledger/Ledger';
import PaymentModes from './pages/finance/payment-modes/PaymentModes';
import PaymentMachines from './pages/finance/payment-machines/PaymentMachines';

// Reports
import ReportsPage from './pages/reports/ReportsPage';
import StockReport from './pages/reports/stock_report/StockReport';
import StockLog from './pages/reports/stockLog/StockLog';
import LoyaltyPointReport from './pages/reports/loyaltyPointReport/LoyaltyPointReport';
import CustomSummary from './pages/reports/customSummary/CustomSummary';
import DailySummary from './pages/reports/dailySummary/DailySummary';
import MonthlySummary from './pages/reports/monthlySummary/MonthlySummary';
import YearlySummary from './pages/reports/yearlySummary/YearlySummary';
// Settings
import SettingsPage from './pages/settings/SettingsPage';
import SiteSettings from './pages/settings/siteSettings/SiteSettings';
import ChangePassword from './pages/settings/changePassword/ChangePassword';
import ChangeSite from './pages/settings/changeSite/ChangeSite';
import PosMachines from './pages/admin/pos_machines/PosMachines';



function App() {
  const navigate = useNavigate();

  const getValidToken = () => {
    const token = localStorage.getItem('token');
    if (!token || typeof token !== 'string') return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    try {
      const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadJson);
      if (payload?.exp === undefined || payload?.exp === null) return token;

      const nowSec = Math.floor(Date.now() / 1000);
      if (Number(payload.exp) <= nowSec) return null;
      return token;
    } catch {
      return null;
    }
  };

  const token = getValidToken();
  if (!token) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    user = null;
  }
  const role = user?.role || null;

  const goToMainPanel = () => navigate('/dashboard');

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Home />} />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              {Number(user?.status_id ?? 1) === 0 ? (
                <Navigate to="/dashboard/dashboard" replace />
              ) : (
                <Dashboard
                  role={role}
                  onOpenDashbord={() => navigate('/dashboard/dashboard')}
                  onOpenBilling={() => navigate('/sales/billing')}
                  onOpenItem={() => navigate('/item')}
                  onExportPanel={() => navigate('/item/export_panel')}
                  onStock={() => navigate('/stock/stock')}
                  onOpenSales={() => navigate('/sales/sales')}
                  onDueAmount={() => navigate('sales/due_amount')}
                  onOpenUsers={() => navigate('/users/users')}
                  onOpenCustomers={() => navigate('/customers/customers')}
                  onOpenSuppliers={() => navigate('/suppliers/suppliers')}
                  onOpenExpenses={() => navigate('/expenses/expenses')}
                  onOpenFinance={() => navigate('/finance')}
                  onOpenReports={() => navigate('/reports/reports')}
                  onOpenStockReport={() => navigate('reports/stock_report')}
                  onOpenSettings={() => navigate('/settings/settings')}
                />
              )}
            </RequireAuth>
          }
        />
          {/* Dashboard */}
        <Route
          path="/dashboard/dashboard"
          element={
            <RequireAuth>
              <DashbordDashboard onBackToMain={goToMainPanel} />
            </RequireAuth>
          }
        />
          {/* Sales */}
        <Route path="/sales/billing" element={<RequireAuth><Billing onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/sales/sales" element={<RequireAuth><SalesPage onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/sales/salesItems" element={<RequireAuth><SalesItem /></RequireAuth>} />
        <Route path="/sales/sales_item" element={<RequireAuth><SalesItem /></RequireAuth>} />
        <Route path="/sales/return_list_view" element={<RequireAuth><ReturnListView /></RequireAuth>} />
        <Route path="/sales/payment_details/:saleId" element={<RequireAuth><PaymentDetails /></RequireAuth>} />

        {/* Customer Invoice */}
        <Route path="/sales/customer_invoice" element={<RequireAuth><CustomerInvoice /></RequireAuth>} />
        
          {/* Item Management */}
        <Route path="/item" element={<RequireAuth><ItemPage onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/item/add_item" element={<RequireAuth><AddItemPage /></RequireAuth>} />
        <Route path="/item/add_category" element={<RequireAuth><AddCategoryPage /></RequireAuth>} />
        <Route path="/item/edit_item" element={<RequireAuth><EditItemPage /></RequireAuth>} />
        <Route path="/item/category/edit_category" element={<RequireAuth><EditCategory /></RequireAuth>} />
        <Route path="/item/item_list" element={<RequireAuth><ItemListPage /></RequireAuth>} />
        <Route path="/item/category_list" element={<RequireAuth><CategoryListPage /></RequireAuth>} />
        <Route path="/item/importItem" element={<RequireAuth><ImportItem /></RequireAuth>} />
        <Route path="/item/generate_qr_code" element={<RequireAuth><GenerateQRCode /></RequireAuth>} />
        <Route path="/item/genarateCode" element={<Navigate to="/item/generate_qr_code" replace />} />
        <Route path="/item/export_panel" element={<RequireAuth><ExportPanel /></RequireAuth>} />

          {/* Stock Management */}
        <Route path="/stock/stock" element={<RequireAuth><Stock onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/stock/update_stock" element={<RequireAuth><UpdateStock onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/stock/view_related_stock" element={<RequireAuth><ViewRelatedStock onBackToMain={goToMainPanel} /></RequireAuth>} />
        
        <Route path="sales/due_amount" element={<RequireAuth><DueAmount onBackToMain={goToMainPanel} /></RequireAuth>} />

          {/* User Management */}
        <Route path="/users/users" element={<RequireAuth><UsersPage onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/users/add_users" element={<RequireAuth><AddUsers onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/users/edit_users" element={<RequireAuth><EditUsers onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/users/user_list" element={<RequireAuth><UserList onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/users/role_list" element={<RequireAuth><RoleList onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/users/add_role" element={<RequireAuth><AddRole onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/users/edit_role/:id" element={<RequireAuth><EditRole onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/users/permission_list" element={<RequireAuth><PermissionList onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/users/add_permission" element={<RequireAuth><AddPermission onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/users/edit_permission" element={<Navigate to="/users/permission_list" replace />} />
        <Route path="/users/edit_permission/:id" element={<RequireAuth><EditPermission onBackToMain={goToMainPanel} /></RequireAuth>} />

            {/* Customer Management */}
          <Route path="/customers/customers" element={<RequireAuth><CustomersPage onBackToMain={goToMainPanel} /></RequireAuth>} />
          <Route path="/customers/add_customer" element={<RequireAuth><AddCustomer onBackToMain={goToMainPanel} /></RequireAuth>} />
          <Route path="/customers/updateCustomer/" element={<Navigate to="/customers/customer_list" replace />} />
          <Route path="/customers/updateCustomer/:id" element={<RequireAuth><EditCustomer onBackToMain={goToMainPanel} /></RequireAuth>} />
          <Route path="/customers/customer_list" element={<RequireAuth><CustomerList onBackToMain={goToMainPanel} /></RequireAuth>} />
          <Route path="/customers/transactions" element={<RequireAuth><Transactions onBackToMain={goToMainPanel} /></RequireAuth>} />
          <Route path="/customers_invoices" element={<RequireAuth><CustomerInvoice onBackToMain={goToMainPanel} /></RequireAuth>} />
          <Route path="/customers/transactions/history" element={<RequireAuth><CustomerTransactionHistory onBackToMain={goToMainPanel} /></RequireAuth>} />
          <Route path="/customers/transaction-log" element={<RequireAuth><TransactionLog onBackToMain={goToMainPanel} /></RequireAuth>} />
          <Route path="/customers/balance-transaction-log" element={<RequireAuth><BalanceTransactionLog onBackToMain={goToMainPanel} /></RequireAuth>} />

        {/* Cheques */}
        <Route path="/cheques" element={<RequireAuth><Cheques onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/cheques/create" element={<RequireAuth><CreateCheques onBackToMain={goToMainPanel} /></RequireAuth>} />
        
        {/* Supplier Management */}
        <Route path="/suppliers/suppliers" element={<RequireAuth><SuppliersPage onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/suppliers/add_supplier" element={<RequireAuth><AddSupplier onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/suppliers/supplier_list" element={<RequireAuth><SupplierList onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/suppliers/supplier_invoice" element={<RequireAuth><SupplierInvoice onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/suppliers/supplier_cheque" element={<RequireAuth><SupplierCheque onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/suppliers/transactions" element={<RequireAuth><TransactionHistory onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/suppliers/edit_supplier" element={<RequireAuth><EditSupplier onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/suppliers/transaction_log" element={<RequireAuth><SupplierTransactionLog onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/suppliers/cheques" element={<RequireAuth><ChequeList onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/suppliers/add_invoice" element={<RequireAuth><AddNewInvoice onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/suppliers/invoice_report" element={<RequireAuth><InvoiceReport onBackToMain={goToMainPanel} /></RequireAuth>} />
        {/* Expenses */}
        <Route path="/expenses/expenses" element={<RequireAuth><ExpensesPage onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route
          path="/expenses/addExpense"
          element={
            <RequireAuth>
              <React.Suspense fallback={null}>
                <AddExpense onBackToMain={goToMainPanel} />
              </React.Suspense>
            </RequireAuth>
          }
        />
        <Route
          path="/expenses/addExpenseCategory"
          element={
            <RequireAuth>
              <React.Suspense fallback={null}>
                <AddExpenseCategory onBackToMain={goToMainPanel} />
              </React.Suspense>
            </RequireAuth>
          }
        />
        <Route path="/expenses/expensesList" element={<RequireAuth><ExpensesList onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/expenses/expensesCategoryList" element={<RequireAuth><ExpensesCategoryList onBackToMain={goToMainPanel} /></RequireAuth>} />
        {/* Finance Management */}
        <Route path="/finance" element={<RequireAuth><FinancePage onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/finance/banks" element={<RequireAuth><Banks onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/finance/accounts" element={<RequireAuth><Accounts onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/finance/transactions" element={<RequireAuth><TransactionsFinance onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/finance/ledger" element={<RequireAuth><Ledger onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/finance/payment-modes" element={<RequireAuth><PaymentModes onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/finance/payment-machines" element={<RequireAuth><PaymentMachines onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/reports/reports" element={<RequireAuth><ReportsPage onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/reports/stockReports" element={<RequireAuth><StockReport onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/reports/stock_report" element={<RequireAuth><StockReport onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/reports/stockLog" element={<RequireAuth><StockLog onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/reports/loyaltyPointReport" element={<RequireAuth><LoyaltyPointReport onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/reports/customSummary" element={<RequireAuth><CustomSummary onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/reports/dailySummary" element={<RequireAuth><DailySummary onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/reports/monthlySummary" element={<RequireAuth><MonthlySummary onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/reports/yearlySummary" element={<RequireAuth><YearlySummary onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/settings/settings" element={<RequireAuth><SettingsPage onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/settings/siteSettings" element={<RequireAuth><SiteSettings onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/settings/changePassword" element={<RequireAuth><ChangePassword onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/settings/changeSite" element={<RequireAuth><ChangeSite onBackToMain={goToMainPanel} /></RequireAuth>} />
        <Route path="/admin/pos_machines" element={<RequireAuth><PosMachines onBackToMain={goToMainPanel} /></RequireAuth>} />

        <Route path="*" element={<Navigate to={token ? '/dashboard' : '/'} replace />} />
      </Routes>
    </div>
  );
}

export default App;