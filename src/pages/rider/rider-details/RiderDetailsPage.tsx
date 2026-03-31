import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useRiderDetails, useUpdateRiderStatus } from '@/hooks/useRider';
import { routes } from '@/routes/routes';

import SuspendRiderModal from '../../../components/ui/SuspendRiderModal';

import ActivityTimelineTab from './components/ActivityTimelineTab';
import RiderInfoTab from './components/RiderInfoTab';
import SpentTripHistoryTab from './components/SpentTripHistoryTab';

export default function RiderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);

  const { rider, loading, error, refetch } = useRiderDetails(id);
  const { updateStatus, isUpdating } = useUpdateRiderStatus();

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white p-6 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !rider) {
    return (
      <div className="w-full min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{error || 'Rider Not Found'}</h2>
          <button onClick={() => navigate(routes.RIDER)} className="text-teal-600 hover:underline">
            Return to Riders List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white p-2 ">
      <button
        onClick={() => navigate(routes.RIDER)}
        className="flex items-center gap-2 text-[14px] font-medium text-[#4E616A] mb-6 w-fit transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-[24px] h-[24px] text-[#4E616A] font-medium" />
        Back
      </button>

      <div className="flex items-center gap-8  mb-8 mt-4 overflow-x-auto ">
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-3 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${activeTab === 'info' ? 'border-[#1DAFA1] text-[#1DAFA1]' : 'border-transparent text-[#4E616A]'}`}
        >
          Rider Details
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${activeTab === 'history' ? 'border-[#1DAFA1] text-[#1DAFA1]' : 'border-transparent text-[#4E616A]'}`}
        >
          Spent & Trip History
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-3 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${activeTab === 'timeline' ? 'border-[#1DAFA1] text-[#1DAFA1]' : 'border-transparent text-[#4E616A]'}`}
        >
          Activity Timeline
        </button>
      </div>

      <div
        className={`bg-white rounded-lg ${activeTab === 'info' ? 'border border-[#DFE6E5] p-4' : ''}`}
      >
        {activeTab === 'info' && <RiderInfoTab rider={rider} />}
        {activeTab === 'history' && <SpentTripHistoryTab rider={rider} />}
        {activeTab === 'timeline' && <ActivityTimelineTab />}
      </div>

      {activeTab === 'info' && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setIsSuspendModalOpen(true)}
            className={`flex items-center cursor-pointer gap-2 px-4 py-2.5 rounded-sm border border-[#DFE6E5] bg-white text-[14px] font-medium ${rider.status?.toLowerCase() === 'suspended' ? 'text-[#00A63E]' : 'text-[#FF0707]'
              }`}
          >
            {rider.status?.toLowerCase() === 'suspended' ? (
              <img
                src="/icons/driver/greenUser.svg"
                alt="reactivate"
                className="w-[20px] h-[20px]"
              />
            ) : (
              <img src="/icons/driver/redUser.svg" alt="suspend" className="w-[20px] h-[20px]" />
            )}
            {rider.status?.toLowerCase() === 'suspended' ? 'Reactivate Rider' : 'Suspend Rider'}
          </button>
        </div>
      )}

      <SuspendRiderModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        onConfirm={async (reason) => {
          if (!id) return;
          const newStatus = rider.status?.toLowerCase() === 'suspended' ? 'active' : 'suspended';
          try {
            const success = await updateStatus([id], newStatus, reason);
            if (success) {
              setIsSuspendModalOpen(false);
              refetch();
            }
          } catch (err) {
            console.error('Failed to update status:', err);
          }
        }}
        userType="rider"
        loading={isUpdating}
        mode={rider.status?.toLowerCase() === 'suspended' ? 'reactivate' : 'suspend'}
      />
    </div>
  );
}
