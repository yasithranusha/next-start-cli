/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/(server)/_config/lib/db";
import { User } from "@/app/(server)/_config/types/db";
import { hash } from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, dob, role } = body;

    // Validation
    if (!email || !name || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.findOneAsync({ email } as Partial<User>);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    //todo: generate a random password and save, then send a email to user to set a new password
    const password = "Abcd@1234";

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const user: User = {
      name,
      email,
      password: hashedPassword,
      profileImage: `https://avatar.iran.liara.run/username?username=[${name}]`,
      role,
      status: "Active",
      ...(dob && { dob }),
      createdAt: new Date(),
    };

    const newUser = await db.insertAsync(user);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "-createdAt"; // default sort by newest
    const email = searchParams.get("email");
    const name = searchParams.get("name");

    // Get all values for parameters that can have multiple values
    const roles = searchParams.getAll("role");
    const statuses = searchParams.getAll("status");

    // Date range parameters
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build query conditions for NeDB
    const query: any = { email: { $exists: true } };
    if (email) query.email = { $regex: new RegExp(email, "i") };
    if (name) query.name = { $regex: new RegExp(name, "i") };

    if (roles.length > 0) {
      query.role = { $regex: new RegExp(roles.join("|"), "i") };
    }

    // Handle multiple statuses (if provided)
    if (statuses.length > 0) {
      query.status = { $regex: new RegExp(statuses.join("|"), "i") };
    }

    // Handle date range for createdAt
    if (startDate || endDate) {
      query.createdAt = {};

      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        // Adding a day to include the entire end date
        const endDateTime = new Date(endDate);
        endDateTime.setDate(endDateTime.getDate() + 1);
        query.createdAt.$lt = endDateTime;
      }
    }

    // Convert sort parameter to NeDB format
    const sortField = sort.startsWith("-") ? sort.substring(1) : sort;
    const sortDirection = sort.startsWith("-") ? -1 : 1;

    // Get total count of users
    const totalUsers = (await db.findAsync(query)) as User[];

    // Get paginated and sorted users with proper date comparison
    const users = ((await db.findAsync(query)) as User[])
      .sort((a: any, b: any) => {
        const aValue =
          sortField === "createdAt"
            ? new Date(a[sortField]).getTime()
            : a[sortField];
        const bValue =
          sortField === "createdAt"
            ? new Date(b[sortField]).getTime()
            : b[sortField];
        return sortDirection * (aValue > bValue ? 1 : aValue < bValue ? -1 : 0);
      })
      .slice(skip, skip + limit);

    // Remove passwords from results
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const usersWithoutPassword = users.map(({ password, ...rest }) => rest);

    return NextResponse.json({
      users: usersWithoutPassword,
      pagination: {
        total: totalUsers.length,
        page,
        limit,
        totalPages: Math.ceil(totalUsers.length / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
