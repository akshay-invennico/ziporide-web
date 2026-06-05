import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { usePermissions } from '@/hooks/usePermissions';
import { useDriverDetails, useUpdateDriverStatus } from '@/hooks/useDriver';
import { routes } from '@/routes/routes';

import SuspendRiderModal from '../../../components/ui/SuspendRiderModal';

import DriverAuditLogTab from './components/DriverAuditLogTab';
import DriverEarningTab from './components/DriverEarningTab';
import DriverInfoTab from './components/DriverInfoTab';
import DriverSubscriptionTab from './components/DriverSubscriptionTab';
import DriverTripHistoryTab from './components/DriverTripHistoryTab';

type TabKey = 'info' | 'subscription' | 'earning' | 'trip-history' | 'audit-log';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'info', label: 'Driver Details & Docs' },
  { key: 'subscription', label: 'Subscription' },
  { key: 'earning', label: 'Earning' },
  { key: 'trip-history', label: 'Trip History' },
  { key: 'audit-log', label: 'Audit Log & Activity Timeline' },
];

export default function DriverDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('info');
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const { canEditModule } = usePermissions();
  const canEditDrivers = canEditModule('drivers');

  const { driver, loading, error, refetch } = useDriverDetails(id);
  const { updateStatus, isUpdating } = useUpdateDriverStatus();

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white p-6 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="w-full min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{error || 'Driver Not Found'}</h2>
          <button onClick={() => navigate(routes.DRIVER)} className="text-teal-600 hover:underline">
            Return to Drivers List
          </button>
        </div>
      </div>
    );
  }

  const isSuspended = driver.status?.toLowerCase() === 'suspended';

  const handleStatusUpdate = async (reason?: string) => {
    if (!id || !canEditDrivers) return;
    const newStatus = isSuspended ? 'approved' : 'suspended';
    try {
      const success = await updateStatus([id], newStatus, reason);
      if (success) {
        setIsSuspendModalOpen(false);
        refetch();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white p-2">
      {/* Back Button */}
      <button
        onClick={() => navigate(routes.DRIVER)}
        className="flex items-center gap-2 text-[14px] font-medium text-[#4E616A] mb-6 w-fit transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-[24px] h-[24px] text-[#4E616A] font-medium" />
        Back
      </button>

      {/* Tab Navigation */}
      <div className="flex items-center gap-8 mb-3 overflow-x-auto overflow-y-hidden scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.key
                ? 'border-[#1DAFA1] text-[#1DAFA1]'
                : 'border-transparent text-[#4E616A] hover:text-[#1DAFA1]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white w-full">
        {activeTab === 'info' && (
          <DriverInfoTab driver={driver} onProfileUpdated={refetch} canEdit={canEditDrivers} />
        )}
        {activeTab === 'subscription' && <DriverSubscriptionTab />}
        {activeTab === 'earning' && <DriverEarningTab />}
        {activeTab === 'trip-history' && <DriverTripHistoryTab />}
        {activeTab === 'audit-log' && <DriverAuditLogTab driverId={id!} />}
      </div>

      {/* Status Update Button */}
      {activeTab === 'info' && canEditDrivers && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setIsSuspendModalOpen(true)}
            className={`flex items-center cursor-pointer gap-2 px-4 py-2.5 rounded-sm border border-[#DFE6E5] bg-white text-[14px] font-medium ${isSuspended ? 'text-[#00A63E]' : 'text-[#FF0707]'}`}
          >
            <img
              src={isSuspended ? '/icons/driver/greenUser.svg' : '/icons/driver/redUser.svg'}
              alt="status"
              className="w-[20px] h-[20px]"
            />
            {isSuspended ? 'Reactivate Driver' : 'Suspend Driver'}
          </button>
        </div>
      )}

      <SuspendRiderModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        onConfirm={handleStatusUpdate}
        userType="driver"
        mode={isSuspended ? 'reactivate' : 'suspend'}
        loading={isUpdating}
      />
    </div>
  );
}
