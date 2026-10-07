import type { Job, Organization } from './types';

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function formatDate(isoDate: string): string {
  // isoDate is YYYY-MM-DD -> returns YYYYMMDD
  return isoDate.replace(/-/g, '');
}

function nextDayDate(isoDate: string): string {
  const d = new Date(isoDate + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

export function generateIcsCalendar(org: Organization, jobs: Job[]): string {
  const now = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RollOS//Dumpster Rental Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(org.name || 'RollOS')} - Deliveries & Pickups`,
    `X-WR-TIMEZONE:${escapeIcsText(org.timezone || 'America/Chicago')}`,
  ];

  for (const job of jobs) {
    if (job.status === 'cancelled') continue;

    // Delivery VEVENT
    lines.push(
      'BEGIN:VEVENT',
      `UID:delivery-${job.id}@rollos`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${formatDate(job.delivery_date)}`,
      `DTEND;VALUE=DATE:${nextDayDate(job.delivery_date)}`,
      `SUMMARY:🚚 Delivery: ${escapeIcsText(job.customer_name)} (${job.size_yards}yd)`,
      `DESCRIPTION:${escapeIcsText(
        `Delivery: ${job.size_yards} yd dumpster\nCustomer: ${job.customer_name}\nPhone: ${job.customer_phone}\nAddress: ${job.delivery_address}\nStatus: ${job.status}\nNotes: ${job.notes || 'None'}`,
      )}`,
      `LOCATION:${escapeIcsText(job.delivery_address)}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
    );

    // Pickup VEVENT
    lines.push(
      'BEGIN:VEVENT',
      `UID:pickup-${job.id}@rollos`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${formatDate(job.pickup_date)}`,
      `DTEND;VALUE=DATE:${nextDayDate(job.pickup_date)}`,
      `SUMMARY:📦 Pickup: ${escapeIcsText(job.customer_name)} (${job.size_yards}yd)`,
      `DESCRIPTION:${escapeIcsText(
        `Pickup: ${job.size_yards} yd dumpster\nCustomer: ${job.customer_name}\nPhone: ${job.customer_phone}\nAddress: ${job.delivery_address}\nStatus: ${job.status}\nNotes: ${job.notes || 'None'}`,
      )}`,
      `LOCATION:${escapeIcsText(job.delivery_address)}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
    );
  }

  lines.push('END:VCALENDAR');

  return lines.join('\r\n') + '\r\n';
}
