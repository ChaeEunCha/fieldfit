import { RiskEvent, toAbsoluteDate } from "./mock-data";

export type AlarmOffsetDays = 0 | 1 | 3 | 7;

const ALARM_TRIGGER_BY_OFFSET: Record<AlarmOffsetDays, string> = {
  0: "-P0DT0H0M0S",
  1: "-P1D",
  3: "-P3D",
  7: "-P7D",
};

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

function formatIcsDate(date: Date): string {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
}

function formatIcsTimestamp(date: Date): string {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(
    date.getHours(),
  )}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

/**
 * RFC5545 TEXT escaping: backslash, semicolon, comma, newline must be escaped.
 */
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

interface GroupedEvent {
  dateKey: string;
  date: Date;
  crops: string[];
  types: string[];
  messages: string[];
}

function groupEventsByDate(events: RiskEvent[]): GroupedEvent[] {
  const groups = new Map<string, GroupedEvent>();

  for (const event of events) {
    const date = toAbsoluteDate(event);
    const dateKey = formatIcsDate(date);
    const existing = groups.get(dateKey);

    if (existing) {
      for (const crop of event.cropsAffected) {
        if (!existing.crops.includes(crop)) existing.crops.push(crop);
      }
      if (!existing.types.includes(event.type)) existing.types.push(event.type);
      existing.messages.push(event.message);
    } else {
      groups.set(dateKey, {
        dateKey,
        date,
        crops: [...event.cropsAffected],
        types: [event.type],
        messages: [event.message],
      });
    }
  }

  return Array.from(groups.values()).sort((a, b) => (a.dateKey < b.dateKey ? -1 : 1));
}

export function buildIcsCalendar(
  events: RiskEvent[],
  alarmOffsetDays: AlarmOffsetDays,
  regionName: string,
): string {
  const now = new Date();
  const dtstamp = formatIcsTimestamp(now);
  const trigger = ALARM_TRIGGER_BY_OFFSET[alarmOffsetDays];
  const grouped = groupEventsByDate(events);

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//FieldFit//Risk Calendar//KO",
    "CALSCALE:GREGORIAN",
  ];

  grouped.forEach((group, index) => {
    const cropLabel = group.crops.join("·");
    const typeLabel = group.types.join("·");
    const title = `[필드핏] ${cropLabel} ${typeLabel} 주의 — ${regionName}`;
    const description = group.messages.join(" / ");
    const uid = `fieldfit-${group.dateKey}-${index}@fieldfit.app`;

    lines.push(
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}Z`,
      `DTSTART;VALUE=DATE:${group.dateKey}`,
      `SUMMARY:${escapeIcsText(title)}`,
      `DESCRIPTION:${escapeIcsText(description)}`,
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeIcsText(title)}`,
      `TRIGGER:${trigger}`,
      "END:VALARM",
      "END:VEVENT",
    );
  });

  lines.push("END:VCALENDAR");

  return lines.join("\r\n");
}

export function downloadIcsFile(icsText: string, filename: string): void {
  const blob = new Blob([icsText], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
