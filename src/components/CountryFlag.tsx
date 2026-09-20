import React from 'react';

interface CountryFlagProps {
  code: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  code,
  className = '',
  size = 'md',
}) => {
  const c = code.toUpperCase();

  const sizeClasses = {
    sm: 'w-4 h-3 text-[9px]',
    md: 'w-6 h-4 text-xs',
    lg: 'w-8 h-5.5 text-sm',
    xl: 'w-10 h-7 text-base',
  }[size];

  // Crisp SVG flags
  const renderFlagContent = () => {
    switch (c) {
      case 'FR': // France: Blue, White, Red vertical
        return (
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
            <rect width="1" height="2" fill="#002654" />
            <rect width="1" height="2" x="1" fill="#FFFFFF" />
            <rect width="1" height="2" x="2" fill="#CE1126" />
          </svg>
        );

      case 'DE': // Germany: Black, Red, Gold horizontal
        return (
          <svg viewBox="0 0 5 3" className="w-full h-full object-cover">
            <rect width="5" height="1" fill="#000000" />
            <rect width="5" height="1" y="1" fill="#DD0000" />
            <rect width="5" height="1" y="2" fill="#FFCC00" />
          </svg>
        );

      case 'IT': // Italy: Green, White, Red vertical
        return (
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
            <rect width="1" height="2" fill="#009246" />
            <rect width="1" height="2" x="1" fill="#FFFFFF" />
            <rect width="1" height="2" x="2" fill="#CE2B37" />
          </svg>
        );

      case 'ES': // Spain: Red, Yellow, Red horizontal
        return (
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
            <rect width="3" height="0.5" fill="#AA151B" />
            <rect width="3" height="1" y="0.5" fill="#F1BF00" />
            <rect width="3" height="0.5" y="1.5" fill="#AA151B" />
            <circle cx="0.9" cy="1" r="0.25" fill="#AA151B" />
          </svg>
        );

      case 'GB': // UK Union Jack
        return (
          <svg viewBox="0 0 60 30" className="w-full h-full object-cover">
            <clipPath id="s">
              <path d="M0,0 v30 h60 v-30 z"/>
            </clipPath>
            <clipPath id="t">
              <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
            </clipPath>
            <g clipPath="url(#s)">
              <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
              <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
              <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
              <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
              <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
            </g>
          </svg>
        );

      case 'IE': // Ireland: Green, White, Orange vertical
        return (
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
            <rect width="1" height="2" fill="#169B62" />
            <rect width="1" height="2" x="1" fill="#FFFFFF" />
            <rect width="1" height="2" x="2" fill="#FF883E" />
          </svg>
        );

      case 'GR': // Greece: 9 blue/white stripes + cross
        return (
          <svg viewBox="0 0 27 18" className="w-full h-full object-cover">
            <rect width="27" height="18" fill="#0D5EAF" />
            <rect y="2" width="27" height="2" fill="#fff" />
            <rect y="6" width="27" height="2" fill="#fff" />
            <rect y="10" width="27" height="2" fill="#fff" />
            <rect y="14" width="27" height="2" fill="#fff" />
            <rect width="10" height="10" fill="#0D5EAF" />
            <rect x="4" width="2" height="10" fill="#fff" />
            <rect y="4" width="10" height="2" fill="#fff" />
          </svg>
        );

      case 'PT': // Portugal: Green/Red with emblem
        return (
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
            <rect width="1.2" height="2" fill="#046A38" />
            <rect width="1.8" height="2" x="1.2" fill="#DA291C" />
            <circle cx="1.2" cy="1" r="0.35" fill="#FFE900" />
            <circle cx="1.2" cy="1" r="0.22" fill="#FFFFFF" stroke="#DA291C" strokeWidth="0.05" />
          </svg>
        );

      case 'NL': // Netherlands: Red, White, Blue horizontal
        return (
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
            <rect width="3" height="0.67" fill="#AE1C28" />
            <rect width="3" height="0.67" y="0.67" fill="#FFFFFF" />
            <rect width="3" height="0.66" y="1.34" fill="#21468B" />
          </svg>
        );

      case 'PL': // Poland: White, Red horizontal
        return (
          <svg viewBox="0 0 8 5" className="w-full h-full object-cover">
            <rect width="8" height="2.5" fill="#FFFFFF" />
            <rect width="8" height="2.5" y="2.5" fill="#DC143C" />
          </svg>
        );

      case 'SE': // Sweden: Blue with Yellow Nordic cross
        return (
          <svg viewBox="0 0 16 10" className="w-full h-full object-cover">
            <rect width="16" height="10" fill="#006AA7" />
            <rect x="5" width="2" height="10" fill="#FECC00" />
            <rect y="4" width="16" height="2" fill="#FECC00" />
          </svg>
        );

      case 'FI': // Finland: White with Blue Nordic cross
        return (
          <svg viewBox="0 0 18 11" className="w-full h-full object-cover">
            <rect width="18" height="11" fill="#FFFFFF" />
            <rect x="5" width="3" height="11" fill="#002F6C" />
            <rect y="4" width="18" height="3" fill="#002F6C" />
          </svg>
        );

      case 'HU': // Hungary: Red, White, Green horizontal
        return (
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
            <rect width="3" height="0.67" fill="#CE2939" />
            <rect width="3" height="0.67" y="0.67" fill="#FFFFFF" />
            <rect width="3" height="0.66" y="1.34" fill="#477050" />
          </svg>
        );

      case 'RO': // Romania: Blue, Yellow, Red vertical
        return (
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
            <rect width="1" height="2" fill="#002B7F" />
            <rect width="1" height="2" x="1" fill="#FCD116" />
            <rect width="1" height="2" x="2" fill="#CE1126" />
          </svg>
        );

      case 'CZ': // Czechia: White/Red with Blue triangle
        return (
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
            <rect width="3" height="1" fill="#FFFFFF" />
            <rect width="3" height="1" y="1" fill="#D7141A" />
            <polygon points="0,0 1.5,1 0,2" fill="#11457E" />
          </svg>
        );

      case 'UA': // Ukraine: Blue, Yellow horizontal
        return (
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
            <rect width="3" height="1" fill="#0057B7" />
            <rect width="3" height="1" y="1" fill="#FFDD00" />
          </svg>
        );

      case 'AL': // Albania: Red with black double-headed eagle
        return (
          <svg viewBox="0 0 7 5" className="w-full h-full object-cover">
            <rect width="7" height="5" fill="#DA291C" />
            <path
              d="M3.5,1.5 L3.1,2.2 L2.4,2.1 L2.7,2.8 L2.2,3.4 L3,3.4 L3.5,4.2 L4,3.4 L4.8,3.4 L4.3,2.8 L4.6,2.1 L3.9,2.2 Z"
              fill="#000000"
            />
            <circle cx="3.2" cy="1.6" r="0.25" fill="#000000" />
            <circle cx="3.8" cy="1.6" r="0.25" fill="#000000" />
          </svg>
        );

      case 'EU': // European Union flag
        return (
          <svg viewBox="0 0 810 540" className="w-full h-full object-cover">
            <rect width="810" height="540" fill="#003399" />
            <g fill="#FFCC00" transform="translate(405,270)">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <polygon
                  key={deg}
                  points="0,-15 4,-3 16,-3 7,4 10,16 0,9 -10,16 -7,4 -16,-3 -4,-3"
                  transform={`rotate(${deg}) translate(0,-160)`}
                />
              ))}
            </g>
          </svg>
        );

      case 'EUS': // Basque Country (Ikurrina)
      case 'EU-ES':
        return (
          <svg viewBox="0 0 280 200" className="w-full h-full object-cover">
            <rect width="280" height="200" fill="#D52B1E" />
            <path d="M0,0 L280,200 M280,0 L0,200" stroke="#009B48" strokeWidth="26" />
            <path d="M140,0 v200 M0,100 h280" stroke="#FFFFFF" strokeWidth="26" />
          </svg>
        );

      case 'NO': // Norway
        return (
          <svg viewBox="0 0 22 16" className="w-full h-full object-cover">
            <rect width="22" height="16" fill="#BA0C2F" />
            <path d="M0,8 h22 M8,0 v16" stroke="#FFFFFF" strokeWidth="4" />
            <path d="M0,8 h22 M8,0 v16" stroke="#00205B" strokeWidth="2" />
          </svg>
        );

      case 'DK': // Denmark (Dannebrog)
        return (
          <svg viewBox="0 0 37 28" className="w-full h-full object-cover">
            <rect width="37" height="28" fill="#C8102E" />
            <rect x="12" width="4" height="28" fill="#FFFFFF" />
            <rect y="12" width="37" height="4" fill="#FFFFFF" />
          </svg>
        );

      case 'AT': // Austria: Red, White, Red horizontal
        return (
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
            <rect width="3" height="0.67" fill="#ED2939" />
            <rect width="3" height="0.67" y="0.67" fill="#FFFFFF" />
            <rect width="3" height="0.66" y="1.34" fill="#ED2939" />
          </svg>
        );

      case 'CH': // Switzerland: Red with white cross
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full object-cover">
            <rect width="32" height="32" fill="#DA291C" />
            <rect x="13" y="6" width="6" height="20" fill="#FFFFFF" />
            <rect x="6" y="13" width="20" height="6" fill="#FFFFFF" />
          </svg>
        );

      case 'HR': // Croatia: Red, White, Blue with coat
        return (
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
            <rect width="3" height="0.67" fill="#FF0000" />
            <rect width="3" height="0.67" y="0.67" fill="#FFFFFF" />
            <rect width="3" height="0.66" y="1.34" fill="#0000FF" />
            <rect x="1.3" y="0.6" width="0.4" height="0.5" fill="#FF0000" stroke="#fff" strokeWidth="0.05" />
          </svg>
        );

      case 'BG': // Bulgaria: White, Green, Red
        return (
          <svg viewBox="0 0 5 3" className="w-full h-full object-cover">
            <rect width="5" height="1" fill="#FFFFFF" />
            <rect width="5" height="1" y="1" fill="#00966E" />
            <rect width="5" height="1" y="2" fill="#D62612" />
          </svg>
        );

      case 'EE': // Estonia: Blue, Black, White
        return (
          <svg viewBox="0 0 33 21" className="w-full h-full object-cover">
            <rect width="33" height="7" fill="#0072CE" />
            <rect width="33" height="7" y="7" fill="#000000" />
            <rect width="33" height="7" y="14" fill="#FFFFFF" />
          </svg>
        );

      case 'LT': // Lithuania: Yellow, Green, Red
        return (
          <svg viewBox="0 0 5 3" className="w-full h-full object-cover">
            <rect width="5" height="1" fill="#FDB913" />
            <rect width="5" height="1" y="1" fill="#006A44" />
            <rect width="5" height="1" y="2" fill="#C1272D" />
          </svg>
        );

      case 'LV': // Latvia: Carmine red with narrow white band
        return (
          <svg viewBox="0 0 5 3" className="w-full h-full object-cover">
            <rect width="5" height="1.2" fill="#9E3039" />
            <rect width="5" height="0.6" y="1.2" fill="#FFFFFF" />
            <rect width="5" height="1.2" y="1.8" fill="#9E3039" />
          </svg>
        );

      case 'CY': // Cyprus / Greek
        return (
          <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
            <rect width="3" height="2" fill="#FFFFFF" />
            <path d="M1.3,0.8 L1.7,0.7 L1.9,1.1 L1.4,1.2 Z" fill="#D47600" />
          </svg>
        );

      default:
        return (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center font-bold text-cyan-400">
            {c.slice(0, 2)}
          </div>
        );
    }
  };

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[3px] shadow-[0_1px_4px_rgba(0,0,0,0.5)] border border-white/20 ${sizeClasses} ${className}`}
      title={code}
    >
      {renderFlagContent()}
    </span>
  );
};
