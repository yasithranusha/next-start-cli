import { UserRoles, UserStatus } from "@/enum/user";
import { PaginationParams, PaginatedResponse } from "@/types/pagination";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRoles;
  dob?: Date;
  profileImage?: string;
  status?: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface getAllUsersResponse extends PaginatedResponse {
  users: IUser[];
}

export interface getAllUserRquestParams extends PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  email?: string;
  role?: string[];
  status?: string[];
  startDate?: string;
  endDate?: string;
}
