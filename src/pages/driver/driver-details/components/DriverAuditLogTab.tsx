import { Clock, User, Settings } from 'lucide-react';

interface TimelineItem {
  id: number;
  title: string;
  description?: string;
  date: string;
  time: string;
  actor: 'System' | 'Driver';
  isLast?: boolean;
}

const timelineData: TimelineItem[] = [
  {
    id: 1,
    title: 'Driver Profile Completed',
    description:
      'The driver filled out their profile, including vehicle details and license information.',
    date: '15 Mar, 2026',
    time: '09:00 AM',
    actor: 'System',
  },
  {
    id: 2,
    title: 'Document Verification',
    description:
      'All submitted documents were verified for authenticity and compliance with safety standards.',
    date: '16 Mar, 2026',
    time: '11:30 AM',
    actor: 'System',
  },
  {
    id: 3,
    title: 'Availability Set to Online',
    description: 'Driver marked themselves available to receive ride requests',
    date: '17 Mar, 2026',
    time: '02:45 PM',
    actor: 'Driver',
  },
  {
    id: 4,
    title: 'Ride Request Received',
    description: 'New ride request pushed to driver dashboard',
    date: '18 Mar, 2026',
    time: '01:00 PM',
    actor: 'System',
  },
  {
    id: 5,
    title: 'Ride Accepted',
    description: 'Driver accepted incoming ride request within response window',
    date: '19 Mar, 2026',
    time: '10:00 AM',
    actor: 'Driver',
  },
  {
    id: 6,
    title: 'Arrived at Pickup Location',
    description: 'Driver marked arrival at pickup point',
    date: '20 Mar, 2026',
    time: '04:00 PM',
    actor: 'Driver',
  },
  {
    id: 7,
    title: 'Trip Started',
    date: '20 Mar, 2026',
    time: '04:15 PM',
    actor: 'Driver',
    isLast: true,
  },
];

export default function DriverAuditLogTab() {
  return (
    <div className="p-6">
      <h3 className="text-[18px] font-bold text-[#101828] mb-8">Activity Timeline</h3>

      <div className="flex flex-col">
        {timelineData.map((item) => (
          <div key={item.id} className="flex gap-6 group">
            {/* Timeline Graphic */}
            <div className="flex flex-col items-center">
              <div className="w-[18px] h-[18px] rounded-full border-[3px] border-[#1DAFA1] bg-white  shrink-0 z-10" />
              {!item.isLast && (
                <div className="w-px flex-1 bg-[#DFE6E5] my-2 group-hover:bg-[#1DAFA1]/30 transition-colors" />
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 ${item.isLast ? '' : 'pb-10'}`}>
              <h4 className="text-[15px] font-bold text-[#101828] mb-1.5">{item.title}</h4>
              {item.description && (
                <p className="text-[13px] font-medium text-[#4E616A] mb-3 max-w-[600px] leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* Metadata Row */}
              <div className="flex items-center gap-4 text-[12px] font-semibold text-[#4E616A]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-[14px] h-[14px] opacity-70" />
                  <span>{item.date}</span>
                  <div className="w-[4px] h-[4px] rounded-full bg-gray-300 mx-0.5" />
                  <span>{item.time}</span>
                </div>
                <div className="w-px h-[10px] bg-gray-300" />
                <div className="flex items-center gap-1.5">
                  {item.actor === 'Driver' ? (
                    <User className="w-[14px] h-[14px] opacity-70" />
                  ) : (
                    <Settings className="w-[14px] h-[14px] opacity-70" />
                  )}
                  <span>{item.actor}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
