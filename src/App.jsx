import PaymentDetails from './pages/sales/payment_details/PaymentDetails';
import CustomerInvoice from './pages/sales/customer_invoice/CusomerInvoice';
import ReturnListView from './pages/sales/return_list_view/ReturnListView';
import React from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

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

  const token = localStorage.getItem('token');
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
            token ? (
              Number(user?.status_id ?? 1) === 0 ? (
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
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
          {/* Dashboard */}
        <Route
          path="/dashboard/dashboard"
          element={token ? <DashbordDashboard onBackToMain={goToMainPanel} /> : <Navigate to="/" replace />}
        />
          {/* Sales */}
        <Route path="/sales/billing" element={<Billing onBackToMain={goToMainPanel} />} />
        <Route path="/sales/sales" element={<SalesPage onBackToMain={goToMainPanel} />} />
        <Route path="/sales/salesItems" element={<SalesItem />} />
        <Route path="/sales/sales_item" element={<SalesItem />} />
        <Route path="/sales/return_list_view" element={<ReturnListView />} />
        <Route path="/sales/payment_details" element={<PaymentDetails />} />

        {/* Customer Invoice */}
        <Route path="/sales/customer_invoice" element={<CustomerInvoice />} />
        
          {/* Item Management */}
        <Route path="/item" element={<ItemPage onBackToMain={goToMainPanel} />} />
        <Route path="/item/add_item" element={<AddItemPage />} />
        <Route path="/item/add_category" element={<AddCategoryPage />} />
        <Route path="/item/edit_item" element={<EditItemPage />} />
        <Route path="/item/category/edit_category" element={<EditCategory />} />
        <Route path="/item/item_list" element={<ItemListPage />} />
        <Route path="/item/category_list" element={<CategoryListPage />} />
        <Route path="/item/importItem" element={<ImportItem />} />
        <Route path="/item/generate_qr_code" element={<GenerateQRCode />} />
        <Route path="/item/genarateCode" element={<Navigate to="/item/generate_qr_code" replace />} />
        <Route path="/item/export_panel" element={<ExportPanel />} />

          {/* Stock Management */}
        <Route path="/stock/stock" element={<Stock onBackToMain={goToMainPanel} />} />
        <Route path="/stock/update_stock" element={<UpdateStock onBackToMain={goToMainPanel} />} />
        <Route path="/stock/view_related_stock" element={<ViewRelatedStock onBackToMain={goToMainPanel} />} />
        
        <Route path="sales/due_amount" element={<DueAmount onBackToMain={goToMainPanel} />} />

          {/* User Management */}
        <Route path="/users/users" element={<UsersPage onBackToMain={goToMainPanel} />} />
        <Route path="/users/add_users" element={<AddUsers onBackToMain={goToMainPanel} />} />
        <Route path="/users/edit_users" element={<EditUsers onBackToMain={goToMainPanel} />} />
        <Route path="/users/user_list" element={<UserList onBackToMain={goToMainPanel} />} />
        <Route path="/users/role_list" element={<RoleList onBackToMain={goToMainPanel} />} />
        <Route path="/users/add_role" element={<AddRole onBackToMain={goToMainPanel} />} />
        <Route path="/users/edit_role" element={<EditRole onBackToMain={goToMainPanel} />} />
        <Route path="/users/permission_list" element={<PermissionList onBackToMain={goToMainPanel} />} />
        <Route path="/users/add_permission" element={<AddPermission onBackToMain={goToMainPanel} />} />
        <Route path="/users/edit_permission" element={<EditPermission onBackToMain={goToMainPanel} />} />

            {/* Customer Management */}
        <Route path="/customers/customers" element={<CustomersPage onBackToMain={goToMainPanel} />} />
        <Route path="/customers/add_customer" element={<AddCustomer onBackToMain={goToMainPanel} />} />
        <Route path="/customers/updateCustomer/" element={<EditCustomer onBackToMain={goToMainPanel} />} />
        <Route path="/customers/customer_list" element={<CustomerList onBackToMain={goToMainPanel} />} />
        <Route path="/customers/transactions" element={<Transactions onBackToMain={goToMainPanel} />} />
        <Route path="/customers_invoices" element={<CustomerInvoice onBackToMain={goToMainPanel} />} />
        <Route path="/customers/transactions/history" element={<CustomerTransactionHistory onBackToMain={goToMainPanel} />} />
        <Route path="/customers/transaction-log" element={<TransactionLog onBackToMain={goToMainPanel} />} />
        <Route path="/customers/balance-transaction-log" element={<BalanceTransactionLog onBackToMain={goToMainPanel} />} />

        {/* Cheques */}
        <Route path="/cheques" element={<Cheques onBackToMain={goToMainPanel} />} />
        <Route path="/cheques/create" element={<CreateCheques onBackToMain={goToMainPanel} />} />
        
        {/* Supplier Management */}
        <Route path="/suppliers/suppliers" element={<SuppliersPage onBackToMain={goToMainPanel} />} />
        <Route path="/suppliers/add_supplier" element={<AddSupplier onBackToMain={goToMainPanel} />} />
        <Route path="/suppliers/supplier_list" element={<SupplierList onBackToMain={goToMainPanel} />} />
        <Route path="/suppliers/supplier_invoice" element={<SupplierInvoice onBackToMain={goToMainPanel} />} />
        <Route path="/suppliers/supplier_cheque" element={<SupplierCheque onBackToMain={goToMainPanel} />} />
        <Route path="/suppliers/transactions" element={<TransactionHistory onBackToMain={goToMainPanel} />} />
        <Route path="/suppliers/edit_supplier" element={<EditSupplier onBackToMain={goToMainPanel} />} />
        <Route path="/suppliers/transaction_log" element={<SupplierTransactionLog onBackToMain={goToMainPanel} />} />
        <Route path="/suppliers/cheques" element={<ChequeList onBackToMain={goToMainPanel} />} />
        <Route path="/suppliers/add_invoice" element={<AddNewInvoice onBackToMain={goToMainPanel} />} />
        <Route path="/suppliers/invoice_report" element={<InvoiceReport onBackToMain={goToMainPanel} />} />
        {/* Expenses */}
        <Route path="/expenses/expenses" element={<ExpensesPage onBackToMain={goToMainPanel} />} />
        <Route
          path="/expenses/addExpense"
          element={
            <React.Suspense fallback={null}>
              <AddExpense onBackToMain={goToMainPanel} />
            </React.Suspense>
          }
        />
        <Route
          path="/expenses/addExpenseCategory"
          element={
            <React.Suspense fallback={null}>
              <AddExpenseCategory onBackToMain={goToMainPanel} />
            </React.Suspense>
          }
        />
        <Route path="/expenses/expensesList" element={<ExpensesList onBackToMain={goToMainPanel} />} />
        <Route path="/expenses/expensesCategoryList" element={<ExpensesCategoryList onBackToMain={goToMainPanel} />} />
        {/* Finance Management */}
        <Route path="/finance" element={<FinancePage onBackToMain={goToMainPanel} />} />
        <Route path="/finance/banks" element={<Banks onBackToMain={goToMainPanel} />} />
        <Route path="/finance/accounts" element={<Accounts onBackToMain={goToMainPanel} />} />
        <Route path="/finance/transactions" element={<TransactionsFinance onBackToMain={goToMainPanel} />} />
        <Route path="/finance/ledger" element={<Ledger onBackToMain={goToMainPanel} />} />
        <Route path="/finance/payment-modes" element={<PaymentModes onBackToMain={goToMainPanel} />} />
        <Route path="/finance/payment-machines" element={<PaymentMachines onBackToMain={goToMainPanel} />} />
        <Route path="/reports/reports" element={<ReportsPage onBackToMain={goToMainPanel} />} />
        <Route path="/reports/stockReports" element={<StockReport onBackToMain={goToMainPanel} />} />
        <Route path="/reports/stock_report" element={<StockReport onBackToMain={goToMainPanel} />} />
        <Route path="/reports/stockLog" element={<StockLog onBackToMain={goToMainPanel} />} />
        <Route path="/reports/loyaltyPointReport" element={<LoyaltyPointReport onBackToMain={goToMainPanel} />} />
        <Route path="/reports/customSummary" element={<CustomSummary onBackToMain={goToMainPanel} />} />
        <Route path="/reports/dailySummary" element={<DailySummary onBackToMain={goToMainPanel} />} />
        <Route path="/reports/monthlySummary" element={<MonthlySummary onBackToMain={goToMainPanel} />} />
        <Route path="/reports/yearlySummary" element={<YearlySummary onBackToMain={goToMainPanel} />} />
        <Route path="/settings/settings" element={<SettingsPage onBackToMain={goToMainPanel} />} />
        <Route path="/settings/siteSettings" element={<SiteSettings onBackToMain={goToMainPanel} />} />
        <Route path="/settings/changePassword" element={<ChangePassword onBackToMain={goToMainPanel} />} />
        <Route path="/settings/changeSite" element={<ChangeSite onBackToMain={goToMainPanel} />} />
        <Route path="/admin/pos_machines" element={<PosMachines onBackToMain={goToMainPanel} />} />

        <Route path="*" element={<Navigate to={token ? '/dashboard' : '/'} replace />} />
      </Routes>
    </div>
  );
}

export default App;