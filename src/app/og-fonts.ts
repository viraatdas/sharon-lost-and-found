const LEGACY_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2';

async function fetchFont(family: string, weight: number): Promise<ArrayBuffer> {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`, { headers: { 'User-Agent': LEGACY_UA } })).text();
  const match = css.match(/src: url\(([^)]+)\)/);
  if (!match) throw new Error(`Could not resolve a font file for ${family}`);
  const response = await fetch(match[1]);
  return response.arrayBuffer();
}

export async function loadOgFonts() {
  const [silkscreen, vt323] = await Promise.all([fetchFont('Silkscreen', 700), fetchFont('VT323', 400)]);
  return [
    { name: 'Silkscreen', data: silkscreen, weight: 700 as const, style: 'normal' as const },
    { name: 'VT323', data: vt323, weight: 400 as const, style: 'normal' as const },
  ];
}
