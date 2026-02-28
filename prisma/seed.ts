import { config } from "dotenv";
import { resolve } from "path";

// Load .env from the project root (needed when running outside Next.js)
config({ path: resolve(process.cwd(), ".env") });

import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();


async function main() {
    console.log("🚀 Seeding spacecraft data...");

    await prisma.spaceCraft.deleteMany(); // clean slate before seeding

    const spacecrafts = await prisma.spaceCraft.createMany({
        data: [
            {
                // 🇲🇽 México
                name: "Quetzalcóatl I",
                nationality: "México",
                maxSpeed: 28_000,
                buildYear: 2022,
                price: 980_000_000,
                imageUrl: null,
                inertialVelocity: 7.8,
                altitude: 408,
                apogee: 420,
                perigee: 398,
                inclination: 51.6,
                rangeToISS: 12,
                ppo2: 3.0,
                cabinTemp: 22.5,
                cabinPressure: 14.7,
                co2: 3.8,
                loopATemp: 18.2,
                loopBTemp: 17.9,
                netPwr1: 12_500,
                netPwr2: 11_800,
                manualRigsConnected: true,
                changelogConnected: true,
                airlockConnected: true,
                wingConnected: true,
                allSystemsCheck: true,
                rendezvousBurnSlow: true,
                prepareRendezvousBurn: true,
                thermalShieldApplied: true,
                burnGoNoGo: true,
                powerCompletion: true,
                stationDeckCheck: true,
                cabinMicsRecording: false,
            },
            {
                // 🇺🇸 USA
                name: "Liberty Voyager",
                nationality: "United States",
                maxSpeed: 40_320,
                buildYear: 2021,
                price: 2_100_000_000,
                imageUrl: null,
                inertialVelocity: 11.2,
                altitude: 550,
                apogee: 560,
                perigee: 540,
                inclination: 28.5,
                rangeToISS: 150,
                ppo2: 3.1,
                cabinTemp: 21.0,
                cabinPressure: 14.5,
                co2: 2.9,
                loopATemp: 20.1,
                loopBTemp: 19.7,
                netPwr1: 15_200,
                netPwr2: 14_900,
                manualRigsConnected: true,
                changelogConnected: true,
                airlockConnected: false,
                wingConnected: true,
                allSystemsCheck: true,
                rendezvousBurnSlow: false,
                prepareRendezvousBurn: false,
                thermalShieldApplied: true,
                burnGoNoGo: false,
                powerCompletion: true,
                stationDeckCheck: true,
                cabinMicsRecording: true,
            },
            {
                // 🇷🇺 Russia
                name: "Soyuz-MX 9",
                nationality: "Russia",
                maxSpeed: 27_500,
                buildYear: 2019,
                price: 1_450_000_000,
                imageUrl: null,
                inertialVelocity: 7.66,
                altitude: 401,
                apogee: 415,
                perigee: 387,
                inclination: 51.6,
                rangeToISS: 5,
                ppo2: 2.97,
                cabinTemp: 20.3,
                cabinPressure: 14.9,
                co2: 4.1,
                loopATemp: 17.5,
                loopBTemp: 18.0,
                netPwr1: 10_800,
                netPwr2: 10_500,
                manualRigsConnected: true,
                changelogConnected: false,
                airlockConnected: true,
                wingConnected: false,
                allSystemsCheck: false,
                rendezvousBurnSlow: true,
                prepareRendezvousBurn: true,
                thermalShieldApplied: false,
                burnGoNoGo: true,
                powerCompletion: false,
                stationDeckCheck: false,
                cabinMicsRecording: false,
            },
            {
                // 🇯🇵 Japan
                name: "Hayabusa-X Aurora",
                nationality: "Japan",
                maxSpeed: 33_700,
                buildYear: 2023,
                price: 1_750_000_000,
                imageUrl: null,
                inertialVelocity: 9.35,
                altitude: 480,
                apogee: 490,
                perigee: 470,
                inclination: 30.0,
                rangeToISS: 72,
                ppo2: 3.05,
                cabinTemp: 22.0,
                cabinPressure: 14.8,
                co2: 3.2,
                loopATemp: 19.5,
                loopBTemp: 19.1,
                netPwr1: 13_600,
                netPwr2: 13_200,
                manualRigsConnected: true,
                changelogConnected: true,
                airlockConnected: true,
                wingConnected: true,
                allSystemsCheck: true,
                rendezvousBurnSlow: true,
                prepareRendezvousBurn: false,
                thermalShieldApplied: true,
                burnGoNoGo: true,
                powerCompletion: true,
                stationDeckCheck: true,
                cabinMicsRecording: true,
            },
            {
                // 🇫🇷 France / ESA
                name: "Ariane Celeste",
                nationality: "France",
                maxSpeed: 35_100,
                buildYear: 2020,
                price: 1_980_000_000,
                imageUrl: null,
                inertialVelocity: 9.75,
                altitude: 500,
                apogee: 512,
                perigee: 488,
                inclination: 45.0,
                rangeToISS: 95,
                ppo2: 2.95,
                cabinTemp: 21.8,
                cabinPressure: 14.6,
                co2: 3.5,
                loopATemp: 18.8,
                loopBTemp: 18.5,
                netPwr1: 14_000,
                netPwr2: 13_700,
                manualRigsConnected: true,
                changelogConnected: true,
                airlockConnected: true,
                wingConnected: false,
                allSystemsCheck: true,
                rendezvousBurnSlow: false,
                prepareRendezvousBurn: true,
                thermalShieldApplied: true,
                burnGoNoGo: true,
                powerCompletion: false,
                stationDeckCheck: true,
                cabinMicsRecording: false,
            },
        ],
    });

    console.log(`✅ Seeded ${spacecrafts.count} spacecraft records.`);
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
