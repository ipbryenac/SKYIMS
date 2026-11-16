import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    Briefcase,
    Calendar,
    Clock,
    GraduationCap,
    Plus,
    QrCode,
    Users,
} from 'lucide-react';

export default function AdminDashboard({ metrics = {} }) {
    const defaultMetrics = {
        totalYouth: metrics.totalYouth ?? 0,
        pendingVerification: metrics.pendingVerification ?? 0,
        inSchoolYouth: metrics.inSchoolYouth ?? 0,
        outOfSchoolYouth: metrics.outOfSchoolYouth ?? 0,
        workingYouth: metrics.workingYouth ?? 0,
        activeEvents: metrics.activeEvents ?? 0,
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/skyims-logo.jpg"
                            alt="SKYIMS Logo"
                            className="w-12 h-12 rounded-full object-contain bg-white p-0.5 border border-slate-200 shadow-sm flex-shrink-0"
                        />
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                                SK Council Dashboard Overview
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Barangay Tibao, Municipality of Mlang, Cotabato
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Link
                            href="/admin/events/create"
                            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create Event</span>
                        </Link>
                        <Link
                            href="/admin/attendance/scanner"
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95"
                        >
                            <QrCode className="w-4 h-4" />
                            <span>Open QR Scanner</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="SK Council Dashboard" />

            <div className="space-y-6 animate-slideUp">
                {/* Quick KPI Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 hover:-translate-y-1 hover:shadow-md transition duration-200">
                        <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                            Total KK Youth
                        </p>
                        <p className="text-3xl font-black text-slate-800 mt-1.5">
                            {defaultMetrics.totalYouth}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">Registered in Databank</span>
                    </div>

                    <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-xs hover:border-amber-300 hover:-translate-y-1 hover:shadow-md transition duration-200">
                        <p className="text-[11px] text-amber-800 font-bold uppercase tracking-wider">
                            Verification Queue
                        </p>
                        <p className="text-3xl font-black text-amber-700 mt-1.5">
                            {defaultMetrics.pendingVerification}
                        </p>
                        <Link
                            href="/admin/registry/verification"
                            className="text-[11px] text-amber-800 font-bold hover:underline inline-flex items-center gap-1 mt-1"
                        >
                            <span>Review IDs</span>
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 shadow-xs hover:border-blue-300 hover:-translate-y-1 hover:shadow-md transition duration-200">
                        <p className="text-[11px] text-blue-800 font-bold uppercase tracking-wider">
                            In-School (ISY)
                        </p>
                        <p className="text-3xl font-black text-blue-700 mt-1.5">
                            {defaultMetrics.inSchoolYouth}
                        </p>
                        <span className="text-[10px] text-blue-600/70 mt-1 block">Students (Elem-College)</span>
                    </div>

                    <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 shadow-xs hover:border-rose-300 hover:-translate-y-1 hover:shadow-md transition duration-200">
                        <p className="text-[11px] text-rose-800 font-bold uppercase tracking-wider">
                            Out-of-School (OSY)
                        </p>
                        <p className="text-3xl font-black text-rose-700 mt-1.5">
                            {defaultMetrics.outOfSchoolYouth}
                        </p>
                        <span className="text-[10px] text-rose-600/70 mt-1 block">Target for Livelihood</span>
                    </div>

                    <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-xs hover:border-emerald-300 hover:-translate-y-1 hover:shadow-md transition duration-200">
                        <p className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider">
                            Working Youth (WY)
                        </p>
                        <p className="text-3xl font-black text-emerald-700 mt-1.5">
                            {defaultMetrics.workingYouth}
                        </p>
                        <span className="text-[10px] text-emerald-600/70 mt-1 block">Employed / Self-Employed</span>
                    </div>

                    <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 shadow-xs hover:border-purple-300 hover:-translate-y-1 hover:shadow-md transition duration-200">
                        <p className="text-[11px] text-purple-800 font-bold uppercase tracking-wider">
                            Active Programs
                        </p>
                        <p className="text-3xl font-black text-purple-700 mt-1.5">
                            {defaultMetrics.activeEvents}
                        </p>
                        <span className="text-[10px] text-purple-600/70 mt-1 block">Open for Registration</span>
                    </div>
                </div>

                {/* Quick Actions & Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition duration-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                                <Users className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-base">Youth Registry CRM</h3>
                                <p className="text-xs text-slate-500">Official Katipunan ng Kabataan Databank</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                            Filter youth records by Purok 1–7, age bracket (15–17 Child Youth, 18–24 Core Youth, 25–30 Young Adult), and electoral status for assembly quorum justification.
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                            <Link
                                href="/admin/registry"
                                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition active:scale-95"
                            >
                                <span>Open Centralized CRM</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                                href="/admin/registry/verification"
                                className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition active:scale-95"
                            >
                                <Clock className="w-3.5 h-3.5" />
                                <span>Process Verification Queue ({defaultMetrics.pendingVerification})</span>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition duration-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-base">CBYDP & ABYIP Analytics</h3>
                                <p className="text-xs text-slate-500">Needs Assessment Visualizations</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                            Analyze survey responses from Barangay Tibao youth across Sports, Livelihood, Leadership, Environment, and Mental Health to justify your Annual Barangay Youth Investment Program.
                        </p>
                        <Link
                            href="/admin/analytics"
                            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition active:scale-95"
                        >
                            <span>View Needs Assessment Charts</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
