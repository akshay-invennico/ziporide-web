import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { usePendingDriverCount } from '@/hooks/useVerificationDriver';
import { routes } from '@/routes/routes';

export default function Sidebar() {
  const location = useLocation();
  const { count } = usePendingDriverCount();

  const navigate = useNavigate();

  const navItems = useMemo(
    () => [
      { name: 'Dashboard', path: routes.DASHBOARD, icon: '/icons/sidebar/sidebarIcon1.svg' },
      { name: 'Riders', path: routes.RIDER, icon: '/icons/sidebar/sidebarIcon2.svg' },
      { name: 'Drivers', path: routes.DRIVER, icon: '/icons/sidebar/sidebarIcon3.svg' },
      {
        name: 'Verification Request',
        path: routes.VERIFICATION,
        badge: count > 0 ? (count > 99 ? '99+' : count.toString()) : undefined,
        icon: '/icons/sidebar/sidebarIcon4.svg',
      },
      { name: 'Trips', path: routes.TRIPS, icon: '/icons/sidebar/sidebarIcon5.svg' },
      {
        name: 'Vehicle Inventory',
        path: routes.INVENTORY,
        icon: '/icons/sidebar/sidebarIcon6.svg',
      },
      { name: 'Transactions', path: routes.TRANSACTIONS, icon: '/icons/sidebar/sidebarIcon7.svg' },
      { name: 'Support Tickets', path: routes.SUPPORT, icon: '/icons/sidebar/sidebarIcon8.svg' },
      {
        name: 'Settings',
        path: routes.SETTINGS,
        icon: '/icons/sidebar/sidebarIcon9.svg',
        hasDropdown: true,
        subItems: [
          {
            name: 'Pricing Logics',
            path: routes.PRICING_LOGIC,
            Icon: '/icons/sidebar/sidebarIcon10.svg',
          },
          {
            name: 'Push Notifications',
            path: routes.PUSH_NOTIFICATIONS,
            Icon: '/icons/sidebar/sidebarIcon11.svg',
          },
          { name: 'Operators', path: routes.OPERATORS, Icon: '/icons/sidebar/sidebarIcon12.svg' },
        ],
      },
    ],
    [count],
  );

  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialOpen: Record<string, boolean> = {};
    navItems.forEach((item) => {
      if (item.subItems && item.subItems.some((sub) => location.pathname.startsWith(sub.path))) {
        initialOpen[item.name] = true;
      }
    });
    setOpenDropdowns(initialOpen);
  }, [location.pathname, navItems]);

  const handleNavClick = (
    name: string,
    path: string,
    e: React.MouseEvent,
    hasSubItems: boolean,
  ) => {
    if (hasSubItems) {
      e.preventDefault();
      setOpenDropdowns((prev) => ({
        ...prev,
        [name]: !prev[name],
      }));
    } else {
      e.preventDefault();
      navigate(path);
    }
  };

  return (
    <div className="w-[250px] bg-[#2D2D2D] text-white flex flex-col h-screen fixed top-0 left-0 overflow-y-auto z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 mb-1">
        <img src="/logo.svg" alt="ZipoRide" className="h-[30px] w-[30px]" />
        <span className="text-[24px] font-semibold tracking-wide text-white">Zipo</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 mt-2">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.subItems && item.subItems.some((sub) => location.pathname === sub.path));
          const isOpen = openDropdowns[item.name];

          return (
            <div key={item.name} className="flex flex-col">
              <Link
                to={item.path}
                onClick={(e) => handleNavClick(item.name, item.path, e, !!item.subItems)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-md transition-all duration-150 group ${
                  isActive && !item.subItems ? 'bg-[#14B8A6] text-white  ' : 'text-[#FFFFFF]'
                }`}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-[24px] h-[24px] shrink-0"
                  draggable={false}
                />

                <span className="font-medium text-[#FFFFFF] flex-1 text-[14px]">{item.name}</span>

                {item.badge && (
                  <span className="bg-red-500 text-white text-[12px] font-bold px-2 py-1 rounded-md leading-none">
                    {item.badge}
                  </span>
                )}

                {item.hasDropdown && (
                  <img
                    src="/icons/sidebar/dropdown.svg"
                    alt="dropdown"
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                )}
              </Link>

              {item.subItems && isOpen && (
                <div className="relative flex flex-col gap-2 mt-2 ml-4 pl-6">
                  {/* Vertical main branch stalk */}
                  <div className="absolute left-[11px] top-[-8px] bottom-[28px] w-[2px] bg-white z-0 pointer-events-none"></div>

                  {item.subItems.map((subItem) => {
                    const isSubActive = location.pathname === subItem.path;
                    const Icon = subItem.Icon;
                    return (
                      <Link
                        key={subItem.name}
                        to={subItem.path}
                        className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-150 ${
                          isSubActive
                            ? 'bg-[#14B8A6] text-white font-medium'
                            : 'text-[#FFFFFF] font-medium'
                        }`}
                      >
                        {/* Connecting branch curve connecting to the main stalk */}
                        <div className="absolute left-[-13px] top-[-8px] w-[13px] h-[32px] border-b-2 border-l-2 border-white rounded-bl-[16px] z-[-1] pointer-events-none"></div>

                        {Icon && (
                          <img
                            src={Icon}
                            alt={subItem.name}
                            className="w-[24px] h-[24px] shrink-0"
                            draggable={false}
                          />
                        )}
                        <span className="text-[14px] font-medium text-[#FFFFFF] leading-none">
                          {subItem.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
