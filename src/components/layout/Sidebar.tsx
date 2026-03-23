import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '/icons/sidebar/sidebarIcon1.svg' },
  { name: 'Riders', path: '/rider', icon: '/icons/sidebar/sidebarIcon2.svg' },
  { name: 'Drivers', path: '/driver', icon: '/icons/sidebar/sidebarIcon3.svg' },
  {
    name: 'Verification Req',
    path: '/verification',
    icon: '/icons/sidebar/sidebarIcon4.svg',
    badge: '20+',
  },
  { name: 'Trips', path: '/trips', icon: '/icons/sidebar/sidebarIcon5.svg' },
  { name: 'Vehicle Inventory', path: '/inventory', icon: '/icons/sidebar/sidebarIcon6.svg' },
  { name: 'Support Tickets', path: '/support', icon: '/icons/sidebar/sidebarIcon7.svg' },
  {
    name: 'Settings',
    path: '/settings',
    icon: '/icons/sidebar/sidebarIcon8.svg',
    hasDropdown: true,
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-[250px] bg-[#2D2D2D] text-white flex flex-col h-screen fixed top-0 left-0 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 mb-1">
        <img src="/logo.svg" alt="ZipoRide" className="h-[30px] w-[30px]" />
        <span className="text-[24px] font-semibold tracking-wide text-white">Zipo</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-150 group ${
                isActive ? 'bg-[#14B8A6] text-white ' : 'text-[#FFFFFF] '
              }`}
            >
              <img
                src={item.icon}
                alt={item.name}
                className="w-[24px] h-[24px]  shrink-0"
                draggable={false}
              />

              <span className="font-medium text-[#FFFFFF] flex-1 text-[14px]">{item.name}</span>

              {item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none">
                  {item.badge}
                </span>
              )}

              {item.hasDropdown && (
                <svg
                  className={`w-3.5 h-3.5 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
