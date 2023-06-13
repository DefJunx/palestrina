import type { SupabaseClient } from '@supabase/supabase-js';

export function handleLoginRedirect(url: URL) {
  const redirectTo = url.pathname + url.search;

  return `/?redirectTo=${redirectTo}`;
}

export function getAvatarFallbackfromName(fullName: string | null) {
  if (!fullName) return '';

  const nameParts = fullName.split(' ');
  const initials = nameParts.map((part: string) => part.charAt(0).toUpperCase());
  return initials.join('');
}

export function getPublicBucketUrl(
  supabase: SupabaseClient,
  avatarPath: string | null = null,
  bucket: 'avatars' | 'exercise_videos' | 'exercise_photos' = 'avatars'
) {
  if (!avatarPath) return '';

  try {
    const { data: avatarUrl } = supabase.storage.from(bucket).getPublicUrl(avatarPath);
    return avatarUrl.publicUrl;
  } catch (error) {
    console.error(error);
    return '';
  }
}
