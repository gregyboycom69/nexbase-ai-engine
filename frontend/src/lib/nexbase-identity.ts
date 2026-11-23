// i18n-exempt: Nexbase is the product name in every locale.
export const NEXBASE_NAME = "Nexbase AI Engine";

// Two interlocking strokes form the N and frame the open center of the mark.
const NEXBASE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="nexbase" x2="1" y2="1" gradientUnits="objectBoundingBox">
      <stop stop-color="#8174ff"/>
      <stop offset="1" stop-color="#46e3f2"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="#10162c"/>
  <path d="M15 45V25l9-8 18 17v-8l7-7v20l-9 8-18-17v8z" fill="url(#nexbase)"/>
  <path d="m15 45 7-7v9h-7zm34-26-7 7v-9h7z" fill="#f0f6ff"/>
</svg>`;

export const LOGO_DATA_URI = `data:image/svg+xml,${encodeURIComponent(NEXBASE_SVG)}`;
export const LOGO_VERSION = "nexbase-1";
