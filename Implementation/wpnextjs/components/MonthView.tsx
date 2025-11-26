// components/MonthView.tsx
import type { EventItem } from "@/lib/events";

type Props = {
  events: EventItem[];
  year: number;
  month: number; // 1–12
};

function toYMD(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Build a 6x7 matrix of dates, starting on Monday
function buildCalendarMatrix(year: number, month: number) {
  const firstOfMonth = new Date(year, month - 1, 1);
  const jsDay = firstOfMonth.getDay(); // 0 = Sun ... 6 = Sat
  const mondayIndex = (jsDay + 6) % 7; // 0 = Mon ... 6 = Sun

  const startDate = new Date(year, month - 1, 1 - mondayIndex);
  const weeks: Date[][] = [];
  let current = new Date(startDate);

  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

export default function MonthView({ events, year, month }: Props) {
  const monthLabel = new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const weeks = buildCalendarMatrix(year, month);
  const eventsByDate = new Map<string, EventItem[]>();

  events.forEach((ev) => {
    const key = ev.start_date.slice(0, 10); // "YYYY-MM-DD"
    if (!eventsByDate.has(key)) eventsByDate.set(key, []);
    eventsByDate.get(key)!.push(ev);
  });

  // Labels for header row (Mon–Sun)
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <section className="mb-12">
      {/* Header row: arrows, This Month, label */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1 rounded border border-gray-300 text-lg leading-none"
          >
            ‹
          </button>
          <button
            type="button"
            className="px-3 py-1 rounded border border-gray-300 text-sm"
          >
            This Month
          </button>
        </div>

        <div className="flex items-center gap-1 text-xl">
          <span>{monthLabel}</span>
          <span className="text-gray-500 text-sm">▼</span>
        </div>

        {/* spacer so header is balanced */}
        <div className="w-[72px]" />
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 border-t border-l">
        {dayNames.map((d, idx) => (
          <div
            key={`${d}-${idx}`}
            className="py-2 px-3 text-xs font-semibold text-gray-500 border-b border-r bg-gray-50"
          >
            {d}
          </div>
        ))}

        {/* Calendar cells */}
        {weeks.flat().map((day, idx) => {
          const isCurrentMonth = day.getMonth() === month - 1;
          const ymd = toYMD(day);
          const dayEvents = eventsByDate.get(ymd) ?? [];

          return (
            <div
              key={idx}
              className="min-h-[90px] border-b border-r px-2 pt-2 pb-1 align-top"
            >
              <div
                className={`text-sm font-semibold ${
                  isCurrentMonth ? "text-gray-700" : "text-gray-300"
                }`}
              >
                {day.getDate()}
              </div>

              {isCurrentMonth && dayEvents.length > 0 && (
                <div className="mt-1 space-y-1">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="text-[11px] leading-snug text-gray-700"
                    >
                      {/* Time */}
                      <span className="block text-gray-500">
                        {new Date(ev.start_date).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}{" "}
                        –{" "}
                        {new Date(ev.end_date).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                      {/* Title */}
                      <span className="block">{ev.title.rendered}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
