// lib/events.ts
const WP_BASE = process.env.WP_API_URL || "https://healthacademy.ca";

export type EventItem = {
  id: number;
  title: { rendered: string };
  description?: { rendered: string } | string;
  excerpt?: { rendered: string } | string;
  start_date: string;
  end_date: string;
  url: string;
};

type EventsResponse = {
  events: EventItem[];
  total: number;
  total_pages: number;
};

// ---- helper to format YYYY-MM-DD ----
function formatYMD(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// NEW: fetch events for a given month (both past + upcoming in that month)
export async function getEventsForMonth(
  year: number,
  month: number // 1–12
): Promise<EventItem[]> {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0); // last day of month

  const params = new URLSearchParams({
    per_page: "50",
    start_date: `${formatYMD(start)} 00:00:00`,
    end_date: `${formatYMD(end)} 23:59:59`,
    status: "publish",
  });

  const res = await fetch(
    `${WP_BASE}/wp-json/tribe/events/v1/events?${params.toString()}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch month events: ${res.status} ${res.statusText}`
    );
  }

  const data: EventsResponse = await res.json();
  // sort by start date
  return data.events.sort((a, b) =>
    a.start_date < b.start_date ? -1 : 1
  );
}

export async function getPastEvents(): Promise<EventItem[]> {
  const today = new Date().toISOString().slice(0, 10);

  const params = new URLSearchParams({
    per_page: "20",
    start_date: "2025-01-01 00:00:00",
    end_date: `${today} 23:59:59`,
    status: "publish",
  });

  const res = await fetch(
    `${WP_BASE}/wp-json/tribe/events/v1/events?${params.toString()}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch past events: ${res.status} ${res.statusText}`
    );
  }

  const data: EventsResponse = await res.json();

  return data.events.sort((a, b) =>
    a.start_date < b.start_date ? 1 : -1
  );
}
