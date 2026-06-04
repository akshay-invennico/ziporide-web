import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { usePermissions } from '@/hooks/usePermissions';
import { useSupportTicketCount } from '@/hooks/useSupportTickets';
import { usePendingDriverCount } from '@/hooks/useVerificationDriver';
import { routes } from '@/routes/routes';

interface SubItem {
  name: string;
  path: string;
  icon: string;
  activeIcon: string;
  permission?: string;
}

interface NavItem {
  name: string;
  path: string;
  icon: string;
  activeIcon: string;
  badge?: string;
  hasDropdown?: boolean;
  subItems?: SubItem[];
  permission?: string;
}

export default function Sidebar() {
  const location = useLocation();
  const { count } = usePendingDriverCount();
  const { count: supportTicketCount } = useSupportTicketCount();
  const { hasPermission } = usePermissions();

  const navigate = useNavigate();

  const allNavItems: NavItem[] = useMemo(
    () => [
      {
        name: 'Dashboard',
        path: routes.DASHBOARD,
        icon: '/icons/sidebar/sidebarIcon1_default.svg',
        activeIcon: '/icons/sidebar/sidebarIcon1_active.svg',
        permission: 'dashboard.view_analytics',
      },
      {
        name: 'Riders',
        path: routes.RIDER,
        icon: '/icons/sidebar/sidebarIcon2_default.svg',
        activeIcon: '/icons/sidebar/sidebarIcon2_active.svg',
        permission: 'riders.view',
      },
      {
        name: 'Drivers',
        path: routes.DRIVER,
        icon: '/icons/sidebar/sidebarIcon3_default.svg',
        activeIcon: '/icons/sidebar/sidebarIcon3_active.svg',
        permission: 'drivers.view',
      },
      {
        name: 'Verification Request',
        path: routes.VERIFICATION,
        badge: count > 0 ? (count > 99 ? '99+' : count.toString()) : undefined,
        icon: '/icons/sidebar/sidebarIcon4_default.svg',
        activeIcon: '/icons/sidebar/sidebarIcon4_active.svg',
        permission: 'verification.view',
      },
      {
        name: 'Trips',
        path: routes.TRIPS,
        icon: '/icons/sidebar/sidebarIcon5_default.svg',
        activeIcon: '/icons/sidebar/sidebarIcon5_active.svg',
        permission: 'trips.view',
      },
      {
        name: 'Vehicle Inventory',
        path: routes.INVENTORY,
        icon: '/icons/sidebar/sidebarIcon6_default.svg',
        activeIcon: '/icons/sidebar/sidebarIcon6_active.svg',
        permission: 'inventory.view',
      },
      {
        name: 'Transactions',
        path: routes.TRANSACTIONS,
        icon: '/icons/sidebar/sidebarIcon7_default.svg',
        activeIcon: '/icons/sidebar/sidebarIcon7_active.svg',
      },
      {
        name: 'Support Tickets',
        path: routes.SUPPORT,
        badge:
          supportTicketCount > 0
            ? supportTicketCount > 99
              ? '99+'
              : supportTicketCount.toString()
            : undefined,
        icon: '/icons/sidebar/sidebarIcon8_default.svg',
        activeIcon: '/icons/sidebar/sidebarIcon8_active.svg',
        permission: 'support.view',
      },
      {
        name: 'Settings',
        path: routes.SETTINGS,
        icon: '/icons/sidebar/sidebarIcon9_default.svg',
        activeIcon: '/icons/sidebar/sidebarIcon9_active.svg',
        hasDropdown: true,
        subItems: [
          {
            name: 'Pricing Logics',
            path: routes.PRICING_LOGIC,
            icon: '/icons/sidebar/sidebarIcon10_default.svg',
            activeIcon: '/icons/sidebar/sidebarIcon10_active.svg',
            permission: 'pricing.view',
          },
          {
            name: 'Push Notifications',
            path: routes.PUSH_NOTIFICATIONS,
            icon: '/icons/sidebar/sidebarIcon11_default.svg',
            activeIcon: '/icons/sidebar/sidebarIcon11_active.svg',
            permission: 'notifications.send',
          },
          {
            name: 'Operators',
            path: routes.OPERATORS,
            icon: '/icons/sidebar/sidebarIcon12_default.svg',
            activeIcon: '/icons/sidebar/sidebarIcon12_active.svg',
            permission: 'operators.view',
          },
        ],
      },
    ],
    [count, supportTicketCount],
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
      <Link to={routes.DASHBOARD} className="flex items-center gap-3 px-6 py-5 mb-1 cursor-pointer">
        <img src="/logo.svg" alt="Zipo" className="h-[30px] w-[30px]" />
        <span className="text-[24px] font-semibold tracking-wide text-white">Zipo</span>
      </Link>

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
                  src={isActive ? item.activeIcon : item.icon}
                  alt={item.name}
                  className="w-[24px] h-[24px] shrink-0"
                  draggable={false}
                />

                <span className="font-medium text-[#FFFFFF] flex-1 text-[14px]">{item.name}</span>

                {item.badge && (
                  <span className="bg-[#FF0707] text-white text-[12px] font-semibold px-2 py-1 text-center rounded-full leading-none">
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
                    return (
                      <Link
                        key={subItem.name}
                        to={subItem.path}
                        className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-150 ${
                          isSubActive
                            ? 'bg-[#14B8A6] text-white font-medium text-[14px]'
                            : 'text-[#FFFFFF] font-medium text-[14px]'
                        }`}
                      >
                        {/* Connecting branch curve connecting to the main stalk */}
                        <div className="absolute left-[-13px] top-[-8px] w-[13px] h-[32px] border-b-2 border-l-2 border-white rounded-bl-[16px] z-[-1] pointer-events-none"></div>

                        {(subItem.icon || subItem.activeIcon) && (
                          <img
                            src={isSubActive ? subItem.activeIcon : subItem.icon}
                            alt={subItem.name}
                            className="w-[24px] h-[24px]"
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
