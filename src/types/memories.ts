export type MemorySlotId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface MemoryItem {
  id: MemorySlotId;
  row: 1 | 2 | 3 | 4 | 5;
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
