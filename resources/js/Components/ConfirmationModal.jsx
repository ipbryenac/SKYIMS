import { CheckCircle2, AlertTriangle, AlertCircle, ShieldCheck, X } from 'lucide-react';

export default function ConfirmationModal({
    show = false,
    onClose = () => {},
    onConfirm = () => {},
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'primary', // 'primary' | 'success' | 'danger' | 'warning'
    loading = false,
}) {
    if (!show) return null;

    const typeConfig = {
        primary: {
            bgIcon: 'bg-indigo-100 text-indigo-600',
            button: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white',
            icon: ShieldCheck,
            border: 'border-indigo-100',
        },
        success: {
            bgIcon: 'bg-emerald-100 text-emerald-600',
            button: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white',
            icon: CheckCircle2,
            border: 'border-emerald-100',
        },
        danger: {
            bgIcon: 'bg-rose-100 text-rose-600',
            button: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 text-white',
            icon: AlertTriangle,
            border: 'border-rose-100',
        },
        warning: {
            bgIcon: 'bg-amber-100 text-amber-600',
            button: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white',
            icon: AlertCircle,
            border: 'border-amber-100',
        },
    }[type] || {
        bgIcon: 'bg-indigo-100 text-indigo-600',
        button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        icon: ShieldCheck,
        border: 'border-indigo-100',
    };

    const IconComponent = typeConfig.icon;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div
                className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-scaleUp relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close 'X' Button */}
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="p-6">
                    {/* Icon & Title */}
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${typeConfig.bgIcon} shadow-xs`}>
                            <IconComponent className="w-6 h-6 stroke-[2.2]" />
                        </div>
                        <div className="flex-1 pr-6">
                            <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                                {title}
                            </h3>
                            <div className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                                {message}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition active:scale-95 disabled:opacity-50"
                        >
                            {cancelText}
                        </button>

                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={loading}
                            className={`${typeConfig.button} font-bold px-5 py-2.5 rounded-xl text-xs transition active:scale-95 shadow-sm flex items-center gap-2 disabled:opacity-50`}
                        >
                            {loading && (
                                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                            )}
                            <span>{confirmText}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

