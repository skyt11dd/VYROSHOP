export function ProductIllustration({ category, name }: { category?: string; name?: string }) {
  const catLower = (category || name || '').toLowerCase();

  // 1. Liquids (Рідини)
  if (catLower.includes('рідин') || catLower.includes('liquid') || catLower.includes('salt') || catLower.includes('chaser') || catLower.includes('octobar')) {
    return (
      <svg width="72" height="110" viewBox="0 0 72 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Dropper Cap */}
        <rect x="30" y="2" width="12" height="14" rx="3" fill="#27272a" />
        <rect x="26" y="16" width="20" height="10" rx="2" fill="#3f3f46" />
        <line x1="28" y1="21" x2="44" y2="21" stroke="#71717a" strokeWidth="1" />
        {/* Bottle Body */}
        <path d="M22 28C16 32 14 38 14 46V98C14 103 18 107 23 107H49C54 107 58 103 58 98V46C58 38 56 32 50 28H22Z" fill="#18181b" />
        {/* Minimal Label */}
        <rect x="18" y="48" width="36" height="44" rx="2" fill="#ffffff" fillOpacity="0.08" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="1" />
        <line x1="24" y1="58" x2="48" y2="58" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <line x1="28" y1="66" x2="44" y2="66" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="30" y1="74" x2="42" y2="74" stroke="#a1a1aa" strokeWidth="1" strokeLinecap="round" />
        <circle cx="36" cy="84" r="2.5" fill="#ffffff" />
      </svg>
    );
  }

  // 2. Disposables (Одноразки)
  if (catLower.includes('однораз') || catLower.includes('disposable') || catLower.includes('elf') || catLower.includes('vozol')) {
    return (
      <svg width="44" height="116" viewBox="0 0 44 116" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Mouthpiece */}
        <path d="M14 6C14 2.5 17 0 22 0C27 0 30 2.5 30 6V18H14V6Z" fill="#27272a" />
        {/* Main Stick Chassis */}
        <rect x="8" y="18" width="28" height="92" rx="6" fill="#18181b" />
        {/* Minimal accent line */}
        <line x1="16" y1="36" x2="28" y2="36" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="44" x2="26" y2="44" stroke="#71717a" strokeWidth="1" strokeLinecap="round" />
        {/* LED Light Ring at bottom */}
        <path d="M12 104H32C33.1 104 34 104.9 34 106V107C34 108.1 33.1 109 32 109H12C10.9 109 10 108.1 10 107V106C10 104.9 10.9 104 12 104Z" fill="#e4e4e7" />
      </svg>
    );
  }

  // 3. Cartridges (Картриджі)
  if (catLower.includes('картридж') || catLower.includes('cartridge') || catLower.includes('coil')) {
    return (
      <svg width="60" height="90" viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Mouthpiece */}
        <path d="M18 10C18 4 23 0 30 0C37 0 42 4 42 10V22H18V10Z" fill="#27272a" />
        {/* Transparent Pod Chamber */}
        <rect x="12" y="22" width="36" height="52" rx="4" fill="#f4f4f5" stroke="#d4d4d8" strokeWidth="1.5" />
        {/* Internal Mesh Coil */}
        <rect x="24" y="32" width="12" height="32" rx="2" fill="#18181b" />
        <line x1="26" y1="42" x2="34" y2="42" stroke="#e4e4e7" strokeWidth="1" />
        <line x1="26" y1="48" x2="34" y2="48" stroke="#e4e4e7" strokeWidth="1" />
        <line x1="26" y1="54" x2="34" y2="54" stroke="#e4e4e7" strokeWidth="1" />
        {/* Magnetic Gold Contacts */}
        <rect x="10" y="74" width="40" height="12" rx="2" fill="#27272a" />
        <circle cx="20" cy="80" r="2.5" fill="#eab308" />
        <circle cx="40" cy="80" r="2.5" fill="#eab308" />
      </svg>
    );
  }

  // 4. Default: POD System (Matching the VYRO pod device shape!)
  return (
    <svg width="44" height="120" viewBox="0 0 44 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Translucent Pod Cartridge */}
      <path d="M13 8C13 3 17 0 22 0C27 0 31 3 31 8V24H13V8Z" fill="#3f3f46" opacity="0.85" />
      <line x1="17" y1="12" x2="27" y2="12" stroke="#71717a" strokeWidth="1" strokeLinecap="round" />
      {/* Device Body Chassis */}
      <rect x="9" y="24" width="26" height="92" rx="5" fill="#18181b" />
      {/* Vertical LED slit (signature VYRO detail!) */}
      <rect x="20.5" y="44" width="3" height="16" rx="1.5" fill="#ffffff" />
      {/* Minimal Brand Wordmark */}
      <rect x="19" y="98" width="6" height="2" rx="1" fill="#52525b" />
    </svg>
  );
}
