/**
 * Utility functions for date calculations considering America/Recife timezone (UTC-3)
 * Follows Rule 11: Automatic marking of past, present, next, and future dates.
 */

export type DateTemporalStatus = 'PASSADA' | 'HOJE' | 'PROXIMO' | 'FUTURA';

export type ExtendedTemporalFilter =
  | 'TODAS'
  | 'HOJE'
  | 'PROXIMO'
  | 'FUTURAS'
  | 'PASSADAS'
  | 'PENDENTES_PASSADAS'
  | 'CONCLUIDAS';

/**
 * Returns the current date in YYYY-MM-DD format based on America/Recife timezone (UTC-3)
 */
export function getRecifeTodayDate(customDate?: Date): string {
  try {
    const targetDate = customDate || new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Recife',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(targetDate);
  } catch {
    // Fallback if timezone not supported
    const d = customDate || new Date();
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

/**
 * Formats YYYY-MM-DD to Brazilian DD/MM/YYYY
 */
export function formatToDateBR(dateStr: string): string {
  if (!dateStr || !dateStr.includes('-')) return dateStr;
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Determines the temporal status of an event with optional multi-day support.
 * Rule 6: In events with multiple days, considers endDate to determine when it ended.
 */
export function getEventTemporalStatus(
  startDateStr: string,
  endDateStr: string | null | undefined,
  todayStr: string,
  nextEventDateStr?: string | null
): DateTemporalStatus {
  const effectiveEnd = endDateStr || startDateStr;

  // If the final date is strictly before today, it has passed
  if (effectiveEnd < todayStr) {
    return 'PASSADA';
  }

  // If today is within [startDate, effectiveEnd], it is happening today
  if (startDateStr <= todayStr && todayStr <= effectiveEnd) {
    return 'HOJE';
  }

  // If this event starts on the next upcoming event date
  if (nextEventDateStr && startDateStr === nextEventDateStr) {
    return 'PROXIMO';
  }

  return 'FUTURA';
}

/**
 * Finds the earliest date that is strictly greater than todayStr among items
 */
export function findNextEventDate(dates: string[], todayStr: string): string | null {
  const futureDates = dates.filter((d) => d > todayStr).sort();
  return futureDates.length > 0 ? futureDates[0] : null;
}

/**
 * Checks if a recurring birthday (DD/MM/YYYY) in the given year has already passed relative to todayStr (YYYY-MM-DD)
 */
export function isBirthdayPassedInYear(
  birthDateStr: string,
  year: number,
  todayStr: string
): boolean {
  const parts = birthDateStr.split('/').map(Number);
  const day = (parts[0] || 1).toString().padStart(2, '0');
  const month = (parts[1] || 1).toString().padStart(2, '0');
  const birthdayThisYear = `${year}-${month}-${day}`;
  return birthdayThisYear < todayStr;
}

/**
 * Checks if a recurring birthday is TODAY
 */
export function isBirthdayToday(
  birthDateStr: string,
  todayStr: string
): boolean {
  const [, todayMonth, todayDay] = todayStr.split('-');
  const parts = birthDateStr.split('/').map(Number);
  const empDay = (parts[0] || 1).toString().padStart(2, '0');
  const empMonth = (parts[1] || 1).toString().padStart(2, '0');
  return empMonth === todayMonth && empDay === todayDay;
}

/**
 * Formats a birthday date for that specific year (YYYY-MM-DD)
 */
export function getBirthdayDateInYear(birthDateStr: string, year: number): string {
  const parts = birthDateStr.split('/').map(Number);
  const day = (parts[0] || 1).toString().padStart(2, '0');
  const month = (parts[1] || 1).toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
