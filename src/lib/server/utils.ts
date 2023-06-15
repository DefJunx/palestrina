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
