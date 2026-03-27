'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function AgilysysLogo({ size = 'md' }: LogoProps) {
  const sizes = {
    sm: { mark: { w: 36, h: 24, green: 20, blue: 11 }, name: 'text-base', sub: 'text-xs' },
    md: { mark: { w: 42, h: 29, green: 22, blue: 12 }, name: 'text-base', sub: 'text-xs' },
    lg: { mark: { w: 58, h: 40, green: 34, blue: 18 }, name: 'text-2xl', sub: 'text-sm' },
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <div
        className="relative flex-shrink-0"
        style={{ width: s.mark.w, height: s.mark.h }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: s.mark.green,
            height: s.mark.green,
            background: 'radial-gradient(circle at 35% 35%, #7DD97D, #3DA53D)',
            left: 0,
            top: size === 'lg' ? 3 : 2,
            boxShadow: '0 2px 8px rgba(61,165,61,0.5)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: s.mark.blue,
            height: s.mark.blue,
            background: 'radial-gradient(circle at 35% 35%, #6AADFF, #1E6FCC)',
            right: 0,
            top: 0,
            boxShadow: '0 2px 6px rgba(30,111,204,0.5)',
          }}
        />
      </div>
      <div>
        <div className={`${s.name} font-extrabold text-white tracking-tight`}>
          agilysys
        </div>
        <div className={`${s.sub} tracking-widest uppercase font-medium`} style={{ color: 'var(--text-3)' }}>
          AR Buddy
        </div>
      </div>
    </div>
  );
}
