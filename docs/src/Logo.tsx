export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer ring */}
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="4 3"
        className="opacity-30"
      />
      {/* Inner ring */}
      <circle
        cx="16"
        cy="16"
        r="9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="3 4"
        className="opacity-20"
      />
      {/* Center dot */}
      <circle
        cx="16"
        cy="16"
        r="2"
        fill="currentColor"
        className="opacity-80"
      />
      {/* Orbiting dots */}
      <circle cx="16" cy="2" r="1.8" fill="currentColor" className="opacity-90" />
      <circle cx="30" cy="16" r="1.8" fill="currentColor" className="opacity-70" />
      <circle cx="16" cy="30" r="1.8" fill="currentColor" className="opacity-50" />
      <circle cx="2" cy="16" r="1.8" fill="currentColor" className="opacity-60" />
      {/* Arc connecting top and right dots (rotation path) */}
      <path
        d="M 17.5 3.5 A 14 14 0 0 1 29.5 15"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        className="opacity-40"
        fill="none"
      />
      <path
        d="M 29.5 17 A 14 14 0 0 1 17.5 28.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        className="opacity-40"
        fill="none"
      />
      <path
        d="M 14.5 28.5 A 14 14 0 0 1 2.5 17"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        className="opacity-40"
        fill="none"
      />
      <path
        d="M 2.5 15 A 14 14 0 0 1 14.5 3.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        className="opacity-40"
        fill="none"
      />
    </svg>
  );
}

export function LogoFull({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.3" strokeDasharray="3 2.5" className="opacity-30" />
      <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" className="opacity-20" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" className="opacity-80" />
      <circle cx="12" cy="2" r="1.3" fill="currentColor" className="opacity-90" />
      <circle cx="22" cy="12" r="1.3" fill="currentColor" className="opacity-70" />
      <circle cx="12" cy="22" r="1.3" fill="currentColor" className="opacity-50" />
      <circle cx="2" cy="12" r="1.3" fill="currentColor" className="opacity-60" />
    </svg>
  );
}
