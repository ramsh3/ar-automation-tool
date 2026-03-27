'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function AgilysysLogo({ size = 'md' }: LogoProps) {
  const sizes = {
    sm: { mark: { w: 32, h: 22, green: 18, blue: 10 }, name: 'text-sm', sub: 'text-[9px]' },
    md: { mark: { w: 38, h: 26, green: 20, blue: 11 }, name: 'text-sm', sub: 'text-[10px]' },
    lg: { mark: { w: 52, h: 36, green: 30, blue: 16 }, name: 'text-xl', sub: 'text-[11px]' },
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
