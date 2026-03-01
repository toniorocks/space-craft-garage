import { prisma } from "@/lib/prisma";
import { UserStatus } from "@prisma/client";

// ── Types ─────────────────────────────────────────────────────────────────────

export { UserStatus };

/** Full User record returned from the database */
export type User = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    nombreCompleto: string;
    telefono: string | null;
    password: string;
    status: UserStatus;
};

/** Fields exposed publicly (password excluded) */
export type PublicUser = Omit<User, "password">;

/** Payload required to create a new User */
export type CreateUserInput = {
    email: string;
    nombreCompleto: string;
    telefono?: string;
    /** Must be a bcrypt/argon2 hash — never plain text */
    password: string;
    status?: UserStatus;
};

/** Allowed fields when updating a User */
export type UpdateUserInput = Partial<Omit<CreateUserInput, "email">>;

// ── Queries ───────────────────────────────────────────────────────────────────

/** Returns all users without the password field */
export async function findAllUsers(): Promise<PublicUser[]> {
    return prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        omit: { password: true },
    });
}

/** Returns a single user by id, or null if not found */
export async function findUserById(id: number): Promise<PublicUser | null> {
    return prisma.user.findUnique({
        where: { id },
        omit: { password: true },
    });
}

/** Returns a single user by email (includes password — use only for auth) */
export async function findUserByEmailWithPassword(
    email: string
): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

/** Creates and returns a new user (password must already be hashed) */
export async function createUser(data: CreateUserInput): Promise<PublicUser> {
    return prisma.user.create({
        data,
        omit: { password: true },
    });
}

/** Updates a user by id and returns the updated record */
export async function updateUser(
    id: number,
    data: UpdateUserInput
): Promise<PublicUser> {
    return prisma.user.update({
        where: { id },
        data,
        omit: { password: true },
    });
}

/** Soft-deletes a user by setting status to INACTIVE */
export async function deactivateUser(id: number): Promise<PublicUser> {
    return prisma.user.update({
        where: { id },
        data: { status: UserStatus.INACTIVE },
        omit: { password: true },
    });
}

/** Hard-deletes a user by id */
export async function deleteUser(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
}
