import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSpaceCraftById } from "@/lib/services/spacecraft.service";
import type { SpaceCraft } from "@/lib/models";
import { verifySession } from "@/lib/session";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function SpaceCraftDetailPage({ params }: Props) {
    const session = await verifySession();

    if (!session?.isAuth) {
        redirect("/");
    }

    const { id } = await params;
    const numericId = Number(id);

    if (isNaN(numericId)) notFound();

    let craft: SpaceCraft;
    try {
        craft = await getSpaceCraftById(numericId);
    } catch {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#060813] text-zinc-100 font-sans overflow-hidden flex flex-col relative">
            {/* Background radiant glow */}
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#1A265A]/40 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 py-8 flex-1 flex flex-col items-center">

                {/* Header */}
                <header className="text-center mb-10 w-full">
                    <h1 className="text-[14px] font-medium tracking-[0.25em] text-white/90">VEHICLE OVERVIEW</h1>
                    <h2 className="text-xl font-bold text-[#4DEEEA] mt-2">{craft.name}</h2>
                </header>

                {/* Main Content Grid */}
                <div className="w-full flex justify-between gap-10">

                    {/* Left Column - System Checks */}
                    <div className="flex flex-col gap-8 pt-4 w-[280px]">
                        <SystemCheck label="ALL SYSTEMS CHECK" status={craft.allSystemsCheck ? "Normal" : "Warning"} color="#8B92CC" />
                        <SystemCheck label="RENDEZVOUS BURN SLOW" status={craft.rendezvousBurnSlow ? "Normal" : "Warning"} color="#8B92CC" />
                        <SystemCheck label="PREPARE RENDEZVOUS BURN" status={craft.prepareRendezvousBurn ? "Normal" : "Warning"} color="#8B92CC" />
                        <SystemCheck label="THERMAL SHIELD" status={craft.thermalShieldApplied ? "Applied" : "Not Applied"} color="#2DF152" />
                        <SystemCheck label="BURN GO/NO-GO" status={craft.burnGoNoGo ? "Normal" : "Warning"} color="#8B92CC" />
                        <SystemCheck label="POWER COMPLETION" status={craft.powerCompletion ? "Completed" : "Awaiting"} color="#FF8811" isOrange />
                        <SystemCheck label="STATION DECK CHECK" status={craft.stationDeckCheck ? "Normal" : "Warning"} color="#8B92CC" />
                    </div>

                    {/* Center Column - Gauges & Spaceship */}
                    <div className="flex-1 flex flex-col relative items-center min-w-[600px]">

                        {/* Top Gauges */}
                        <div className="flex justify-center gap-10 w-full mb-10">
                            <CircularGauge label="PPO2" value={craft.ppo2 ?? 0} unit="psia" max={5} color="#FFCF54" />
                            <CircularGauge label="CABIN TEMP" value={craft.cabinTemp ?? 0} unit="°C" max={30} color="#FF2A2A" />
                            <CircularGauge label="CABIN PRESSURE" value={craft.cabinPressure ?? 0} unit="psia" max={20} color="#FFCF54" />
                            <CircularGauge label="CO2" value={craft.co2 ?? 0} unit="mmHg" max={1} color="#00A3FF" />
                        </div>

                        {/* Middle Gauges */}
                        <div className="w-full flex justify-between px-10 z-20 mb-8 mt-2">
                            <div className="flex gap-8">
                                <CircularGauge label="LOOP A" value={craft.loopATemp ?? 0} unit="°C" max={50} color="#00A3FF" />
                                <CircularGauge label="LOOP B" value={craft.loopBTemp ?? 0} unit="°C" max={50} color="#00A3FF" />
                            </div>
                            <div className="flex gap-8">
                                <DottedGauge label="NET PWR 1" value={craft.netPwr1 ?? 0} unit="W" />
                                <DottedGauge label="NET PWR 2" value={craft.netPwr2 ?? 0} unit="W" />
                            </div>
                        </div>

                        {/* Spaceship Image */}
                        <div className="absolute top-[160px] left-1/2 -translate-x-1/2 w-[550px] h-[650px] pointer-events-none z-10 flex items-center justify-center">
                            {craft.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={craft.imageUrl} alt={craft.name} className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
                            ) : (
                                <div className="text-9xl opacity-50">🛸</div>
                            )}
                        </div>

                        {/* Connections & Info */}
                        <div className="w-full mt-[390px] z-20 grid grid-cols-2 gap-[200px] px-8">
                            <div className="flex flex-col">
                                <h3 className="text-[10px] tracking-[0.2em] text-[#A1A7CD] font-semibold mb-5 border-b border-[#2A3158]/50 pb-3">CONNECTIONS</h3>
                                <div className="flex flex-col gap-3">
                                    <ConnectionRow label="Manual Rigs" connected={craft.manualRigsConnected} />
                                    <ConnectionRow label="Changelog" connected={craft.changelogConnected} />
                                    <ConnectionRow label="Airlock" connected={craft.airlockConnected} />
                                    <ConnectionRow label="Wing" connected={craft.wingConnected} />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-[10px] tracking-[0.2em] text-[#A1A7CD] font-semibold mb-5 border-b border-[#2A3158]/50 pb-3">INFO</h3>
                                <div className="flex flex-col gap-3">
                                    <InfoRow label="Nationality" value={craft.nationality || "🇺🇸"} />
                                    <InfoRow label="Max speed" value={craft.maxSpeed ? `${craft.maxSpeed.toLocaleString()} km/h` : "N/A"} />
                                    <InfoRow label="Build year" value={craft.buildYear?.toString() || "N/A"} />
                                    <InfoRow label="Price (in MXN)" value={craft.price ? `$${craft.price.toLocaleString()}` : "N/A"} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 text-[10px] font-bold tracking-[0.2em] text-[#A1A7CD] z-20">
                            CABIN MICS: <span className={craft.cabinMicsRecording ? "text-[#FF2A2A]" : "text-[#A1A7CD]"}>{craft.cabinMicsRecording ? "RECORDING" : "OFF"}</span>
                        </div>
                    </div>

                    {/* Right Column - Status Bars */}
                    <div className="flex flex-col gap-8 pt-4 w-[280px] z-20 items-end">
                        <LinearProgress label="Inertial Velocity" value={craft.inertialVelocity ?? 0} max={15} unit="km/s" />
                        <LinearProgress label="Altitude" value={craft.altitude ?? 0} max={600} unit="km" />
                        <LinearProgress label="Apogee" value={craft.apogee ?? 0} max={600} unit="km" />
                        <LinearProgress label="Perigee" value={craft.perigee ?? 0} max={600} unit="km" />
                        <LinearProgress label="Inclination" value={craft.inclination ?? 0} max={90} unit="°" />
                        <LinearProgress label="Range to ISS" value={craft.rangeToISS ?? 0} max={10} unit="km" />
                    </div>
                </div>

                {/* Bottom Buttons */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-4 w-[500px]">
                    <Link
                        href="/"
                        className="flex-1 py-3 bg-[#1B2142]/80 hover:bg-[#252B52] border border-[#2D3560] text-center rounded text-[13px] font-medium text-white transition-colors backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                    >
                        Mostrar todas las naves
                    </Link>

                </div>
            </div>
        </div>
    );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function SystemCheck({ label, status, color, isOrange }: { label: string, status: string, color: string, isOrange?: boolean, active?: boolean }) {
    const isGreen = color === "#2DF152";
    let borderClass = "";
    if (isGreen) {
        borderClass = "border-[#2DF152] bg-[#2DF152] text-[#051608]";
    } else if (isOrange) {
        borderClass = "border-[#FF8811] bg-[#FF8811] text-white";
    } else {
        borderClass = "border-[#8B92CC]/50 bg-[#8B92CC]/20 text-[#8B92CC]";
    }

    return (
        <div className="flex items-center gap-4">
            <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center border-[1.5px] ${borderClass} shrink-0`}>
                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="19 6 9 16 4.5 11.5"></polyline>
                </svg>
            </div>
            <div>
                <div className="text-[11px] font-semibold tracking-widest text-[#E2E6F8]">{label}</div>
                <div className="text-[11px] font-medium text-[#7C83AA] mt-0.5">{status}</div>
            </div>
        </div>
    );
}

function CircularGauge({ label, value, unit, color, max }: { label: string, value: number, unit: string, color: string, max: number }) {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const sweep = 0.75;
    const dashLength = circumference * sweep;
    const gapLength = circumference * (1 - sweep);

    const pct = Math.min((value || 0) / max, 1);
    const fillLength = dashLength * pct;

    return (
        <div className="flex flex-col items-center">
            <div className="text-[9px] text-[#A1A7CD] font-bold tracking-widest mb-3 uppercase">{label}</div>
            <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                        cx="50" cy="50" r={radius}
                        fill="none"
                        stroke="#1C2341"
                        strokeWidth="4"
                        strokeDasharray={`${dashLength} ${gapLength}`}
                        strokeLinecap="round"
                        transform="rotate(135 50 50)"
                    />
                    <circle
                        cx="50" cy="50" r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="4"
                        strokeDasharray={`${fillLength} ${circumference}`}
                        strokeLinecap="round"
                        transform="rotate(135 50 50)"
                        className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_currentColor]"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                    <div className="text-xl font-medium text-white mb-0">{Number(value).toFixed(2)}</div>
                    <div className="text-[10px] text-[#A1A7CD] font-medium">{unit}</div>
                </div>
            </div>
        </div >
    );
}

function DottedGauge({ label, value, unit }: { label: string, value: number, unit: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="text-[9px] text-[#A1A7CD] font-bold tracking-widest mb-3 uppercase">{label}</div>
            <div className="relative w-[84px] h-[84px] rounded-full border border-dashed border-[#5A6399]/40 flex flex-col items-center justify-center">
                <div className="text-xl font-medium text-white">{Number(value).toFixed(2)}</div>
                <div className="text-[10px] text-[#A1A7CD] font-medium mt-0.5">{unit}</div>
            </div>
        </div>
    );
}

function ConnectionRow({ label, connected }: { label: string, connected: boolean }) {
    return (
        <div className="flex justify-between items-center text-[11px] font-medium">
            <span className="text-[#A1A7CD]">{label}</span>
            <span className={connected ? "text-white" : "text-zinc-500"}>{connected ? "Connected" : "Disconnected"}</span>
        </div>
    );
}

function InfoRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center text-[11px] font-medium">
            <span className="text-[#A1A7CD]">{label}</span>
            <span className="text-white">{value}</span>
        </div>
    );
}

function LinearProgress({ label, value, max, unit }: { label: string, value: number, max: number, unit: string }) {
    const pct = Math.min((value / max) * 100, 100);
    const hasSpace = unit !== '°';
    return (
        <div className="w-[260px]">
            <div className="flex justify-between items-end text-[11px] font-medium mb-3 pr-[4px]">
                <span className="text-[#E2E6F8]">{label}</span>
                <span className="text-white text-[15px] leading-none flex items-baseline gap-1">
                    {Number(value).toFixed(2)}
                    <span className="text-[#A1A7CD] text-[11px]">{hasSpace ? ' ' : ''}{unit}</span>
                </span>
            </div>
            <div className="h-[4px] bg-[#1C2341] rounded-full w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-[#00A3FF] rounded-full shadow-[0_0_10px_rgba(0,163,255,1)]" style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}
