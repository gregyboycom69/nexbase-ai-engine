/* eslint-disable @next/next/no-img-element -- ImageResponse rasterizes the logo server-side into a PNG. */
import { ImageResponse } from "next/og";

import { LOGO_DATA_URI } from "@/lib/nexbase-identity";

/** Dynamic favicon - the Nexbase mark. Renders at 32x32. */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Icon() {
  return new ImageResponse(<img src={LOGO_DATA_URI} alt="" width={32} height={32} />, { ...size });
}
