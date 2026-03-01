export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getAllSpaceCrafts, searchSpaceCraftsByName } from "@/lib/services/spacecraft.service";
import { verifySession } from "@/lib/session";
import { AuthGate } from "./components/auth/AuthGate";
import { LogoutButton } from "./components/auth/LogoutButton";
import { AddSpacecraftButton } from "./components/spacecraft/AddSpacecraftButton";
import { SearchInput } from "./components/spacecraft/SearchInput";

interface PageProps {
  searchParams: Promise<{ query?: string }>;
}

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  const session = await verifySession();

  if (!session?.isAuth) {
    return (
      <div className="min-h-screen bg-[#060813] text-zinc-100 p-8 font-sans relative overflow-hidden flex flex-col items-center">
        {/* Background radiant glow */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#1A265A]/40 rounded-full blur-[140px] pointer-events-none" />

        <header className="mb-10 text-center mt-20 relative z-10">
          <h1 className="text-[14px] font-medium tracking-[0.25em] text-white/90 mb-2">
            🚀 SPACECRAFT GARAGE
          </h1>
          <p className="text-[#A1A7CD] text-[13px]">Panel de Control de Naves Espaciales.</p>
        </header>
        <div className="relative z-10 w-full">
          <AuthGate />
        </div>
      </div>
    );
  }

  const spacecrafts = query ? await searchSpaceCraftsByName(query) : await getAllSpaceCrafts();

  return (
    <div className="min-h-screen bg-[#060813] text-zinc-100 p-8 font-sans relative overflow-hidden">
      {/* Background radiant glow */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#1A265A]/40 rounded-full blur-[140px] pointer-events-none" />

      <header className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-[14px] font-medium tracking-[0.25em] text-white/90">
            🚀 SPACECRAFT GARAGE
          </h1>
          <p className="mt-2 text-[#4DEEEA] text-xl font-bold">
            {spacecrafts.length} nave{spacecrafts.length !== 1 ? "s" : ""} registrada{spacecrafts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <AddSpacecraftButton />
          <LogoutButton />
        </div>
      </header>

      <div className="flex justify-between items-center relative z-10 w-full">
        <SearchInput />
      </div>

      {spacecrafts.length === 0 ? (
        <p className="text-[#A1A7CD] text-center mt-20 relative z-10">
          {query ? `No se encontraron naves que coincidan con "${query}".` : "No hay naves registradas aún."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {spacecrafts.map((craft) => (
            <Link
              key={craft.id}
              href={`/spacecraft/${craft.id}`}
              className="block rounded-2xl bg-[#1B2142]/80 border border-[#2D3560] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:bg-[#252B52] hover:border-[#4DEEEA]/50 transition-all cursor-pointer backdrop-blur-sm"
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
                <div className="w-full h-48 bg-[#1A265A]/20 flex items-center justify-center text-5xl opacity-50">
                  🛸
                </div>
              )}

              {/* Body */}
              <div className="p-5">
                <h2 className="text-[14px] font-medium tracking-[0.1em] text-[#4DEEEA] truncate uppercase">{craft.name}</h2>

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
                <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-medium">
                  <TelemetryItem label="Altitud" value={craft.altitude} unit="km" />
                  <TelemetryItem label="Apogeo" value={craft.apogee} unit="km" />
                  <TelemetryItem label="Perigeo" value={craft.perigee} unit="km" />
                  <TelemetryItem label="Dist. ISS" value={craft.rangeToISS} unit="km" />
                </div>

                {/* Status */}
                <div className="mt-4 flex items-center justify-between">
                  {craft.allSystemsCheck ? (
                    <div className="flex items-center gap-2">
                      <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center border-[1.5px] border-[#2DF152] bg-[#2DF152] text-[#051608]">
                        <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="19 6 9 16 4.5 11.5"></polyline>
                        </svg>
                      </div>
                      <span className="text-[#E2E6F8] text-[11px] font-semibold tracking-widest">SISTEMAS OK</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center border-[1.5px] border-[#FF2A2A] bg-[#FF2A2A] text-white">
                        <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      </div>
                      <span className="text-[#FF2A2A] text-[11px] font-semibold tracking-widest">REVISAR</span>
                    </div>
                  )}
                  {craft.price && (
                    <span className="text-[#4DEEEA] font-medium text-sm">
                      ${craft.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>

  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-[10px] uppercase font-bold tracking-widest bg-[#2D3560]/50 border border-[#5A6399]/40 text-[#A1A7CD] rounded-full px-3 py-1">
      <span className="text-[#5A6399]">{label}:</span> <span className="text-white">{value}</span>
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
    <div className="flex justify-between items-end border-b border-[#2A3158]/50 pb-1 mr-2">
      <span className="text-[#A1A7CD] text-[10px] tracking-widest uppercase">{label}</span>
      <p className="text-white font-mono text-[11px]">
        {value.toLocaleString()} <span className="text-[#5A6399]">{unit}</span>
      </p>
    </div>
  );
}
