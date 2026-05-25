export type AvatarType = 'male' | 'female';

export const DEFAULT_AVATAR: AvatarType = 'male';

/** Maps DB/auth values (including legacy hex colors) to male | female. */
export function normalizeAvatar(value: unknown): AvatarType {
  if (value === 'male' || value === 'female') return value;
  return DEFAULT_AVATAR;
}

export const AVATAR_OPTIONS: { value: AvatarType; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];
