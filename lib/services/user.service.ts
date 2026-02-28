import bcrypt from "bcryptjs";
import {
    type CreateUserInput,
    type PublicUser,
    type UpdateUserInput,
    type User,
    UserStatus,
    createUser,
    deactivateUser,
    deleteUser,
    findAllUsers,
    findUserByEmailWithPassword,
    findUserById,
    updateUser,
} from "@/lib/models";

// ── Constants ─────────────────────────────────────────────────────────────────

const SALT_ROUNDS = 12;

// ── Errors ────────────────────────────────────────────────────────────────────

export class UserNotFoundError extends Error {
    constructor(id: number) {
        super(`User with id ${id} was not found.`);
        this.name = "UserNotFoundError";
    }
}

export class EmailAlreadyInUseError extends Error {
    constructor(email: string) {
        super(`The email "${email}" is already in use.`);
        this.name = "EmailAlreadyInUseError";
    }
}

export class InvalidCredentialsError extends Error {
    constructor() {
        super("Invalid email or password.");
        this.name = "InvalidCredentialsError";
    }
}

// ── Read ──────────────────────────────────────────────────────────────────────

/** Returns all users (password excluded) */
export async function getAllUsers(): Promise<PublicUser[]> {
    return findAllUsers();
}

/**
 * Returns a user by id (password excluded).
 * @throws {UserNotFoundError}
 */
export async function getUserById(id: number): Promise<PublicUser> {
    const user = await findUserById(id);
    if (!user) throw new UserNotFoundError(id);
    return user;
}

// ── Create ────────────────────────────────────────────────────────────────────

/**
 * Registers a new user.
 * - Validates the email is not already taken.
 * - Hashes the plain-text password before persisting.
 * @throws {EmailAlreadyInUseError}
 */
export async function registerUser(
    input: Omit<CreateUserInput, "password"> & { password: string }
): Promise<PublicUser> {
    const existing = await findUserByEmailWithPassword(input.email);
    if (existing) throw new EmailAlreadyInUseError(input.email);

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    return createUser({ ...input, password: hashedPassword });
}

// ── Update ────────────────────────────────────────────────────────────────────

/**
 * Updates a user's profile fields.
 * - If a new plain-text password is supplied it is hashed automatically.
 * @throws {UserNotFoundError}
 */
export async function editUser(
    id: number,
    input: UpdateUserInput & { password?: string }
): Promise<PublicUser> {
    await getUserById(id); // assert exists

    const data: UpdateUserInput = { ...input };

    if (input.password) {
        data.password = await bcrypt.hash(input.password, SALT_ROUNDS);
    }

    return updateUser(id, data);
}

// ── Auth ──────────────────────────────────────────────────────────────────────

/**
 * Validates credentials and returns the public user on success.
 * @throws {InvalidCredentialsError}
 */
export async function authenticateUser(
    email: string,
    plainPassword: string
): Promise<PublicUser> {
    const user: User | null = await findUserByEmailWithPassword(email);
    if (!user) throw new InvalidCredentialsError();

    const passwordMatch = await bcrypt.compare(plainPassword, user.password);
    if (!passwordMatch) throw new InvalidCredentialsError();

    if (user.status !== UserStatus.ACTIVE) throw new InvalidCredentialsError();

    // Return the public shape (no password)
    const { password: _pw, ...publicUser } = user;
    return publicUser;
}

// ── Delete / Deactivate ───────────────────────────────────────────────────────

/**
 * Sets the user status to INACTIVE (soft delete).
 * @throws {UserNotFoundError}
 */
export async function suspendUser(id: number): Promise<PublicUser> {
    await getUserById(id); // assert exists
    return deactivateUser(id);
}

/**
 * Permanently deletes a user from the database.
 * @throws {UserNotFoundError}
 */
export async function removeUser(id: number): Promise<void> {
    await getUserById(id); // assert exists
    return deleteUser(id);
}
