import React, { useId } from 'react';

// Albania outline: Natural Earth 1:50m Admin 0, public domain.
// Local equirectangular projection, standard parallel 41°N.
const ALBANIA_OUTLINE = 'M84.39,108.23L84.64,102.92L85.9,94.48L85.18,91.68L85.93,86.86L83.46,80.43L79.41,75.8L83.31,67.61L89.01,57.71L94.29,49.85L100.7,41.67L104.96,33.82L109.56,27.07L113.51,25.0L115.48,26.43L116.52,29.38L116.28,38.12L117.63,41.14L120.35,43.36L126.12,42.27L132.51,40.1L141.12,35.48L142.59,35.76L145.78,38.18L152.41,48.73L156.83,58.02L165.52,61.24L170.36,64.86L176.58,70.37L179.6,75.92L183.84,92.84L184.32,103.07L183.1,107.74L182.04,108.95L178.17,125.61L179.09,134.1L179.06,139.69L175.79,141.89L173.61,145.4L177.14,159.28L176.71,165.19L176.87,171.98L183.23,187.45L186.99,192.23L190.34,194.52L194.63,208.76L197.18,211.23L207.61,209.88L212.72,211.46L214.74,214.84L215.2,217.15L214.51,225.12L217.11,231.27L220.59,237.59L220.57,241.45L218.24,247.77L214.06,255.14L208.54,257.97L202.44,260.37L199.53,266.09L198.05,272.18L195.33,276.7L193.64,281.64L191.06,291.76L190.45,295.43L186.32,299.14L179.94,300.65L174.21,300.97L170.34,302.69L168.38,306.14L164.73,308.93L162.52,310.17L162.54,313.23L165.19,319.66L168.21,324.88L168.27,329.06L166.79,330.23L162.12,329.7L161.13,331.25L160.62,335.91L159.37,339.91L157.45,342.34L154.11,345.0L148.0,344.13L142.25,340.13L139.25,338.89L137.53,339.03L137.08,329.24L134.59,321.62L125.48,303.32L95.86,285.54L88.89,277.53L85.82,270.82L82.77,264.47L85.7,264.29L88.6,265.9L92.31,267.83L93.81,264.65L92.2,257.72L84.57,241.5L84.0,237.03L87.74,223.47L93.98,208.24L93.56,189.77L95.5,175.85L93.35,166.8L92.31,155.72L96.89,140.98L100.8,137.33L103.21,132.67L103.36,116.95L94.54,109.62L84.39,108.23Z';
const DIALECT_TRANSITION = 'M85.01,197.9L103.56,195.76L121.3,196.83L141.46,188.28L157.59,190.42L173.72,205.38L189.85,205.38';
const NORTHERN_REGION = 'M0,0H300V205.38L189.85,205.38L173.72,205.38L157.59,190.42L141.46,188.28L121.3,196.83L103.56,195.76L85.01,197.9H0Z';

export const AlbaniaDialectMap: React.FC = () => {
  const clipId = useId();
  return (
    <svg viewBox="0 0 300 380" className="w-full h-full" role="img"
      aria-label="Harta gjeografike e Shqipërisë: gegërishtja në veri, toskërishtja në jug; ndarja pranë Shkumbinit është e përafërt.">
      <defs><clipPath id={clipId}><path d={ALBANIA_OUTLINE} /></clipPath></defs>
      <rect width="300" height="380" rx="16" fill="#eef7fb" />
      <text x="28" y="190" transform="rotate(-78 28 190)" fill="#55839a" fontSize="10">DETI ADRIATIK</text>
      <path d={ALBANIA_OUTLINE} fill="#f5efe3" />
      <g clipPath={`url(#${clipId})`}>
        <path d={NORTHERN_REGION} fill="#ffdfe0" />
        <path d={DIALECT_TRANSITION} fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 3" />
      </g>
      <path d={ALBANIA_OUTLINE} fill="none" stroke="#475569" strokeWidth="1.6" strokeLinejoin="round" />
      <text x="155" y="103" textAnchor="middle" fill="#b91c1c" fontWeight="900" fontSize="12">GEGËRISHT</text>
      <text x="177" y="260" textAnchor="middle" fill="#333333" fontWeight="900" fontSize="12">TOSKËRISHT</text>
      <circle cx="122.81" cy="166.11" r="3" fill="#111111" stroke="white" strokeWidth="1" />
      <text x="129.81" y="161.11" fill="#111111" fontSize="10" fontWeight="700">Tiranë</text>
      <text x="145" y="210" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="800">Shkumbini (skematik)</text>
      <g transform="translate(266 30)" fill="#475569">
        <path d="M0 15L5 0L10 15L5 11Z" />
        <text x="5" y="-5" textAnchor="middle" fontSize="10" fontWeight="800">V</text>
      </g>
      <text x="150" y="367" textAnchor="middle" fill="#64748b" fontSize="9">Kufijtë: Natural Earth</text>
    </svg>
  );
};
