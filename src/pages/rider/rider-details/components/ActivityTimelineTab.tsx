import { activityTimelineData } from '../../../../data/RiderTripsData';

export default function ActivityTimelineTab() {
  return (
    <div className="flex flex-col w-full fade-in pb-4">
      <h3 className="text-[20px] font-semibold text-[#000000] mb-8 border-b border-[#DFE6E5] pb-5">
        Activity Timeline
      </h3>

      <div className="relative pl-[5px]">
        {/* Continuous vertical line - starting from first element slightly below top to last element slightly above bottom */}
        <div className="absolute top-[10px] bottom-[10px] left-[12px] w-[2px] bg-[#E2E8F0]"></div>

        <div className="flex flex-col gap-10">
          {activityTimelineData.map((activity) => (
            <div key={activity.id} className="relative flex items-start gap-8">
              {/* Timeline dot */}
              <div className="relative z-10 w-[16px] h-[16px] rounded-full border-2 border-[#1DAFA1] bg-white mt-[2px] shrink-0 ring-4 ring-white"></div>

              {/* Content */}
              <div className="flex flex-col pb-0">
                <h4 className="text-[16px] font-semibold text-[#000000] mb-1">{activity.title}</h4>
                {activity.description && (
                  <p className="text-[14px] text-[#4E616A] mb-2.5 leading-relaxed font-medium">
                    {activity.description}
                  </p>
                )}
                {activity.date && (
                  <div className="flex items-center gap-2.5 text-[12px] font-medium text-[#4E616A]">
                    <div className="flex items-center gap-1.5">
                      <img
                        src="/icons/rider/dateIcon.svg"
                        alt="calender"
                        className="w-[15px] h-[15px]"
                      />
                      <span>{activity.date}</span>
                    </div>
                    <span className="w-[5px] h-[5px] rounded-full bg-[#4E616A]"></span>
                    <span>{activity.time}</span>
                    <span className="w-[5px] h-[5px] rounded-full bg-[#4E616A]"></span>
                    <div className="flex items-center gap-1.5 text-[#4E616A]">
                      {activity.user.toLowerCase() === 'system' ? (
                        <img
                          src="/icons/rider/system.svg"
                          alt="system"
                          className="w-[15px] h-[15px]"
                        />
                      ) : (
                        <img src="/icons/rider/user.svg" alt="user" className="w-[15px] h-[15px]" />
                      )}
                      <span>{activity.user}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
