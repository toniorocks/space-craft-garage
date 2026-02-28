import { prisma } from "@/lib/prisma";

// ── Types ─────────────────────────────────────────────────────────────────────

/** Full SpaceCraft record as stored in the database */
export type SpaceCraft = {
    id: number;
    createdAt: Date;
    updatedAt: Date;

    // General info
    name: string;
    nationality: string | null;
    maxSpeed: number | null;
    buildYear: number | null;
    price: number | null;
    imageUrl: string | null;

    // Orbital telemetry
    inertialVelocity: number | null;
    altitude: number | null;
    apogee: number | null;
    perigee: number | null;
    inclination: number | null;
    rangeToISS: number | null;

    // Life-support sensors
    ppo2: number | null;
    cabinTemp: number | null;
    cabinPressure: number | null;
    co2: number | null;

    // Thermal control loops
    loopATemp: number | null;
    loopBTemp: number | null;

    // Electrical power
    netPwr1: number | null;
    netPwr2: number | null;

    // Connection statuses
    manualRigsConnected: boolean;
    changelogConnected: boolean;
    airlockConnected: boolean;
    wingConnected: boolean;

    // System checks
    allSystemsCheck: boolean;
    rendezvousBurnSlow: boolean;
    prepareRendezvousBurn: boolean;
    thermalShieldApplied: boolean;
    burnGoNoGo: boolean;
    powerCompletion: boolean;
    stationDeckCheck: boolean;

    // Misc
    cabinMicsRecording: boolean;
};

/** Fields required when registering a new spacecraft */
export type CreateSpaceCraftInput = Pick<SpaceCraft, "name"> &
    Partial<
        Omit<SpaceCraft, "id" | "createdAt" | "updatedAt" | "name">
    >;

/** Any field can be updated after creation */
export type UpdateSpaceCraftInput = Partial<CreateSpaceCraftInput>;

// ── Queries ───────────────────────────────────────────────────────────────────

/** Returns all spacecraft ordered by creation date (newest first) */
export async function findAllSpaceCrafts(): Promise<SpaceCraft[]> {
    return prisma.spaceCraft.findMany({ orderBy: { createdAt: "desc" } });
}

/** Returns a single spacecraft by id, or null if not found */
export async function findSpaceCraftById(
    id: number
): Promise<SpaceCraft | null> {
    return prisma.spaceCraft.findUnique({ where: { id } });
}

/** Full-text search by spacecraft name (case-insensitive) */
export async function findSpaceCraftsByName(
    name: string
): Promise<SpaceCraft[]> {
    return prisma.spaceCraft.findMany({
        where: { name: { contains: name, mode: "insensitive" } },
        orderBy: { name: "asc" },
    });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

/** Creates and returns a new spacecraft */
export async function createSpaceCraft(
    data: CreateSpaceCraftInput
): Promise<SpaceCraft> {
    return prisma.spaceCraft.create({ data });
}

/** Updates a spacecraft by id and returns the updated record */
export async function updateSpaceCraft(
    id: number,
    data: UpdateSpaceCraftInput
): Promise<SpaceCraft> {
    return prisma.spaceCraft.update({ where: { id }, data });
}

/** Deletes a spacecraft by id */
export async function deleteSpaceCraft(id: number): Promise<void> {
    await prisma.spaceCraft.delete({ where: { id } });
}
