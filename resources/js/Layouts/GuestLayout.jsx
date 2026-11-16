import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, maxWidth = 'sm:max-w-md', showBackground = true }) {
    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center py-10 px-4 sm:px-6 font-sans overflow-hidden">
            {/* Background Hall Image with Darkened Scrim Overlay */}
            {showBackground ? (
                <>
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 filter blur-[1px] transition-transform duration-1000"
                        style={{ backgroundImage: `url('/images/tibao-hall.jpg')` }}
                    />
                    {/* Deep gradient overlay to ensure perfect contrast and readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950/90 backdrop-blur-[2px]" />

                    {/* Ambient Glow Orbs */}
                    <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
                    <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
                </>
            ) : (
                <div className="absolute inset-0 bg-slate-950" />
            )}

            {/* Top Brand Header */}
            <div className="relative z-10 flex flex-col items-center mb-5 animate-fadeIn">
                <Link
                    href="/"
                    className="group flex flex-col items-center gap-2 transition transform hover:scale-105 duration-200"
                >
                    <img
                        src="/images/skyims-logo.jpg"
                        alt="SKYIMS Logo"
                        className="w-16 h-16 rounded-full object-contain bg-white p-1 border-2 border-indigo-400/80 shadow-2xl shadow-indigo-600/40 group-hover:border-indigo-300 transition duration-300"
                    />
                    <div className="text-center">
                        <span className="font-black text-xl tracking-tight text-white block drop-shadow-md">
                            SKYIMS <span className="text-indigo-400 font-bold text-sm">Tibao</span>
                        </span>
                        <span className="text-xs text-slate-300 font-medium block drop-shadow-xs">
                            Barangay Tibao • Mlang, Cotabato
                        </span>
                    </div>
                </Link>

                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/15 text-slate-200 text-[11px] font-semibold backdrop-blur-md shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Barangay Tibao Multi-Purpose Hall Operations</span>
                </div>
            </div>

            {/* Main Form Glass Card */}
            <div
                className={`relative z-10 w-full overflow-hidden bg-white/95 backdrop-blur-xl px-6 py-8 sm:px-8 shadow-2xl shadow-slate-950/70 rounded-3xl border border-white/50 ${maxWidth} animate-slideUp`}
            >
                {children}
            </div>

            {/* Bottom Return Link */}
            <div className="relative z-10 mt-6 text-center animate-fadeIn">
                <Link
                    href="/"
                    className="text-xs font-semibold text-slate-300 hover:text-white transition inline-flex items-center gap-1.5 drop-shadow-xs"
                >
                    <span>←</span>
                    <span>Return to Public Homepage</span>
                </Link>
            </div>
        </div>
    );
}
