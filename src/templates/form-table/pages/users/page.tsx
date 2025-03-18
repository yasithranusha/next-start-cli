import { getUsers } from "@/action/admin/user";
import { UserDialog } from "@/components/dialog/user/user-dialog";
import { Metadata } from "next";
import {
  IUser,
  getAllUsersResponse,
  getAllUserRquestParams,
} from "@/types/user/users";
import { AdminColumns } from "@/components/admin/users/user-table/admin-columns";
import { DataTable } from "@/components/data-table/datatable";
import { filters } from "@/data/admin-users/filters";

export const metadata: Metadata = {
  title: "Admin | View Admins",
};

export default async function UsersPage(props: {
  searchParams?: Promise<{
    page?: string | undefined;
    size?: string | undefined;
    query?: string | undefined;
    sort?: string | undefined;
    order?: string | undefined;
    role?: string | string[] | undefined;
    status?: string | string[] | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
  }>;
}) {
  const SearchParams = await props.searchParams;
  const query = SearchParams?.query || "";
  const page = SearchParams?.page || "1";
  const size = SearchParams?.size || "10";
  const sort = SearchParams?.sort || "";
  const order = SearchParams?.order || "";
  const role = SearchParams?.role || "";
  const status = SearchParams?.status || "";
  const startDate = SearchParams?.startDate;
  const endDate = SearchParams?.endDate;

  let userData: IUser[] = [];
  let tableMessage = "Loading...";
  let pages = 1;

  const payload: getAllUserRquestParams = {
    page: Number(page),
    limit: Number(size),
    sort: order === "desc" ? `-${sort}` : sort,
    email: query,
    role: Array.isArray(role) ? role : role ? [role] : undefined,
    status: Array.isArray(status) ? status : status ? [status] : undefined,
    startDate: startDate,
    endDate: endDate,
  };

  let response: getAllUsersResponse = {
    users: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },
  };

  try {
    response = await getUsers(payload);
    userData = response.users;
    tableMessage = "No users found.";
    pages = response.pagination.totalPages;
  } catch (error) {
    if (error instanceof Error) {
      tableMessage = "Failed to fetch users";
    }
  }

  return (
    <div>
      <div className="w-full flex justify-end">
        <UserDialog />
      </div>
      <DataTable
        filters={filters}
        dateRangeFilter={true}
        dateRangeFilterText={"Filter by Registration Date"}
        tableMessage={tableMessage}
        searchBy="email"
        columns={AdminColumns}
        data={userData}
        pageCount={Number(pages)}
        pageIndex={Number(response.pagination.page)}
        pageSize={Number(response.pagination.limit)}
      />
    </div>
  );
}
