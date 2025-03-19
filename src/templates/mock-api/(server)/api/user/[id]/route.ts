import { NextRequest, NextResponse } from "next/server";
import db from "@/app/(server)/_config/lib/db";
import { User, Item } from "@/app/(server)/_config/types/db";

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const userId = (await params).id;
    // Check if user exists
    const user = (await db.findOneAsync({ _id: userId })) as User;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete user
    const numRemoved = await db.removeAsync({ _id: userId }, {});

    if (numRemoved === 0) {
      return NextResponse.json(
        { error: "Failed to delete user" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const userId = (await params).id;
    const body = await req.json();
    const { email, name, role, dob, status } = body;

    // Check if user exists
    const existingUser = (await db.findOneAsync({
      _id: userId,
    } as Partial<Item>)) as User;

    // Check for duplicate email
    if (email && email !== existingUser.email) {
      const emailQuery = {
        email,
        _id: { $ne: userId },
      } as unknown as Partial<Item>;

      const emailExists = await db.findOneAsync(emailQuery);
      if (emailExists) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        );
      }
    }

    // Update operation
    const updates: Partial<User> = {
      ...(email && { email }),
      ...(name && { name }),
      ...(role && { role }),
      ...(dob && { dob: new Date(dob) }),
      ...(status && { status }),
      ...(name && {
        profileImage: `https://avatar.iran.liara.run/username?username=[${name}]`,
      }),
      updatedAt: new Date(),
    };

    const updateQuery = { _id: userId } as Partial<Item>;
    const updateOperation = { $set: updates } as unknown as Partial<Item>;

    const numUpdated = await db.updateAsync(updateQuery, updateOperation, {});

    if (numUpdated === 0) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "User updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
