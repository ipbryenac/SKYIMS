import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const fillCredentials = (email, password) => {
        setData((prev) => ({
            ...prev,
            email,
            password,
        }));
    };

    return (
        <GuestLayout maxWidth="sm:max-w-md">
            <Head title="Sign In - SKYIMS Tibao" />

            {/* Card Header */}
            <div className="mb-6 text-center">
                <span className="inline-block bg-indigo-50 border border-indigo-200/80 text-indigo-700 font-bold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                    Official SK & Youth Portal
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Welcome Back
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                    Sign in to manage barangay youth records or view your Katipunan ng Kabataan pass.
                </p>
            </div>

            {status && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Email Address" className="text-xs font-bold text-slate-700" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full rounded-xl border-slate-300 text-sm focus:border-indigo-600 focus:ring-indigo-600"
                        autoComplete="username"
                        isFocused={true}
                        placeholder="e.g. admin@skyims.test"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <InputLabel htmlFor="password" value="Password" className="text-xs font-bold text-slate-700" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full rounded-xl border-slate-300 text-sm focus:border-indigo-600 focus:ring-indigo-600"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center cursor-pointer select-none">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="rounded-md border-slate-300 text-indigo-600 shadow-xs focus:ring-indigo-500"
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-xs font-medium text-slate-600">
                            Remember my session
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition duration-200 active:scale-95 text-sm disabled:opacity-50"
                >
                    <span>{processing ? 'Signing in...' : 'Sign In to Portal'}</span>
                    <span>→</span>
                </button>
            </form>

            {/* Quick Demo Credentials Helper */}
            <div className="mt-6 pt-5 border-t border-slate-200/80">
                <p className="text-[11px] font-semibold text-slate-400 text-center mb-2">
                    Quick Demo Credentials (Click to Autofill):
                </p>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => fillCredentials('admin@skyims.test', 'password123')}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left transition group"
                    >
                        <p className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                            SK Admin
                        </p>
                        <p className="text-xs font-semibold text-slate-700 truncate">
                            admin@skyims.test
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => fillCredentials('alyssa.alcantara@gmail.com', 'password123')}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left transition group"
                    >
                        <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                            Youth Member
                        </p>
                        <p className="text-xs font-semibold text-slate-700 truncate">
                            alyssa.alcantara
                        </p>
                    </button>
                </div>
            </div>

            {/* Self-Registration Footer Link */}
            <div className="mt-5 text-center text-xs text-slate-500">
                Don't have a KK youth profile yet?{' '}
                <Link
                    href={route('register')}
                    className="font-bold text-indigo-600 hover:text-indigo-500 underline transition"
                >
                    Register as Youth (15–30) →
                </Link>
            </div>
        </GuestLayout>
    );
}
