import { ImageResponse } from 'next/og';
import { loadOgFonts } from '../og-fonts';

export const runtime = 'nodejs';

export async function GET() {
  const fonts = await loadOgFonts();
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#f5f0e6', padding: '40px', fontFamily: 'VT323' }}>
        <div style={{ display: 'flex', fontFamily: 'Silkscreen', fontSize: 16, color: '#6a8074', marginBottom: 20 }}>
          sharonlostandfound.viraat.dev — &ldquo;Add a find&rdquo; form
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', border: '6px solid #18382c', background: '#fffdf8', padding: '36px 40px', maxWidth: 640 }}>
          <div style={{ display: 'flex', fontFamily: 'Silkscreen', fontSize: 14, letterSpacing: 2, color: '#ed7963', marginBottom: 10 }}>ADD A FIND</div>
          <div style={{ display: 'flex', fontFamily: 'Silkscreen', fontWeight: 700, fontSize: 34, color: '#18382c', marginBottom: 24 }}>Let&rsquo;s get it home.</div>
          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '3px dashed #18382c', paddingTop: 20 }}>
            <div style={{ display: 'flex', fontFamily: 'Silkscreen', fontSize: 18, color: '#18382c', marginBottom: 16 }}>Know whose it might be?</div>
            <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Silkscreen', fontSize: 13, color: '#18382c', marginBottom: 6 }}>I think it might be…</div>
            <div style={{ display: 'flex', border: '3px solid #18382c', background: '#fff', padding: '12px 14px', fontSize: 20, color: '#9a9488', marginBottom: 18 }}>e.g. Alex</div>
            <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Silkscreen', fontSize: 13, color: '#18382c', marginBottom: 6 }}>Their phone number</div>
            <div style={{ display: 'flex', border: '3px solid #18382c', background: '#fff', padding: '12px 14px', fontSize: 20, color: '#9a9488' }}>(304) 555-0123</div>
            <div style={{ display: 'flex', marginTop: 14, fontSize: 18, lineHeight: 1.4, color: '#6a8074', maxWidth: 520 }}>
              By entering their number, you&rsquo;re OK with us sending them one text about this find. Nothing else, nothing stored beyond that.
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1000, height: 600, fonts },
  );
}
