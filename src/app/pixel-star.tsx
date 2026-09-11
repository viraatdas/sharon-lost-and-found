const PATTERN = [
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [1, 1, 1, 1, 1],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
];

export function PixelStar({ cell, color }: { cell: number; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {PATTERN.map((row, i) => (
        <div key={i} style={{ display: 'flex' }}>
          {row.map((on, j) => (
            <div key={j} style={{ width: cell, height: cell, background: on ? color : 'transparent' }} />
          ))}
        </div>
      ))}
    </div>
  );
}
