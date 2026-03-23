import RecentTripsTable from '../../components/dashboard/RecentTripsTable';
import RevenueAnalyticsChart from '../../components/dashboard/RevenueAnalyticsChart';
import RidersDriversReportChart from '../../components/dashboard/RidersDriversReportChart';
import StatCard from '../../components/dashboard/StatCard';
import TripsChart from '../../components/dashboard/TripsChart';

export default function DashboardPage() {
  return (
    <div className="space-y-6 ">
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Riders"
          value="12,458"
          trend="up"
          trendValue="+12.5%"
          trendLabel="This Week"
          icon="/icons/statCard/Riders.svg"
        />
        <StatCard
          title="Active Drivers"
          value="03,255"
          trend="up"
          trendValue="+1.5%"
          trendLabel="This Week"
          icon="/icons/statCard/Drivers.svg"
        />
        <StatCard
          title="Total Trips"
          value="10,05,277"
          trend="down"
          trendValue="-12%"
          trendLabel="This Week"
          icon="/icons/statCard/Trips.svg"
        />
        <StatCard
          title="Revenue"
          value="£56,64,2356.00"
          trend="down"
          trendValue="-15%"
          trendLabel="This Week"
          icon="/icons/statCard/Revenu.svg"
        />
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
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
