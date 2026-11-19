import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode';
import { AlertCircle, Camera, CameraOff, CheckCircle2, RefreshCw, Smartphone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function AdminAttendanceScanner({
    events = [],
    selectedEventId,
    recentAttendances = [],
}) {
    const [currentEventId, setCurrentEventId] = useState(selectedEventId || (events[0]?.id ?? ''));
    const [scanCode, setScanCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [logs, setLogs] = useState(recentAttendances);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraStarting, setCameraStarting] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [cameraFacing, setCameraFacing] = useState('environment'); // 'environment' | 'user'
    const inputRef = useRef(null);
    const scannerRef = useRef(null);
    const lastScannedRef = useRef({ code: '', time: 0 });

    const playBeep = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
            osc.start();
            osc.stop(ctx.currentTime + 0.12);
        } catch {
            // Audio blocked
        }
    };

    const stopCamera = async () => {
        if (scannerRef.current) {
            try {
                if (scannerRef.current.isScanning) {
                    await scannerRef.current.stop();
                }
                scannerRef.current.clear();
            } catch (e) {
                console.warn('Error stopping scanner:', e);
            }
            scannerRef.current = null;
        }
        setIsCameraActive(false);
        setCameraStarting(false);
    };

    const startCamera = async (facing = cameraFacing) => {
        setCameraError(null);
        setCameraStarting(true);
        // Step 1: Immediately activate container in DOM so it has real clientWidth & clientHeight
        setIsCameraActive(true);

        // Step 2: Yield to browser rendering loop to ensure DOM layout has calculated container dimensions
        await new Promise((resolve) => setTimeout(resolve, 150));

        try {
            if (scannerRef.current) {
                await stopCamera();
                setIsCameraActive(true);
                await new Promise((resolve) => setTimeout(resolve, 100));
            }

            const html5QrCode = new Html5Qrcode('qr-reader-viewport');
            scannerRef.current = html5QrCode;

            const qrCodeSuccessCallback = (decodedText) => {
                const now = Date.now();
                if (
                    lastScannedRef.current.code === decodedText &&
                    now - lastScannedRef.current.time < 3500
                ) {
                    return;
                }

                lastScannedRef.current = { code: decodedText, time: now };

                if (navigator.vibrate) {
                    navigator.vibrate(200);
                }
                playBeep();

                processScan(decodedText);
            };

            const config = {
                fps: 15,
                qrbox: (viewfinderWidth, viewfinderHeight) => {
                    const minDim = Math.min(viewfinderWidth || 300, viewfinderHeight || 300);
                    const size = Math.max(Math.floor(minDim * 0.75), 200);
                    return {
                        width: size,
                        height: size,
                    };
                },
                aspectRatio: 1.0,
                disableFlip: false,
            };

            const cameraConfig = facing === 'user' ? { facingMode: 'user' } : { facingMode: 'environment' };

            try {
                await html5QrCode.start(
                    cameraConfig,
                    config,
                    qrCodeSuccessCallback,
                    () => {}
                );
            } catch (primaryErr) {
                console.warn('Primary camera mode failed, attempting fallback camera:', primaryErr);
                const fallbackFacing = facing === 'user' ? 'environment' : 'user';
                await html5QrCode.start(
                    { facingMode: fallbackFacing },
                    config,
                    qrCodeSuccessCallback,
                    () => {}
                );
                setCameraFacing(fallbackFacing);
            }

            // Step 3: Patch video element specifically for iOS Safari WebKit inline playback
            const patchVideoElement = () => {
                const video = document.querySelector('#qr-reader-viewport video');
                if (video) {
                    video.setAttribute('playsinline', 'true');
                    video.setAttribute('webkit-playsinline', 'true');
                    video.setAttribute('muted', 'true');
                    video.setAttribute('autoplay', 'true');
                    video.style.width = '100%';
                    video.style.height = '100%';
                    video.style.objectFit = 'cover';
                    video.style.borderRadius = '1rem';
                    video.style.display = 'block';
                    video.play().catch(() => {});
                }
            };

            patchVideoElement();
            setTimeout(patchVideoElement, 200);
            setTimeout(patchVideoElement, 600);

        } catch (err) {
            console.error('Failed to start camera:', err);
            setCameraError(
                err?.message ||
                'Unable to access camera. Please allow camera permissions in Safari / Chrome settings or check if another app is using the camera.'
            );
            setIsCameraActive(false);
        } finally {
            setCameraStarting(false);
        }
    };

    const flipCamera = async () => {
        const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
        setCameraFacing(nextFacing);
        await stopCamera();
        await startCamera(nextFacing);
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                if (scannerRef.current.isScanning) {
                    scannerRef.current.stop().catch(() => {});
                }
                scannerRef.current.clear();
            }
        };
    }, []);

    // Keep scanner input focused for fast barcode / QR scanner wedge entry
    useEffect(() => {
        inputRef.current?.focus();
    }, [scanResult, errorMessage]);

    const handleEventChange = (eventId) => {
        setCurrentEventId(eventId);
        setScanResult(null);
        setErrorMessage(null);
        router.get('/admin/attendance/scanner', { event_id: eventId }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const processScan = async (codeToScan) => {
        const code = (codeToScan || scanCode).trim();
        if (!code || !currentEventId) return;

        setIsProcessing(true);
        setScanResult(null);
        setErrorMessage(null);

        try {
            const response = await axios.post('/admin/attendance/scan', {
                event_id: currentEventId,
                code: code,
            });

            if (response.data?.success) {
                setScanResult(response.data);
                setScanCode('');

                // Prepend to live check-in log
                const newLog = {
                    id: Date.now(),
                    name: response.data.youth.name,
                    youth_code: response.data.youth.code,
                    purok: response.data.youth.purok,
                    scanned_at: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }),
                    method: 'QR_SCAN',
                };
                setLogs((prev) => [newLog, ...prev.slice(0, 9)]);
            }
        } catch (err) {
            if (err.response?.status === 409) {
                // Already checked in
                setErrorMessage({
                    title: 'Already Checked In',
                    message: err.response.data.message,
                    type: 'warning',
                });
            } else {
                setErrorMessage({
                    title: 'Scan Failed',
                    message: err.response?.data?.message || 'Unrecognized QR code. Please verify against Katipunan ng Kabataan databank.',
                    type: 'error',
                });
            }
            setScanCode('');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        processScan();
    };

    const currentEvent = events.find((e) => e.id === Number(currentEventId));

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                                On-Site QR Attendance Terminal
                            </h2>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Barangay Tibao Multi-Purpose Gym / Assembly Entrance Scanner
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                            Terminal: SK Council Check-In Active
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="QR Attendance Scanner" />

            <div className="space-y-6 animate-slideUp">
                {/* Event Selector Banner */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                            Current Event Gate
                        </span>
                        <h3 className="font-black text-slate-900 text-base">
                            {currentEvent ? currentEvent.title : 'Select an Event to Admit Youth'}
                        </h3>
                        <p className="text-xs text-slate-500">
                            Venue: <strong>{currentEvent?.venue || 'Barangay Tibao'}</strong> • Reward:{' '}
                            <strong className="text-amber-600">+{currentEvent?.points_reward || 50} XP</strong>
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-600 whitespace-nowrap">
                            Change Event:
                        </label>
                        <select
                            value={currentEventId}
                            onChange={(e) => handleEventChange(e.target.value)}
                            className="text-xs font-bold border-slate-200 rounded-xl bg-slate-50 focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3 text-slate-800"
                        >
                            {events.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.title} (+{e.points_reward} XP)
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Scanner Terminal (Left) */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Terminal Box */}
                        <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl text-white space-y-6 relative overflow-hidden">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                                        Scanner Sensor Ready
                                    </span>
                                </div>
                                <span className="text-[11px] text-slate-400">
                                    Auto-detects USB, Camera & 2D Barcode Pass
                                </span>
                            </div>

                            {/* Scoped CSS to ensure Html5Qrcode video expands properly on all mobile viewports & iOS Safari */}
                            <style>{`
                                #qr-reader-viewport {
                                    width: 100% !important;
                                    max-width: 360px !important;
                                    min-height: 280px !important;
                                    aspect-ratio: 1 / 1 !important;
                                    position: relative !important;
                                    background-color: #000000 !important;
                                    border-radius: 1.25rem !important;
                                    border: none !important;
                                    overflow: hidden !important;
                                }
                                #qr-reader-viewport video {
                                    width: 100% !important;
                                    height: 100% !important;
                                    min-height: 280px !important;
                                    object-fit: cover !important;
                                    border-radius: 1.25rem !important;
                                    display: block !important;
                                }
                                #qr-reader-viewport canvas {
                                    display: none !important;
                                }
                                #qr-reader-viewport #qr-shaded-region {
                                    border-radius: 1.25rem !important;
                                }
                                #qr-reader-viewport img[alt="Info icon"] {
                                    display: none !important;
                                }
                            `}</style>

                            {/* Live Camera Viewfinder or Standby */}
                            <div className="relative border-2 border-dashed border-indigo-500/40 rounded-3xl p-4 flex flex-col items-center justify-center bg-slate-900/90 min-h-[320px] overflow-hidden">
                                {/* Corner Reticles */}
                                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-indigo-400 rounded-tl-lg pointer-events-none z-20" />
                                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-indigo-400 rounded-tr-lg pointer-events-none z-20" />
                                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-indigo-400 rounded-bl-lg pointer-events-none z-20" />
                                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-indigo-400 rounded-br-lg pointer-events-none z-20" />

                                {/* Standby UI (shown when camera is OFF) */}
                                {!isCameraActive && (
                                    <div className="text-center space-y-3 py-6 z-10 animate-fadeIn">
                                        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30">
                                            <Camera className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-white">Live Phone Camera Scanner</p>
                                            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                                                Tap below to open your phone camera and scan youth QR passes.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => startCamera(cameraFacing)}
                                            disabled={cameraStarting}
                                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-50"
                                        >
                                            {cameraStarting ? (
                                                <>
                                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                                    <span>Opening Camera...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Camera className="w-4 h-4" />
                                                    <span>Start Phone Camera</span>
                                                </>
                                            )}
                                        </button>

                                        {cameraError && (
                                            <p className="text-xs text-rose-400 max-w-xs mx-auto pt-1 font-medium">
                                                ⚠️ {cameraError}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Camera Viewport Container (keeps element mounted for Html5Qrcode) */}
                                <div
                                    id="qr-reader-viewport"
                                    className={`w-full max-w-sm aspect-square min-h-[280px] rounded-2xl overflow-hidden bg-black relative flex items-center justify-center ${
                                        isCameraActive ? 'block' : 'hidden'
                                    }`}
                                />

                                {/* Active Camera Bar Controls */}
                                {isCameraActive && (
                                    <div className="w-full max-w-sm flex items-center justify-between px-3.5 py-2.5 bg-slate-950/90 backdrop-blur-xs rounded-xl mt-3 border border-slate-800 z-20">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="text-xs font-bold text-emerald-400">
                                                {cameraFacing === 'user' ? 'Front Camera Live' : 'Back Camera Live'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={flipCamera}
                                                className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-2.5 py-1.5 rounded-lg text-xs transition active:scale-95 border border-slate-700"
                                                title="Switch between front and back camera"
                                            >
                                                <RefreshCw className="w-3.5 h-3.5" />
                                                <span className="hidden sm:inline">Flip</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={stopCamera}
                                                className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition active:scale-95"
                                            >
                                                <CameraOff className="w-3.5 h-3.5" />
                                                <span>Stop</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Manual / Scanner Code Input Form */}
                            <form onSubmit={handleFormSubmit} className="space-y-3">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                        Scan / Enter Youth Code or Ticket UUID:
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={scanCode}
                                            onChange={(e) => setScanCode(e.target.value)}
                                            placeholder="e.g. TIBAO-2026-00001 or scan QR directly"
                                            disabled={isProcessing}
                                            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 font-mono focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isProcessing || !scanCode.trim()}
                                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-xs transition active:scale-95 disabled:opacity-50"
                                        >
                                            {isProcessing ? 'Verifying...' : 'Check In'}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Demo Quick-Scan Helper Buttons */}
                            <div className="pt-4 border-t border-slate-800">
                                <p className="text-[11px] text-slate-400 font-semibold mb-2">
                                    Instant Demo Simulators (Click to Test Live Attendance):
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        disabled={isProcessing}
                                        onClick={() => processScan('TIBAO-2026-00001')}
                                        className="bg-slate-800 hover:bg-indigo-900/60 text-slate-200 hover:text-white border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono transition"
                                    >
                                        Scan Alyssa (TIBAO-2026-00001)
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isProcessing}
                                        onClick={() => processScan('TIBAO-2026-00002')}
                                        className="bg-slate-800 hover:bg-indigo-900/60 text-slate-200 hover:text-white border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono transition"
                                    >
                                        Scan Kenneth (TIBAO-2026-00002)
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Scan Result Feedback Card */}
                        {scanResult && (
                            <div className="bg-emerald-50 border-2 border-emerald-400 p-6 rounded-3xl shadow-lg animate-fadeIn text-emerald-950 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl font-black shadow-md">
                                        ✓
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-200 px-2 py-0.5 rounded-full">
                                            Admitted & Verified
                                        </span>
                                        <h4 className="text-xl font-black mt-0.5">{scanResult.youth.name}</h4>
                                        <p className="text-xs font-mono font-bold text-emerald-800">
                                            {scanResult.youth.code} • {scanResult.youth.purok}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-3 bg-white/80 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="text-[10px] uppercase font-bold text-slate-500">Earned XP</span>
                                        <p className="text-lg font-black text-amber-600">
                                            +{scanResult.youth.points_earned} XP Points
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] uppercase font-bold text-slate-500">New Total</span>
                                        <p className="text-lg font-black text-slate-800">
                                            {scanResult.youth.total_xp} XP
                                        </p>
                                    </div>
                                </div>

                                {scanResult.new_badges && scanResult.new_badges.length > 0 && (
                                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300 text-xs">
                                        <p className="font-bold text-amber-900 flex items-center gap-1.5">
                                            <span>🏆</span>
                                            <span>New Badges Unlocked for {scanResult.youth.name}:</span>
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-1.5">
                                            {scanResult.new_badges.map((bName, i) => (
                                                <span
                                                    key={i}
                                                    className="bg-amber-200 text-amber-900 font-bold px-2.5 py-0.5 rounded-full text-[11px]"
                                                >
                                                    {bName}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Error / Warning Alert */}
                        {errorMessage && (
                            <div
                                className={`p-5 rounded-3xl border shadow-sm animate-fadeIn ${
                                    errorMessage.type === 'warning'
                                        ? 'bg-amber-50 border-amber-300 text-amber-950'
                                        : 'bg-rose-50 border-rose-300 text-rose-950'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">
                                        {errorMessage.type === 'warning' ? '⚠️' : '❌'}
                                    </span>
                                    <div>
                                        <h5 className="font-black text-sm">{errorMessage.title}</h5>
                                        <p className="text-xs mt-0.5 leading-relaxed">{errorMessage.message}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Live Recent Check-Ins Log (Right) */}
                    <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-black text-slate-900 text-base">Live Entrance Stream</h3>
                                <p className="text-xs text-slate-500">Real-time attendance logs</p>
                            </div>
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                Live
                            </span>
                        </div>

                        <div className="space-y-2">
                            {logs.length === 0 ? (
                                <p className="text-xs text-slate-400 py-8 text-center">
                                    No youth checked in yet for this event. Ready to scan!
                                </p>
                            ) : (
                                logs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs hover:bg-slate-100 transition"
                                    >
                                        <div>
                                            <p className="font-bold text-slate-900">{log.name}</p>
                                            <p className="text-[11px] text-slate-500 font-mono">
                                                {log.youth_code} • {log.purok}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-mono text-emerald-700 font-bold block">
                                                {log.scanned_at}
                                            </span>
                                            <span className="text-[9px] text-slate-400 font-medium">
                                                {log.method}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

