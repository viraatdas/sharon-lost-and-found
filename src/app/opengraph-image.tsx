import { ImageResponse } from 'next/og';
import { loadOgFonts } from './og-fonts';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Sharon Lost + Found';

export default async function OgImage() {
  const fonts = await loadOgFonts();
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#f5f0e6', padding: '48px', fontFamily: 'Silkscreen' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, border: '8px solid #18382c', background: '#fffdf8' }}>
          <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', fontWeight: 700, fontSize: 62, lineHeight: 1, color: '#18382c', letterSpacing: -1 }}>Sharon Lost + Found</div>
          <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', fontSize: 32, color: '#ed7963' }}>Lost something at Sharon?</div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
