import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useDashboardSummary } from '@/hooks/useDashboard';

import RecentTripsTable from '../../components/dashboard/RecentTripsTable';
import RevenueAnalyticsChart from '../../components/dashboard/RevenueAnalyticsChart';
import RidersDriversReportChart from '../../components/dashboard/RidersDriversReportChart';
import StatCard from '../../components/dashboard/StatCard';
import TripsChart from '../../components/dashboard/TripsChart';

export default function DashboardPage() {
  const { data: summaryData, loading, error } = useDashboardSummary();

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center text-red-500">
        <p>Error loading dashboard data: {error}</p>
      </div>
    );
  }

  const formatNumber = (num: number) => new Intl.NumberFormat('en-GB').format(num);
  const formatCurrency = (num: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(num);

  return (
    <div className="space-y-6 ">
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Riders"
          value={summaryData ? formatNumber(summaryData.totalRiders.value) : '0'}
          trend={summaryData?.totalRiders.trend || 'up'}
          trendValue={summaryData ? `${summaryData.totalRiders.change}%` : '0%'}
          trendLabel="This Week"
          icon="/icons/statCard/Riders.svg"
        />
        <StatCard
          title="Active Drivers"
          value={summaryData ? formatNumber(summaryData.activeDrivers.value) : '0'}
          trend={summaryData?.activeDrivers.trend || 'up'}
          trendValue={summaryData ? `${summaryData.activeDrivers.change}%` : '0%'}
          trendLabel="This Week"
          icon="/icons/statCard/Drivers.svg"
        />
        <StatCard
          title="Total Trips"
          value={summaryData ? formatNumber(summaryData.totalTrips.value) : '0'}
          trend={summaryData?.totalTrips.trend || 'up'}
          trendValue={summaryData ? `${summaryData.totalTrips.change}%` : '0%'}
          trendLabel="This Week"
          icon="/icons/statCard/Trips.svg"
        />
        <StatCard
          title="Revenue"
          value={summaryData ? formatCurrency(summaryData.revenue.value) : '£0'}
          trend={summaryData?.revenue.trend || 'up'}
          trendValue={summaryData ? `${summaryData.revenue.change}%` : '0%'}
          trendLabel="This Week"
          icon="/icons/statCard/Revenu.svg"
        />
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <RevenueAnalyticsChart />
        <RidersDriversReportChart />
        <TripsChart />
      </div>

      {/* Recent Trips Table */}
      <div className="grid grid-cols-1">
        <RecentTripsTable />
      </div>
    </div>
  );
}
