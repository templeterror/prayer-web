"use client";

import { useState } from "react";

const LIFETIME_YEARS = 60; // praying years assumed (~age 15 to ~75)

const PERIODS = [
  { label: "A month", days: 30 },
  { label: "A year", days: 365 },
  { label: "A lifetime", days: 365 * LIFETIME_YEARS },
] as const;

export default function MissedPrayersCalculator() {
  const [perDay, setPerDay] = useState(2);

  return (
    <div className="reveal mx-auto mt-12 grid max-w-4xl gap-6 rounded-2xl border border-green-600/25 bg-white/70 p-6 text-left shadow-sm md:grid-cols-2 md:gap-10 md:p-10">
      {/* Left: slider */}
      <div className="flex flex-col justify-center">
        <label htmlFor="missed-per-day" className="font-serif text-xl text-green-800 md:text-2xl">
          How many prayers do you miss a day?
        </label>

        <div className="mt-8 flex items-baseline gap-3">
          <span className="font-serif text-6xl font-semibold tabular-nums text-green-800">{perDay}</span>
          <span className="text-green-700/70">of 5 daily prayers</span>
        </div>

        <input
          id="missed-per-day"
          type="range"
          min={0}
          max={5}
          step={1}
          value={perDay}
          onChange={(e) => setPerDay(Number(e.target.value))}
          aria-valuetext={`${perDay} prayers missed per day`}
          className="prayer-slider mt-6 w-full"
        />
        <div className="mt-2 flex justify-between text-xs text-green-700/55 tabular-nums" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
      </div>

      {/* Right: the numbers */}
      <div className="flex flex-col justify-center gap-3 border-t border-green-600/20 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-10">
        <p className="text-xs font-semibold uppercase tracking-eyebrow text-amber-700">That adds up to</p>
        {PERIODS.map((period) => {
          const total = perDay * period.days;
          return (
            <div key={period.label} className="flex items-baseline justify-between gap-4">
              <span className="text-green-700/80">{period.label}</span>
              <span className="font-serif text-3xl font-semibold tabular-nums text-green-800 md:text-4xl">
                {total.toLocaleString("en-US")}
              </span>
            </div>
          );
        })}
        <p className="mt-2 text-sm leading-relaxed text-green-700/70">
          {perDay === 0
            ? "Not one missed — may it stay that way, in shā' Allah."
            : "prayers that could have been kept. Iqama helps you reclaim them, one at a time."}
        </p>
      </div>
    </div>
  );
}
