export interface Activity {
  id: string;
  entityType: 'rider' | 'driver';
  entityId: string;
  action: string;
  description: string;
  actor: 'system' | 'rider' | 'driver' | 'operator';
  actorName: string;
  actorId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityResponse {
  success: boolean;
  message: string;
  data: {
    results: Activity[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}
