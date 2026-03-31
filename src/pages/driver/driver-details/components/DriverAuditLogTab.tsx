interface TimelineItem {
  id: number;
  title: string;
  description?: string;
  date: string;
  time: string;
  actor: 'System' | 'Driver';
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
    description: 'Driver started the trip after confirming passenger on-board',
    date: '20 Mar, 2026',
    time: '04:15 PM',
    actor: 'Driver',
  },
];

export default function DriverAuditLogTab() {
  return (
    <div className="p-0">
      <div className="border border-[#DFE6E5] rounded-lg p-6">
        <h3 className="text-[20px] font-semibold text-[#000000] mb-4">Activity Timeline</h3>

        <div className="flex flex-col border-t border-[#DFE6E5] mb-2 ">
          {timelineData.map((item, index) => {
            const isLast = index === timelineData.length - 1;
            const isSystem = item.actor === 'System';

            return (
              <div key={item.id} className="flex gap-3  mt-2">
                {/* Timeline Column */}
                <div className="flex flex-col items-center">
                  {/* Teal circle dot */}
                  <div className="w-[14px] h-[14px] rounded-full border-[2.5px] border-[#1DAFA1] bg-white shrink-0 z-10 mt-0.5" />
                  {/* Connecting line */}
                  {!isLast && <div className="w-px flex-1 bg-[#DFE6E5] my-1" />}
                </div>

                {/* Content */}
                <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-8'}`}>
                  <h4 className="text-[16px] font-semibold text-[#000000] mb-1 leading-tight">
                    {item.title}
                  </h4>

                  {item.description && (
                    <p className="text-[14px] font-medium text-[#4E616A] mb-3 max-w-[600px] leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Metadata Row: 📅 date • time • icon actor */}
                  <div className="flex items-center gap-2 text-[12px] font-medium text-[#4E616A]">
                    {/* Calendar icon + date */}
                    <img src="/icons/driver/dates.svg" alt="date" />
                    <span>{item.date}</span>

                    {/* Bullet separator */}
                    <div className="w-[4px] h-[4px] rounded-full bg-[#4E616A]" />

                    {/* Time */}
                    <span>{item.time}</span>

                    {/* Bullet separator */}
                    <div className="w-[4px] h-[4px] rounded-full bg-[#4E616A]" />

                    {/* Actor icon + label */}
                    {isSystem ? (
                      <img src="/icons/driver/system.svg" alt="system" />
                    ) : (
                      <img src="/icons/driver/user.svg" alt="person" />
                    )}
                    <span>{item.actor}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
