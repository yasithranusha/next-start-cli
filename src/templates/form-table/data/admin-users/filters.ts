import { UserStatus, UserRoles } from "@/enum/user";

export const filters = [
  {
    title: "Role",
    filterKey: "role",
    options: Object.values(UserRoles).map((role: string) => ({
      label: role,
      value: role,
    })),
  },
  {
    title: "User Status",
    filterKey: "status",
    options: Object.values(UserStatus).map((status: string) => ({
      label: status,
      value: status,
    })),
  },
];
