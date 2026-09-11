import { ImageResponse } from 'next/og';
import { loadOgFonts } from './og-fonts';
import { PixelStar } from './pixel-star';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Sharon Lost + Found — a neighborly lost and found board';

export default async function OgImage() {
  const fonts = await loadOgFonts();
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#f5f0e6', padding: '48px', fontFamily: 'VT323' }}>
        <div style={{ flex: 1, display: 'flex', border: '8px solid #18382c', background: '#fffdf8' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 32px 0 64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'Silkscreen', fontSize: 20, color: '#ed7963', letterSpacing: 4 }}>
              <PixelStar cell={3} color="#ed7963" />
              A NEIGHBORLY BOARD
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Silkscreen', fontWeight: 700, fontSize: 76, lineHeight: 1.08, color: '#18382c', letterSpacing: -1.5, marginTop: 20 }}>
              <span style={{ display: 'flex' }}>SHARON</span>
              <span style={{ display: 'flex', color: '#ed7963' }}>LOST + FOUND</span>
            </div>
            <div style={{ display: 'flex', marginTop: 30, fontSize: 28, color: '#466153', maxWidth: 600 }}>
              Found something? Lost something? Meet in the middle.
            </div>
            <div style={{ display: 'flex', marginTop: 36, fontFamily: 'Silkscreen', fontSize: 16, color: '#6a8074' }}>
              sharonlostandfound.viraat.dev
            </div>
          </div>
          <div style={{ width: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '8px solid #18382c', background: '#f4b345' }}>
            <PixelStar cell={26} color="#ed7963" />
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
