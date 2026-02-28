-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "telefono" TEXT,
    "password" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpaceCraft" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "nationality" TEXT,
    "maxSpeed" DOUBLE PRECISION,
    "buildYear" INTEGER,
    "price" DOUBLE PRECISION,
    "inertialVelocity" DOUBLE PRECISION,
    "altitude" DOUBLE PRECISION,
    "apogee" DOUBLE PRECISION,
    "perigee" DOUBLE PRECISION,
    "inclination" DOUBLE PRECISION,
    "rangeToISS" DOUBLE PRECISION,
    "ppo2" DOUBLE PRECISION,
    "cabinTemp" DOUBLE PRECISION,
    "cabinPressure" DOUBLE PRECISION,
    "co2" DOUBLE PRECISION,
    "loopATemp" DOUBLE PRECISION,
    "loopBTemp" DOUBLE PRECISION,
    "netPwr1" DOUBLE PRECISION,
    "netPwr2" DOUBLE PRECISION,
    "manualRigsConnected" BOOLEAN NOT NULL DEFAULT false,
    "changelogConnected" BOOLEAN NOT NULL DEFAULT false,
    "airlockConnected" BOOLEAN NOT NULL DEFAULT false,
    "wingConnected" BOOLEAN NOT NULL DEFAULT false,
    "allSystemsCheck" BOOLEAN NOT NULL DEFAULT true,
    "rendezvousBurnSlow" BOOLEAN NOT NULL DEFAULT true,
    "prepareRendezvousBurn" BOOLEAN NOT NULL DEFAULT true,
    "thermalShieldApplied" BOOLEAN NOT NULL DEFAULT false,
    "burnGoNoGo" BOOLEAN NOT NULL DEFAULT true,
    "powerCompletion" BOOLEAN NOT NULL DEFAULT false,
    "stationDeckCheck" BOOLEAN NOT NULL DEFAULT true,
    "cabinMicsRecording" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SpaceCraft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
