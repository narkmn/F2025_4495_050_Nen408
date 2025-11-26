// components/EventsToolbar.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type View = "list" | "month" | "day";

type Props = {
  activeView: View;
  onViewChange: (view: View) => void;
};

export default function EventsToolbar({ activeView, onViewChange }: Props) {
  const [query, setQuery] = useState("");

  const activeCls =
    "font-semibold text-black border-b-2 border-black pb-0.5";
  const inactiveCls = "text-gray-700 hover:text-black pb-0.5";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can wire this up later to actually filter events
    console.log("Search query:", query);
  };

  return (
    <div className="border border-gray-300 rounded-sm px-6 py-3 mb-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
      >
        {/* Search box */}
        <div className="flex items-center flex-1 max-w-xl border-b md:border-none pb-2 md:pb-0">
          <Search className="w-4 h-4 text-gray-500 mr-3" />
          <input
            type="search"
            placeholder="Search for events"
            className="w-full outline-none text-sm md:text-base placeholder:text-gray-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Button + tabs */}
        <div className="flex items-center gap-6 justify-end">
          <button
            type="submit"
            className="bg-[#5EA758] hover:bg-[#4e8b4a] text-white font-semibold px-6 py-2 rounded-sm text-sm md:text-base"
          >
            Find Events
          </button>

          <div className="flex items-end gap-4 text-sm md:text-base">
            <button
              type="button"
              className={activeView === "list" ? activeCls : inactiveCls}
              onClick={() => onViewChange("list")}
            >
              List
            </button>
            <button
              type="button"
              className={activeView === "month" ? activeCls : inactiveCls}
              onClick={() => onViewChange("month")}
            >
              Month
            </button>
            <button
              type="button"
              className={activeView === "day" ? activeCls : inactiveCls}
              onClick={() => onViewChange("day")}
            >
              Day
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
