const STEPS = [
  {
    n: "01",
    lead: "Your attention is sacred.",
    body: "Infinite feeds, notifications, autoplay. Every detail is tuned to keep you scrolling.",
  },
  {
    n: "02",
    lead: "Willpower alone is not enough.",
    body: "You are one person against giants whose business model is your attention.",
  },
  {
    n: "03",
    lead: "Friction is the answer.",
    body: "Iqama puts a deliberate wall between you and procrastination.",
    highlight: true,
  },
];

function SectionHeading() {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-16">
      <p className="reveal mb-4 text-xs font-semibold uppercase tracking-eyebrow text-amber-700">
        Why it matters
      </p>
      <h2 className="reveal font-serif text-[1.75rem] font-medium leading-snug text-green-800 sm:text-3xl md:text-4xl">
        Your attention is being taken.
        <br className="hidden sm:block" /> Take it back on purpose.
      </h2>
    </div>
  );
}

export default function WhyDifferent() {
  return (
    <>
      <div id="why" aria-hidden="true" className="scroll-mt-24" />
      {/* MOBILE (<640px): one full-screen snap panel holding the header + all
          three points as compact numbered rows, sized to fit a single screen. */}
      <section className="snap-panel flex flex-col justify-center px-5 pb-10 pt-24 sm:hidden">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 text-center">
            <p className="reveal mb-3 text-xs font-semibold uppercase tracking-eyebrow text-amber-700">
              Why it matters
            </p>
            <h2 className="reveal font-serif text-2xl font-medium leading-tight text-green-800">
              Your attention is being taken. Take it back on purpose.
            </h2>
          </div>
          <ol className="space-y-4">
            {STEPS.map((step) => (
              <li
                key={step.n}
                className={`reveal flex gap-4 rounded-xl p-4 ${
                  step.highlight
                    ? "bg-amber-400/10"
                    : "border border-green-600/20"
                }`}
              >
                <span
                  className={`shrink-0 font-serif text-3xl font-semibold leading-none tabular-nums ${
                    step.highlight ? "text-amber-700" : "text-green-600/35"
                  }`}
                  aria-hidden="true"
                >
                  {step.n}
                </span>
                <div className="min-w-0">
                  <p className="font-serif text-lg font-medium leading-snug text-green-800">
                    {step.lead}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-green-700/80">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="reveal mt-6 text-center text-sm leading-relaxed text-green-700/80">
            Protecting your attention for your deen is the best investment you can make.{" "}
            <a
              href="#waitlist"
              className="font-semibold text-amber-700 underline decoration-amber-700/40 underline-offset-4 transition hover:decoration-amber-700"
            >
              Join the waitlist
            </a>
          </p>
        </div>
      </section>

      {/* DESKTOP (≥640px): original numbered list, unchanged. */}
      <section className="hidden px-4 py-16 sm:block sm:py-24 md:py-28">
        <div className="mx-auto max-w-content">
          <SectionHeading />
          <ol className="mx-auto max-w-3xl">
            {STEPS.map((step, i) => (
              <li
                key={step.n}
                className={`reveal flex gap-4 py-7 sm:gap-8 sm:py-8 ${
                  i !== 0 ? "border-t border-green-600/20" : ""
                }`}
              >
                <span
                  className={`shrink-0 font-serif text-3xl font-semibold tabular-nums sm:text-4xl md:text-5xl ${
                    step.highlight ? "text-amber-700" : "text-green-600/35"
                  }`}
                  aria-hidden="true"
                >
                  {step.n}
                </span>
                <div
                  className={
                    step.highlight
                      ? "rounded-xl bg-amber-400/10 p-5 sm:p-6"
                      : ""
                  }
                >
                  <p className="font-serif text-lg font-medium leading-snug text-green-800 sm:text-xl md:text-2xl">
                    {step.lead}
                  </p>
                  <p className="mt-3 leading-relaxed text-green-700/80">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="reveal mx-auto mt-10 max-w-3xl text-center leading-relaxed text-green-700/80">
            Protecting your attention for your deen is the best investment you can make.{" "}
            <a
              href="#waitlist"
              className="font-semibold text-amber-700 underline decoration-amber-700/40 underline-offset-4 transition hover:decoration-amber-700"
            >
              Join the waitlist
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
