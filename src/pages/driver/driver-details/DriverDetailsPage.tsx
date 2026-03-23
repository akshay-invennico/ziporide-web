import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { driversData } from '../../../data/DriverData';
import DriverInfoTab from './components/DriverInfoTab';
import DriverSubscriptionTab from './components/DriverSubscriptionTab';
import DriverEarningTab from './components/DriverEarningTab';
import DriverTripHistoryTab from './components/DriverTripHistoryTab';
import DriverAuditLogTab from './components/DriverAuditLogTab';
import SuspendRiderModal from '../../../components/ui/SuspendRiderModal';

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

    const driver = driversData.find(d => d.id === id);

    if (!driver) {
        return (
            <div className="w-full min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Driver Not Found</h2>
                    <button onClick={() => navigate('/driver')} className="text-teal-600 hover:underline">
                        Return to Drivers List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-white p-2">

            {/* Back Button */}
            <button
                onClick={() => navigate('/driver')}
                className="flex items-center gap-2 text-[14px] font-medium text-[#4E616A] mb-6 w-fit transition-colors cursor-pointer"
            >
                <ArrowLeft className="w-[24px] h-[24px] text-[#4E616A] font-medium" />
                Back
            </button>

            {/* Tab Navigation */}
            <div className="flex items-center gap-8 mb-4 overflow-x-auto border-b border-[#DFE6E5]">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`pb-3 text-[14px] font-medium whitespace-nowrap border-b-2 -mb-px transition-colors cursor-pointer ${activeTab === tab.key
                            ? 'border-[#1DAFA1] text-[#1DAFA1]'
                            : 'border-transparent text-[#4E616A] hover:text-[#1DAFA1]'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className={`bg-white rounded-lg ${activeTab === 'info' ? 'border border-t-0 border-[#DFE6E5]' : ''}`}>
                {activeTab === 'info' && <DriverInfoTab driver={driver} />}
                {activeTab === 'subscription' && <DriverSubscriptionTab />}
                {activeTab === 'earning' && <DriverEarningTab />}
                {activeTab === 'trip-history' && <DriverTripHistoryTab />}
                {activeTab === 'audit-log' && <DriverAuditLogTab />}
            </div>

            {/* Suspend Driver Button */}
            {activeTab === 'info' && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => setIsSuspendModalOpen(true)}
                        className="flex items-center cursor-pointer gap-2 px-4 py-2.5 rounded-sm border border-[#DFE6E5] bg-white text-[14px] font-medium text-[#FF0707]"
                    >
                        <img src="/icons/rider/person.svg" alt="suspend" className="w-[20px] h-[20px]" />
                        Suspend Driver
                    </button>
                </div>
            )}

            <SuspendRiderModal
                isOpen={isSuspendModalOpen}
                onClose={() => setIsSuspendModalOpen(false)}
                onConfirm={() => setIsSuspendModalOpen(false)}
            />
        </div>
    );
}
