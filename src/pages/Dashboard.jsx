import './Dashboard.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const panelItems = [
  {
    label: 'Dashboard',
    href: ' /dash/dash',
    icon: ' /images/main-panel/btn-icons/dash.svg',
    alt: 'Dashboard',
  },
  {
    label: 'Billing',
    href: ' /sales/billing',
    icon: ' /images/main-panel/btn-icons/installment.svg',
    alt: 'Installment',
    target: '_blank',
  },
  {
    label: 'Items',
    href: ' /item/item',
    icon: ' /images/main-panel/btn-icons/items.svg',
    alt: 'Items',
  },
  {
    label: 'Export Items',
    href: ' /item/exportPanel',
    icon: ' /images/main-panel/btn-icons/reports.svg',
    alt: 'Export Items',
  },
  {
    label: 'Stock',
    href: ' /stock/stock',
    icon: ' /images/main-panel/btn-icons/stock.svg',
    alt: 'Stock',
  },
  {
    label: 'Sales',
    href: ' /sales/sales',
    icon: ' /images/main-panel/btn-icons/sales.svg',
    alt: 'Sales',
  },
  {
    label: 'Due Amount',
    href: ' /sales/dueAmount',
    icon: ' /images/main-panel/btn-icons/billing.svg',
    alt: 'Due Amount',
  },
  {
    label: 'Users',
    href: ' /users/users',
    icon: ' /images/main-panel/btn-icons/users.svg',
    alt: 'Users',
  },
  {
    label: 'Customer',
    href: ' /customers/customers',
    icon: ' /images/main-panel/btn-icons/customer.svg',
    alt: 'Customer',
  },
  {
    label: 'Suppliers',
    href: ' /suppliers/suppliers',
    icon: ' /images/main-panel/btn-icons/suppliers.svg',
    alt: 'Suppliers',
  },
  {
    label: 'Expenses',
    href: ' /expenses/expenses',
    icon: ' /images/main-panel/btn-icons/expenses.svg',
    alt: 'Expenses',
  },
  {
    label: 'Finance Management',
    href: ' /finance',
    iconType: 'finance',
  },
  {
    label: 'Reports',
    href: ' /reports/reports',
    icon: ' /images/main-panel/btn-icons/reports.svg',
    alt: 'Reports',
  },
  {
    label: 'Settings',
    href: ' /settings/settings',
    icon: ' /images/main-panel/btn-icons/settings.svg',
    alt: 'Settings',
  },
  {
    label: 'Stock Report',
    href: ' /reports/stockReports',
    icon: ' /images/reports/ItemStockReport.png',
    alt: 'Stock Report',
  },
];

function Dashboard({
  onOpenDashbord,
  onOpenBilling,
  onOpenItem,
  onOpenSales,
  onOpenUsers,
  onOpenCustomers,
  onOpenSuppliers,
  onOpenExpenses,
  onOpenFinance,
  onOpenReports,
  onOpenSettings,
}) {
  const pageOpeners = {
    Items: onOpenItem,
    Sales: onOpenSales,
    Users: onOpenUsers,
    Customer: onOpenCustomers,
    Suppliers: onOpenSuppliers,
    Expenses: onOpenExpenses,
    'Finance Management': onOpenFinance,
    Reports: onOpenReports,
    Settings: onOpenSettings,
  };

  return (
    <div className="dashboard-page flex flex-col min-h-screen">
      <Header showMainPanelButton={false} showPosButton={false} />
      <main
        className="flex items-center justify-center flex-grow py-8"
        style={{
          backgroundImage: "url('images/dash-bg.png')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-fit h-fit py-6 xl:py-9 2xl:py-28 gap-6 text-white px-12">
          {panelItems.map((item) => {
            const sharedClass = 'w-[250px] max-lg:w-[200px] h-[200px] max-lg:h-[150px] text-white uppercase lg:text-xl transform transition-all duration-300 ease-in-out hover:translate-y-[-10px] hover:scale-[1.02] hover:rotate-[1deg] cardBox';
            if (item.label === 'Dashboard') {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={onOpenDashbord}
                  className={sharedClass}
                >
                  <div className="card">
                    <img
                      src={item.icon}
                      className="w-[105px] h-[105px] max-lg:w-[70px] max-lg:h-[70px]"
                      alt={item.alt}
                    />
                    <p className="panel-text">{item.label}</p>
                  </div>
                </button>
              );
            }
            if (item.label === 'Billing') {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={onOpenBilling}
                  className={sharedClass}
                >
                  <div className="card">
                    <img
                      src={item.icon}
                      className="w-[105px] h-[105px] max-lg:w-[70px] max-lg:h-[70px]"
                      alt={item.alt}
                    />
                    <p className="panel-text">{item.label}</p>
                  </div>
                </button>
              );
            }
            if (pageOpeners[item.label]) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={pageOpeners[item.label]}
                  className={sharedClass}
                >
                  <div className="card">
                    {item.icon ? (
                      <img
                        src={item.icon}
                        className="w-[105px] h-[105px] max-lg:w-[70px] max-lg:h-[70px]"
                        alt={item.alt}
                      />
                    ) : item.iconType === 'finance' ? (
                      <svg viewBox="0 0 24 24" className="w-[80px] h-[80px] max-lg:w-[60px] max-lg:h-[60px] mb-2" fill="none" aria-hidden="true">
                        <path d="M4 10h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M6 10v8M10 10v8M14 10v8M18 10v8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M3 18h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M12 4l8 4H4l8-4z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <i className={item.iconClass} />
                    )}
                    <p className="panel-text">{item.label}</p>
                  </div>
                </button>
              );
            }
            return (
              <a
                key={item.label}
                href={item.href}
                target={item.target}
                rel={item.target === '_blank' ? 'noreferrer' : undefined}
                className={sharedClass}
              >
                <div className="card">
                  {item.icon ? (
                    <img
                      src={item.icon}
                      className="w-[105px] h-[105px] max-lg:w-[70px] max-lg:h-[70px]"
                      alt={item.alt}
                    />
                  ) : item.iconType === 'finance' ? (
                    <svg viewBox="0 0 24 24" className="w-[80px] h-[80px] max-lg:w-[60px] max-lg:h-[60px] mb-2" fill="none" aria-hidden="true">
                      <path d="M4 10h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M6 10v8M10 10v8M14 10v8M18 10v8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M3 18h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M12 4l8 4H4l8-4z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <i className={item.iconClass} />
                  )}
                  <p className="panel-text">{item.label}</p>
                </div>
              </a>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
