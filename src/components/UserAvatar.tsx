import { AvatarType } from '@/lib/avatar';

const sizeMap = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
} as const;

function MaleAvatarSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="32" fill="#E0F2FE" />
      <ellipse cx="32" cy="26" rx="11" ry="12" fill="#0EA5E9" />
      <path
        d="M14 58c2-14 12-20 18-20s16 6 18 20"
        fill="#0284C7"
      />
      <path
        d="M22 24c0-4 4-7 10-7s10 3 10 7c0 2-1 4-3 5-2 2-5 3-7 3s-5-1-7-3c-2-1-3-3-3-5z"
        fill="#0369A1"
      />
    </svg>
  );
}

function FemaleAvatarSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="32" fill="#FCE7F3" />
      <ellipse cx="32" cy="26" rx="11" ry="12" fill="#EC4899" />
      <path
        d="M14 58c2-14 12-20 18-20s16 6 18 20"
        fill="#DB2777"
      />
      <path
        d="M18 22c2-6 8-10 14-10s12 4 14 10c-4 2-8 3-14 3s-10-1-14-3z"
        fill="#BE185D"
      />
      <path
        d="M20 30c3 4 7 6 12 6s9-2 12-6"
        fill="none"
        stroke="#BE185D"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function UserAvatar({
  avatar,
  size = 'md',
  className = '',
}: {
  avatar: AvatarType;
  size?: keyof typeof sizeMap;
  className?: string;
}) {
  const dim = sizeMap[size];
  const Svg = avatar === 'female' ? FemaleAvatarSvg : MaleAvatarSvg;
  return (
    <div
      className={`${dim} rounded-full overflow-hidden shrink-0 ring-1 ring-slate-200/80 ${className}`}
      role="img"
      aria-label={avatar === 'female' ? 'Female avatar' : 'Male avatar'}
    >
      <Svg className="w-full h-full" />
    </div>
  );
}
