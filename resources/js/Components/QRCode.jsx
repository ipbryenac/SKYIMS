import { useEffect, useRef, useState } from 'react';

export default function QRCode({ value, size = 200, className = '' }) {
    const [imgLoaded, setImgLoaded] = useState(false);
    const encodedValue = encodeURIComponent(value || 'SKYIMS-TIBAO');
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodedValue}`;

    return (
        <div
            className={`relative flex items-center justify-center bg-white p-2 rounded-2xl shadow-inner border border-slate-200 overflow-hidden ${className}`}
            style={{ width: size, height: size }}
        >
            {/* Real High-Resolution QR Server Image */}
            <img
                src={qrUrl}
                crossOrigin="anonymous"
                alt={`QR Code: ${value}`}
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                    imgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
            />

            {/* Offline / Loading SVG Placeholder Matrix */}
            {!imgLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-50 text-center">
                    <svg className="w-16 h-16 text-indigo-600 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
                        <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
                        <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
                        <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3v1h-3zM20 14h1v3h-1z" fill="currentColor" />
                    </svg>
                    <span className="text-[10px] text-slate-500 font-bold mt-2 font-mono truncate max-w-full">
                        {value}
                    </span>
                </div>
            )}
        </div>
    );
}

