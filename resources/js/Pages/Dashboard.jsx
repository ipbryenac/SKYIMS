import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isSkOfficial = user && ['super_admin', 'sk_chairperson', 'sk_official'].includes(user.role);
    const targetRoute = isSkOfficial ? '/admin/dashboard' : '/youth/dashboard';

    useEffect(() => {
        // Automatically redirect to the appropriate portal
        window.location.replace(targetRoute);
    }, [targetRoute]);

    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
            <Head title="Redirecting..." />
            <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 border border-slate-700 text-center space-y-4 shadow-2xl">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600/30 flex items-center justify-center text-3xl animate-pulse">
                    🚀
                </div>
                <h2 className="text-xl font-black">Redirecting to Your Dashboard...</h2>
                <p className="text-sm text-slate-400">
                    Routing you to the {isSkOfficial ? 'SK Admin Overview' : 'Youth Portal'}...
                </p>
                <div className="pt-2">
                    <Link
                        href={targetRoute}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg transition"
                    >
                        <span>Click here if not redirected</span>
                        <span>→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
