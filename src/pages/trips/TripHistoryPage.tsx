import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';

import DataTable, { type Column } from '@/components/ui/DataTable';

import TripDetailsModal from '../../components/ui/TripDetailsModal';
import {
  tripHistoryData,
  TRIP_ITEMS_PER_PAGE,
  type TripStatus,
  type TripRecord,
} from '../../data/TripHistoryData';

type FilterTab = 'All' | TripStatus;

const FILTER_TABS: FilterTab[] = ['All', 'Assigned', 'In Progress', 'Completed', 'Cancelled'];

const STATUS_STYLES: Record<TripStatus, { dot: string; text: string }> = {
  Assigned: { dot: 'bg-[#1DAFA1]', text: 'text-[#1DAFA1]' },
  'In Progress': { dot: 'bg-[#F6921E]', text: 'text-[#F6921E]' },
  Completed: { dot: 'bg-[#00A63E]', text: 'text-[#00A63E]' },
  Cancelled: { dot: 'bg-[#FF0707]', text: 'text-[#FF0707]' },
};

const AvatarCell = ({ initials, bg = '#1DAFA1' }: { initials: string; bg?: string }) => (
  <div
    className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-white text-[18px] font-bold shrink-0"
    style={{ backgroundColor: bg }}
  >
    {initials}
  </div>
);

export default function TripHistoryPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrip, setSelectedTrip] = useState<TripRecord | null>(null);
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return tripHistoryData.filter((trip) => {
      const matchesTab = activeTab === 'All' || trip.status === activeTab;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        trip.id.toLowerCase().includes(q) ||
        trip.rider.name.toLowerCase().includes(q) ||
        trip.driver.name.toLowerCase().includes(q) ||
        trip.route.from.toLowerCase().includes(q) ||
        trip.route.to.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, search]);

  const totalPages = Math.ceil(filtered.length / TRIP_ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * TRIP_ITEMS_PER_PAGE,
    currentPage * TRIP_ITEMS_PER_PAGE,
  );

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const columns = useMemo<Column<TripRecord>[]>(
    () => [
      {
        key: 'id',
        label: 'TRIP ID',
        sortable: true,
        render: (trip) => (
          <span className="text-[14px] font-medium text-[#14B8A6] whitespace-nowrap">
            {trip.id}
          </span>
        ),
      },
      {
        key: 'rider',
        label: 'RIDER',
        sortable: true,
        render: (trip) => (
          <div className="flex items-center gap-2.5">
            <AvatarCell initials={trip.rider.avatar} />
            <div className="flex flex-col">
              <span className="text-[14px] font-medium text-[#1DAFA1] whitespace-nowrap">
                {trip.rider.name}
              </span>
              <span className="text-[12px] font-medium text-[#4E616A]">{trip.rider.phone}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'driver',
        label: 'DRIVER',
        sortable: true,
        render: (trip) => (
          <div className="flex items-center gap-2.5">
            <div className="w-[40px] h-[40px] rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src={trip.driver.avatar}
                alt={trip.driver.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const t = e.currentTarget as HTMLImageElement;
                  t.style.display = 'none';
                  const parent = t.parentElement;
                  if (parent) {
                    parent.style.backgroundColor = '#1DAFA1';
                    parent.innerText = trip.driver.name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2);
                    parent.style.color = 'white';
                    parent.style.fontSize = '18px';
                    parent.style.fontWeight = '700';
                  }
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-medium text-[#1DAFA1] whitespace-nowrap">
                {trip.driver.name}
              </span>
              <span className="text-[12px] font-medium text-[#4E616A]">{trip.driver.phone}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'route',
        label: 'ROUTE',
        render: (trip) => (
          <span className="text-[14px] font-medium text-[#4E616A] whitespace-nowrap">
            {trip.route.from} <span className="mx-1">→</span> {trip.route.to}
          </span>
        ),
      },
      {
        key: 'amount',
        label: 'AMOUNT',
        sortable: true,
        render: (trip) => (
          <span className="text-[14px] font-medium text-[#4E616A] whitespace-nowrap">
            £{trip.amount.toFixed(2)}
          </span>
        ),
      },
      {
        key: 'date',
        label: 'TIME & DATE',
        sortable: true,
        render: (trip) => (
          <span className="text-[14px] font-medium text-[#4E616A] whitespace-nowrap flex items-center gap-2">
            {trip.date}
            <span className="border-r border-[#DFE6E5] w-[3px] h-[20px] inline-block" />
            <span>{trip.time}</span>
          </span>
        ),
      },
      {
        key: 'status',
        label: 'STATUS',
        sortable: true,
        render: (trip) => {
          const style = STATUS_STYLES[trip.status];
          return (
            <div className="flex items-center gap-1.5">
              <div className={`w-[6px] h-[6px] rounded-full shrink-0 ${style.dot}`} />
              <span className={`text-[12px] font-semibold ${style.text}`}>{trip.status}</span>
            </div>
          );
        },
      },
      {
        key: 'action',
        label: 'ACTION',
        render: (trip) => {
          const showCancel = trip.status === 'Assigned' || trip.status === 'In Progress';
          return (
            <div className="flex items-center gap-2">
              <button
                className="cursor-pointer"
                title="View"
                onClick={() => {
                  setSelectedTrip(trip);
                  setIsTripModalOpen(true);
                }}
              >
                <img src="/icons/rider/eye.svg" alt="view" className="w-[20px] h-[20px]" />
              </button>
              {showCancel && (
                <button className="cursor-pointer" title="Cancel">
                  <img
                    src="/icons/dashboard/cancel.svg"
                    alt="cancel"
                    className="w-[20px] h-[20px]"
                  />
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="w-full min-h-screen p-1 flex flex-col gap-4">
      <div className="bg-white rounded-lg border border-[#DFE6E5] overflow-hidden">
        {/* Search + Filter Row */}
        <div className="p-4 border-b border-[#DFE6E5] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-[300px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex border-[#DFE6E5] rounded-sm items-center pointer-events-none">
              <Search className="h-[22px] w-[22px] text-[#939999]" />
            </div>
            <input
              type="text"
              placeholder="Search here..."
              value={search}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 w-full border border-[#939999] rounded-sm text-[14px] focus:outline-none focus:ring-1 focus:ring-[#14B8A6] focus:border-[#14B8A6]"
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-4 py-2 rounded-sm text-[14px] cursor-pointer font-medium transition-all ${
                    activeTab === tab
                      ? tab === 'Assigned' || tab === 'All'
                        ? 'bg-[#EEFFFD] text-[#1DAFA1] border border-[#1DAFA1]'
                        : tab === 'In Progress'
                          ? 'bg-[#FFF3D4] text-[#F6921E] border border-[#F6921E]'
                          : tab === 'Completed'
                            ? 'bg-[#EAFFF2] text-[#00A63E] border border-[#00A63E]'
                            : 'bg-[#FFF6F6] text-[#FF0707] border border-[#FF0707]'
                      : 'text-[#4E616A] bg-transparent border border-[#DFE6E5]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-[#DFE6E5] rounded-sm text-[14px] font-medium text-[#4E616A] w-full sm:w-auto justify-center">
              <img src="/icons/rider/export.svg" alt="export" className="w-[22px] h-[22px]" />
              Export
            </button>
          </div>
        </div>

        {/* DataTable */}
        <DataTable<TripRecord>
          columns={columns}
          data={paginated}
          rowKey={(trip) => trip.id}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          emptyText="No trips found."
          minHeight="400px"
        />
      </div>

      <TripDetailsModal
        isOpen={isTripModalOpen}
        onClose={() => {
          setIsTripModalOpen(false);
          setSelectedTrip(null);
        }}
        trip={selectedTrip}
      />
    </div>
  );
}
