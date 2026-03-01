import Link from "next/link";
import { getAllSpaceCrafts } from "@/lib/services/spacecraft.service";
import { OpenModalTestButton } from "./components/modal/OpenModalTestButton";

export default async function Home() {
  const spacecrafts = await getAllSpaceCrafts();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 font-sans">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          🚀 SpaceCraft Garage
        </h1>
        <p className="mt-2 text-zinc-400">
          {spacecrafts.length} nave{spacecrafts.length !== 1 ? "s" : ""} registrada{spacecrafts.length !== 1 ? "s" : ""}
        </p>
      </header>

      {spacecrafts.length === 0 ? (
        <p className="text-zinc-500 text-center mt-20">No hay naves registradas aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spacecrafts.map((craft) => (
            <Link
              key={craft.id}
              href={`/spacecraft/${craft.id}`}
              className="block rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-lg hover:border-zinc-600 hover:shadow-zinc-700/20 transition-all cursor-pointer"
            >
              {/* Image */}
              {craft.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={craft.imageUrl}
                  alt={craft.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-zinc-800 flex items-center justify-center text-5xl">
                  🛸
                </div>
              )}

              {/* Body */}
              <div className="p-5">
                <h2 className="text-xl font-semibold text-white truncate">{craft.name}</h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {craft.nationality && (
                    <Badge label="Nación" value={craft.nationality} />
                  )}
                  {craft.buildYear && (
                    <Badge label="Año" value={String(craft.buildYear)} />
                  )}
                  {craft.maxSpeed && (
                    <Badge label="Vel. máx." value={`${craft.maxSpeed.toLocaleString()} km/h`} />
                  )}
                </div>

                {/* Telemetry row */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-zinc-400">
                  <TelemetryItem label="Altitud" value={craft.altitude} unit="km" />
                  <TelemetryItem label="Apogeo" value={craft.apogee} unit="km" />
                  <TelemetryItem label="Perigeo" value={craft.perigee} unit="km" />
                  <TelemetryItem label="Dist. ISS" value={craft.rangeToISS} unit="km" />
                </div>

                {/* Status */}
                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${craft.allSystemsCheck
                      ? "bg-emerald-900 text-emerald-300"
                      : "bg-red-900 text-red-300"
                      }`}
                  >
                    {craft.allSystemsCheck ? "✓ Sistemas OK" : "⚠ Revisar sistemas"}
                  </span>
                  {craft.price && (
                    <span className="text-zinc-300 font-medium">
                      ${craft.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="flex justify-center mt-10">
        <OpenModalTestButton />
      </div>
    </div>

  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-xs bg-zinc-800 text-zinc-300 rounded-full px-3 py-1">
      <span className="text-zinc-500">{label}:</span> {value}
    </span>
  );
}

function TelemetryItem({
  label,
  value,
  unit,
}: {
  label: string;
  value: number | null;
  unit: string;
}) {
  if (value === null) return null;
  return (
    <div>
      <span className="text-zinc-600 text-xs">{label}</span>
      <p className="text-zinc-300 font-mono text-xs">
        {value.toLocaleString()} {unit}
      </p>
    </div>
  );
}
