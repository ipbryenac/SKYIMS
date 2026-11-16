import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
            <Head title="SKYIMS - Barangay Tibao Sangguniang Kabataan" />

            {/* Glowing Ambient Gradient Orbs in Background */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute top-48 right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-[800px] left-10 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top Navigation */}
            <header className="relative z-50 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/skyims-logo.jpg"
                            alt="SKYIMS Logo"
                            className="w-11 h-11 rounded-full object-contain bg-white p-0.5 border border-indigo-400/40 shadow-lg shadow-indigo-500/20"
                        />
                        <div>
                            <span className="font-black text-lg tracking-tight text-white block leading-tight">
                                SKYIMS <span className="text-indigo-400 font-bold text-sm">Tibao</span>
                            </span>
                            <span className="text-[11px] text-slate-400 block">
                                Barangay Tibao • Mlang, Cotabato
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                        <a href="#about" className="hover:text-white transition">About SKYIMS</a>
                        <a href="#features" className="hover:text-white transition">Core Modules</a>
                        <a href="#hall" className="hover:text-white transition">Barangay Hall</a>
                    </nav>

                    {/* Auth CTA Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 transition active:scale-95 text-sm"
                            >
                                <span>Go to Dashboard</span>
                                <span>→</span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-slate-300 hover:text-white px-4 py-2 font-semibold text-sm transition"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition active:scale-95 text-sm"
                                >
                                    <span>Register as Youth</span>
                                    <span>→</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setMobileNavOpen(!mobileNavOpen)}
                        className="md:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
                    >
                        {mobileNavOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                {mobileNavOpen && (
                    <div className="md:hidden border-b border-slate-800 bg-slate-900/95 px-4 py-4 space-y-3 animate-slideDown">
                        <a
                            href="#about"
                            onClick={() => setMobileNavOpen(false)}
                            className="block text-sm text-slate-300 hover:text-white py-1"
                        >
                            About SKYIMS
                        </a>
                        <a
                            href="#features"
                            onClick={() => setMobileNavOpen(false)}
                            className="block text-sm text-slate-300 hover:text-white py-1"
                        >
                            Core Modules
                        </a>
                        <a
                            href="#hall"
                            onClick={() => setMobileNavOpen(false)}
                            className="block text-sm text-slate-300 hover:text-white py-1"
                        >
                            Barangay Hall
                        </a>
                        <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="w-full text-center bg-indigo-600 text-white font-bold py-2 rounded-xl text-sm"
                                >
                                    Open Dashboard →
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="w-full text-center bg-slate-800 text-white font-semibold py-2 rounded-xl text-sm"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="w-full text-center bg-indigo-600 text-white font-bold py-2 rounded-xl text-sm"
                                    >
                                        Register as Youth →
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* HERO SECTION */}
            <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                        {/* Hero Text Content (Left) */}
                        <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-slideUp">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Official Katipunan ng Kabataan Digital Hub</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                                Centralized Youth Information &{' '}
                                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                                    Management System
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                                Empowering the Sangguniang Kabataan and youth of <strong>Barangay Tibao, Mlang, Cotabato</strong>. Moving from scattered paper records to a secure digital databank for needs assessment, activity tracking, and proactive youth governance.
                            </p>

                            {/* Hero Actions */}
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                                <Link
                                    href={route('register')}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-7 py-3.5 rounded-2xl shadow-xl shadow-indigo-600/30 text-sm transition active:scale-95 group"
                                >
                                    <span>Register as Youth Member (Ages 15–30)</span>
                                    <span className="group-hover:translate-x-1 transition">→</span>
                                </Link>

                                <Link
                                    href={route('login')}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold px-6 py-3.5 rounded-2xl text-sm transition"
                                >
                                    <span>SK Council Portal</span>
                                </Link>
                            </div>

                            {/* Trust Stats Indicator */}
                            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0 text-left">
                                <div>
                                    <p className="text-2xl font-black text-white">7+ Puroks</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Purok 1–7 & Sitio Crossing</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-indigo-400">15–30</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Katipunan ng Kabataan</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-emerald-400">100%</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Digital QR Verification</p>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image Showcase (Right) - Featuring Barangay Tibao Multi-Purpose Hall */}
                        <div id="hall" className="lg:col-span-5 relative animate-fadeIn">
                            {/* Glass Background Backdrop Frame */}
                            <div className="relative rounded-3xl p-3 bg-gradient-to-b from-indigo-500/20 via-slate-800/30 to-slate-900/60 border border-indigo-500/30 shadow-2xl backdrop-blur-md">
                                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] group">
                                    <img
                                        src="/images/tibao-hall.jpg"
                                        alt="Barangay Tibao Multi Purpose Hall, Mlang, Cotabato"
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                                    />
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                                    {/* Bottom Image Caption */}
                                    <div className="absolute bottom-3 left-3 right-3 p-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10">
                                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                                            <span>🏛️</span>
                                            <span>Barangay Tibao Multi-Purpose Hall</span>
                                        </p>
                                        <p className="text-[11px] text-slate-300">
                                            Official Center of Sangguniang Kabataan Operations & Youth Assemblies
                                        </p>
                                    </div>
                                </div>

                                {/* Floating Glass Badge: Katipunan ng Kabataan Databank */}
                                <div className="absolute -top-5 -left-4 bg-slate-900/90 border border-indigo-500/40 backdrop-blur-md p-3 rounded-2xl shadow-xl hidden sm:flex items-center gap-3 animate-floatSlow">
                                    <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-base">
                                        🪪
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white leading-tight">Digital Youth Pass</p>
                                        <p className="text-[10px] text-indigo-300">Fast QR Attendance Scanning</p>
                                    </div>
                                </div>

                                {/* Floating Glass Badge: Verification Status */}
                                <div className="absolute -bottom-4 -right-4 bg-slate-900/90 border border-emerald-500/40 backdrop-blur-md p-3 rounded-2xl shadow-xl hidden sm:flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">
                                        ✓
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white leading-tight">Official SK Verified</p>
                                        <p className="text-[10px] text-emerald-400">Authentic Barangay Records</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* THREE CORE PROBLEM-SOLVING MODULES */}
            <section id="features" className="py-20 bg-slate-900/60 border-y border-slate-800/80 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-500/20">
                            Problem-Solving Architecture
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                            Targeted Tools for Barangay Tibao Youth
                        </h2>
                        <p className="text-sm text-slate-400">
                            Directly replacing manual paper logs and Excel spreadsheets with three integrated pillars.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Pillar 1 */}
                        <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition duration-300 flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                                    👥
                                </div>
                                <h3 className="text-xl font-bold text-white">The Youth Registry CRM</h3>
                                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                                    Solving Disorganized Information
                                </p>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Self-registration portal where youth input demographics, educational level, and contact numbers. The SK Council easily filters youth by age bracket (15–17, 18–24, 25–30) or sector (In-School, Out-of-School, Working).
                                </p>
                            </div>
                            <div className="pt-6 border-t border-slate-900 mt-6 flex items-center gap-2 text-xs text-slate-300 font-semibold">
                                <span className="text-emerald-400">✓</span>
                                <span>Includes SK Council Verification Queue</span>
                            </div>
                        </div>

                        {/* Pillar 2 */}
                        <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition duration-300 flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                                    📊
                                </div>
                                <h3 className="text-xl font-bold text-white">Digital Surveying & Analytics</h3>
                                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                                    Solving Poor Needs Assessment
                                </p>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Interactive assessment surveys prompt youth upon registration and login. Dynamic real-time charts summarize youth interest across Sports, Livelihood, and Leadership to justify CBYDP and ABYIP budget allocations.
                                </p>
                            </div>
                            <div className="pt-6 border-t border-slate-900 mt-6 flex items-center gap-2 text-xs text-slate-300 font-semibold">
                                <span className="text-blue-400">✓</span>
                                <span>Data-Backed Annual Youth Investment Planning</span>
                            </div>
                        </div>

                        {/* Pillar 3 */}
                        <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 hover:border-purple-500/50 transition duration-300 flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                                    🏆
                                </div>
                                <h3 className="text-xl font-bold text-white">Engagement & Tracking Tools</h3>
                                <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                                    Solving Lack of Participation
                                </p>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    A public-facing event feed where youth click "Join". On-site officials scan the youth's system-generated QR pass at the Barangay Gym to instantly log attendance, awarding digital gamification badges and XP points.
                                </p>
                            </div>
                            <div className="pt-6 border-t border-slate-900 mt-6 flex items-center gap-2 text-xs text-slate-300 font-semibold">
                                <span className="text-purple-400">✓</span>
                                <span>Fast Camera QR Scanner & Gamification Badges</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BARANGAY TIBAO COMMUNITY CONTEXT */}
            <section id="about" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12">
                        <div className="max-w-3xl space-y-4">
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                Community Purpose
                            </span>
                            <h2 className="text-3xl font-black text-white tracking-tight">
                                Tailored to the Exact Realities of Barangay Tibao
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                In Barangay Tibao, Mlang, Cotabato, organizing youth activities historically required manually compiling handwritten attendance sheets and distributing paper surveys. SKYIMS bridges this gap with a modern platform that unifies all youth across <strong>Purok 1, Purok 2, Purok 3, Purok 4, Purok 5, Purok 6, Purok 7, and Sitio Crossing</strong> under one Katipunan ng Kabataan databank.
                            </p>

                            <div className="pt-4 flex flex-wrap gap-3 text-xs font-semibold">
                                <div className="bg-slate-800/80 px-4 py-2 rounded-xl text-slate-200 border border-slate-700">
                                    📍 Barangay Tibao, Mlang
                                </div>
                                <div className="bg-slate-800/80 px-4 py-2 rounded-xl text-slate-200 border border-slate-700">
                                    🏛️ Multi-Purpose Hall Operations
                                </div>
                                <div className="bg-slate-800/80 px-4 py-2 rounded-xl text-slate-200 border border-slate-700">
                                    🇵🇭 RA 10742 & RA 11768 Compliant
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="py-16 text-center border-t border-slate-800/80 relative">
                <div className="max-w-4xl mx-auto px-4 space-y-6">
                    <h2 className="text-3xl font-black text-white tracking-tight">
                        Ready to Register in the Tibao Youth Databank?
                    </h2>
                    <p className="text-sm text-slate-400 max-w-xl mx-auto">
                        Join your fellow youth in Barangay Tibao. Create your profile, get your verified digital ID pass, and earn points by participating in community programs.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                        <Link
                            href={route('register')}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-indigo-600/30 text-sm transition active:scale-95"
                        >
                            Start Youth Self-Registration →
                        </Link>
                        <Link
                            href={route('login')}
                            className="text-slate-300 hover:text-white font-semibold text-sm px-6 py-3.5 transition"
                        >
                            Council Official Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <img
                            src="/images/skyims-logo.jpg"
                            alt="SKYIMS Logo"
                            className="w-7 h-7 rounded-full object-contain bg-white p-0.5 border border-slate-800"
                        />
                        <p>© 2026 Sangguniang Kabataan of Barangay Tibao, Mlang, Cotabato. All rights reserved.</p>
                    </div>
                    <p className="text-[11px] text-slate-600">
                        SKYIMS • Powered by Laravel & React
                    </p>
                </div>
            </footer>
        </div>
    );
}
