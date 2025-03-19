/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserRoles, UserStatus } from "@/enum/user";

export interface BaseItem {
  _id?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface User extends BaseItem {
  email: string;
  password: string;
  name: string;
  role: UserRoles;
  dob?: Date;
  status?: UserStatus;
  profileImage?: string;
}

export interface Post extends BaseItem {
  title: string;
  content: string;
  userId: string;
  author: string;
}

export type Item = User | Post;

export interface Item {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NeDBOperators {
  $exists?: boolean;
  $ne?: any;
  $regex?: RegExp;
  $set?: any;
}

export type NeDBValue<T> = T | { [K in keyof NeDBOperators]?: any };

export type NeDBQuery<T> = {
  [P in keyof T]?: NeDBValue<T[P]>;
};