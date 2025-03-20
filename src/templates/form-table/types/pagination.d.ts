export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  startDate?: string;
  endDate?: string;
}

interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse {
  pagination: PaginationResponse;
}