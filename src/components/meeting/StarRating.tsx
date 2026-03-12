interface Props {
  rating: number;
}

export default function StarRating({ rating }: Props) {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: '16px',
            height: '16px',
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            background: i <= rating ? '#f7d87c' : '#4a5568',
            transition: 'background 300ms',
          }}
        />
      ))}
    </div>
  );
}
