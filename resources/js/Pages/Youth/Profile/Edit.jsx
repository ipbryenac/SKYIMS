import YouthLayout from '@/Layouts/YouthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Sparkles, Wrench, Heart, Plus, X, Check, Save } from 'lucide-react';

export default function YouthProfileEdit({
    user,
    youthProfile,
    puroksList = [],
    classifications = [],
    educationLevels = [],
    workStatuses = [],
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
    const [previewPhoto, setPreviewPhoto] = useState(null);
    const [customSkillInput, setCustomSkillInput] = useState('');
    const [customHobbyInput, setCustomHobbyInput] = useState('');

    const initialIdType = youthProfile?.id_type || idTypes[0];
    const isStandardIdType = idTypes.includes(initialIdType);
    const [selectedIdCategory, setSelectedIdCategory] = useState(
        isStandardIdType ? initialIdType : 'Other Valid ID / Document'
    );
    const [customIdType, setCustomIdType] = useState(
        !isStandardIdType ? initialIdType : ''
    );

    const { data, setData, post, processing, errors } = useForm({
        first_name: youthProfile?.first_name || '',
        middle_name: youthProfile?.middle_name || '',
        last_name: youthProfile?.last_name || '',
        suffix: youthProfile?.suffix || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        gender: youthProfile?.gender || 'Male',
        birthdate: youthProfile?.birthdate || '',
        civil_status: youthProfile?.civil_status || 'Single',
        purok_sitio: youthProfile?.purok_sitio || 'Purok 1',
        youth_classification: youthProfile?.youth_classification || 'In-School Youth',
        educational_attainment: youthProfile?.educational_attainment || 'High School Level',
        work_status: youthProfile?.work_status || 'Not Applicable',
        skills: youthProfile?.skills || '',
        hobbies: youthProfile?.hobbies || '',
        is_registered_sk_voter: youthProfile?.is_registered_sk_voter ?? false,
        is_registered_national_voter: youthProfile?.is_registered_national_voter ?? false,
        voted_last_sk_election: youthProfile?.voted_last_sk_election ?? false,
        id_type: youthProfile?.id_type || idTypes[0],
        id_photo: null,
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

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

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('id_photo', file);
            setPreviewPhoto(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post('/youth/profile/update');
    };

    return (
        <YouthLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Edit Profile Information</h2>
                        <p className="text-xs text-slate-500">
                            Update your Katipunan ng Kabataan databank records and contact info
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/youth/profile/digital-id"
                            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95"
                        >
                            <span>🪪</span>
                            <span>View Digital Pass</span>
                        </Link>
                        <Link
                            href="/youth/dashboard"
                            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition"
                        >
                            <span>←</span>
                            <span>Back to Dashboard</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Edit Profile - Katipunan ng Kabataan" />

            <div className="max-w-3xl mx-auto space-y-6 animate-slideUp">
                {/* Profile Overview Card with Quick Badge */}
                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200 bg-white/20 px-2.5 py-0.5 rounded-full border border-white/20">
                            Katipunan ng Kabataan Databank
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                            {youthProfile?.full_name || user?.name}
                        </h3>
                        <p className="text-xs text-indigo-100 font-mono">
                            Youth Code: <strong className="text-amber-300">{youthProfile?.youth_code || 'TIBAO-KK'}</strong> •{' '}
                            Status: <strong className="uppercase">{youthProfile?.verification_status || 'Pending'}</strong>
                        </p>
                    </div>

                    <div className="bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center flex-shrink-0">
                        <span className="text-[10px] uppercase font-bold text-indigo-200 block">Total XP</span>
                        <span className="text-2xl font-black text-amber-300">{youthProfile?.xp_points || 0} pts</span>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* SECTION 1: Personal Demographics */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                        <div className="border-b border-slate-100 pb-3">
                            <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                <span>👤</span>
                                <span>Personal Information</span>
                            </h4>
                            <p className="text-xs text-slate-500">Official name as stated in government or school records</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">First Name *</label>
                                <input
                                    type="text"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    required
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                />
                                {errors.first_name && <p className="text-rose-600 text-xs mt-1">{errors.first_name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Middle Name (Optional)</label>
                                <input
                                    type="text"
                                    value={data.middle_name}
                                    onChange={(e) => setData('middle_name', e.target.value)}
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Last Name *</label>
                                <input
                                    type="text"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    required
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                />
                                {errors.last_name && <p className="text-rose-600 text-xs mt-1">{errors.last_name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Suffix</label>
                                <input
                                    type="text"
                                    placeholder="Jr., III"
                                    value={data.suffix}
                                    onChange={(e) => setData('suffix', e.target.value)}
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Gender / Sex *</label>
                                <select
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date of Birth *</label>
                                <input
                                    type="date"
                                    value={data.birthdate}
                                    onChange={(e) => setData('birthdate', e.target.value)}
                                    required
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                />
                                {errors.birthdate && <p className="text-rose-600 text-xs mt-1">{errors.birthdate}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Civil Status *</label>
                                <select
                                    value={data.civil_status}
                                    onChange={(e) => setData('civil_status', e.target.value)}
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                >
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Widowed">Widowed</option>
                                    <option value="Separated">Separated</option>
                                    <option value="Live-in">Live-in</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Contact & Barangay Tibao Address */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                        <div className="border-b border-slate-100 pb-3">
                            <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                <span>📍</span>
                                <span>Contact Details & Barangay Tibao Location</span>
                            </h4>
                            <p className="text-xs text-slate-500">Used for SK SMS/Email alerts and purok quorum planning</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Phone Number *</label>
                                <input
                                    type="text"
                                    value={data.phone_number}
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                    placeholder="e.g. 09123456789"
                                    required
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                />
                                {errors.phone_number && <p className="text-rose-600 text-xs mt-1">{errors.phone_number}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                />
                                {errors.email && <p className="text-rose-600 text-xs mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Purok / Sitio in Tibao *</label>
                                <select
                                    value={data.purok_sitio}
                                    onChange={(e) => setData('purok_sitio', e.target.value)}
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                >
                                    {puroksList.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Barangay</label>
                                <input
                                    type="text"
                                    value="Barangay Tibao"
                                    disabled
                                    className="w-full text-xs rounded-xl border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Municipality & Province</label>
                                <input
                                    type="text"
                                    value="Mlang, Cotabato"
                                    disabled
                                    className="w-full text-xs rounded-xl border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: Katipunan ng Kabataan Sectoral Profile */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                        <div className="border-b border-slate-100 pb-3">
                            <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                <span>🎓</span>
                                <span>Sector, Education & Employment</span>
                            </h4>
                            <p className="text-xs text-slate-500">Official NYC classification to target youth opportunities</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Youth Sector Classification *</label>
                                <select
                                    value={data.youth_classification}
                                    onChange={(e) => setData('youth_classification', e.target.value)}
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                >
                                    {classifications.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Educational Attainment *</label>
                                <select
                                    value={data.educational_attainment}
                                    onChange={(e) => setData('educational_attainment', e.target.value)}
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                >
                                    {educationLevels.map((lvl) => (
                                        <option key={lvl} value={lvl}>{lvl}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Employment / Work Status *</label>
                                <select
                                    value={data.work_status}
                                    onChange={(e) => setData('work_status', e.target.value)}
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                >
                                    {workStatuses.map((ws) => (
                                        <option key={ws} value={ws}>{ws}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Electoral & Voting Status */}
                        <div className="pt-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Electoral Participation:</label>
                            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_registered_sk_voter}
                                        onChange={(e) => setData('is_registered_sk_voter', e.target.checked)}
                                        className="rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="font-semibold">Registered Katipunan ng Kabataan (SK) Voter (Ages 15–30)</span>
                                </label>

                                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_registered_national_voter}
                                        onChange={(e) => setData('is_registered_national_voter', e.target.checked)}
                                        className="rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="font-semibold">Registered National / COMELEC Voter (Ages 18+)</span>
                                </label>

                                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.voted_last_sk_election}
                                        onChange={(e) => setData('voted_last_sk_election', e.target.checked)}
                                        className="rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="font-semibold">Voted in the Last Barangay / SK Elections</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: Talents, Skills & Community Passions (CBYDP Guidance) */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                        <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
                            <div>
                                <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    <span>Skills, Talents & Hobbies</span>
                                </h4>
                                <p className="text-xs text-slate-500">
                                    Informs the SK Council's CBYDP budget allocations for trainings, sports tournaments, and livelihood projects.
                                </p>
                            </div>
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                                Council Planning Input
                            </span>
                        </div>

                        {/* Skills Block */}
                        <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <Wrench className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>Skills & Special Competencies</span>
                                </label>
                                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                                    {currentSkills.length} selected
                                </span>
                            </div>

                            <p className="text-[11px] text-slate-600">
                                Select from popular skills in Barangay Tibao or add your custom expertise:
                            </p>

                            {/* Recommendations */}
                            <div className="flex flex-wrap gap-1.5">
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
                                                    : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-200 hover:border-indigo-300'
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
                                    placeholder="Add custom skill (e.g. Electrical wiring, Web design)..."
                                    className="text-xs w-full rounded-xl border-slate-300 py-1.5 px-3 focus:border-indigo-500 focus:ring-indigo-500 bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={addCustomSkill}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl shrink-0 flex items-center gap-1 transition"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add</span>
                                </button>
                            </div>

                            {/* Active Skills Badges */}
                            {currentSkills.length > 0 && (
                                <div className="pt-1 flex flex-wrap items-center gap-1.5">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active:</span>
                                    {currentSkills.map((sk) => (
                                        <span
                                            key={sk}
                                            className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-900 border border-indigo-200 text-[11px] font-medium px-2.5 py-0.5 rounded-lg"
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
                            {errors.skills && <p className="text-rose-600 text-xs mt-1">{errors.skills}</p>}
                        </div>

                        {/* Hobbies Block */}
                        <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                                    <span>Hobbies, Sports & Recreation</span>
                                </label>
                                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                                    {currentHobbies.length} selected
                                </span>
                            </div>

                            <p className="text-[11px] text-slate-600">
                                Select from popular recreational activities or add your favorite sports and creative arts:
                            </p>

                            {/* Recommendations */}
                            <div className="flex flex-wrap gap-1.5">
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
                                                    : 'bg-white hover:bg-rose-50 text-slate-700 border-slate-200 hover:border-rose-300'
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
                                    placeholder="Add custom hobby (e.g. Acoustic guitar, Chess)..."
                                    className="text-xs w-full rounded-xl border-slate-300 py-1.5 px-3 focus:border-rose-500 focus:ring-rose-500 bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={addCustomHobby}
                                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-2 rounded-xl shrink-0 flex items-center gap-1 transition"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add</span>
                                </button>
                            </div>

                            {/* Active Hobbies Badges */}
                            {currentHobbies.length > 0 && (
                                <div className="pt-1 flex flex-wrap items-center gap-1.5">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active:</span>
                                    {currentHobbies.map((hb) => (
                                        <span
                                            key={hb}
                                            className="inline-flex items-center gap-1 bg-rose-100 text-rose-900 border border-rose-200 text-[11px] font-medium px-2.5 py-0.5 rounded-lg"
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
                            {errors.hobbies && <p className="text-rose-600 text-xs mt-1">{errors.hobbies}</p>}
                        </div>
                    </div>

                    {/* SECTION 5: Verification ID Document Re-upload */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                        <div className="border-b border-slate-100 pb-3">
                            <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                <span>🪪</span>
                                <span>Verification Document Proof</span>
                            </h4>
                            <p className="text-xs text-slate-500">Student ID, Barangay Clearance, PhilSys, or Birth Certificate</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                    Document Type *
                                </label>
                                <select
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
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600 font-semibold text-slate-800"
                                >
                                    {idTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                {selectedIdCategory === 'Other Valid ID / Document' && (
                                    <div className="mt-2 animate-fadeIn">
                                        <input
                                            type="text"
                                            value={customIdType}
                                            onChange={(e) => {
                                                setCustomIdType(e.target.value);
                                                setData('id_type', e.target.value.trim() || 'Other Valid ID / Document');
                                            }}
                                            placeholder="Specify document name (e.g. Employee ID, PWD ID)..."
                                            className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                            required
                                        />
                                    </div>
                                )}
                                {errors.id_type && <p className="text-rose-600 text-xs mt-1">{errors.id_type}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                    Upload New ID Photo (Max 5MB)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                />
                                {errors.id_photo && <p className="text-rose-600 text-xs mt-1">{errors.id_photo}</p>}
                            </div>
                        </div>

                        {/* ID Photo Preview */}
                        {(previewPhoto || youthProfile?.id_photo_path) && (
                            <div className="pt-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                                    Document On File:
                                </span>
                                <img
                                    src={previewPhoto || `/storage/${youthProfile.id_photo_path}`}
                                    alt="Verification Proof"
                                    className="max-h-40 rounded-2xl border border-slate-200 object-cover shadow-xs"
                                />
                            </div>
                        )}
                    </div>

                    {/* SECTION 5: Security & Password Update (Optional) */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                        <div className="border-b border-slate-100 pb-3">
                            <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                <span>🔒</span>
                                <span>Account Password (Optional)</span>
                            </h4>
                            <p className="text-xs text-slate-500">Leave blank if you do not wish to change your password</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                />
                                {errors.current_password && <p className="text-rose-600 text-xs mt-1">{errors.current_password}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={data.new_password}
                                    onChange={(e) => setData('new_password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                />
                                {errors.new_password && <p className="text-rose-600 text-xs mt-1">{errors.new_password}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={data.new_password_confirmation}
                                    onChange={(e) => setData('new_password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-600 focus:ring-indigo-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <Link
                            href="/youth/dashboard"
                            className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl transition"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-3 rounded-2xl text-xs shadow-md transition active:scale-95 disabled:opacity-50 flex items-center gap-2"
                        >
                            <span>{processing ? 'Saving Changes...' : 'Save Profile Information'}</span>
                            <span>✓</span>
                        </button>
                    </div>
                </form>
            </div>
        </YouthLayout>
    );
}

