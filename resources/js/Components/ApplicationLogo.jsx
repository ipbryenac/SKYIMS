export default function ApplicationLogo({ className = 'h-12 w-12', ...props }) {
    return (
        <img
            src="/images/skyims-logo.jpg"
            alt="SKYIMS Barangay Tibao Logo"
            className={`object-contain rounded-full shadow-md border border-white/20 bg-white ${className}`}
            {...props}
        />
    );
}
