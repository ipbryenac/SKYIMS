import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Sparkles, Lightbulb, Wrench, Heart, Plus, X, Check, HelpCircle } from 'lucide-react';

export default function Register({
    puroks = ['Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5', 'Purok 6', 'Purok 7', 'Sitio Crossing'],
    classifications = ['In-School Youth', 'Out-of-School Youth', 'Working Youth', 'Youth with Specific Needs'],
    educationLevels = [
        'Elementary Level',
        'Elementary Graduate',
        'High School Level',
        'High School Graduate',
        'Senior High Level',
        'Senior High Graduate',
        'Vocational Course',
        'College Level',
        'College Graduate',
        'Post-Graduate Level',
    ],
    workStatuses = ['Employed', 'Unemployed', 'Self-Employed', 'Looking for Job', 'Not Applicable'],
    recommendedSkills = [
        'Computer & IT / Programming',
        'Graphic Design & Digital Media',
        'Cooking & Commercial Baking',
        'Carpentry & Electrical Installation',
        'First Aid & Disaster Rescue (DRRM)',
        'Agriculture & Farming',
        'Public Speaking & Leadership',
        'Sports Coaching & Refereeing',
        'Tailoring & Dressmaking',
        'Automotive & Engine Repair',
        'Photography & Videography',
        'Bookkeeping & Financial Literacy',
    ],
    recommendedHobbies = [
        'Basketball',
        'Volleyball',
        'Esports (Mobile Legends / COD)',
        'Badminton',
        'Singing & Musical Instruments',
        'Dancing (Hip-hop / Folk)',
        'Painting & Visual Arts',
        'Cycling & Biking',
        'Gardening & Urban Farming',
        'Reading & Creative Writing',
        'Board Games & Chess',
        'Community Volunteering',
    ],
    idTypes = [
        'Student ID (School / College ID)',
        'National ID (PhilSys ID / ePhilID)',
        'Barangay Clearance / Certificate of Residency',
        'PSA / NSO Birth Certificate',
        'Philippine Passport',
        "Driver's License / Student Permit",
        "Voter's ID / COMELEC Certificate",
        'SK Member Certificate',
        'Postal ID',
        'Other Valid ID / Document',
    ],
}) {
    const [step, setStep] = useState(1);
    const [clientErrors, setClientErrors] = useState({});
    const [customSkillInput, setCustomSkillInput] = useState('');
    const [customHobbyInput, setCustomHobbyInput] = useState('');
    const [selectedIdCategory, setSelectedIdCategory] = useState(idTypes[0] || 'Student ID (School / College ID)');
    const [customIdType, setCustomIdType] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        // Step 1: Account & Contact
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        email: '',
        phone_number: '',
        password: '',
        password_confirmation: '',

        // Step 2: Demographics & ID
        gender: 'Male',
        birthdate: '',
        civil_status: 'Single',
        purok_sitio: puroks[0] || 'Purok 1',
        youth_classification: classifications[0] || 'In-School Youth',
        educational_attainment: educationLevels[6] || 'College Level',
        work_status: 'Not Applicable',
        skills: '',
        hobbies: '',
        is_registered_sk_voter: true,
        is_registered_national_voter: false,
        voted_last_sk_election: false,
        id_type: idTypes[0] || 'Student ID (School / College ID)',
        id_photo: null,
    });

    const step1Fields = ['first_name', 'last_name', 'email', 'phone_number', 'password', 'password_confirmation'];
    const hasStep1Errors = Object.keys(errors).some((key) => step1Fields.includes(key));
    const hasStep2Errors = Object.keys(errors).some((key) => !step1Fields.includes(key));

    // Automatically navigate back to Step 1 if backend validation failed on Step 1 fields
    useEffect(() => {
        if (hasStep1Errors) {
            setStep(1);
        }
    }, [errors]);

    // Client-side validation before advancing to Step 2
    const validateStep1 = () => {
        const errs = {};
        if (!data.first_name.trim()) errs.first_name = 'First name is required.';
        if (!data.last_name.trim()) errs.last_name = 'Last name is required.';
        if (!data.phone_number.trim()) errs.phone_number = 'Philippine mobile number is required.';
        if (!data.email.trim()) errs.email = 'Email address is required.';
        if (!data.password) {
            errs.password = 'Password is required.';
        } else if (data.password.length < 8) {
            errs.password = 'Password must be at least 8 characters.';
        }
        if (data.password !== data.password_confirmation) {
            errs.password_confirmation = 'Passwords do not match.';
        }

        setClientErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleContinueToStep2 = () => {
        if (validateStep1()) {
            setClientErrors({});
            setStep(2);
        }
    };

    // Helpers for skills & hobbies tags
    const currentSkills = data.skills
        ? data.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

    const currentHobbies = data.hobbies
        ? data.hobbies.split(',').map((h) => h.trim()).filter(Boolean)
        : [];

    const toggleSkill = (skill) => {
        let updated;
        if (currentSkills.includes(skill)) {
            updated = currentSkills.filter((s) => s !== skill);
        } else {
            updated = [...currentSkills, skill];
        }
        setData('skills', updated.join(', '));
    };

    const addCustomSkill = () => {
        const val = customSkillInput.trim();
        if (val && !currentSkills.includes(val)) {
            setData('skills', [...currentSkills, val].join(', '));
            setCustomSkillInput('');
        }
    };

    const removeSkill = (skill) => {
        setData('skills', currentSkills.filter((s) => s !== skill).join(', '));
    };

    const toggleHobby = (hobby) => {
        let updated;
        if (currentHobbies.includes(hobby)) {
            updated = currentHobbies.filter((h) => h !== hobby);
        } else {
            updated = [...currentHobbies, hobby];
        }
        setData('hobbies', updated.join(', '));
    };

    const addCustomHobby = () => {
        const val = customHobbyInput.trim();
        if (val && !currentHobbies.includes(val)) {
            setData('hobbies', [...currentHobbies, val].join(', '));
            setCustomHobbyInput('');
        }
    };

    const removeHobby = (hobby) => {
        setData('hobbies', currentHobbies.filter((h) => h !== hobby).join(', '));
    };

    const submit = (e) => {
        e.preventDefault();

        // Final check on Step 1
        if (!validateStep1()) {
            setStep(1);
            return;
        }

        if (!data.birthdate) {
            setClientErrors({ birthdate: 'Please specify your birthdate to compute your age bracket.' });
            return;
        }

        post(route('register'), {
            forceFormData: true,
            onError: (err) => {
                if (Object.keys(err).some((k) => step1Fields.includes(k))) {
                    setStep(1);
                }
            },
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const allErrors = { ...clientErrors, ...errors };

    return (
        <GuestLayout maxWidth="sm:max-w-2xl">
            <Head title="Youth Self-Registration" />

            <div className="mb-6 text-center">
                <span className="inline-block bg-indigo-100 text-indigo-700 font-bold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                    Barangay Tibao, Mlang, Cotabato
                </span>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                    Youth Registry Portal
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                    Official Katipunan ng Kabataan Databank Profiling (Ages 15–30)
                </p>

                {/* Step Indicators with Error Badges */}
                <div className="flex items-center justify-center gap-3 mt-4">
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                            step === 1 ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-200 text-slate-700'
                        }`}
                    >
                        <span>1</span>
                        <span>Account & Contact</span>
                        {hasStep1Errors && (
                            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                !
                            </span>
                        )}
                    </button>

                    <span className="text-slate-300">→</span>

                    <button
                        type="button"
                        onClick={() => {
                            if (validateStep1()) setStep(2);
                        }}
                        className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                            step === 2 ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-200 text-slate-700'
                        }`}
                    >
                        <span>2</span>
                        <span>Demographics & ID</span>
                        {hasStep2Errors && (
                            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                !
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Global Error Summary Alert Banner */}
            {Object.keys(allErrors).length > 0 && (
                <div className="mb-5 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl shadow-xs">
                    <div className="flex items-start gap-2.5">
                        <span className="text-rose-500 font-bold text-base leading-none">⚠️</span>
                        <div className="flex-1">
                            <h4 className="text-xs font-extrabold text-rose-800">
                                Registration could not be submitted:
                            </h4>
                            <ul className="mt-1 list-disc list-inside text-[11px] text-rose-700 space-y-0.5">
                                {Object.entries(allErrors).map(([key, msg]) => (
                                    <li key={key}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (step1Fields.includes(key)) setStep(1);
                                                else setStep(2);
                                            }}
                                            className="underline font-medium hover:text-rose-900 text-left"
                                        >
                                            {msg}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                {/* STEP 1: Account Credentials & Contact Details */}
                {step === 1 && (
                    <div className="space-y-4 animate-fadeIn">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 mb-2">
                            Step 1: Create your portal account credentials. These will be used to log in and access your personal digital ID and event feed.
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <InputLabel htmlFor="first_name" value="First Name *" />
                                <TextInput
                                    id="first_name"
                                    name="first_name"
                                    value={data.first_name}
                                    className={`mt-1 block w-full ${allErrors.first_name ? 'border-rose-400 ring-rose-200' : ''}`}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    placeholder="e.g. Juan"
                                    required
                                />
                                <InputError message={allErrors.first_name} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="middle_name" value="Middle Name (Optional)" />
                                <TextInput
                                    id="middle_name"
                                    name="middle_name"
                                    value={data.middle_name}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('middle_name', e.target.value)}
                                    placeholder="e.g. Santos"
                                />
                                <InputError message={allErrors.middle_name} className="mt-1" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2">
                                <InputLabel htmlFor="last_name" value="Last Name *" />
                                <TextInput
                                    id="last_name"
                                    name="last_name"
                                    value={data.last_name}
                                    className={`mt-1 block w-full ${allErrors.last_name ? 'border-rose-400 ring-rose-200' : ''}`}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    placeholder="e.g. Dela Cruz"
                                    required
                                />
                                <InputError message={allErrors.last_name} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="suffix" value="Suffix" />
                                <TextInput
                                    id="suffix"
                                    name="suffix"
                                    value={data.suffix}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('suffix', e.target.value)}
                                    placeholder="Jr., III"
                                />
                                <InputError message={allErrors.suffix} className="mt-1" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="phone_number" value="Philippine Mobile Number *" />
                            <TextInput
                                id="phone_number"
                                name="phone_number"
                                value={data.phone_number}
                                className={`mt-1 block w-full ${allErrors.phone_number ? 'border-rose-400 ring-rose-200' : ''}`}
                                onChange={(e) => setData('phone_number', e.target.value)}
                                placeholder="09171234567"
                                required
                            />
                            <p className="text-[10px] text-slate-400 mt-0.5">Used for official assembly SMS reminders.</p>
                            <InputError message={allErrors.phone_number} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email Address *" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className={`mt-1 block w-full ${allErrors.email ? 'border-rose-400 ring-rose-200' : ''}`}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="juan@gmail.com"
                                required
                            />
                            <InputError message={allErrors.email} className="mt-1" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <InputLabel htmlFor="password" value="Password *" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className={`mt-1 block w-full ${allErrors.password ? 'border-rose-400 ring-rose-200' : ''}`}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Min. 8 characters"
                                    required
                                />
                                <InputError message={allErrors.password} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password *" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className={`mt-1 block w-full ${allErrors.password_confirmation ? 'border-rose-400 ring-rose-200' : ''}`}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Re-type password"
                                    required
                                />
                                <InputError message={allErrors.password_confirmation} className="mt-1" />
                            </div>
                        </div>

                        <div className="pt-3">
                            <button
                                type="button"
                                onClick={handleContinueToStep2}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-xs active:scale-95"
                            >
                                <span>Continue to Demographics (Step 2)</span>
                                <span>→</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Demographics & Katipunan ng Kabataan Profiling */}
                {step === 2 && (
                    <div className="space-y-4 animate-fadeIn">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 mb-2">
                            Step 2: Enter your official Katipunan ng Kabataan details for Barangay Tibao records and upload proof of residency or student ID.
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <InputLabel htmlFor="birthdate" value="Date of Birth *" />
                                <TextInput
                                    id="birthdate"
                                    type="date"
                                    name="birthdate"
                                    value={data.birthdate}
                                    className={`mt-1 block w-full ${allErrors.birthdate ? 'border-rose-400 ring-rose-200' : ''}`}
                                    onChange={(e) => setData('birthdate', e.target.value)}
                                    required
                                />
                                <InputError message={allErrors.birthdate} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="gender" value="Sex / Gender *" />
                                <select
                                    id="gender"
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                                <InputError message={allErrors.gender} className="mt-1" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <InputLabel htmlFor="purok_sitio" value="Purok / Sitio in Barangay Tibao *" />
                                <select
                                    id="purok_sitio"
                                    value={data.purok_sitio}
                                    onChange={(e) => setData('purok_sitio', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 text-sm font-semibold"
                                >
                                    {puroks.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                                <InputError message={allErrors.purok_sitio} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="civil_status" value="Civil Status *" />
                                <select
                                    id="civil_status"
                                    value={data.civil_status}
                                    onChange={(e) => setData('civil_status', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                >
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Widowed">Widowed</option>
                                    <option value="Separated">Separated</option>
                                    <option value="Live-in">Live-in</option>
                                </select>
                                <InputError message={allErrors.civil_status} className="mt-1" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="youth_classification" value="Youth Sector Classification *" />
                            <select
                                id="youth_classification"
                                value={data.youth_classification}
                                onChange={(e) => setData('youth_classification', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 text-sm font-medium"
                            >
                                {classifications.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <InputError message={allErrors.youth_classification} className="mt-1" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <InputLabel htmlFor="educational_attainment" value="Educational Attainment *" />
                                <select
                                    id="educational_attainment"
                                    value={data.educational_attainment}
                                    onChange={(e) => setData('educational_attainment', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 text-xs"
                                >
                                    {educationLevels.map((lvl) => (
                                        <option key={lvl} value={lvl}>{lvl}</option>
                                    ))}
                                </select>
                                <InputError message={allErrors.educational_attainment} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="work_status" value="Employment Status *" />
                                <select
                                    id="work_status"
                                    value={data.work_status}
                                    onChange={(e) => setData('work_status', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 text-xs"
                                >
                                    {workStatuses.map((ws) => (
                                        <option key={ws} value={ws}>{ws}</option>
                                    ))}
                                </select>
                                <InputError message={allErrors.work_status} className="mt-1" />
                            </div>
                        </div>

                        {/* SKILLS, TALENTS & HOBBIES SECTION (CBYDP / ABYIP Council Guidance) */}
                        <div className="bg-gradient-to-br from-indigo-50/90 via-sky-50/60 to-purple-50/70 p-4 rounded-2xl border border-indigo-200/80 shadow-xs space-y-4">
                            <div className="flex items-start gap-2.5">
                                <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs shrink-0 mt-0.5">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wide">
                                            Skills, Talents & Hobbies
                                        </h4>
                                        <span className="text-[10px] font-bold bg-indigo-200/70 text-indigo-800 px-2 py-0.5 rounded-full">
                                            CBYDP Planning Guide
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-indigo-900/80 mt-1 leading-relaxed">
                                        💡 <strong>Your passions guide our budget:</strong> Under the SK Reform Act, the Sangguniang Kabataan uses your skills and hobbies to design and fund tailored livelihood bootcamps, sports tournaments, cultural arts workshops, and disaster brigades in Barangay Tibao.
                                    </p>
                                </div>
                            </div>

                            {/* 1. Skills & Proficiencies */}
                            <div className="bg-white/90 p-3.5 rounded-xl border border-indigo-100 space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <Wrench className="w-3.5 h-3.5 text-indigo-600" />
                                        <span>Skills & Special Competencies</span>
                                    </label>
                                    <span className="text-[10px] text-slate-500">
                                        {currentSkills.length} selected
                                    </span>
                                </div>

                                <p className="text-[11px] text-slate-500">
                                    Click suggested skills below to select or add your own:
                                </p>

                                {/* Recommended Skills Pills */}
                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                    {recommendedSkills.map((sk) => {
                                        const isSelected = currentSkills.includes(sk);
                                        return (
                                            <button
                                                type="button"
                                                key={sk}
                                                onClick={() => toggleSkill(sk)}
                                                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1 active:scale-95 ${
                                                    isSelected
                                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                                        : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 border-slate-200 hover:border-indigo-300'
                                                }`}
                                            >
                                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                                <span>{sk}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Custom Skill Input */}
                                <div className="flex items-center gap-2 pt-1">
                                    <input
                                        type="text"
                                        value={customSkillInput}
                                        onChange={(e) => setCustomSkillInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addCustomSkill();
                                            }
                                        }}
                                        placeholder="Add other skill (e.g. Video Editing, Baking, Welding)..."
                                        className="text-xs w-full rounded-lg border-slate-300 py-1.5 px-3 focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={addCustomSkill}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 transition"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add</span>
                                    </button>
                                </div>

                                {/* Selected Skills Summary */}
                                {currentSkills.length > 0 && (
                                    <div className="pt-1 flex flex-wrap items-center gap-1.5">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Added:</span>
                                        {currentSkills.map((sk) => (
                                            <span
                                                key={sk}
                                                className="inline-flex items-center gap-1 bg-indigo-100/90 text-indigo-900 border border-indigo-200 text-[11px] font-medium px-2 py-0.5 rounded-md"
                                            >
                                                <span>{sk}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSkill(sk)}
                                                    className="hover:text-rose-600 p-0.5 rounded"
                                                    title={`Remove ${sk}`}
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <InputError message={allErrors.skills} className="mt-1" />
                            </div>

                            {/* 2. Hobbies, Sports & Creative Passions */}
                            <div className="bg-white/90 p-3.5 rounded-xl border border-indigo-100 space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                                        <span>Hobbies, Sports & Recreation</span>
                                    </label>
                                    <span className="text-[10px] text-slate-500">
                                        {currentHobbies.length} selected
                                    </span>
                                </div>

                                <p className="text-[11px] text-slate-500">
                                    Click suggested hobbies to select or add your favorite pastimes:
                                </p>

                                {/* Recommended Hobbies Pills */}
                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                    {recommendedHobbies.map((hb) => {
                                        const isSelected = currentHobbies.includes(hb);
                                        return (
                                            <button
                                                type="button"
                                                key={hb}
                                                onClick={() => toggleHobby(hb)}
                                                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1 active:scale-95 ${
                                                    isSelected
                                                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                                        : 'bg-slate-50 hover:bg-rose-50 text-slate-700 border-slate-200 hover:border-rose-300'
                                                }`}
                                            >
                                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                                <span>{hb}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Custom Hobby Input */}
                                <div className="flex items-center gap-2 pt-1">
                                    <input
                                        type="text"
                                        value={customHobbyInput}
                                        onChange={(e) => setCustomHobbyInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addCustomHobby();
                                            }
                                        }}
                                        placeholder="Add other hobby (e.g. Photography, Cooking, Guitar)..."
                                        className="text-xs w-full rounded-lg border-slate-300 py-1.5 px-3 focus:border-rose-500 focus:ring-rose-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={addCustomHobby}
                                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 transition"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add</span>
                                    </button>
                                </div>

                                {/* Selected Hobbies Summary */}
                                {currentHobbies.length > 0 && (
                                    <div className="pt-1 flex flex-wrap items-center gap-1.5">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Added:</span>
                                        {currentHobbies.map((hb) => (
                                            <span
                                                key={hb}
                                                className="inline-flex items-center gap-1 bg-rose-100/90 text-rose-900 border border-rose-200 text-[11px] font-medium px-2 py-0.5 rounded-md"
                                            >
                                                <span>{hb}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeHobby(hb)}
                                                    className="hover:text-rose-600 p-0.5 rounded"
                                                    title={`Remove ${hb}`}
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <InputError message={allErrors.hobbies} className="mt-1" />
                            </div>
                        </div>

                        {/* Voter checkboxes */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                            <p className="text-xs font-bold text-slate-700">Electoral & Voting Status</p>
                            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_registered_sk_voter}
                                    onChange={(e) => setData('is_registered_sk_voter', e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>Registered Katipunan ng Kabataan (SK) Voter (Ages 15–30)</span>
                            </label>

                            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_registered_national_voter}
                                    onChange={(e) => setData('is_registered_national_voter', e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>Registered National / COMELEC Voter (Ages 18+)</span>
                            </label>
                        </div>

                        {/* Verification ID Upload */}
                        <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-200 space-y-2">
                            <p className="text-xs font-bold text-indigo-900">
                                Official Verification Document
                            </p>
                            <p className="text-[11px] text-indigo-700">
                                Upload a photo of your Student ID, National ID, or Barangay Clearance to get verified by the SK Council.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                <div>
                                    <InputLabel htmlFor="id_type" value="ID Document Type *" />
                                    <select
                                        id="id_type"
                                        value={selectedIdCategory}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setSelectedIdCategory(val);
                                            if (val === 'Other Valid ID / Document') {
                                                setData('id_type', customIdType.trim() || 'Other Valid ID / Document');
                                            } else {
                                                setData('id_type', val);
                                            }
                                        }}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 text-xs font-semibold"
                                    >
                                        {idTypes.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    {selectedIdCategory === 'Other Valid ID / Document' && (
                                        <div className="mt-2 animate-fadeIn">
                                            <TextInput
                                                type="text"
                                                value={customIdType}
                                                onChange={(e) => {
                                                    setCustomIdType(e.target.value);
                                                    setData('id_type', e.target.value.trim() || 'Other Valid ID / Document');
                                                }}
                                                placeholder="Specify document name (e.g., Company ID, PWD ID)..."
                                                className="block w-full text-xs"
                                                required
                                            />
                                        </div>
                                    )}
                                    <InputError message={allErrors.id_type} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="id_photo" value="Upload Photo Proof" />
                                    <input
                                        id="id_photo"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('id_photo', e.target.files[0])}
                                        className="mt-1 block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                                    />
                                    <InputError message={allErrors.id_photo} className="mt-1" />
                                </div>
                            </div>
                        </div>

                        {/* Submission Buttons */}
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-1/3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 rounded-xl transition text-sm active:scale-95"
                            >
                                ← Back
                            </button>

                            <PrimaryButton
                                className="w-2/3 justify-center py-2.5 rounded-xl text-sm bg-indigo-600 hover:bg-indigo-700 font-bold active:scale-95"
                                disabled={processing}
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                        </svg>
                                        <span>Submitting Registration...</span>
                                    </span>
                                ) : (
                                    'Complete Registration 🎉'
                                )}
                            </PrimaryButton>
                        </div>
                    </div>
                )}
            </form>

            <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-200 pt-4">
                Already registered in Barangay Tibao?{' '}
                <Link href={route('login')} className="font-bold text-indigo-600 hover:underline">
                    Log in here
                </Link>
            </div>
        </GuestLayout>
    );
}
