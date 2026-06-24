"use client";

import { useState } from "react";

const LIFETIME_YEARS = 60; // praying years assumed (~age 15 to ~75)

const SECONDARY_PERIODS = [
  { label: "A month", days: 30 },
  { label: "A year", days: 365 },
] as const;

const LIFETIME_DAYS = 365 * LIFETIME_YEARS;

export default function MissedPrayersCalculatorMobile() {
  const [perDay, setPerDay] = useState(2);

  return (
    <div className="reveal mt-10 rounded-2xl border border-green-600/25 bg-white/70 p-6 text-left shadow-sm">
      {/* Slider block */}
      <label htmlFor="missed-per-day-m" className="font-serif text-xl text-green-800">
        How many prayers do you usually miss a day?
      </label>

      <div className="mt-6 flex items-baseline gap-3">
        <span className="font-serif text-7xl font-semibold tabular-nums leading-none text-green-800">
          {perDay}
        </span>
        <span className="text-green-700/70">of 5 daily prayers</span>
      </div>

      <input
        id="missed-per-day-m"
        type="range"
        min={0}
        max={5}
        step={1}
        value={perDay}
        onChange={(e) => setPerDay(Number(e.target.value))}
        aria-valuetext={`${perDay} prayers missed per day`}
        className="prayer-slider prayer-slider-lg mt-7 w-full"
      />
      <div
        className="mt-2 flex justify-between text-xs text-green-700/55 tabular-nums"
        aria-hidden="true"
      >
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>

      {/* Results block — the payoff */}
      <div className="mt-8 border-t border-green-600/20 pt-7">
        <p className="text-xs font-semibold uppercase tracking-eyebrow text-amber-700">That adds up to</p>

        <div className="mt-4 space-y-3">
          {SECONDARY_PERIODS.map((period) => {
            const total = perDay * period.days;
            return (
              <div key={period.label} className="flex items-baseline justify-between gap-4">
                <span className="text-green-700/80">{period.label}</span>
                <span className="font-serif text-2xl font-semibold tabular-nums text-green-800">
                  {total.toLocaleString("en-US")}
                </span>
              </div>
            );
          })}
        </div>

        {/* A lifetime — the gut-punch */}
        <div className="mt-5 rounded-2xl bg-amber-400/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-eyebrow text-amber-700">A lifetime</p>
          <p className="mt-1 font-serif text-6xl font-semibold tabular-nums leading-none text-green-800">
            {(perDay * LIFETIME_DAYS).toLocaleString("en-US")}
          </p>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-green-700/70">
          {perDay === 0
            ? "Not one missed — may it stay that way, in shā' Allah."
            : "prayers that could have been kept. Iqama helps you reclaim them, one at a time."}
        </p>
      </div>
    </div>
  );
}
