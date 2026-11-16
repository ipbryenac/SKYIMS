import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function AdminEventsCreate({ categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        category: categories[0] || 'Global Mobility & Sports/Culture',
        venue: 'Barangay Tibao Multi-Purpose Gym',
        start_datetime: '',
        end_datetime: '',
        capacity: '',
        points_reward: 50,
        status: 'published',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/events');
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between animate-fadeIn">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Create SK Event</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Schedule a community activity, youth assembly, or sports fest in Barangay Tibao
                        </p>
                    </div>

                    <Link
                        href="/admin/events"
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition"
                    >
                        ← Back to Events
                    </Link>
                </div>
            }
        >
            <Head title="Create Event" />

            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs animate-slideUp">
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Event Title *
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="e.g. 2026 Inter-Purok Youth Sports Fest"
                            required
                            className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                        />
                        {errors.title && <p className="text-rose-600 text-xs mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            CBYDP Category *
                        </label>
                        <select
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {errors.category && <p className="text-rose-600 text-xs mt-1">{errors.category}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Event Description & Objectives *
                        </label>
                        <textarea
                            rows="3"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Provide details about the event, rules, target participants, and benefits..."
                            required
                            className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                        />
                        {errors.description && <p className="text-rose-600 text-xs mt-1">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Venue / Location in Barangay Tibao *
                        </label>
                        <input
                            type="text"
                            value={data.venue}
                            onChange={(e) => setData('venue', e.target.value)}
                            placeholder="e.g. Barangay Tibao Multi-Purpose Gym"
                            required
                            className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                        />
                        {errors.venue && <p className="text-rose-600 text-xs mt-1">{errors.venue}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                Start Date & Time *
                            </label>
                            <input
                                type="datetime-local"
                                value={data.start_datetime}
                                onChange={(e) => setData('start_datetime', e.target.value)}
                                required
                                className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                            />
                            {errors.start_datetime && <p className="text-rose-600 text-xs mt-1">{errors.start_datetime}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                End Date & Time *
                            </label>
                            <input
                                type="datetime-local"
                                value={data.end_datetime}
                                onChange={(e) => setData('end_datetime', e.target.value)}
                                required
                                className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                            />
                            {errors.end_datetime && <p className="text-rose-600 text-xs mt-1">{errors.end_datetime}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                Capacity Limit
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={data.capacity}
                                onChange={(e) => setData('capacity', e.target.value)}
                                placeholder="Unlimited"
                                className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                Reward (XP) *
                            </label>
                            <input
                                type="number"
                                min="10"
                                max="500"
                                value={data.points_reward}
                                onChange={(e) => setData('points_reward', e.target.value)}
                                required
                                className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                Status *
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                            >
                                <option value="published">Published (Visible)</option>
                                <option value="draft">Draft (Hidden)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <Link
                            href="/admin/events"
                            className="text-xs font-bold text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-100 transition"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition active:scale-95 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save & Publish Event'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

