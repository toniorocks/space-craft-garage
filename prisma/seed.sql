-- Spacecraft seed data
-- Run: psql "postgresql://marco@localhost:5432/space_craft_garage" -f prisma/seed.sql

DELETE FROM "SpaceCraft";

INSERT INTO "SpaceCraft" (
    "name", "nationality", "maxSpeed", "buildYear", "price", "imageUrl",
    "inertialVelocity", "altitude", "apogee", "perigee", "inclination", "rangeToISS",
    "ppo2", "cabinTemp", "cabinPressure", "co2",
    "loopATemp", "loopBTemp",
    "netPwr1", "netPwr2",
    "manualRigsConnected", "changelogConnected", "airlockConnected", "wingConnected",
    "allSystemsCheck", "rendezvousBurnSlow", "prepareRendezvousBurn",
    "thermalShieldApplied", "burnGoNoGo", "powerCompletion", "stationDeckCheck",
    "cabinMicsRecording",
    "createdAt", "updatedAt"
) VALUES
-- 🇲🇽 México
(
    'Quetzalcóatl I', 'México', 28000, 2022, 980000000, NULL,
    7.8, 408, 420, 398, 51.6, 12,
    3.0, 22.5, 14.7, 3.8,
    18.2, 17.9,
    12500, 11800,
    true, true, true, true,
    true, true, true, true, true, true, true,
    false,
    NOW(), NOW()
),
-- 🇺🇸 United States
(
    'Liberty Voyager', 'United States', 40320, 2021, 2100000000, NULL,
    11.2, 550, 560, 540, 28.5, 150,
    3.1, 21.0, 14.5, 2.9,
    20.1, 19.7,
    15200, 14900,
    true, true, false, true,
    true, false, false, true, false, true, true,
    true,
    NOW(), NOW()
),
-- 🇷🇺 Russia
(
    'Soyuz-MX 9', 'Russia', 27500, 2019, 1450000000, NULL,
    7.66, 401, 415, 387, 51.6, 5,
    2.97, 20.3, 14.9, 4.1,
    17.5, 18.0,
    10800, 10500,
    true, false, true, false,
    false, true, true, false, true, false, false,
    false,
    NOW(), NOW()
),
-- 🇯🇵 Japan
(
    'Hayabusa-X Aurora', 'Japan', 33700, 2023, 1750000000, NULL,
    9.35, 480, 490, 470, 30.0, 72,
    3.05, 22.0, 14.8, 3.2,
    19.5, 19.1,
    13600, 13200,
    true, true, true, true,
    true, true, false, true, true, true, true,
    true,
    NOW(), NOW()
),
-- 🇫🇷 France / ESA
(
    'Ariane Celeste', 'France', 35100, 2020, 1980000000, NULL,
    9.75, 500, 512, 488, 45.0, 95,
    2.95, 21.8, 14.6, 3.5,
    18.8, 18.5,
    14000, 13700,
    true, true, true, false,
    true, false, true, true, true, false, true,
    false,
    NOW(), NOW()
);

SELECT id, name, nationality FROM "SpaceCraft" ORDER BY id;
