import { Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    BarChart3,
    Calendar,
    CheckCircle2,
    Clock,
    Info,
    LayoutDashboard,
    LogOut,
    Menu,
    QrCode,
    ShieldCheck,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const { url } = usePage();
    const currentPath = (url || window.location.pathname).split('?')[0];
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        { name: 'Dashboard Overview', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Verification Queue', href: '/admin/registry/verification', icon: Clock },
        { name: 'Youth Registry CRM', href: '/admin/registry', icon: Users },
        { name: 'Event Management', href: '/admin/events', icon: Calendar },
        { name: 'QR Attendance Scanner', href: '/admin/attendance/scanner', icon: QrCode },
        { name: 'Needs Assessment & Analytics', href: '/admin/analytics', icon: BarChart3 },
    ];

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
            {/* Top Bar for Mobile */}
            <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                    <img
                        src="/images/skyims-logo.jpg"
                        alt="SKYIMS Logo"
                        className="w-8 h-8 rounded-full object-contain bg-white p-0.5 border border-slate-700 shadow-sm"
                    />
                    <div>
                        <h1 className="text-base font-bold text-white tracking-wide">SKYIMS Tibao</h1>
                        <p className="text-[10px] text-slate-400">SK Council Administration</p>
                    </div>
                </div>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800 focus:outline-none"
                    aria-label="Toggle Menu"
                >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Sidebar (Desktop always visible, Mobile collapsible) */}
            <aside
                className={`${
                    mobileMenuOpen ? 'block' : 'hidden'
                } md:flex md:flex-col w-full md:w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex-shrink-0 z-30`}
            >
                {/* Brand Header */}
                <div className="p-5 border-b border-slate-800 hidden md:block">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/skyims-logo.jpg"
                            alt="SKYIMS Logo"
                            className="w-10 h-10 rounded-full object-contain bg-white p-0.5 border border-slate-700 shadow-md"
                        />
                        <div>
                            <h1 className="text-base font-bold text-white tracking-tight">SKYIMS Tibao</h1>
                            <p className="text-[11px] text-slate-400">Mlang, Cotabato</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="p-3 space-y-1.5 flex-1">
                    <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Council Modules
                    </p>
                    {navItems.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = currentPath === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                                    isActive
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                                }`}
                            >
                                <IconComponent className="w-4 h-4 flex-shrink-0" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logged in Official Info */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/60">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">
                                {auth?.user?.name || 'SK Official'}
                            </p>
                            <span className="inline-block px-2 py-0.5 mt-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 capitalize">
                                {auth?.user?.role?.replace('_', ' ') || 'Official'}
                            </span>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition"
                            title="Log Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {header && (
                    <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-2xs">
                        {header}
                    </header>
                )}

                {/* Flash Message Banner */}
                {flashMsg && (
                    <div className="p-4 bg-slate-50 border-b border-slate-200 animate-slideDown">
                        <div
                            className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 ${
                                flashMsg.type === 'success'
                                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                                    : flashMsg.type === 'error'
                                    ? 'bg-rose-50 text-rose-900 border border-rose-200'
                                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                {flashMsg.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                                {flashMsg.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600" />}
                                {flashMsg.type !== 'success' && flashMsg.type !== 'error' && <Info className="w-4 h-4 text-amber-600" />}
                                <p className="text-xs font-bold">{flashMsg.text}</p>
                            </div>
                            <button
                                onClick={() => setFlashMsg(null)}
                                className="text-xs font-bold opacity-60 hover:opacity-100 p-1"
                                aria-label="Dismiss alert"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
