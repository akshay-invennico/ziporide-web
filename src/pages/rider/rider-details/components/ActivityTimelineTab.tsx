import { useEffect, useRef, useCallback } from 'react';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useActivities } from '@/hooks/useActivities';

import { formatActivityDate, formatActivityTime, getActorIcon } from './activityUtils';

interface Props {
  riderId: string;
}

export default function ActivityTimelineTab({ riderId }: Props) {
  const { activities, loading, hasMore, fetchActivities, loadMore } = useActivities(
    'rider',
    riderId,
  );
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchActivities(1);
  }, [fetchActivities]);

  // Infinite scroll observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, loadMore],
  );

  if (loading && activities.length === 0) {
    return (
      <div className="flex flex-col w-full fade-in pb-4">
        <h3 className="text-[20px] font-semibold text-[#000000] mb-8 border-b border-[#DFE6E5] pb-5">
          Activity Timeline
        </h3>
        <div className="space-y-8 pl-[5px]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-8 animate-pulse">
              <div className="w-[16px] h-[16px] rounded-full bg-gray-200 shrink-0 mt-[2px]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-48" />
                <div className="h-3 bg-gray-100 rounded w-80" />
                <div className="h-3 bg-gray-100 rounded w-56" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!loading && activities.length === 0) {
    return (
      <div className="flex flex-col w-full fade-in pb-4">
        <h3 className="text-[20px] font-semibold text-[#000000] mb-8 border-b border-[#DFE6E5] pb-5">
          Activity Timeline
        </h3>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <img
            src="/icons/rider/dateIcon.svg"
            alt="no activity"
            className="w-10 h-10 opacity-40 mb-3"
          />
          <p className="text-[16px] font-medium text-[#4E616A]">No activity found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full fade-in pb-4">
      <h3 className="text-[20px] font-semibold text-[#000000] mb-8 border-b border-[#DFE6E5] pb-5">
        Activity Timeline
      </h3>

      <div className="relative pl-[5px]">
        {/* Continuous vertical line */}
        <div className="absolute top-[10px] bottom-[10px] left-[12px] w-[2px] bg-[#E2E8F0]"></div>

        <div className="flex flex-col gap-10">
          {activities.map((activity, index) => {
            const isLast = index === activities.length - 1;
            return (
              <div
                key={activity.id}
                ref={isLast ? lastItemRef : undefined}
                className="relative flex items-start gap-8"
              >
                {/* Timeline dot */}
                <div className="relative z-10 w-[16px] h-[16px] rounded-full border-2 border-[#1DAFA1] bg-white mt-[2px] shrink-0 ring-4 ring-white"></div>

                {/* Content */}
                <div className="flex flex-col pb-0">
                  <h4 className="text-[16px] font-semibold text-[#000000] mb-1">
                    {activity.action}
                  </h4>
                  {activity.description && (
                    <p className="text-[14px] text-[#4E616A] mb-2.5 leading-relaxed font-medium">
                      {activity.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2.5 text-[12px] font-medium text-[#4E616A]">
                    <div className="flex items-center gap-1.5">
                      <img
                        src="/icons/rider/dateIcon.svg"
                        alt="calendar"
                        className="w-[15px] h-[15px]"
                      />
                      <span>{formatActivityDate(activity.createdAt)}</span>
                    </div>
                    <span className="w-[5px] h-[5px] rounded-full bg-[#4E616A]"></span>
                    <span>{formatActivityTime(activity.createdAt)}</span>
                    <span className="w-[5px] h-[5px] rounded-full bg-[#4E616A]"></span>
                    <div className="flex items-center gap-1.5 text-[#4E616A]">
                      <img
                        src={getActorIcon(activity.actor, 'rider')}
                        alt={activity.actor}
                        className="w-[15px] h-[15px]"
                      />
                      <span>{activity.actorName}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {loading && activities.length > 0 && (
        <div className="flex justify-center py-4">
          <LoadingSpinner size={20} />
        </div>
      )}

      <div ref={sentinelRef} />
    </div>
  );
}
