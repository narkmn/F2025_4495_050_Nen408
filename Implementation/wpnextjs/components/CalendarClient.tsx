// components/CalendarClient.tsx
"use client";

import { useState } from "react";
import EventsToolbar from "@/components/EventsToolbar";
import MonthView from "@/components/MonthView";
import Link from "next/link";
import type { EventItem } from "@/lib/events";

type View = "list" | "month" | "day";

type Props = {
  monthEvents: EventItem[];
  pastEvents: EventItem[];
  year: number;
  month: number; // 1–12
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function toYMD(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function CalendarClient({
  monthEvents,
  pastEvents,
  year,
  month,
}: Props) {
  const [view, setView] = useState<View>("list");
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  // all events we know about (for Day view)
  const allEvents: EventItem[] = [...monthEvents, ...pastEvents];

  const handleViewChange = (v: View) => {
    setView(v);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const shiftDay = (delta: number) => {
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + delta);
      return next;
    });
  };

  const eventsForSelectedDay = allEvents.filter((ev) => {
    const evDate = ev.start_date.slice(0, 10); // "YYYY-MM-DD"
    return evDate === toYMD(selectedDate);
  });

  const selectedDateLabel = selectedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div>
      {/* Top toolbar (search + List / Month / Day tabs) */}
      <EventsToolbar activeView={view} onViewChange={handleViewChange} />

      {/* ---------- DAY VIEW ---------- */}
      {view === "day" ? (
        <>
          {/* Header row: arrows, Today, full date */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1 rounded border border-gray-300 text-lg leading-none"
                onClick={() => shiftDay(-1)}
              >
                ‹
              </button>
              <button
                type="button"
                className="px-3 py-1 rounded border border-gray-300 text-lg leading-none"
                onClick={() => shiftDay(1)}
              >
                ›
              </button>
              <button
                type="button"
                className="ml-2 px-3 py-1 rounded border border-gray-300 text-sm"
                onClick={goToToday}
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-1 text-xl">
              <span>{selectedDateLabel}</span>
              <span className="text-gray-500 text-sm">▼</span>
            </div>

            {/* right spacer */}
            <div className="w-[120px]" />
          </div>

          {/* Day content box */}
          <div className="border border-gray-200 rounded bg-gray-50 px-4 py-6 text-center text-gray-600 mb-10">
            {eventsForSelectedDay.length === 0 ? (
              <div className="flex items-center justify-center gap-3">
                {/* simple calendar icon placeholder */}
                <div className="border border-gray-400 rounded px-2 py-1 text-xs">
                  📅
                </div>
                <span>There are no upcoming events.</span>
              </div>
            ) : (
              <div className="space-y-4 text-left max-w-xl mx-auto">
                {eventsForSelectedDay.map((ev) => (
                  <div key={ev.id} className="border-b pb-3 last:border-b-0">
                    <p className="text-sm text-gray-600 mb-1">
                      {new Date(ev.start_date).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}{" "}
                      –{" "}
                      {new Date(ev.end_date).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {ev.title.rendered}
                    </h3>
                    <p className="text-sm text-gray-700">
                      {stripHtml(
                        (typeof ev.excerpt === "string"
                          ? ev.excerpt
                          : ev.excerpt?.rendered) ||
                          (typeof ev.description === "string"
                            ? ev.description
                            : ev.description?.rendered) ||
                          ""
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom row: Previous Day / Next Day / Subscribe */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="flex items-center gap-1 text-sm text-gray-800 hover:text-black"
              onClick={() => shiftDay(-1)}
            >
              <span>‹</span>
              <span>Previous Day</span>
            </button>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="flex items-center gap-1 text-sm text-gray-800 hover:text-black"
                onClick={() => shiftDay(1)}
              >
                <span>Next Day</span>
                <span>›</span>
              </button>

              <button
                type="button"
                className="border border-[#5EA758] text-[#5EA758] hover:bg-[#5EA758]/5 px-4 py-2 rounded text-sm font-semibold"
              >
                Subscribe to calendar ▾
              </button>
            </div>
          </div>
        </>
      ) : null}

      {/* ---------- MONTH VIEW ---------- */}
      {view === "month" && (
        <MonthView events={monthEvents} year={year} month={month} />
      )}

      {/* ---------- LIST VIEW ---------- */}
      {view === "list" && (
        <>
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Upcoming</h2>
            <div className="bg-gray-100 px-4 py-6 rounded text-center text-gray-600">
              There are no upcoming events.
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Latest Past Events</h2>

            {pastEvents.length === 0 ? (
              <p className="text-gray-600">No past events found.</p>
            ) : (
              <ul className="space-y-8">
                {pastEvents.map((event) => {
                  const d = new Date(event.start_date);

                  const rawSummary =
                    (typeof event.excerpt === "string"
                      ? event.excerpt
                      : event.excerpt?.rendered) ||
                    (typeof event.description === "string"
                      ? event.description
                      : event.description?.rendered) ||
                    "";
                  const summaryText = stripHtml(rawSummary);
                  const shortSummary =
                    summaryText.length > 220
                      ? summaryText.slice(0, 220) + "..."
                      : summaryText;

                  return (
                    <li
                      key={event.id}
                      className="flex gap-6 border-b pb-6 last:border-b-0"
                    >
                      {/* date badge */}
                      <div className="w-16 text-center">
                        <div className="text-xs font-semibold text-gray-500">
                          {d.toLocaleString("en-US", {
                            month: "short",
                          }).toUpperCase()}
                        </div>
                        <div className="text-2xl font-bold text-gray-900 leading-none">
                          {d.getDate()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {d.getFullYear()}
                        </div>
                      </div>

                      {/* event details */}
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">
                          {d.toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          @{" "}
                          {d.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {event.title.rendered}
                        </h3>

                        {shortSummary && (
                          <p className="text-gray-700 mb-3">{shortSummary}</p>
                        )}

                        <Link
                          href={event.url}
                          className="text-green-700 font-semibold hover:underline"
                        >
                          View event details
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
