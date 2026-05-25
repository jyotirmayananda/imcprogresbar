'use client';

import { AVATAR_OPTIONS, AvatarType } from '@/lib/avatar';
import { UserAvatar } from '@/components/UserAvatar';

export function AvatarPicker({
  value,
  onChange,
}: {
  value: AvatarType;
  onChange: (avatar: AvatarType) => void;
}) {
  return (
    <div className="flex gap-4">
      {AVATAR_OPTIONS.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              selected
                ? 'border-ag-green bg-green-50/80 ring-2 ring-ag-green/30'
                : 'border-slate-200 bg-white hover:border-slate-300 opacity-80 hover:opacity-100'
            }`}
          >
            <UserAvatar avatar={opt.value} size="lg" />
            <span className="text-sm font-medium text-slate-700">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
