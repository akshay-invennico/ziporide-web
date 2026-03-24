import { ChevronDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { routes } from '@/routes/routes';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  [routes.DASHBOARD]: { title: 'Dashboard', subtitle: "Welcome back! Here's what's happening today." },
  [routes.RIDER]: { title: 'Riders', subtitle: 'View and manage rider accounts' },
  [routes.DRIVER]: { title: 'Drivers', subtitle: 'View and manage driver accounts' },
  [routes.VERIFICATION]: { title: 'Verification Requests', subtitle: 'Review and take action on driver applications' },
  [routes.TRIPS]: { title: 'Trip History', subtitle: 'View and manage trip records' },
};

export default function Header() {
  const location = useLocation();

  const getPageTitle = () => {
    const match = Object.entries(PAGE_TITLES).find(([path]) =>
      location.pathname.startsWith(path),
    );
    return match ? match[1] : { title: 'Admin Panel', subtitle: 'Manage your platform here.' };
  };

  const { title, subtitle } = getPageTitle();

  return (
    <header className="flex justify-between items-center   bg-white px-8 py-5  shrink-0">
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

        <div className="flex items-center gap-3 cursor-pointer border border-[#DFE6E5] p-1.5 rounded-full pr-3 transition-colors">
          <img
            src="https://i.pravatar.cc/150?img=11"
            alt="Profile"
            className="w-10 h-10 rounded-full "
          />
          <ChevronDown className="text-[#2D2D2D] w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
