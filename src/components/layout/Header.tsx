import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '@/context/useAuth';
import { routes } from '@/routes/routes';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  [routes.DASHBOARD]: {
    title: 'Dashboard',
    subtitle: "Welcome back! Here's what's happening today.",
  },
  [routes.RIDER]: {
    title: 'Riders',
    subtitle: 'View and manage rider accounts',
  },
  [routes.DRIVER]: {
    title: 'Drivers',
    subtitle: 'View and manage driver accounts',
  },
  [routes.VERIFICATION]: {
    title: 'Verification Requests',
    subtitle: 'Review and take action on driver applications',
  },
  [routes.TRIPS]: {
    title: 'Trip History',
    subtitle: 'View and manage trip records',
  },
  [routes.INVENTORY]: {
    title: 'Vehicle Inventory',
    subtitle: 'Manage all vehicles in the fleet with detailed information',
  },
  [routes.TRANSACTIONS]: {
    title: 'Transactions',
    subtitle: 'Oversee all fleet transactions with comprehensive insights.',
  },
  [routes.SUPPORT]: {
    title: 'Support Tickets',
    subtitle: 'Manage all the Support Tickets',
  },
};

export default function Header() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const match = Object.entries(PAGE_TITLES).find(([path]) => location.pathname.startsWith(path));
    return match ? match[1] : { title: 'Admin Panel', subtitle: 'Manage your platform here.' };
  };

  const { title, subtitle } = getPageTitle();

  const handleLogout = () => {
    logout();
    navigate(routes.LOGIN);
  };

  return (
    <header className="flex justify-between items-center bg-white px-8 py-5 shrink-0">
      <div>
        <h1 className="text-[20px] font-semibold text-[#2D2D2D]">{title}</h1>
        <p className="text-[12px] font-medium text-[#4E616A] mt-1">{subtitle}</p>
      </div>

      <div className="flex items-center gap-5">
        <img
          src="/icons/bellIcon.svg"
          alt="bellIcon"
          className="w-[44px] h-[44px] cursor-pointer"
        />

        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 cursor-pointer border border-[#DFE6E5] p-1.5 rounded-full pr-3 transition-colors hover:bg-gray-50"
          >
            <img
              src="https://i.pravatar.cc/150?img=11"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <ChevronDown
              className={`text-[#2D2D2D] w-4 h-4 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-[200px] bg-white shadow-[0_0_16px_0_rgba(237,155,14,0.2)] border border-[#DFE6E5] rounded-lg py-2 z-50 overflow-hidden">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate(routes.SETTINGS);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-[#4E616A] cursor-pointer"
              >
                <img src="/icons/profile.svg" alt="profile" className="w-[22px] h-[22px]" />
                My Profile
              </button>

              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-[#4E616A] cursor-pointer"
              >
                <img src="/icons/log.svg" alt="logout" className="w-[22px] h-[22px]" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
