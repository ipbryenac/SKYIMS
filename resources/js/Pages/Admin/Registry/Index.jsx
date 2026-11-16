import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmationModal from '@/Components/ConfirmationModal';

export default function YouthRegistryIndex({ profiles, filters = {}, puroksList = [], counts = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [purok, setPurok] = useState(filters.purok || '');
    const [sector, setSector] = useState(filters.sector || '');
    const [status, setStatus] = useState(filters.status || '');
    const [ageBracket, setAgeBracket] = useState(filters.age_bracket || '');
    const [voter, setVoter] = useState(filters.voter || '');

    const [selectedProfile, setSelectedProfile] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const applyFilters = (newFilters = {}) => {
        const query = {
            search,
            purok,
            sector,
            status,
            age_bracket: ageBracket,
            voter,
            ...newFilters,
        };

        // Clean empty keys
        Object.keys(query).forEach((key) => {
            if (!query[key]) delete query[key];
        });

        router.get('/admin/registry', query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const resetFilters = () => {
        setSearch('');
        setPurok('');
        setSector('');
        setStatus('');
        setAgeBracket('');
        setVoter('');
        router.get('/admin/registry');
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                            Katipunan ng Kabataan Databank CRM
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Barangay Tibao Centralized Youth Registry & Sectoral Filtering
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href="/admin/registry/export"
                            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition"
                        >
                            <span>📥</span>
                            <span>Export CSV / Excel</span>
                        </a>

                        <Link
                            href="/admin/registry/verification"
                            className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition"
                        >
                            <span>⏳ Verification Queue ({counts.pending || 0})</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Youth Registry CRM" />

            {/* Top Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Youth</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">{counts.total || 0}</p>
                </div>
                <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Verified</p>
                    <p className="text-2xl font-black text-emerald-700 mt-1">{counts.verified || 0}</p>
                </div>
                <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 shadow-xs">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Pending</p>
                    <p className="text-2xl font-black text-amber-700 mt-1">{counts.pending || 0}</p>
                </div>
                <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200 shadow-xs">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-800">In-School (ISY)</p>
                    <p className="text-2xl font-black text-blue-700 mt-1">{counts.isy || 0}</p>
                </div>
                <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200 shadow-xs">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-rose-800">Out-of-School</p>
                    <p className="text-2xl font-black text-rose-700 mt-1">{counts.osy || 0}</p>
                </div>
                <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200 shadow-xs">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-purple-800">Working Youth</p>
                    <p className="text-2xl font-black text-purple-700 mt-1">{counts.wy || 0}</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-3">
                <div className="flex flex-col md:flex-row gap-3">
                    {/* Search */}
                    <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, youth code (TIBAO-...), or phone..."
                            className="flex-1 text-xs rounded-xl border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                        >
                            Search
                        </button>
                    </form>

                    {/* Reset Button */}
                    <button
                        onClick={resetFilters}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition"
                    >
                        Clear Filters
                    </button>
                </div>

                {/* Filter Dropdowns Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100 text-xs">
                    {/* Purok Filter */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Purok / Sitio</label>
                        <select
                            value={purok}
                            onChange={(e) => {
                                setPurok(e.target.value);
                                applyFilters({ purok: e.target.value });
                            }}
                            className="w-full text-xs rounded-lg border-slate-300 py-1.5 focus:border-indigo-500"
                        >
                            <option value="">All Puroks of Tibao</option>
                            {puroksList.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    {/* Age Bracket Filter */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Age Bracket</label>
                        <select
                            value={ageBracket}
                            onChange={(e) => {
                                setAgeBracket(e.target.value);
                                applyFilters({ age_bracket: e.target.value });
                            }}
                            className="w-full text-xs rounded-lg border-slate-300 py-1.5 focus:border-indigo-500 font-semibold"
                        >
                            <option value="">All Age Brackets</option>
                            <option value="child">Child Youth (15–17)</option>
                            <option value="core">Core Youth (18–24)</option>
                            <option value="young_adult">Young Adult (25–30)</option>
                        </select>
                    </div>

                    {/* Sector Filter */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sector Classification</label>
                        <select
                            value={sector}
                            onChange={(e) => {
                                setSector(e.target.value);
                                applyFilters({ sector: e.target.value });
                            }}
                            className="w-full text-xs rounded-lg border-slate-300 py-1.5 focus:border-indigo-500"
                        >
                            <option value="">All Sectors</option>
                            <option value="In-School Youth">In-School (ISY)</option>
                            <option value="Out-of-School Youth">Out-of-School (OSY)</option>
                            <option value="Working Youth">Working Youth (WY)</option>
                            <option value="Youth with Specific Needs">Specific Needs (YSN)</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status</label>
                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                applyFilters({ status: e.target.value });
                            }}
                            className="w-full text-xs rounded-lg border-slate-300 py-1.5 focus:border-indigo-500"
                        >
                            <option value="">All Statuses</option>
                            <option value="verified">Verified Official</option>
                            <option value="pending">Pending Queue</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    {/* Voter Filter */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Voter Type</label>
                        <select
                            value={voter}
                            onChange={(e) => {
                                setVoter(e.target.value);
                                applyFilters({ voter: e.target.value });
                            }}
                            className="w-full text-xs rounded-lg border-slate-300 py-1.5 focus:border-indigo-500"
                        >
                            <option value="">All Registered</option>
                            <option value="sk">SK Voter (15–30)</option>
                            <option value="national">National Voter (18+)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Centralized Youth Data Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                            <tr>
                                <th className="p-3.5">Youth Code</th>
                                <th className="p-3.5">Full Name</th>
                                <th className="p-3.5">Age & Bracket</th>
                                <th className="p-3.5">Purok</th>
                                <th className="p-3.5">Sector</th>
                                <th className="p-3.5">Status</th>
                                <th className="p-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {profiles.data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-400">
                                        No Katipunan ng Kabataan records matched your filters.
                                    </td>
                                </tr>
                            ) : (
                                profiles.data.map((profile) => (
                                    <tr key={profile.id} className="hover:bg-slate-50/80 transition">
                                        <td className="p-3.5 font-mono font-bold text-indigo-700">
                                            {profile.youth_code}
                                        </td>
                                        <td className="p-3.5">
                                            <p className="font-bold text-slate-900">{profile.full_name}</p>
                                            <p className="text-[11px] text-slate-400">{profile.user?.email || 'No email'}</p>
                                            {(profile.skills || profile.hobbies) && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {profile.skills && (
                                                        <span className="inline-flex items-center text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 max-w-[160px] truncate">
                                                            🛠️ {profile.skills.split(',')[0]}
                                                        </span>
                                                    )}
                                                    {profile.hobbies && (
                                                        <span className="inline-flex items-center text-[10px] font-semibold bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-100 max-w-[160px] truncate">
                                                            ❤️ {profile.hobbies.split(',')[0]}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3.5">
                                            <span className="font-bold text-slate-800">{profile.age} yrs</span>
                                            <span className="block text-[10px] text-slate-500 font-medium">
                                                {profile.age_bracket}
                                            </span>
                                        </td>
                                        <td className="p-3.5 font-medium">
                                            {profile.purok_sitio}
                                        </td>
                                        <td className="p-3.5">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                profile.youth_classification === 'Out-of-School Youth'
                                                    ? 'bg-rose-100 text-rose-800'
                                                    : profile.youth_classification === 'Working Youth'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {profile.youth_classification}
                                            </span>
                                        </td>
                                        <td className="p-3.5">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                                profile.verification_status === 'verified'
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : profile.verification_status === 'pending'
                                                    ? 'bg-amber-100 text-amber-800'
                                                    : 'bg-rose-100 text-rose-800'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    profile.verification_status === 'verified'
                                                        ? 'bg-emerald-500'
                                                        : profile.verification_status === 'pending'
                                                        ? 'bg-amber-500'
                                                        : 'bg-rose-500'
                                                }`} />
                                                {profile.verification_status}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                                            <button
                                                onClick={() => setSelectedProfile(profile)}
                                                className="bg-slate-100 hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800 font-bold px-2.5 py-1 rounded-lg transition text-xs"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(profile)}
                                                className="bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 font-bold px-2.5 py-1 rounded-lg transition text-xs border border-rose-200"
                                                title="Delete youth record"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {profiles.links && profiles.links.length > 3 && (
                    <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                            Showing {profiles.from || 0} to {profiles.to || 0} of {profiles.total} youth records
                        </span>
                        <div className="flex gap-1">
                            {profiles.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 rounded-md text-xs font-semibold ${
                                        link.active
                                            ? 'bg-indigo-600 text-white'
                                            : link.url
                                            ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                            : 'text-slate-400 cursor-not-allowed'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Profile Detail Modal */}
            {selectedProfile && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 flex items-center justify-between">
                            <div>
                                <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                    {selectedProfile.youth_code}
                                </span>
                                <h3 className="text-xl font-black mt-1">{selectedProfile.full_name}</h3>
                                <p className="text-xs text-indigo-200">
                                    {selectedProfile.purok_sitio}, Barangay Tibao, Mlang
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedProfile(null)}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
                            {/* Status & Points Bar */}
                            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                                <div>
                                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Verification: </span>
                                    <strong className="capitalize text-slate-800 ml-1">{selectedProfile.verification_status}</strong>
                                    {selectedProfile.rejection_reason && (
                                        <p className="text-rose-600 text-[11px] mt-0.5">Reason: {selectedProfile.rejection_reason}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Participation XP: </span>
                                    <strong className="text-amber-600 font-extrabold text-sm ml-1">{selectedProfile.xp_points || 0} XP</strong>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Age & Bracket</p>
                                    <p className="font-bold text-slate-800 mt-0.5">{selectedProfile.age} yrs ({selectedProfile.age_bracket})</p>
                                </div>
                                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Gender / Sex</p>
                                    <p className="font-bold text-slate-800 mt-0.5">{selectedProfile.gender}</p>
                                </div>
                                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Civil Status</p>
                                    <p className="font-bold text-slate-800 mt-0.5">{selectedProfile.civil_status}</p>
                                </div>
                                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Classification</p>
                                    <p className="font-bold text-slate-800 mt-0.5">{selectedProfile.youth_classification}</p>
                                </div>
                                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Educational Attainment</p>
                                    <p className="font-bold text-slate-800 mt-0.5">{selectedProfile.educational_attainment}</p>
                                </div>
                                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Work Status</p>
                                    <p className="font-bold text-slate-800 mt-0.5">{selectedProfile.work_status}</p>
                                </div>
                            </div>

                            {/* Skills & Talents / Hobbies & Interests */}
                            <div className="bg-gradient-to-br from-indigo-50/70 to-purple-50/60 p-3.5 rounded-2xl border border-indigo-100 space-y-3">
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <p className="text-[10px] font-bold text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                                            <span>🛠️</span>
                                            <span>Skills & Special Competencies</span>
                                        </p>
                                        <span className="text-[9px] font-bold text-indigo-700 bg-white/90 px-2 py-0.5 rounded-full border border-indigo-200">
                                            CBYDP Livelihood Match
                                        </span>
                                    </div>
                                    {selectedProfile.skills ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedProfile.skills.split(',').map((sk, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center bg-white text-indigo-900 border border-indigo-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg shadow-2xs"
                                                >
                                                    {sk.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-[11px] text-slate-400 italic">No skills indicated yet.</p>
                                    )}
                                </div>

                                <div className="border-t border-indigo-100/70 pt-2.5">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <p className="text-[10px] font-bold text-rose-950 uppercase tracking-wide flex items-center gap-1.5">
                                            <span>❤️</span>
                                            <span>Hobbies & Recreation</span>
                                        </p>
                                        <span className="text-[9px] font-bold text-rose-700 bg-white/90 px-2 py-0.5 rounded-full border border-rose-200">
                                            Sports & Culture Match
                                        </span>
                                    </div>
                                    {selectedProfile.hobbies ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedProfile.hobbies.split(',').map((hb, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center bg-white text-rose-900 border border-rose-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg shadow-2xs"
                                                >
                                                    {hb.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-[11px] text-slate-400 italic">No hobbies indicated yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* Contact & Voting */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Contact Information</p>
                                    <p><strong>Mobile:</strong> {selectedProfile.user?.phone_number || 'N/A'}</p>
                                    <p><strong>Email:</strong> {selectedProfile.user?.email || 'N/A'}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Electoral Participation</p>
                                    <p><strong>SK Voter (15–30):</strong> {selectedProfile.is_registered_sk_voter ? '✅ Yes' : '❌ No'}</p>
                                    <p><strong>National Voter (18+):</strong> {selectedProfile.is_registered_national_voter ? '✅ Yes' : '❌ No'}</p>
                                </div>
                            </div>

                            {/* Verification ID Photo Preview */}
                            {selectedProfile.id_photo_path && (
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">
                                        Submitted Verification Document ({selectedProfile.id_type || 'ID'})
                                    </p>
                                    <a
                                        href={`/storage/${selectedProfile.id_photo_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <img
                                            src={`/storage/${selectedProfile.id_photo_path}`}
                                            alt="Verification ID"
                                            className="max-h-48 rounded-lg border border-slate-300 object-cover hover:opacity-90 transition"
                                        />
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => {
                                    const p = selectedProfile;
                                    setSelectedProfile(null);
                                    setDeleteTarget(p);
                                }}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-3.5 py-2 rounded-xl text-xs border border-rose-300 transition flex items-center gap-1.5"
                            >
                                <span>🗑️</span>
                                <span>Delete Record</span>
                            </button>

                            <button
                                onClick={() => setSelectedProfile(null)}
                                className="bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-slate-700 transition"
                            >
                                Close Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                show={Boolean(deleteTarget)}
                type="danger"
                title="Delete Youth Record"
                message={
                    deleteTarget && (
                        <div className="space-y-3">
                            <p className="text-slate-700 leading-relaxed">
                                Are you sure you want to permanently delete the Katipunan ng Kabataan record for{' '}
                                <strong className="text-slate-900 font-extrabold">{deleteTarget.full_name}</strong> ({deleteTarget.youth_code})?
                            </p>
                            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
                                <p className="font-bold">⚠️ Notice:</p>
                                <p>This will permanently erase their profile, submitted ID documents, attendance records, and associated login credentials from Barangay Tibao's database.</p>
                            </div>
                        </div>
                    )
                }
                confirmText="Yes, Delete Record"
                cancelText="Cancel"
                loading={isDeleting}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => {
                    setIsDeleting(true);
                    router.delete(`/admin/registry/${deleteTarget.id}`, {
                        onFinish: () => {
                            setIsDeleting(false);
                            setDeleteTarget(null);
                        },
                    });
                }}
            />
        </AdminLayout>
    );
}

