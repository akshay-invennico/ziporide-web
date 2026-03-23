import { ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  // Basic title mapping based on route
  const getPageTitle = () => {
    if (location.pathname.includes('dashboard')) return { title: 'Dashboard', subtitle: "Welcome back! Here's what's happening today." };
    if (location.pathname.includes('rider')) return { title: 'Riders', subtitle: "View and manage rider accounts" };
    if (location.pathname.includes('driver')) return { title: 'Drivers', subtitle: "View and manage driver accounts" };
    if (location.pathname.includes('verification')) return { title: 'Verification Requests', subtitle: 'Review and take action on driver applications' };
    if (location.pathname.includes('trips')) return { title: 'Trip History', subtitle: 'View and manage trip records' }
    return { title: 'Admin Panel', subtitle: "Manage your platform here." };
  };

  const { title, subtitle } = getPageTitle();

  return (
    <header className="flex justify-between items-center   bg-white px-8 py-5  shrink-0">
      <div>
        <h1 className="text-[20px] font-semibold text-[#2D2D2D]">{title}</h1>
        <p className="text-[12px] font-medium text-[#4E616A] mt-1">{subtitle}</p>
      </div>

      <div className="flex items-center gap-5">
        <img src="/icons/bellIcon.svg" alt="bellIcon" className="w-[44px] h-[44px] cursor-pointer" />

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
