import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout maxWidth="sm:max-w-md">
            <Head title="Forgot Password - SKYIMS Tibao" />

            <div className="mb-6 text-center">
                <span className="inline-block bg-indigo-50 border border-indigo-200/80 text-indigo-700 font-bold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                    Password Recovery
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Reset Your Password
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                    Enter the email associated with your account and we will send you a password reset link.
                </p>
            </div>

            {status && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Account Email Address" className="text-xs font-bold text-slate-700" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full rounded-xl border-slate-300 text-sm focus:border-indigo-600 focus:ring-indigo-600"
                        isFocused={true}
                        placeholder="e.g. your.email@example.com"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition duration-200 active:scale-95 text-sm disabled:opacity-50"
                >
                    <span>{processing ? 'Sending Link...' : 'Email Password Reset Link'}</span>
                    <span>→</span>
                </button>

                <div className="pt-2 text-center">
                    <Link
                        href={route('login')}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition"
                    >
                        ← Back to Sign In
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
