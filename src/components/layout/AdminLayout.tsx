import { Outlet } from 'react-router-dom';

import Header from './Header';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  return (
    // Full viewport — dark background always visible, no page-level scroll
    <div className="flex h-screen bg-[#2D2D2D] font-sans overflow-hidden">
      {/* Sidebar sits directly ON the dark background, fixed, never scrolls */}
      <Sidebar />

      {/* Right side wrapper — padding lets dark bg peek around the white card */}
      <div className="flex-1 ml-64 pt-3 pb-3 pr-3  overflow-hidden flex flex-col">
        {/* White rounded card — fills remaining height, clips inner content */}
        <div className="flex-1 bg-white rounded-2xl  flex flex-col overflow-hidden">
          {/* Header: sticky at top of white card, never scrolls away */}
          <div className="sticky top-0 z-10 bg-white rounded-t-2xl shrink-0">
            <Header />
          </div>

          {/* Main: ONLY this scrolls — content clips inside the rounded card */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
