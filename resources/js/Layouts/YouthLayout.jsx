import { Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Award,
    Calendar,
    CheckCircle2,
    ClipboardList,
    Info,
    LayoutDashboard,
    LogOut,
    QrCode,
    Trophy,
    User,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function YouthLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const { url } = usePage();
    const currentPath = (url || window.location.pathname).split('?')[0];
    const [flashMsg, setFlashMsg] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            setFlashMsg({ type: 'success', text: flash.success });
        } else if (flash?.error) {
            setFlashMsg({ type: 'error', text: flash.error });
        } else if (flash?.warning) {
            setFlashMsg({ type: 'warning', text: flash.warning });
        }
    }, [flash]);

    const navItems = [
        { name: 'Dashboard', href: '/youth/dashboard', icon: LayoutDashboard },
        { name: 'Activities', href: '/youth/events', icon: Calendar },
        { name: 'Digital Pass', href: '/youth/profile/digital-id', icon: QrCode },
        { name: 'Needs Survey', href: '/youth/surveys', icon: ClipboardList },
        { name: 'Achievements', href: '/youth/badges', icon: Trophy },
        { name: 'Edit Profile', href: '/youth/profile/edit', icon: User },
    ];

    const isDashboard = currentPath === '/youth/dashboard';

    // Page Title Mapping for Breadcrumbs
    const pageTitles = {
        '/youth/dashboard': 'Youth Portal Dashboard',
        '/youth/events': 'Activity Event Board',
        '/youth/profile/digital-id': 'Katipunan ng Kabataan Digital Pass',
        '/youth/surveys': 'Needs Assessment Survey',
        '/youth/badges': 'Achievements & Gamification',
        '/youth/profile/edit': 'Edit Profile Information',
    };

    const currentPageTitle = pageTitles[currentPath] || 'Youth Portal';

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col pb-24 md:pb-0 font-sans">
            {/* Top Navigation Bar with High Visibility */}
            <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 text-white shadow-md sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
                    {/* Brand Link to Dashboard */}
                    <Link
                        href="/youth/dashboard"
                        className="flex items-center gap-3 group transition transform hover:scale-[1.02] flex-shrink-0"
                        title="Return to Youth Dashboard"
                    >
                        <img
                            src="/images/skyims-logo.jpg"
                            alt="SKYIMS Logo"
                            className="w-10 h-10 rounded-full object-contain bg-white p-0.5 border border-white/30 group-hover:border-white shadow-sm transition"
                        />
                        <div>
                            <h1 className="text-base font-black tracking-tight text-white leading-tight flex items-center gap-1.5">
                                <span>Kabataan ng Tibao</span>
                                <span className="text-[10px] font-bold bg-white/20 text-indigo-100 px-2 py-0.5 rounded-full border border-white/20">
                                    SKYIMS
                                </span>
                            </h1>
                            <p className="text-[10px] text-indigo-200">
                                Barangay Tibao • Mlang, Cotabato
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links (Always Visible on PC/Laptop) */}
                    <nav className="hidden lg:flex items-center gap-1 text-xs font-bold">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            const isActive = currentPath === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                                        isActive
                                            ? 'bg-white text-indigo-900 shadow-sm font-extrabold'
                                            : 'text-indigo-100 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <IconComponent className="w-4 h-4" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile Pill & Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Link
                            href="/youth/profile/edit"
                            className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl text-white border border-white/20 font-semibold transition"
                            title="Edit Profile Information"
                        >
                            <User className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[130px]">{auth?.user?.name}</span>
                        </Link>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="inline-flex items-center gap-1.5 text-xs bg-rose-500/25 hover:bg-rose-500/40 text-rose-100 hover:text-white px-3 py-1.5 rounded-xl font-bold transition border border-rose-400/30"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Log Out</span>
                        </Link>
                    </div>
                </div>

                {/* Sub-header Navigation Bar for Mid-sized screens (Tablets/Medium PCs) */}
                <div className="hidden md:flex lg:hidden bg-indigo-950/40 border-t border-white/10 px-4 py-2 overflow-x-auto justify-center gap-1.5 text-xs font-bold">
                    {navItems.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = currentPath === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg transition whitespace-nowrap ${
                                    isActive
                                        ? 'bg-white text-indigo-900 font-extrabold'
                                        : 'text-indigo-100 hover:bg-white/10'
                                }`}
                            >
                                <IconComponent className="w-4 h-4" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </header>

            {/* CLEAR CONTEXTUAL BREADCRUMB & BACK TO DASHBOARD BAR */}
            {!isDashboard && (
                <div className="bg-slate-200/90 border-b border-slate-300 py-2.5 px-4 sm:px-6 shadow-xs animate-fadeIn">
                    <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-2 text-slate-600 font-medium truncate">
                            <Link
                                href="/youth/dashboard"
                                className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1.5"
                            >
                                <LayoutDashboard className="w-3.5 h-3.5" />
                                <span>Dashboard</span>
                            </Link>
                            <span className="text-slate-400">/</span>
                            <span className="text-slate-800 font-bold truncate">
                                {currentPageTitle}
                            </span>
                        </div>

                        <Link
                            href="/youth/dashboard"
                            className="inline-flex items-center gap-1.5 bg-white hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800 border border-slate-300 font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-xs transition active:scale-95 flex-shrink-0"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to Main Dashboard</span>
                        </Link>
                    </div>
                </div>
            )}

            {/* Flash Message Banner */}
            {flashMsg && (
                <div className="max-w-4xl mx-auto w-full px-4 pt-4">
                    <div
                        className={`p-4 rounded-2xl shadow-sm border flex items-start justify-between gap-3 animate-slideDown ${
                            flashMsg.type === 'success'
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                                : flashMsg.type === 'error'
                                ? 'bg-rose-50 border-rose-300 text-rose-900'
                                : 'bg-amber-50 border-amber-300 text-amber-900'
                        }`}
                    >
                        <div className="flex items-center gap-2.5">
                            {flashMsg.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                            {flashMsg.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
                            {flashMsg.type !== 'success' && flashMsg.type !== 'error' && <Info className="w-5 h-5 text-amber-600" />}
                            <p className="text-xs font-bold leading-relaxed">{flashMsg.text}</p>
                        </div>
                        <button
                            onClick={() => setFlashMsg(null)}
                            className="text-xs font-bold opacity-60 hover:opacity-100 p-1 rounded"
                            aria-label="Dismiss alert"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {header && (
                <div className="bg-white border-b border-slate-200 shadow-xs">
                    <div className="max-w-4xl mx-auto px-4 py-3.5">
                        {header}
                    </div>
                </div>
            )}

            {/* Main Content Container */}
            <main className="max-w-4xl mx-auto w-full p-4 md:p-6 flex-1">
                {children}
            </main>

            {/* Bottom Navigation for Mobile Devices */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-2.5 shadow-lg md:hidden z-50">
                {navItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = currentPath === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-0.5 text-xs transition ${
                                isActive
                                    ? 'text-indigo-600 font-bold'
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <IconComponent className="w-5 h-5" />
                            <span className="text-[10px] leading-tight font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
