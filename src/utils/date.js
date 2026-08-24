/**
 * Formats a "YYYY-MM-DD" content date for display.
 *
 * `new Date("2025-12-15")` is parsed as UTC midnight, which renders as the
 * 14th for any viewer behind UTC. Appending a time forces local-time parsing
 * so the date shown always matches the date authored.
 *
 * @param {string} isoDate - Date string as written in the content JSON
 * @param {Intl.DateTimeFormatOptions} options
 * @returns {string}
 */
export function formatPostDate(
  isoDate,
  options = { month: 'long', day: 'numeric', year: 'numeric' }
) {
  if (!isoDate) return '';
  const local = /^\d{4}-\d{2}-\d{2}$/.test(isoDate) ? `${isoDate}T00:00:00` : isoDate;
  return new Date(local).toLocaleDateString('en-US', options);
}
