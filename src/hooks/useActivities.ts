import { useState, useCallback } from 'react';

import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type { Activity, ActivityResponse } from '@/types/activity.types';

export const useActivities = (entityType: 'rider' | 'driver', entityId: string | undefined) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchActivities = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      if (!entityId) return;
      setLoading(true);
      try {
        const url =
          entityType === 'rider' ? API.RIDER_ACTIVITIES(entityId) : API.DRIVER_ACTIVITIES(entityId);

        const response = await apiClient.get<ActivityResponse>(url, {
          params: { page: pageNum, limit: 10, sortBy: 'createdAt:desc' },
        });

        if (response.data?.success) {
          const { results, totalPages: tp } = response.data.data;
          setActivities((prev) => (append ? [...prev, ...results] : results));
          setTotalPages(tp);
          setPage(pageNum);
          setHasMore(pageNum < tp);
        }
      } catch (err) {
        console.error('Failed to fetch activities:', err);
      } finally {
        setLoading(false);
      }
    },
    [entityId, entityType],
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchActivities(page + 1, true);
    }
  }, [loading, hasMore, page, fetchActivities]);

  return { activities, loading, hasMore, totalPages, fetchActivities, loadMore };
};
