import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { usePermissions } from '@/hooks/usePermissions';
import { usePendingDriverCount } from '@/hooks/useVerificationDriver';
import { routes } from '@/routes/routes';

interface SubItem {
  name: string;
  path: string;
  Icon: string;
  permission?: string;
}

interface NavItem {
  name: string;
  path: string;
  icon: string;
  badge?: string;
  hasDropdown?: boolean;
  subItems?: SubItem[];
  permission?: string;
}

export default function Sidebar() {
  const location = useLocation();
  const { count } = usePendingDriverCount();
  const { hasPermission } = usePermissions();

  const navigate = useNavigate();

  const allNavItems: NavItem[] = useMemo(
    () => [
      {
        name: 'Dashboard',
        path: routes.DASHBOARD,
        icon: '/icons/sidebar/sidebarIcon1.svg',
        permission: 'dashboard.view_analytics',
      },
      {
        name: 'Riders',
        path: routes.RIDER,
        icon: '/icons/sidebar/sidebarIcon2.svg',
        permission: 'riders.view',
      },
      {
        name: 'Drivers',
        path: routes.DRIVER,
        icon: '/icons/sidebar/sidebarIcon3.svg',
        permission: 'drivers.view',
      },
      {
        name: 'Verification Request',
        path: routes.VERIFICATION,
        badge: count > 0 ? (count > 99 ? '99+' : count.toString()) : undefined,
        icon: '/icons/sidebar/sidebarIcon4.svg',
        permission: 'verification.view',
      },
      {
        name: 'Trips',
        path: routes.TRIPS,
        icon: '/icons/sidebar/sidebarIcon5.svg',
        permission: 'trips.view',
      },
      {
        name: 'Vehicle Inventory',
        path: routes.INVENTORY,
        icon: '/icons/sidebar/sidebarIcon6.svg',
        permission: 'inventory.view',
      },
      {
        name: 'Transactions',
        path: routes.TRANSACTIONS,
        icon: '/icons/sidebar/sidebarIcon7.svg',
      },
      {
        name: 'Support Tickets',
        path: routes.SUPPORT,
        icon: '/icons/sidebar/sidebarIcon8.svg',
        permission: 'support.view',
      },
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
            permission: 'pricing.view',
          },
          {
            name: 'Push Notifications',
            path: routes.PUSH_NOTIFICATIONS,
            Icon: '/icons/sidebar/sidebarIcon11.svg',
            permission: 'notifications.send',
          },
          {
            name: 'Operators',
            path: routes.OPERATORS,
            Icon: '/icons/sidebar/sidebarIcon12.svg',
            permission: 'operators.view',
          },
        ],
      },
    ],
    [count],
  );

  const navItems = useMemo(() => {
    return allNavItems
      .map((item) => {
        if (item.subItems) {
          const visibleSubItems = item.subItems.filter(
            (sub) => !sub.permission || hasPermission(sub.permission),
          );
          if (visibleSubItems.length === 0) return null;
          return { ...item, subItems: visibleSubItems };
        }
        if (item.permission && !hasPermission(item.permission)) return null;
        return item;
      })
      .filter(Boolean) as NavItem[];
  }, [allNavItems, hasPermission]);

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
            location.pathname.startsWith(item.path + '/') ||
            (item.subItems &&
              item.subItems.some(
                (sub) =>
                  location.pathname === sub.path || location.pathname.startsWith(sub.path + '/'),
              ));
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
                    const isSubActive =
                      location.pathname === subItem.path ||
                      location.pathname.startsWith(subItem.path + '/');
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
