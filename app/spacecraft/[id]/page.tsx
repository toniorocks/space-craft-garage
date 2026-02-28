import Link from "next/link";
import { notFound } from "next/navigation";
import { getSpaceCraftById } from "@/lib/services/spacecraft.service";
import type { SpaceCraft } from "@/lib/models";

// ── Page ──────────────────────────────────────────────────────────────────────

interface Props {
    params: Promise<{ id: string }>;
}

export default async function SpaceCraftDetailPage({ params }: Props) {
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
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
            {/* ── Top bar ─────────────────────────────────────────────────────────── */}
            <nav className="sticky top-0 z-10 flex items-center gap-3 px-6 py-4 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                    ← Garage
                </Link>
                <span className="text-zinc-700">/</span>
                <span className="text-sm text-zinc-300 truncate">{craft.name}</span>

                <div className="ml-auto">
                    <StatusPill ok={craft.allSystemsCheck} />
                </div>
            </nav>

            {/* ── Hero ────────────────────────────────────────────────────────────── */}
            <section className="relative">
                {craft.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={craft.imageUrl}
                        alt={craft.name}
                        className="w-full h-72 sm:h-96 object-cover"
                    />
                ) : (
                    <div className="w-full h-72 sm:h-96 bg-zinc-900 flex items-center justify-center text-8xl">
                        🛸
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight drop-shadow-lg">
                        {craft.name}
                    </h1>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {craft.nationality && (
                            <Pill>{craft.nationality}</Pill>
                        )}
                        {craft.buildYear && (
                            <Pill>🗓 {craft.buildYear}</Pill>
                        )}
                        {craft.price && (
                            <Pill>💰 ${craft.price.toLocaleString()}</Pill>
                        )}
                        {craft.maxSpeed && (
                            <Pill>⚡ {craft.maxSpeed.toLocaleString()} km/h</Pill>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Dashboard grid ──────────────────────────────────────────────────── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">

                {/* Orbital Telemetry */}
                <Card title="🛰 Telemetría Orbital" cols={1}>
                    <MetricRow label="Velocidad Inercial" value={craft.inertialVelocity} unit="km/s" />
                    <MetricRow label="Altitud" value={craft.altitude} unit="km" />
                    <MetricRow label="Apogeo" value={craft.apogee} unit="km" />
                    <MetricRow label="Perigeo" value={craft.perigee} unit="km" />
                    <MetricRow label="Inclinación" value={craft.inclination} unit="°" />
                    <MetricRow label="Dist. a ISS" value={craft.rangeToISS} unit="km" />
                </Card>

                {/* Life Support */}
                <Card title="💨 Soporte de Vida" cols={1}>
                    <MetricRow label="PPO₂" value={craft.ppo2} unit="kPa" />
                    <MetricRow label="Temp. Cabina" value={craft.cabinTemp} unit="°C" />
                    <MetricRow label="Presión Cabina" value={craft.cabinPressure} unit="kPa" />
                    <MetricRow label="CO₂" value={craft.co2} unit="mmHg" />
                </Card>

                {/* Thermal & Power */}
                <Card title="🌡 Térmica y Energía" cols={1}>
                    <MetricRow label="Loop A Temp." value={craft.loopATemp} unit="°C" />
                    <MetricRow label="Loop B Temp." value={craft.loopBTemp} unit="°C" />
                    <MetricRow label="Potencia Net 1" value={craft.netPwr1} unit="W" />
                    <MetricRow label="Potencia Net 2" value={craft.netPwr2} unit="W" />
                </Card>

                {/* Connections */}
                <Card title="🔌 Conexiones" cols={1}>
                    <ConnectionRow label="Rigs manuales" connected={craft.manualRigsConnected} />
                    <ConnectionRow label="Changelog" connected={craft.changelogConnected} />
                    <ConnectionRow label="Airlock" connected={craft.airlockConnected} />
                    <ConnectionRow label="Wing" connected={craft.wingConnected} />
                </Card>

                {/* System Checks */}
                <Card title="✅ Verificaciones de Sistema" cols={1}>
                    <ConnectionRow label="Todos los sistemas OK" connected={craft.allSystemsCheck} />
                    <ConnectionRow label="Preparar quema de rend." connected={craft.prepareRendezvousBurn} />
                    <ConnectionRow label="Quema de rend. (lenta)" connected={craft.rendezvousBurnSlow} />
                    <ConnectionRow label="Escudo térmico aplicado" connected={craft.thermalShieldApplied} />
                    <ConnectionRow label="Quema Go/No-Go" connected={craft.burnGoNoGo} />
                    <ConnectionRow label="Energía completada" connected={craft.powerCompletion} />
                    <ConnectionRow label="Deck de estación OK" connected={craft.stationDeckCheck} />
                </Card>

                {/* Misc */}
                <Card title="🎙 Misceláneos" cols={1}>
                    <ConnectionRow label="Micrófonos grabando" connected={craft.cabinMicsRecording} />
                    <MetricItem label="ID de nave" value={String(craft.id)} />
                    <MetricItem label="Registrada" value={craft.createdAt.toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })} />
                    <MetricItem label="Actualizada" value={craft.updatedAt.toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })} />
                </Card>
            </div>
        </div>
    );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

/** Glassmorphism-style dashboard card */
function Card({
    title,
    children,
    cols = 1,
}: {
    title: string;
    children: React.ReactNode;
    cols?: 1 | 2;
}) {
    return (
        <div
            className={`rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col gap-1 ${cols === 2 ? "md:col-span-2" : ""
                }`}
        >
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                {title}
            </h2>
            {children}
        </div>
    );
}

/** Single metric row: label + numeric value + unit */
function MetricRow({
    label,
    value,
    unit,
}: {
    label: string;
    value: number | null;
    unit: string;
}) {
    return (
        <div className="flex items-baseline justify-between py-1 border-b border-zinc-800 last:border-0">
            <span className="text-sm text-zinc-400">{label}</span>
            {value !== null ? (
                <span className="font-mono text-sm text-zinc-100">
                    {value.toLocaleString("es-MX")}{" "}
                    <span className="text-zinc-500 text-xs">{unit}</span>
                </span>
            ) : (
                <span className="text-zinc-700 text-xs">—</span>
            )}
        </div>
    );
}

/** Generic text metric item */
function MetricItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-baseline justify-between py-1 border-b border-zinc-800 last:border-0">
            <span className="text-sm text-zinc-400">{label}</span>
            <span className="text-sm text-zinc-200">{value}</span>
        </div>
    );
}

/** Boolean connection indicator */
function ConnectionRow({
    label,
    connected,
}: {
    label: string;
    connected: boolean;
}) {
    return (
        <div className="flex items-center justify-between py-1 border-b border-zinc-800 last:border-0">
            <span className="text-sm text-zinc-400">{label}</span>
            <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${connected
                        ? "bg-emerald-900/60 text-emerald-300"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
            >
                {connected ? "● ON" : "○ OFF"}
            </span>
        </div>
    );
}

/** Top-bar status badge */
function StatusPill({ ok }: { ok: boolean }) {
    return (
        <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${ok
                    ? "bg-emerald-900/60 text-emerald-300 border border-emerald-700"
                    : "bg-red-900/60 text-red-300 border border-red-700"
                }`}
        >
            {ok ? "✓ Sistemas OK" : "⚠ Revisar sistemas"}
        </span>
    );
}

/** Small info pill used in the hero */
function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span className="text-xs bg-zinc-900/80 border border-zinc-700 text-zinc-200 rounded-full px-3 py-1 backdrop-blur">
            {children}
        </span>
    );
}
