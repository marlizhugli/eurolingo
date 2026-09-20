import React from 'react';

interface LingoBisonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: 'happy' | 'cheering' | 'thinking' | 'wink';
}

export const LingoBison: React.FC<LingoBisonProps> = ({
  className = '',
  size = 'md',
  mood = 'happy',
}) => {
  const pixelSizes = {
    sm: 36,
    md: 52,
    lg: 72,
    xl: 96,
  };

  const dim = pixelSizes[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: dim, height: dim }}
      title="Lingo the European Bison"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-sm transition-transform hover:scale-105 duration-200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Little Sturdy Bison Cloven Hooves */}
        <ellipse cx="36" cy="93" rx="10" ry="5" fill="#321a0c" />
        <ellipse cx="64" cy="93" rx="10" ry="5" fill="#321a0c" />
        <ellipse cx="36" cy="91" rx="8" ry="3.5" fill="#4d2812" />
        <ellipse cx="64" cy="91" rx="8" ry="3.5" fill="#4d2812" />
        <line x1="36" y1="89" x2="36" y2="94" stroke="#251308" strokeWidth="2" strokeLinecap="round" />
        <line x1="64" y1="89" x2="64" y2="94" stroke="#251308" strokeWidth="2" strokeLinecap="round" />

        {/* Robust Bison Shoulders / Body */}
        <path
          d="M 50 20 C 22 20 14 38 14 65 C 14 84 26 90 50 90 C 74 90 86 84 86 65 C 86 38 78 20 50 20 Z"
          fill="#6d3917"
        />

        {/* Cozy Belly / Chest Shading */}
        <path
          d="M 50 56 C 36 56 28 66 28 78 C 28 86 38 88 50 88 C 62 88 72 86 72 78 C 72 66 64 56 50 56 Z"
          fill="#53290e"
        />

        {/* Left Curved Bison Horn */}
        <path
          d="M 28 32 C 16 30 10 18 16 8 C 20 6 25 15 28 24 Z"
          fill="#2b231d"
        />
        <path
          d="M 18 10 C 19 8 23 14 26 21 C 24 23 20 20 18 10 Z"
          fill="#ded4c8"
        />

        {/* Right Curved Bison Horn */}
        <path
          d="M 72 32 C 84 30 90 18 84 8 C 80 6 75 15 72 24 Z"
          fill="#2b231d"
        />
        <path
          d="M 82 10 C 81 8 77 14 74 21 C 76 23 80 20 82 10 Z"
          fill="#ded4c8"
        />

        {/* Left Ear */}
        <ellipse cx="19" cy="38" rx="7" ry="5" transform="rotate(-15 19 38)" fill="#53290e" />
        <ellipse cx="19" cy="38" rx="4.5" ry="3" transform="rotate(-15 19 38)" fill="#e5989b" />

        {/* Right Ear */}
        <ellipse cx="81" cy="38" rx="7" ry="5" transform="rotate(15 81 38)" fill="#53290e" />
        <ellipse cx="81" cy="38" rx="4.5" ry="3" transform="rotate(15 81 38)" fill="#e5989b" />

        {/* Bison Forehead Mane / Curly Wool Tuft */}
        <path
          d="M 27 28 C 27 18 36 14 50 14 C 64 14 73 18 73 28 C 73 34 68 37 63 35 C 59 38 54 39 50 38 C 46 39 41 38 37 35 C 32 37 27 34 27 28 Z"
          fill="#44210a"
        />
        {/* Forehead Hair Curls Texture */}
        <circle cx="43" cy="24" r="5" fill="#381b08" />
        <circle cx="50" cy="22" r="5.5" fill="#4d270e" />
        <circle cx="57" cy="24" r="5" fill="#381b08" />
        <circle cx="36" cy="29" r="4.5" fill="#381b08" />
        <circle cx="64" cy="29" r="4.5" fill="#381b08" />

        {/* Warm Tan Muzzle / Snout */}
        <ellipse cx="50" cy="62" rx="21" ry="15" fill="#d99f75" />
        <ellipse cx="50" cy="60" rx="19" ry="13" fill="#e7b189" />

        {/* Little Bison Beard / Chin Tuft */}
        <path
          d="M 45 74 C 45 81 48 84 50 85 C 52 84 55 81 55 74 Z"
          fill="#44210a"
        />

        {/* Nostrils */}
        <ellipse cx="43" cy="61" rx="3.2" ry="2.5" fill="#2d170a" />
        <ellipse cx="57" cy="61" rx="3.2" ry="2.5" fill="#2d170a" />

        {/* Cheerful Bison Smile / Mouth */}
        {mood === 'cheering' ? (
          <path
            d="M 44 65 Q 50 72 56 65 Z"
            fill="#a82828"
          />
        ) : (
          <path
            d="M 44 66 Q 50 71 56 66"
            stroke="#2d170a"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Expressive Eyes */}
        {mood === 'wink' ? (
          <>
            {/* Left open eye */}
            <circle cx="35" cy="45" r="7" fill="#ffffff" />
            <circle cx="35" cy="45" r="5" fill="#2b1a11" />
            <circle cx="33.5" cy="43.5" r="1.8" fill="#ffffff" />
            {/* Right winking eye */}
            <path
              d="M 60 46 Q 65 40 70 46"
              stroke="#2b1a11"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : mood === 'cheering' ? (
          <>
            {/* Joyful arched eyes */}
            <path
              d="M 30 46 Q 35 39 40 46"
              stroke="#2b1a11"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 60 46 Q 65 39 70 46"
              stroke="#2b1a11"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Sparkle cheeks */}
            <circle cx="28" cy="53" r="3" fill="#ff7070" opacity="0.6" />
            <circle cx="72" cy="53" r="3" fill="#ff7070" opacity="0.6" />
          </>
        ) : mood === 'thinking' ? (
          <>
            {/* Thinking eyes looking up */}
            <circle cx="35" cy="45" r="7" fill="#ffffff" />
            <circle cx="35" cy="45" r="5" fill="#2b1a11" />
            <circle cx="35" cy="42" r="2" fill="#ffffff" />

            <circle cx="65" cy="45" r="7" fill="#ffffff" />
            <circle cx="65" cy="45" r="5" fill="#2b1a11" />
            <circle cx="65" cy="42" r="2" fill="#ffffff" />

            {/* Little raised eyebrow */}
            <path d="M 61 36 Q 66 33 71 37" stroke="#2b1a11" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            {/* Happy default eyes */}
            <circle cx="35" cy="45" r="7.5" fill="#ffffff" />
            <circle cx="35" cy="45" r="5.2" fill="#2b1a11" />
            <circle cx="33.5" cy="43" r="2" fill="#ffffff" />
            <circle cx="37" cy="46.5" r="0.9" fill="#ffffff" />

            <circle cx="65" cy="45" r="7.5" fill="#ffffff" />
            <circle cx="65" cy="45" r="5.2" fill="#2b1a11" />
            <circle cx="63.5" cy="43" r="2" fill="#ffffff" />
            <circle cx="67" cy="46.5" r="0.9" fill="#ffffff" />
          </>
        )}

        {/* European Golden Star Badge on chest */}
        <polygon
          points="50,78 52,82.5 57,82.5 53,85.5 54.5,90 50,87 45.5,90 47,85.5 43,82.5 48,82.5"
          fill="#ffc800"
          stroke="#e0a800"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  );
};

// Export as both LingoBison and DuoOwl for seamless backward compatibility
export const DuoOwl = LingoBison;
export default LingoBison;
