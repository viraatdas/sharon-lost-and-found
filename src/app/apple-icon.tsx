import { ImageResponse } from 'next/og';
import { PixelStar } from './pixel-star';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#18382c' }}>
        <div style={{ width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4b345', border: '10px solid #18382c' }}>
          <PixelStar cell={14} color="#ed7963" />
        </div>
      </div>
    ),
    { ...size },
  );
}
