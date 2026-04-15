/**
 * Format an ISO date string to "DD MMM, YYYY" (e.g. "14 Mar, 2026")
 */
export function formatActivityDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

/**
 * Format an ISO date string to "hh:mm AM/PM" (e.g. "03:17 PM")
 */
export function formatActivityTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

/**
 * Return the icon path for a given actor type.
 * "system" → computer/system icon, others → person/user icon.
 */
export function getActorIcon(actor: string, context: 'rider' | 'driver'): string {
  const prefix = context === 'rider' ? '/icons/rider' : '/icons/driver';
  if (actor.toLowerCase() === 'system') {
    return `${prefix}/system.svg`;
  }
  return `${prefix}/user.svg`;
}
