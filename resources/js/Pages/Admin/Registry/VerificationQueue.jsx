import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ShieldCheck, AlertTriangle, Eye, Check, X } from 'lucide-react';

export default function VerificationQueue({ pendingYouth }) {
    const [approvingProfile, setApprovingProfile] = useState(null);
    const [rejectingProfile, setRejectingProfile] = useState(null);
    const [previewPhoto, setPreviewPhoto] = useState(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        reason: '',
    });

    const handleConfirmVerify = () => {
        if (!approvingProfile) return;

        post(`/admin/registry/${approvingProfile.id}/verify`, {
            preserveScroll: true,
            onFinish: () => setApprovingProfile(null),
        });
    };

    const handleRejectSubmit = (e) => {
        e.preventDefault();
        if (!rejectingProfile) return;

        post(`/admin/registry/${rejectingProfile.id}/reject`, {
            preserveScroll: true,
            onSuccess: () => {
                setRejectingProfile(null);
                reset('reason');
            },
        });
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                            SK Verification Queue
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Verify pending Katipunan ng Kabataan self-registrants against official Barangay Tibao records
                        </p>
                    </div>

                    <Link
                        href="/admin/registry"
                        className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-slate-800 transition"
                    >
                        ← Back to Centralized CRM
                    </Link>
                </div>
            }
        >
            <Head title="SK Verification Queue" />

            {/* Queue Counter Banner */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-sm mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                        ⏳
                    </div>
                    <div>
                        <h3 className="font-bold text-base">Pending Verification Queue</h3>
                        <p className="text-xs text-amber-100">
                            {pendingYouth.total} youth applicant(s) awaiting SK Council approval
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <span className="text-2xl font-black">{pendingYouth.total}</span>
                    <span className="text-xs block text-amber-100">Pending</span>
                </div>
            </div>

            {/* Pending Applicants Grid */}
            {pendingYouth.data.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                    <div className="text-4xl mb-2">🎉</div>
                    <h3 className="font-bold text-slate-700 text-base">All Caught Up!</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        There are currently no pending registrants waiting for verification.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {pendingYouth.data.map((profile) => (
                        <div
                            key={profile.id}
                            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-400 transition"
                        >
                            {/* Card Header */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                                        {profile.youth_code}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                        Pending Review
                                    </span>
                                </div>

                                <h4 className="font-extrabold text-base text-slate-900">
                                    {profile.full_name}
                                </h4>
                                <p className="text-xs text-slate-500">
                                    📍 <strong>{profile.purok_sitio}</strong>, Barangay Tibao
                                </p>
                            </div>

                            {/* Details Matrix */}
                            <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Age Bracket:</span>
                                    <strong className="text-slate-700">{profile.age_bracket} ({profile.age} yrs)</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Sector:</span>
                                    <strong className="text-slate-700">{profile.youth_classification}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Contact:</span>
                                    <strong className="text-slate-700">{profile.user?.phone_number || 'N/A'}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Submitted ID:</span>
                                    <strong className="text-slate-700">{profile.id_type || 'Barangay/Student ID'}</strong>
                                </div>
                            </div>

                            {/* ID Photo Preview Button */}
                            {profile.id_photo_path ? (
                                <button
                                    type="button"
                                    onClick={() => setPreviewPhoto(`/storage/${profile.id_photo_path}`)}
                                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 rounded-xl transition flex items-center justify-center gap-1.5"
                                >
                                    <span>🔍</span>
                                    <span>Inspect Submitted ID Document</span>
                                </button>
                            ) : (
                                <div className="text-center py-1.5 bg-slate-50 rounded-xl text-[11px] text-slate-400 border border-dashed border-slate-200">
                                    No document attached (Check Voter records)
                                </div>
                            )}

                            {/* Verification Actions */}
                            <div className="pt-2 border-t border-slate-100 flex gap-2">
                                <button
                                    onClick={() => setRejectingProfile(profile)}
                                    disabled={processing}
                                    className="w-1/3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold py-2 rounded-xl transition border border-rose-200"
                                >
                                    Reject
                                </button>

                                <button
                                    onClick={() => setApprovingProfile(profile)}
                                    disabled={processing}
                                    className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 active:scale-95"
                                >
                                    <span>✓ Approve & Verify</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Custom Modern Themed Approval Confirmation Modal */}
            <ConfirmationModal
                show={Boolean(approvingProfile)}
                type="success"
                title="Verify Katipunan ng Kabataan Resident"
                message={
                    approvingProfile && (
                        <div className="space-y-3">
                            <p className="text-slate-700 leading-relaxed">
                                Verify and approve <strong className="text-slate-900 font-extrabold">{approvingProfile.full_name}</strong> as an official resident member of Barangay Tibao?
                            </p>
                            <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-emerald-700 font-semibold">Youth Code:</span>
                                    <strong className="font-mono">{approvingProfile.youth_code}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-emerald-700 font-semibold">Purok / Sitio:</span>
                                    <span>{approvingProfile.purok_sitio}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-emerald-700 font-semibold">Classification:</span>
                                    <span>{approvingProfile.youth_classification}</span>
                                </div>
                                {approvingProfile.id_type && (
                                    <div className="flex justify-between">
                                        <span className="text-emerald-700 font-semibold">Doc Type:</span>
                                        <span className="truncate max-w-[180px]">{approvingProfile.id_type}</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-[11px] text-slate-500">
                                This will grant them an active digital pass and officially register them in the SK Registry Databank.
                            </p>
                        </div>
                    )
                }
                confirmText="Verify & Approve"
                cancelText="Cancel"
                loading={processing}
                onClose={() => setApprovingProfile(null)}
                onConfirm={handleConfirmVerify}
            />

            {/* Modern Themed Rejection Modal */}
            {rejectingProfile && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 animate-scaleUp">
                        <div className="flex items-start gap-3.5 mb-3">
                            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
                            </div>
                            <div>
                                <h3 className="font-black text-base text-slate-900">
                                    Reject Application: {rejectingProfile.full_name}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Provide an official reason for rejection. The applicant will be notified of this remark.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleRejectSubmit} className="space-y-4 pt-2">
                            <div>
                                <textarea
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                    placeholder="e.g., Non-resident of Barangay Tibao, submitted ID is blurred or expired..."
                                    rows="3"
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-rose-500 focus:ring-rose-500"
                                    required
                                />
                                {errors.reason && <p className="text-rose-500 text-xs mt-1">{errors.reason}</p>}
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setRejectingProfile(null)}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs active:scale-95"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Photo Zoom Modal */}
            {previewPhoto && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    onClick={() => setPreviewPhoto(null)}
                >
                    <div className="max-w-2xl max-h-[85vh] bg-white rounded-2xl p-2 relative">
                        <img
                            src={previewPhoto}
                            alt="ID Preview"
                            className="max-h-[80vh] w-auto rounded-xl object-contain mx-auto"
                        />
                        <button
                            onClick={() => setPreviewPhoto(null)}
                            className="absolute top-4 right-4 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

