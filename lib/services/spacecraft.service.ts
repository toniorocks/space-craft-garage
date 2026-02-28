import {
    type CreateSpaceCraftInput,
    type SpaceCraft,
    type UpdateSpaceCraftInput,
    createSpaceCraft,
    deleteSpaceCraft,
    findAllSpaceCrafts,
    findSpaceCraftById,
    findSpaceCraftsByName,
    updateSpaceCraft,
} from "@/lib/models";

// ── Errors ────────────────────────────────────────────────────────────────────

export class SpaceCraftNotFoundError extends Error {
    constructor(id: number) {
        super(`SpaceCraft with id ${id} was not found.`);
        this.name = "SpaceCraftNotFoundError";
    }
}

export class SpaceCraftNameRequiredError extends Error {
    constructor() {
        super("SpaceCraft name is required and cannot be empty.");
        this.name = "SpaceCraftNameRequiredError";
    }
}

// ── Read ──────────────────────────────────────────────────────────────────────

/** Returns all spacecraft, newest first */
export async function getAllSpaceCrafts(): Promise<SpaceCraft[]> {
    return findAllSpaceCrafts();
}

/**
 * Returns a single spacecraft by id.
 * @throws {SpaceCraftNotFoundError}
 */
export async function getSpaceCraftById(id: number): Promise<SpaceCraft> {
    const craft = await findSpaceCraftById(id);
    if (!craft) throw new SpaceCraftNotFoundError(id);
    return craft;
}

/**
 * Searches spacecraft by name (case-insensitive partial match).
 * Returns an empty array when no results are found.
 */
export async function searchSpaceCraftsByName(
    name: string
): Promise<SpaceCraft[]> {
    const trimmed = name.trim();
    if (!trimmed) return findAllSpaceCrafts();
    return findSpaceCraftsByName(trimmed);
}

// ── Create ────────────────────────────────────────────────────────────────────

/**
 * Registers a new spacecraft.
 * @throws {SpaceCraftNameRequiredError}
 */
export async function addSpaceCraft(
    input: CreateSpaceCraftInput
): Promise<SpaceCraft> {
    if (!input.name?.trim()) throw new SpaceCraftNameRequiredError();
    return createSpaceCraft({ ...input, name: input.name.trim() });
}

// ── Update ────────────────────────────────────────────────────────────────────

/**
 * Updates an existing spacecraft.
 * - Validates the record exists before updating.
 * - Trims the name if provided.
 * @throws {SpaceCraftNotFoundError}
 * @throws {SpaceCraftNameRequiredError}
 */
export async function editSpaceCraft(
    id: number,
    input: UpdateSpaceCraftInput
): Promise<SpaceCraft> {
    await getSpaceCraftById(id); // assert exists

    if (input.name !== undefined) {
        if (!input.name.trim()) throw new SpaceCraftNameRequiredError();
        input = { ...input, name: input.name.trim() };
    }

    return updateSpaceCraft(id, input);
}

/**
 * Updates live telemetry fields only (partial update optimised for
 * high-frequency sensor data ingestion).
 * @throws {SpaceCraftNotFoundError}
 */
export async function updateTelemetry(
    id: number,
    telemetry: Pick<
        UpdateSpaceCraftInput,
        | "inertialVelocity"
        | "altitude"
        | "apogee"
        | "perigee"
        | "inclination"
        | "rangeToISS"
        | "ppo2"
        | "cabinTemp"
        | "cabinPressure"
        | "co2"
        | "loopATemp"
        | "loopBTemp"
        | "netPwr1"
        | "netPwr2"
    >
): Promise<SpaceCraft> {
    await getSpaceCraftById(id); // assert exists
    return updateSpaceCraft(id, telemetry);
}

// ── Delete ────────────────────────────────────────────────────────────────────

/**
 * Permanently removes a spacecraft from the database.
 * @throws {SpaceCraftNotFoundError}
 */
export async function removeSpaceCraft(id: number): Promise<void> {
    await getSpaceCraftById(id); // assert exists
    return deleteSpaceCraft(id);
}
