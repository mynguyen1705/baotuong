export type MemorySlotId = number;

export interface MemoryItem {
  id: MemorySlotId;
  row?: number;
  photoUrl: string;
  caption?: string;
  date?: string;
  tag?: string;
  isCenterpiece?: boolean;
}

export interface MemoryStationData {
  title: string;
  subtitle: string;
  quote: string;
  authorNote?: string;
  lastUpdated?: string;
  memories: MemoryItem[];
}

export interface UpdateMemoryPayload {
  photoUrl: string;
  caption?: string;
  date?: string;
  tag?: string;
}

export interface UpdateStationMetaPayload {
  title?: string;
  subtitle?: string;
  quote?: string;
  authorNote?: string;
}

export interface MemoriesApiResponse {
  success: boolean;
  data: MemoryStationData;
  isOwner: boolean;
  error?: string;
}

