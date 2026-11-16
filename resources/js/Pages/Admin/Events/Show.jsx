import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    FileText,
    Mail,
    MapPin,
    Megaphone,
    QrCode,
    Radio,
    Send,
    Smartphone,
    Users,
    X,
    Zap,
    Edit,
    Trash2,
    UserPlus,
    Search,
    AlertCircle,
    Check,
} from 'lucide-react';
import { useState } from 'react';

export default function AdminEventsShow({
    event,
    registrations,
    attendancesCount = 0,
    smsLogs = [],
    totalYouthCount = 0,
    youthWithPhonesCount = 0,
    smsDriver = 'log',
    defaultSmsPreview = '',
    availableYouth = [],
    categories = [],
}) {
    const [activeTab, setActiveTab] = useState('roster'); // 'roster' | 'sms_logs'
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [broadcastMessage, setBroadcastMessage] = useState('');
    const [targetAudience, setTargetAudience] = useState('all');
    const [channel, setChannel] = useState('both');
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);

    // Event Edit Modal State
    const [showEditModal, setShowEditModal] = useState(false);
    const { data: editData, setData: setEditData, put: updateEvent, processing: isUpdatingEvent, errors: editErrors } = useForm({
        title: event.title || '',
        category: event.category || categories[0] || 'Global Mobility & Sports/Culture',
        venue: event.venue || '',
        start_datetime: event.start_datetime || '',
        end_datetime: event.end_datetime || '',
        capacity: event.capacity || '',
        points_reward: event.points_reward || 50,
        status: event.status || 'published',
        description: event.description || '',
    });

    // Event Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeletingEvent, setIsDeletingEvent] = useState(false);

    // Add Attendee / Walk-in Modal State
    const [showAddAttendeeModal, setShowAddAttendeeModal] = useState(false);
    const [youthSearch, setYouthSearch] = useState('');
    const [selectedYouthId, setSelectedYouthId] = useState('');
    const [attendeeInitialStatus, setAttendeeInitialStatus] = useState('registered');
    const [isAddingAttendee, setIsAddingAttendee] = useState(false);

    // Remove Attendee Confirmation State
    const [removingAttendee, setRemovingAttendee] = useState(null);
    const [isRemovingAttendee, setIsRemovingAttendee] = useState(false);

    // Compute live SMS preview text
    const previewText = broadcastMessage
        ? `${defaultSmsPreview} Note: ${broadcastMessage}`
        : defaultSmsPreview;

    const charCount = previewText.length;
    const smsSegments = Math.ceil(charCount / 160) || 1;

    // Filter available youth by search input
    const filteredYouth = availableYouth.filter((y) => {
        const query = youthSearch.toLowerCase();
        return (
            y.name.toLowerCase().includes(query) ||
            y.youth_code.toLowerCase().includes(query) ||
            y.purok.toLowerCase().includes(query) ||
            y.sector.toLowerCase().includes(query)
        );
    });

    // 1. Submit Event Update
    const handleEditSubmit = (e) => {
        e.preventDefault();
        updateEvent(`/admin/events/${event.id}`, {
            preserveScroll: true,
            onSuccess: () => setShowEditModal(false),
        });
    };

    // 2. Quick Status Change
    const handleQuickStatusChange = (newStatus) => {
        if (newStatus === event.status) return;
        router.patch(
            `/admin/events/${event.id}/status`,
            { status: newStatus },
            { preserveScroll: true }
        );
    };

    // 3. Confirm Delete Event
    const handleConfirmDelete = () => {
        setIsDeletingEvent(true);
        router.delete(`/admin/events/${event.id}`, {
            onFinish: () => {
                setIsDeletingEvent(false);
                setShowDeleteModal(false);
            },
        });
    };

    // 4. Add Attendee to Roster
    const handleAddAttendeeSubmit = (e) => {
        e.preventDefault();
        if (!selectedYouthId) return;

        setIsAddingAttendee(true);
        router.post(
            `/admin/events/${event.id}/roster`,
            {
                user_id: selectedYouthId,
                status: attendeeInitialStatus,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowAddAttendeeModal(false);
                    setSelectedYouthId('');
                    setYouthSearch('');
                },
                onFinish: () => setIsAddingAttendee(false),
            }
        );
    };

    // 5. Update Attendee Status in Roster
    const handleUpdateAttendeeStatus = (registrationId, newStatus) => {
        router.patch(
            `/admin/events/${event.id}/roster/${registrationId}`,
            { status: newStatus },
            { preserveScroll: true }
        );
    };

    // 6. Remove Attendee from Roster
    const handleConfirmRemoveAttendee = () => {
        if (!removingAttendee) return;
        setIsRemovingAttendee(true);
        router.delete(`/admin/events/${event.id}/roster/${removingAttendee.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setIsRemovingAttendee(false);
                setRemovingAttendee(null);
            },
        });
    };

    // 7. Submit Broadcast
    const handleBroadcastSubmit = (e) => {
        e.preventDefault();
        setIsBroadcasting(true);
        router.post(
            `/admin/events/${event.id}/broadcast`,
            {
                message: broadcastMessage,
                target_audience: targetAudience,
                channel: channel,
            },
            {
                onFinish: () => {
                    setIsBroadcasting(false);
                    setShowBroadcastModal(false);
                    setBroadcastMessage('');
                    setActiveTab('sms_logs');
                },
            }
        );
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-fadeIn">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold uppercase text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                                {event.category}
                            </span>
                            <span className="text-xs font-semibold text-slate-400">
                                Event ID #{event.id}
                            </span>

                            {/* Quick Status Dropdown Badge */}
                            <div className="inline-flex items-center gap-1.5 ml-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Status:</span>
                                <select
                                    value={event.status}
                                    onChange={(e) => handleQuickStatusChange(e.target.value)}
                                    className={`text-[11px] font-extrabold uppercase rounded-lg py-1 px-2.5 border transition cursor-pointer ${
                                        event.status === 'published'
                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                            : event.status === 'ongoing'
                                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                                            : event.status === 'completed'
                                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                                            : event.status === 'cancelled'
                                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                                            : 'bg-slate-100 text-slate-700 border-slate-300'
                                    }`}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                            {event.title}
                        </h2>

                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 font-medium">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                <span>{event.venue}</span>
                            </span>
                            <span>•</span>
                            <span>Schedule: {event.start_formatted} – {event.end_formatted}</span>
                            <span>•</span>
                            <span className="text-amber-600 font-bold">Reward: +{event.points_reward} XP</span>
                        </p>
                    </div>

                    {/* Header Action Controls */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Edit Event Button */}
                        <button
                            type="button"
                            onClick={() => setShowEditModal(true)}
                            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95"
                            title="Edit Event Details"
                        >
                            <Edit className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Edit Event</span>
                        </button>

                        {/* Broadcast Button */}
                        <button
                            type="button"
                            onClick={() => setShowBroadcastModal(true)}
                            className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95"
                        >
                            <Megaphone className="w-3.5 h-3.5" />
                            <span>Broadcast Alert</span>
                        </button>

                        {/* Delete Event Button */}
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-2 rounded-xl transition active:scale-95"
                            title="Delete Event"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                        </button>

                        <Link
                            href="/admin/events"
                            className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-xl transition"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Manage Event: ${event.title}`} />

            <div className="space-y-6 animate-slideUp">
                {/* Event Description Card */}
                {event.description && (
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                            Activity Overview & Mechanics:
                        </h4>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                            {event.description}
                        </p>
                    </div>
                )}

                {/* Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Total Registered</span>
                        <p className="text-2xl font-black text-slate-900 mt-1">{registrations.total || 0}</p>
                        <span className="text-[10px] text-slate-400">
                            {event.capacity ? `Capacity: ${event.capacity}` : 'Unlimited slots'}
                        </span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
                        <span className="text-[10px] font-bold uppercase text-emerald-600">Attended (Verified)</span>
                        <p className="text-2xl font-black text-emerald-600 mt-1">{attendancesCount}</p>
                        <span className="text-[10px] text-emerald-700 font-medium">Scanned or Logged</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
                        <span className="text-[10px] font-bold uppercase text-slate-400">SMS-Ready Youth</span>
                        <p className="text-2xl font-black text-indigo-600 mt-1">{youthWithPhonesCount}</p>
                        <span className="text-[10px] text-slate-400">Valid Mobile Numbers</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
                        <span className="text-[10px] font-bold uppercase text-amber-600">Reward Per Youth</span>
                        <p className="text-2xl font-black text-amber-600 mt-1">+{event.points_reward} XP</p>
                        <span className="text-[10px] text-amber-700 font-medium">Auto-Awarded</span>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <button
                        onClick={() => setActiveTab('roster')}
                        className={`text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                            activeTab === 'roster'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                        <Users className="w-3.5 h-3.5" />
                        <span>Registered Attendees ({registrations.total || 0})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('sms_logs')}
                        className={`text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                            activeTab === 'sms_logs'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>SMS Dispatch Audit ({smsLogs.length})</span>
                    </button>
                </div>

                {/* Tab 1: Registrations Roster Table with CRUD */}
                {activeTab === 'roster' && (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden animate-fadeIn">
                        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">
                                    Katipunan ng Kabataan Registration Roster
                                </h4>
                                <p className="text-xs text-slate-500">
                                    Manage attendees, update attendance status, and register walk-in participants
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowAddAttendeeModal(true)}
                                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95"
                            >
                                <UserPlus className="w-3.5 h-3.5" />
                                <span>+ Add Attendee / Walk-in</span>
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                                    <tr>
                                        <th className="p-3.5">Youth Code</th>
                                        <th className="p-3.5">Full Name</th>
                                        <th className="p-3.5">Purok / Sitio</th>
                                        <th className="p-3.5">Sector</th>
                                        <th className="p-3.5">Contact Number</th>
                                        <th className="p-3.5">Attendance Status</th>
                                        <th className="p-3.5">Registered Date</th>
                                        <th className="p-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {registrations.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="p-8 text-center text-slate-400">
                                                No youth registered for this event yet. Click "+ Add Attendee / Walk-in" above to add participants manually.
                                            </td>
                                        </tr>
                                    ) : (
                                        registrations.data.map((reg) => (
                                            <tr key={reg.id} className="hover:bg-slate-50/80 transition">
                                                <td className="p-3.5 font-mono font-bold text-indigo-700">
                                                    {reg.youth_code || 'N/A'}
                                                </td>
                                                <td className="p-3.5 font-bold text-slate-900">
                                                    {reg.user_name}
                                                </td>
                                                <td className="p-3.5">{reg.purok || 'Tibao'}</td>
                                                <td className="p-3.5">{reg.sector || 'Youth'}</td>
                                                <td className="p-3.5 text-slate-500">{reg.contact || 'N/A'}</td>
                                                <td className="p-3.5">
                                                    {/* Inline Status Changer Dropdown */}
                                                    <select
                                                        value={reg.status}
                                                        onChange={(e) => handleUpdateAttendeeStatus(reg.id, e.target.value)}
                                                        className={`text-[11px] font-bold rounded-lg py-1 px-2 border transition cursor-pointer ${
                                                            reg.status === 'attended'
                                                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                                                : reg.status === 'registered'
                                                                ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                                                : reg.status === 'no_show'
                                                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                                                : 'bg-rose-50 text-rose-800 border-rose-300'
                                                        }`}
                                                    >
                                                        <option value="registered">Registered</option>
                                                        <option value="attended">Attended (Present)</option>
                                                        <option value="no_show">No-Show</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td className="p-3.5 text-slate-400">{reg.registered_at}</td>
                                                <td className="p-3.5 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => setRemovingAttendee(reg)}
                                                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                                                        title="Remove from roster"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination if applicable */}
                        {registrations.links && registrations.links.length > 3 && (
                            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                                <span className="text-slate-500">
                                    Showing {registrations.from || 0} to {registrations.to || 0} of {registrations.total} attendees
                                </span>
                                <div className="flex gap-1">
                                    {registrations.links.map((link, i) => (
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
                )}

                {/* Tab 2: SMS Dispatch Audit Logs */}
                {activeTab === 'sms_logs' && (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden animate-fadeIn">
                        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-amber-600" />
                                    <span>SMS Broadcast Dispatch Log</span>
                                </h4>
                                <p className="text-xs text-slate-500">
                                    Audit trail of text messages dispatched to youth mobile phones
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                                    Active Gateway: {smsDriver === 'semaphore' ? 'Semaphore API (Live)' : 'Simulator Mode (Free/Test)'}
                                </span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                                    <tr>
                                        <th className="p-3.5">Recipient</th>
                                        <th className="p-3.5">Mobile Number</th>
                                        <th className="p-3.5">Gateway</th>
                                        <th className="p-3.5">Status</th>
                                        <th className="p-3.5">Dispatched At</th>
                                        <th className="p-3.5">SMS Message Content</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {smsLogs.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-slate-400">
                                                No SMS alerts dispatched for this event yet. Click "Broadcast Alert" above to send one!
                                            </td>
                                        </tr>
                                    ) : (
                                        smsLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-slate-50/80 transition">
                                                <td className="p-3.5 font-bold text-slate-900">{log.recipient_name}</td>
                                                <td className="p-3.5 font-mono text-indigo-700 font-semibold">{log.recipient_phone}</td>
                                                <td className="p-3.5 uppercase font-mono text-[10px] text-slate-500">{log.gateway}</td>
                                                <td className="p-3.5">
                                                    <span
                                                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                            log.status === 'sent'
                                                                ? 'bg-emerald-100 text-emerald-800'
                                                                : log.status === 'simulated'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-rose-100 text-rose-800'
                                                        }`}
                                                    >
                                                        {log.status}
                                                    </span>
                                                </td>
                                                <td className="p-3.5 text-slate-400 whitespace-nowrap">{log.created_at}</td>
                                                <td className="p-3.5 max-w-md text-slate-600 font-mono text-[11px] leading-relaxed">
                                                    {log.message}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL 1: Edit Event Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <Edit className="w-5 h-5 text-indigo-200" />
                                <div>
                                    <h3 className="font-black text-base">Edit Event Information</h3>
                                    <p className="text-xs text-indigo-100">Update schedule, venue, capacity, or details</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                    Event Title *
                                </label>
                                <input
                                    type="text"
                                    value={editData.title}
                                    onChange={(e) => setEditData('title', e.target.value)}
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600 font-semibold"
                                    required
                                />
                                {editErrors.title && <p className="text-rose-500 text-xs mt-1">{editErrors.title}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        CBYDP Category *
                                    </label>
                                    <select
                                        value={editData.category}
                                        onChange={(e) => setEditData('category', e.target.value)}
                                        className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600 font-medium"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    {editErrors.category && <p className="text-rose-500 text-xs mt-1">{editErrors.category}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        Status *
                                    </label>
                                    <select
                                        value={editData.status}
                                        onChange={(e) => setEditData('status', e.target.value)}
                                        className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600 font-bold"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="ongoing">Ongoing</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    {editErrors.status && <p className="text-rose-500 text-xs mt-1">{editErrors.status}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                    Venue / Location in Barangay Tibao *
                                </label>
                                <input
                                    type="text"
                                    value={editData.venue}
                                    onChange={(e) => setEditData('venue', e.target.value)}
                                    placeholder="e.g. Barangay Tibao Multi-Purpose Gym"
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                    required
                                />
                                {editErrors.venue && <p className="text-rose-500 text-xs mt-1">{editErrors.venue}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        Start Date & Time *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={editData.start_datetime}
                                        onChange={(e) => setEditData('start_datetime', e.target.value)}
                                        className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                        required
                                    />
                                    {editErrors.start_datetime && <p className="text-rose-500 text-xs mt-1">{editErrors.start_datetime}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        End Date & Time *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={editData.end_datetime}
                                        onChange={(e) => setEditData('end_datetime', e.target.value)}
                                        className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                        required
                                    />
                                    {editErrors.end_datetime && <p className="text-rose-500 text-xs mt-1">{editErrors.end_datetime}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        Attendee Capacity (Leave blank if unlimited)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={editData.capacity}
                                        onChange={(e) => setEditData('capacity', e.target.value)}
                                        placeholder="e.g. 100"
                                        className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                    />
                                    {editErrors.capacity && <p className="text-rose-500 text-xs mt-1">{editErrors.capacity}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        XP Points Reward *
                                    </label>
                                    <input
                                        type="number"
                                        min="10"
                                        max="500"
                                        value={editData.points_reward}
                                        onChange={(e) => setEditData('points_reward', e.target.value)}
                                        className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600 font-bold"
                                        required
                                    />
                                    {editErrors.points_reward && <p className="text-rose-500 text-xs mt-1">{editErrors.points_reward}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                    Description & Mechanics *
                                </label>
                                <textarea
                                    rows="4"
                                    value={editData.description}
                                    onChange={(e) => setEditData('description', e.target.value)}
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                    required
                                />
                                {editErrors.description && <p className="text-rose-500 text-xs mt-1">{editErrors.description}</p>}
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdatingEvent}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition disabled:opacity-50"
                                >
                                    {isUpdatingEvent ? 'Saving Changes...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: Add Attendee / Walk-in Modal */}
            {showAddAttendeeModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-scaleUp">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white p-5 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <UserPlus className="w-5 h-5 text-indigo-200" />
                                <div>
                                    <h3 className="font-black text-base">Add Attendee to Roster</h3>
                                    <p className="text-xs text-indigo-100">Manually register a Katipunan ng Kabataan youth</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAddAttendeeModal(false)}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleAddAttendeeSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
                            {/* Search Field */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                    Search Youth in Barangay Tibao
                                </label>
                                <div className="relative">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                    <input
                                        type="text"
                                        value={youthSearch}
                                        onChange={(e) => setYouthSearch(e.target.value)}
                                        placeholder="Type name, youth code, or purok..."
                                        className="w-full text-xs pl-9 rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                    />
                                </div>
                            </div>

                            {/* Youth Selection List */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                    Select Youth ({filteredYouth.length} available) *
                                </label>
                                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50/50">
                                    {filteredYouth.length === 0 ? (
                                        <p className="p-4 text-center text-slate-400 text-xs italic">
                                            No eligible unregistered youth found matching "{youthSearch}".
                                        </p>
                                    ) : (
                                        filteredYouth.map((y) => (
                                            <label
                                                key={y.id}
                                                className={`p-3 flex items-center justify-between cursor-pointer transition ${
                                                    selectedYouthId === y.id
                                                        ? 'bg-indigo-50/90 text-indigo-950 font-bold'
                                                        : 'hover:bg-slate-100/70 text-slate-700'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <input
                                                        type="radio"
                                                        name="selected_youth"
                                                        value={y.id}
                                                        checked={selectedYouthId === y.id}
                                                        onChange={() => setSelectedYouthId(y.id)}
                                                        className="text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-slate-900">{y.name}</p>
                                                        <p className="text-[10px] text-slate-500 font-mono">
                                                            {y.youth_code} • {y.purok} ({y.sector})
                                                        </p>
                                                    </div>
                                                </div>
                                                {selectedYouthId === y.id && (
                                                    <Check className="w-4 h-4 text-indigo-600 stroke-[3]" />
                                                )}
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Initial Attendance Status */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                                    Initial Status:
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label
                                        className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2 transition ${
                                            attendeeInitialStatus === 'registered'
                                                ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                                                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="initial_status"
                                            value="registered"
                                            checked={attendeeInitialStatus === 'registered'}
                                            onChange={() => setAttendeeInitialStatus('registered')}
                                            className="text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <div>
                                            <span className="block text-xs font-bold">Registered</span>
                                            <span className="text-[10px] text-slate-500">Scheduled to attend</span>
                                        </div>
                                    </label>

                                    <label
                                        className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2 transition ${
                                            attendeeInitialStatus === 'attended'
                                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                                                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="initial_status"
                                            value="attended"
                                            checked={attendeeInitialStatus === 'attended'}
                                            onChange={() => setAttendeeInitialStatus('attended')}
                                            className="text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <div>
                                            <span className="block text-xs font-bold text-emerald-800">Attended (Walk-in)</span>
                                            <span className="text-[10px] text-emerald-600">Awards +{event.points_reward} XP</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddAttendeeModal(false)}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!selectedYouthId || isAddingAttendee}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
                                >
                                    <UserPlus className="w-3.5 h-3.5" />
                                    <span>{isAddingAttendee ? 'Adding to Roster...' : 'Add to Roster'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 3: Delete Event Confirmation Modal */}
            <ConfirmationModal
                show={showDeleteModal}
                type="danger"
                title="Delete Community Event?"
                message={
                    <div className="space-y-2">
                        <p>
                            Are you sure you want to permanently delete{' '}
                            <strong className="text-slate-900 font-black">{event.title}</strong>?
                        </p>
                        <p className="text-[11px] text-slate-500">
                            This will cancel all {registrations.total || 0} registered youth spots and archive the activity from the community event board.
                        </p>
                    </div>
                }
                confirmText="Yes, Delete Event"
                cancelText="Cancel"
                loading={isDeletingEvent}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
            />

            {/* MODAL 4: Remove Attendee Confirmation Modal */}
            <ConfirmationModal
                show={Boolean(removingAttendee)}
                type="warning"
                title="Remove Attendee from Roster?"
                message={
                    removingAttendee && (
                        <div className="space-y-2">
                            <p>
                                Are you sure you want to remove{' '}
                                <strong className="text-slate-900 font-bold">{removingAttendee.user_name}</strong>{' '}
                                ({removingAttendee.youth_code}) from this event roster?
                            </p>
                            {removingAttendee.status === 'attended' && (
                                <p className="text-[11px] text-rose-600 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-100">
                                    ⚠️ Note: Removing an attendee who was marked as attended will deduct the {event.points_reward} XP points awarded for this event.
                                </p>
                            )}
                        </div>
                    )
                }
                confirmText="Remove Attendee"
                cancelText="Cancel"
                loading={isRemovingAttendee}
                onClose={() => setRemovingAttendee(null)}
                onConfirm={handleConfirmRemoveAttendee}
            />

            {/* MODAL 5: Broadcast Modal with Rich SMS Preview */}
            {showBroadcastModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-slideUp">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Megaphone className="w-6 h-6 text-white" />
                                <div>
                                    <h3 className="font-black text-base">Broadcast Event Announcement</h3>
                                    <p className="text-xs text-amber-100">Direct SMS and Email to Katipunan ng Kabataan</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2.5 py-1 rounded-full border border-white/20">
                                {smsDriver === 'semaphore' ? 'Live Gateway' : 'Simulator Mode'}
                            </span>
                        </div>

                        <form onSubmit={handleBroadcastSubmit} className="p-6 space-y-4">
                            {/* Audience Summary Box */}
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 space-y-1">
                                <p className="font-bold flex items-center gap-1.5">
                                    <Smartphone className="w-4 h-4 text-amber-700" />
                                    <span>
                                        Reaching {youthWithPhonesCount} of {totalYouthCount} youth members with valid mobile numbers in Barangay Tibao.
                                    </span>
                                </p>
                                <p className="text-[11px] text-amber-700">
                                    SMS messages are logged directly to the database audit trail and dispatched immediately.
                                </p>
                            </div>

                            {/* Delivery Channel */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                                    Delivery Channel:
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'both', label: 'SMS & Email', icon: Radio },
                                        { id: 'sms', label: 'SMS Alert Only', icon: Smartphone },
                                        { id: 'email', label: 'Email Only', icon: Mail },
                                    ].map((ch) => {
                                        const ChannelIcon = ch.icon;
                                        return (
                                            <button
                                                key={ch.id}
                                                type="button"
                                                onClick={() => setChannel(ch.id)}
                                                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                                                    channel === ch.id
                                                        ? 'bg-amber-500/10 border-amber-500 text-amber-900 shadow-xs'
                                                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                            >
                                                <ChannelIcon className="w-5 h-5" />
                                                <span>{ch.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Target Audience */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                    Target Youth Audience:
                                </label>
                                <select
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value)}
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-amber-600 focus:ring-amber-600 font-medium"
                                >
                                    <option value="all">All Katipunan ng Kabataan Youth (General Assembly)</option>
                                    <option value="registered">Registered Attendees for this Event Only</option>
                                    <option value="purok:Purok 1">Purok 1 Residents Only</option>
                                    <option value="purok:Purok 2">Purok 2 Residents Only</option>
                                    <option value="purok:Purok 3">Purok 3 Residents Only</option>
                                    <option value="purok:Purok 4">Purok 4 Residents Only</option>
                                    <option value="purok:Purok 5">Purok 5 Residents Only</option>
                                    <option value="purok:Purok 6">Purok 6 Residents Only</option>
                                    <option value="purok:Purok 7">Purok 7 Residents Only</option>
                                    <option value="purok:Sitio Crossing">Sitio Crossing Residents Only</option>
                                </select>
                            </div>

                            {/* Custom Note */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase">
                                        Custom Note (Optional):
                                    </label>
                                    <span className="text-[10px] text-slate-400">
                                        {charCount} / 160 chars ({smsSegments} SMS page{smsSegments > 1 ? 's' : ''})
                                    </span>
                                </div>
                                <textarea
                                    rows="2"
                                    value={broadcastMessage}
                                    onChange={(e) => setBroadcastMessage(e.target.value)}
                                    placeholder="e.g. Please bring water bottle and wear athletic shoes!"
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-amber-600 focus:ring-amber-600"
                                />
                            </div>

                            {/* Live SMS Message Preview Card */}
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                    Live SMS Text Message Preview:
                                </label>
                                <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl font-mono text-[11px] leading-relaxed border border-slate-700 shadow-inner">
                                    <div className="flex items-center justify-between text-[10px] text-amber-400 pb-1 mb-1 border-b border-slate-800">
                                        <span>Sender: SKYIMS_TIBAO</span>
                                        <span>{charCount} chars</span>
                                    </div>
                                    <p className="whitespace-pre-wrap">{previewText}</p>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="pt-2 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowBroadcastModal(false)}
                                    className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold px-4 py-2 rounded-xl text-xs transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isBroadcasting}
                                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition disabled:opacity-50 flex items-center gap-2 active:scale-95"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>{isBroadcasting ? 'Dispatching SMS & Alerts...' : 'Dispatch Broadcast Now'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
