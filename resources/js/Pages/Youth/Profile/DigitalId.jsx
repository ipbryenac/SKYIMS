import DigitalPassCard from '@/Components/DigitalPassCard';
import YouthLayout from '@/Layouts/YouthLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit3, QrCode } from 'lucide-react';

export default function DigitalId({
    youthProfile,
    user,
    qrPayload,
    qrString,
    badges = [],
}) {
    return (
        <YouthLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn print:hidden">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <QrCode className="w-5 h-5 text-indigo-600" />
                            <span>Katipunan ng Kabataan Digital Pass</span>
                        </h2>
                        <p className="text-xs text-slate-500">Official Youth Identification & QR Attendance Card</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/youth/profile/edit"
                            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Information</span>
                        </Link>

                        <Link
                            href="/youth/dashboard"
                            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Dashboard</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Digital ID Pass - Katipunan ng Kabataan" />

            <div className="max-w-xl mx-auto space-y-6 animate-slideUp py-4">
                {/* Floating Card View */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl flex flex-col items-center">
                    <DigitalPassCard
                        youthProfile={youthProfile}
                        user={user}
                        qrString={qrString}
                        showActions={true}
                    />
                </div>

                {/* Instructions Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs print:hidden space-y-3">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-indigo-600" />
                        <span>How to Use Your Digital Pass in Barangay Tibao</span>
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                        <li>
                            Click <strong>Download Pass (PNG)</strong> to save an image copy to your smartphone's gallery or photo roll.
                        </li>
                        <li>
                            When arriving at youth assemblies, sports festivals, or seminars at the <strong>Barangay Tibao Multi-Purpose Hall / Gym</strong>, present the QR code to the SK Kagawad or Secretariat.
                        </li>
                        <li>
                            The scanner instantly records your verified attendance and awards participation <strong>XP points</strong> and digital badges to your profile.
                        </li>
                    </ul>
                </div>
            </div>
        </YouthLayout>
    );
}
