import QRCode from '@/Components/QRCode';
import html2canvas from 'html2canvas';
import { Award, CheckCircle2, Download, Printer, ShieldCheck, Sparkles, User, Zap } from 'lucide-react';
import { useRef, useState } from 'react';

export default function DigitalPassCard({
    youthProfile,
    user,
    qrString,
    showActions = true,
    onEdit = null,
}) {
    const cardRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const youthName = youthProfile?.full_name || user?.name || 'Youth Member';
    const youthCode = youthProfile?.youth_code || 'TIBAO-KK-00000';
    const qrValue = qrString || youthCode;

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);

        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 3, // High DPI for crisp printing and viewing
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                logging: false,
            });

            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `KK_Digital_Pass_${youthCode}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Failed to download digital pass:', error);
            // Fallback to print
            window.print();
        } finally {
            setIsDownloading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            {/* The Physical Card Container (Standard ID dimensions, strictly constrained) */}
            <div
                ref={cardRef}
                id="digital-pass-card"
                className="w-full max-w-[440px] bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 text-white rounded-[24px] p-5 shadow-2xl border border-indigo-400/40 relative overflow-hidden select-none"
            >
                {/* Background Ambient Guilloche Circles */}
                <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />

                {/* Card Header: Official Seal & LGU Text */}
                <div className="relative z-10 flex items-center justify-between pb-3.5 border-b border-white/15">
                    <div className="flex items-center gap-2.5 min-w-0">
                        {/* Strict bounded logo: Exactly 44px by 44px, never overflows */}
                        <img
                            src="/images/skyims-logo.jpg"
                            alt="SKYIMS Logo"
                            className="w-11 h-11 min-w-[44px] max-w-[44px] h-[44px] rounded-full object-contain bg-white p-0.5 border-2 border-amber-400 shadow-md flex-shrink-0"
                        />
                        <div className="min-w-0">
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-400 block leading-tight">
                                Republic of the Philippines
                            </span>
                            <h3 className="font-black text-sm text-white tracking-tight leading-tight truncate">
                                Barangay Tibao, Mlang
                            </h3>
                            <p className="text-[10px] text-indigo-200 leading-tight">
                                Katipunan ng Kabataan (KK) Official Pass
                            </p>
                        </div>
                    </div>

                    <div className="text-right flex-shrink-0 pl-2">
                        <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-bold leading-tight">
                            Law
                        </span>
                        <span className="text-[10px] font-black text-indigo-300 leading-tight block">
                            RA 10742/11768
                        </span>
                    </div>
                </div>

                {/* Card Body: Info & QR Code Layout */}
                <div className="relative z-10 py-4 grid grid-cols-12 gap-3 items-center">
                    {/* Youth Details (Left column) */}
                    <div className="col-span-7 space-y-2.5">
                        <div>
                            <span className="text-[9px] uppercase font-bold text-indigo-300 tracking-wider block">
                                Youth Member
                            </span>
                            <h4 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight truncate">
                                {youthName}
                            </h4>
                            <p className="text-[11px] font-mono font-black text-amber-300 tracking-wider mt-0.5">
                                {youthCode}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                            <div>
                                <span className="text-[9px] text-slate-400 uppercase font-semibold block">Purok</span>
                                <p className="font-bold text-white truncate">{youthProfile?.purok_sitio || 'Tibao'}</p>
                            </div>
                            <div>
                                <span className="text-[9px] text-slate-400 uppercase font-semibold block">Bracket</span>
                                <p className="font-bold text-white truncate">{youthProfile?.age_bracket || 'Core Youth'}</p>
                            </div>
                            <div>
                                <span className="text-[9px] text-slate-400 uppercase font-semibold block">Sector</span>
                                <p className="font-bold text-white truncate">{youthProfile?.youth_classification || 'In-School'}</p>
                            </div>
                            <div>
                                <span className="text-[9px] text-slate-400 uppercase font-semibold block">SK Voter</span>
                                <p className="font-bold text-emerald-400 truncate">
                                    {youthProfile?.is_registered_sk_voter ? '✓ Registered' : 'Not Reg.'}
                                </p>
                            </div>
                        </div>

                        {/* Verified Katipunan ng Kabataan Badge */}
                        <div className="pt-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>OFFICIALLY VERIFIED KK</span>
                            </span>
                        </div>
                    </div>

                    {/* QR Code Column (Right column) */}
                    <div className="col-span-5 flex flex-col items-center justify-center p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                        <QRCode
                            value={qrValue}
                            size={120}
                            className="w-[120px] h-[120px] rounded-xl shadow-md"
                        />
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-300 mt-1.5 text-center leading-tight">
                            Scan Attendance
                        </span>
                    </div>
                </div>

                {/* Card Footer: XP & Timestamp */}
                <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-amber-300 font-black">
                        <Zap className="w-3.5 h-3.5 fill-amber-300" />
                        <span>{youthProfile?.xp_points || 0} Total XP</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                        <span>BARANGAY TIBAO</span>
                    </div>
                </div>
            </div>

            {/* Quick Action Controls Under Card */}
            {showActions && (
                <div className="flex flex-wrap items-center justify-center gap-2 print:hidden w-full max-w-[440px]">
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-md text-xs transition active:scale-95 disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                        <span>{isDownloading ? 'Saving PNG...' : 'Download Pass (PNG)'}</span>
                    </button>

                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition active:scale-95"
                    >
                        <Printer className="w-4 h-4" />
                        <span>Print</span>
                    </button>
                </div>
            )}
        </div>
    );
}

