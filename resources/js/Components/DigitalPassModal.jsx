import DigitalPassCard from '@/Components/DigitalPassCard';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Edit3, QrCode, X } from 'lucide-react';
import { useEffect } from 'react';

export default function DigitalPassModal({
    isOpen,
    onClose,
    youthProfile,
    user,
    qrString,
}) {
    // Handle Escape key to close floating window
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            {/* Floating Window Container */}
            <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-slideUp flex flex-col max-h-[92vh]">
                {/* Window Title Bar */}
                <div className="bg-slate-800/90 px-5 py-3.5 border-b border-slate-700/80 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <QrCode className="w-5 h-5 text-indigo-400" />
                        <div>
                            <h3 className="text-sm font-bold tracking-tight">KK Digital Pass Window</h3>
                            <p className="text-[10px] text-slate-400">Official Youth QR Pass • Barangay Tibao</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/youth/profile/edit"
                            className="inline-flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition"
                            title="Edit Profile Information"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Edit Info</span>
                        </Link>

                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white hover:bg-slate-700/80 p-1.5 rounded-lg transition"
                            aria-label="Close Floating Window"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Modal Content Body */}
                <div className="p-5 overflow-y-auto flex-1 flex flex-col items-center">
                    {/* The Bounded Digital Pass Card */}
                    <DigitalPassCard
                        youthProfile={youthProfile}
                        user={user}
                        qrString={qrString}
                        showActions={true}
                    />

                    {/* How to Use Note */}
                    <div className="mt-5 bg-slate-800/70 border border-slate-700/60 rounded-2xl p-3.5 text-xs text-slate-300 w-full max-w-[440px] space-y-1">
                        <p className="font-bold text-indigo-300 flex items-center gap-1.5">
                            <span>💡</span>
                            <span>How to use your Digital Pass:</span>
                        </p>
                        <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
                            <li>Click <strong>Download Pass (PNG)</strong> to save this ID image to your phone or computer.</li>
                            <li>Show the QR code to SK Kagawads at the gym entrance to automatically log your attendance and earn XP.</li>
                        </ul>
                    </div>
                </div>

                {/* Window Bottom Actions */}
                <div className="bg-slate-900 px-5 py-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 font-mono">
                        {youthProfile?.youth_code || 'TIBAO-KK-PASS'}
                    </span>

                    <button
                        onClick={onClose}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-1.5 rounded-xl transition"
                    >
                        Close Window
                    </button>
                </div>
            </div>
        </div>
    );
}

