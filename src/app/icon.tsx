import { ImageResponse } from 'next/og';
import { PixelStar } from './pixel-star';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#18382c' }}>
        <PixelStar cell={4} color="#f4b345" />
      </div>
    ),
    { ...size },
  );
}
