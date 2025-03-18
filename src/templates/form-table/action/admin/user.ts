"use server";

import { UserDetailsSchema } from "@/schema/user/user-details";
import * as z from "zod";
import { BASE_URL } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import {
  getAllUsersResponse,
  getAllUserRquestParams,
} from "@/types/user/users";

type ActionResponse = {
  success: boolean;
  data?: typeof UserDetailsSchema;
  error?: string;
};

export async function createUser(
  data: z.infer<typeof UserDetailsSchema>
): Promise<ActionResponse> {
  try {
    const validationResult = UserDetailsSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0].message,
      };
    }

    const response = await fetch(`${BASE_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    revalidatePath("/admin/users");

    if (!response.ok) {
      throw new Error(responseData.error || "Failed to create user");
    }

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user",
    };
  }
}

export async function deleteUser(id: string): Promise<ActionResponse> {
  try {
    const response = await fetch(`${BASE_URL}/user/${id}`, {
      method: "DELETE",
    });

    const responseData = await response.json();
    revalidatePath("/admin/users");

    if (!response.ok) {
      throw new Error(responseData.error || "Failed to delete user");
    }

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete user",
    };
  }
}

export async function updateUser(
  id: string,
  data: z.infer<typeof UserDetailsSchema>
): Promise<ActionResponse> {
  try {
    const validationResult = UserDetailsSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0].message,
      };
    }

    const response = await fetch(`${BASE_URL}/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        updatedAt: new Date().toISOString(),
      }),
    });

    const responseData = await response.json();
    revalidatePath("/admin/users");

    if (!response.ok) {
      throw new Error(responseData.error || "Failed to update user");
    }

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user",
    };
  }
}

export async function getUsers(
  params: getAllUserRquestParams
): Promise<getAllUsersResponse> {
  // Build URL with query parameters
  const url = new URL(`${BASE_URL}/user`);

  // Add required parameters
  url.searchParams.append("page", params.page.toString());
  url.searchParams.append("limit", params.limit.toString());

  // Add optional parameters only if they exist
  if (params.sort) url.searchParams.append("sort", params.sort);
  if (params.email) url.searchParams.append("email", params.email);

  // Handle array parameters
  if (params.role && params.role.length > 0) {
    params.role.forEach((role) => {
      url.searchParams.append("role", role);
    });
  }

  if (params.status && params.status.length > 0) {
    params.status.forEach((status) => {
      url.searchParams.append("status", status);
    });
  }

  // Add date range parameters if they exist
  if (params.startDate) url.searchParams.append("startDate", params.startDate);
  if (params.endDate) url.searchParams.append("endDate", params.endDate);

  const response = await fetch(url.toString());
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || "Failed to fetch users");
  }

  return responseData;
}
