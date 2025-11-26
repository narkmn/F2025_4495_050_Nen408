// app/events/page.tsx  (or app/calendar/page.tsx)
import CalendarClient from "@/components/CalendarClient";
import { getEventsForMonth, getPastEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const [monthEvents, pastEvents] = await Promise.all([
    getEventsForMonth(year, month),
    getPastEvents(),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Calendar</h1>

      <CalendarClient
        monthEvents={monthEvents}
        pastEvents={pastEvents}
        year={year}
        month={month}
      />
    </div>
  );
}
