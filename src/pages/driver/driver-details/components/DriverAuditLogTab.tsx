import { useEffect, useRef, useCallback } from 'react';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useActivities } from '@/hooks/useActivities';

import { formatActivityDate, formatActivityTime, getActorIcon } from './activityUtils';

interface Props {
  driverId: string;
}

export default function DriverAuditLogTab({ driverId }: Props) {
  const { activities, loading, hasMore, fetchActivities, loadMore } = useActivities(
    'driver',
    driverId,
  );

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
      <div className="p-0">
        <div className="border border-[#DFE6E5] rounded-lg p-6">
          <h3 className="text-[20px] font-semibold text-[#000000] mb-4">Activity Timeline</h3>
          <div className="border-t border-[#DFE6E5] pt-4 space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-[14px] h-[14px] rounded-full bg-gray-200 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-48" />
                  <div className="h-3 bg-gray-100 rounded w-80" />
                  <div className="h-3 bg-gray-100 rounded w-56" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!loading && activities.length === 0) {
    return (
      <div className="p-0">
        <div className="border border-[#DFE6E5] rounded-lg p-6">
          <h3 className="text-[20px] font-semibold text-[#000000] mb-4">Activity Timeline</h3>
          <div className="flex flex-col items-center justify-center py-16 text-center border-t border-[#DFE6E5]">
            <img
              src="/icons/driver/dates.svg"
              alt="no activity"
              className="w-10 h-10 opacity-40 mb-3"
            />
            <p className="text-[16px] font-medium text-[#4E616A]">No activity found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0">
      <div className="border border-[#DFE6E5] rounded-lg p-6">
        <h3 className="text-[20px] font-semibold text-[#000000] mb-4">Activity Timeline</h3>

        <div className="flex flex-col border-t border-[#DFE6E5] mb-2">
          {activities.map((activity, index) => {
            const isLast = index === activities.length - 1 && !hasMore;

            return (
              <div
                key={activity.id}
                ref={isLast ? undefined : index === activities.length - 1 ? lastItemRef : undefined}
                className="flex gap-3 mt-2"
              >
                {/* Timeline Column */}
                <div className="flex flex-col items-center">
                  <div className="w-[14px] h-[14px] rounded-full border-[2.5px] border-[#1DAFA1] bg-white shrink-0 z-10 mt-0.5" />
                  {!(isLast && !loading) && <div className="w-px flex-1 bg-[#DFE6E5] my-1" />}
                </div>

                {/* Content */}
                <div className={`flex-1 ${isLast && !loading ? 'pb-0' : 'pb-8'}`}>
                  <h4 className="text-[16px] font-semibold text-[#000000] mb-1 leading-tight">
                    {activity.action}
                  </h4>

                  {activity.description && (
                    <p className="text-[14px] font-medium text-[#4E616A] mb-3 max-w-[600px] leading-relaxed">
                      {activity.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-[12px] font-medium text-[#4E616A]">
                    <img src="/icons/driver/dates.svg" alt="date" />
                    <span>{formatActivityDate(activity.createdAt)}</span>
                    <div className="w-[4px] h-[4px] rounded-full bg-[#4E616A]" />
                    <span>{formatActivityTime(activity.createdAt)}</span>
                    <div className="w-[4px] h-[4px] rounded-full bg-[#4E616A]" />
                    <img src={getActorIcon(activity.actor, 'driver')} alt={activity.actor} />
                    <span>{activity.actorName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {loading && activities.length > 0 && (
          <div className="flex justify-center py-4">
            <LoadingSpinner size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
