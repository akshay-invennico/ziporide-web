import { pdf } from '@react-pdf/renderer';
import { Search, Star } from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';

import DataTable, { type Column } from '@/components/ui/DataTable';
import {
  useDrivers,
  useUpdateDriverStatus,
  useExportDriversCSV,
  useExportDriversPDF,
} from '@/hooks/useDriver';
import { usePermissions } from '@/hooks/usePermissions';
import type { Driver } from '@/types/driver.types';

import DriverPDFDocument from '../../components/driver/DriverPDFDocument';
import ExportDropdown from '../../components/ui/export/ExportDropdown';
import FilterDropdown, { type FilterType } from '../../components/ui/filter/FilterDropdown';
import SuspendRiderModal from '../../components/ui/SuspendRiderModal';

const DriverPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [filters, setFilters] = useState<FilterType>({
    status: 'Active',
    minEarnings: 0,
    maxEarnings: 1000,
    minTrips: 0,
    maxTrips: 500,
    rating: 'All',
  });

  const { drivers, loading, totalPages, refetch } = useDrivers(
    filters,
    currentPage,
    itemsPerPage,
    searchQuery,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const [selectedDriverIds, setSelectedDriverIds] = useState<string[]>([]);
  const [suspendedDriverId, setSuspendedDriverId] = useState<string | null>(null);

  const { updateStatus, isUpdating } = useUpdateDriverStatus();
  const { hasPermission } = usePermissions();
  const canManageDrivers = hasPermission('drivers.manage');

  const { exportCSV } = useExportDriversCSV();
  const { fetchAllDrivers, setIsExporting: setIsExportingPDF } = useExportDriversPDF();

  const handleExportCSV = async () => {
    await exportCSV(filters);
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const allDrivers = await fetchAllDrivers(filters);
      if (allDrivers && allDrivers.length > 0) {
        const blob = await pdf(<DriverPDFDocument drivers={allDrivers} />).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Drivers_Export_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('PDF Export failed:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const getDriverId = (driver: Driver) => (driver.id || driver._id || '') as string;

  const getStatusStyle = (status?: string) => {
    const s = status?.toLowerCase();
    if (s === 'approved') return { dot: 'bg-[#00A63E]', text: 'text-[#00A63E]', label: 'Active' };
    if (s === 'suspended')
      return { dot: 'bg-[#FF0707]', text: 'text-[#FF0707]', label: 'Suspended' };
    return {
      dot: 'bg-[#E9A90A]',
      text: 'text-[#E9A90A]',
      label: status ? status.charAt(0).toUpperCase() + status.slice(1) : '-',
    };
  };

  const columns = useMemo<Column<Driver>[]>(
    () => [
      {
        key: 'name',
        label: 'DRIVER',
        sortable: true,
        render: (driver) => (
          <div className="flex items-center gap-3">
            {driver.profilePhotoUrl || driver.avatar ? (
              <div className="h-[40px] w-[40px] rounded-full overflow-hidden shrink-0 border border-gray-200">
                <img
                  src={driver.profilePhotoUrl || driver.avatar}
                  alt={driver.name || driver.driverName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-[40px] w-[40px] rounded-full bg-[#1DAFA1] flex items-center justify-center text-white font-bold text-[18px] shrink-0">
                {(driver.name || driver.driverName || 'D')[0].toUpperCase()}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-medium text-[#1DAFA1] text-[14px]">
                {driver.name || driver.driverName}
              </span>
              <span className="text-[12px] font-medium text-[#4E616A]">{driver.phone}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'email',
        label: 'EMAIL',
        sortable: true,
        render: (driver) => (
          <span className="text-[#1DAFA1] font-medium text-[14px]">{driver.email || '-'}</span>
        ),
      },
      {
        key: 'totalTrips',
        label: 'TOTAL TRIPS',
        sortable: true,
        render: (driver) => (
          <span className="text-[#4E616A] text-[14px] font-medium">{driver.totalTrips || 0}</span>
        ),
      },
      {
        key: 'totalEarnings',
        label: 'TOTAL EARN',
        sortable: true,
        render: (driver) => (
          <span className="text-[#4E616A] text-[14px] font-medium">
            £{Number(driver.totalEarnings || driver.totalEarned || 0).toFixed(2)}
          </span>
        ),
      },
      {
        key: 'rating',
        label: 'RATINGS',
        sortable: true,
        render: (driver) => (
          <div className="flex items-center gap-1.5">
            <Star className="h-[15px] w-[15px] fill-[#E9A90A] text-[#E9A90A]" />
            <span className="text-[#4E616A] text-[14px] font-medium">
              {Number(driver.avgRating || driver.rating || 0).toFixed(1)}
            </span>
          </div>
        ),
      },
      {
        key: 'status',
        label: 'STATUS',
        sortable: true,
        render: (driver) => {
          const style = getStatusStyle(driver.status);
          return (
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${style.dot}`} />
              <span className={`text-[12px] font-semibold ${style.text}`}>{style.label}</span>
            </div>
          );
        },
      },
      {
        key: 'action',
        label: 'ACTION',
        render: (driver) => {
          const id = getDriverId(driver);
          return (
            <div className="flex items-center gap-3">
              <Link
                to={`/driver/details/${id}`}
                className="shrink-0 cursor-pointer"
                title="View Driver"
              >
                <img src="/icons/rider/eye.svg" alt="eye" className="w-[24px] h-[24px] shrink-0" />
              </Link>
              {driver.status?.toLowerCase() === 'approved' && (
                <button
                  onClick={() => setSuspendedDriverId(id)}
                  className="shrink-0 cursor-pointer"
                  title="Suspend Driver"
                >
                  <img
                    src="/icons/driver/redUser.svg"
                    alt="suspend"
                    className="w-[24px] h-[24px] shrink-0"
                  />
                </button>
              )}
              {driver.status?.toLowerCase() === 'suspended' && (
                <button
                  onClick={() => setSuspendedDriverId(id)}
                  className="shrink-0 cursor-pointer"
                  title="Activate Driver"
                >
                  <img
                    src="/icons/driver/greenUser.svg"
                    alt="reactivate"
                    className="w-[24px] h-[24px] shrink-0"
                  />
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [canManageDrivers],
  );

  return (
    <div className="w-full min-h-screen bg-[#FFFFFF] p-1 relative">
      <div className="bg-white rounded-lg border border-[#DFE6E5]">
        {/* Controls Row */}
        <div className="p-4 border-b border-[#DFE6E5] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex border-[#DFE6E5] rounded-sm items-center pointer-events-none">
              <Search className="h-[22px] w-[22px] text-[#939999]" />
            </div>
            <input
              type="text"
              placeholder="Search here..."
              className="pl-10 pr-4 py-2 w-full border border-[#939999] rounded-sm text-[14px] focus:outline-none focus:ring-1 focus:ring-[#14B8A6] focus:border-[#14B8A6]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto relative">
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => {
                  setIsFilterOpen((prev) => !prev);
                  setIsExportOpen(false);
                }}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-[#DFE6E5] rounded-sm text-[14px] font-medium text-[#4E616A] w-full sm:w-auto justify-center"
              >
                <img src="/icons/rider/filters.svg" alt="filters" className="w-[22px] h-[22px]" />
                Filters
              </button>
              <FilterDropdown
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                setFilters={setFilters}
                userType="driver"
              />
            </div>
            <div className="relative" ref={exportRef}>
              <button
                onClick={() => {
                  setIsExportOpen((prev) => !prev);
                  setIsFilterOpen(false);
                }}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-[#DFE6E5] rounded-sm text-[14px] font-medium text-[#4E616A] w-full sm:w-auto justify-center"
              >
                <img src="/icons/rider/export.svg" alt="export" className="w-[22px] h-[22px]" />
                Export
              </button>
              <ExportDropdown
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                onExportCSV={handleExportCSV}
                onExportPDF={handleExportPDF}
              />
            </div>
          </div>
        </div>

        <DataTable<Driver>
          columns={columns}
          data={drivers}
          rowKey={(d) => getDriverId(d)}
          loading={loading}
          selectable
          selectedKeys={selectedDriverIds}
          onSelectionChange={setSelectedDriverIds}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          emptyText="No drivers found."
        />
      </div>

      <SuspendRiderModal
        isOpen={!!suspendedDriverId}
        onClose={() => setSuspendedDriverId(null)}
        onConfirm={async (reason) => {
          if (!suspendedDriverId) return;
          const currentDriver = drivers.find((d) => (d.id || d._id) === suspendedDriverId);
          const newStatus =
            currentDriver?.status?.toLowerCase() === 'suspended' ? 'approved' : 'suspended';
          try {
            const success = await updateStatus([suspendedDriverId], newStatus, reason);
            if (success) {
              setSuspendedDriverId(null);
              refetch();
            }
          } catch (err) {
            console.error('Failed to update status:', err);
          }
        }}
        userType="driver"
        loading={isUpdating}
        mode={
          drivers.find((d) => (d.id || d._id) === suspendedDriverId)?.status?.toLowerCase() ===
          'suspended'
            ? 'reactivate'
            : 'suspend'
        }
      />
    </div>
  );
};

export default DriverPage;
