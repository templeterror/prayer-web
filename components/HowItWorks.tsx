const STEPS = [
  {
    title: "The window opens",
    body: "Prayer times are calculated on-device. When its time, the apps you chose lock.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "The gatekeeper",
    body: "Pray with presence. There's a free five-minute escape hatch if you truly need it.",
    icon: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 12.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    title: "Your Data",
    body: "Track how your commitment to deen is improving over time.",
    icon: (
      <path
        d="M12 3l2.4 5 5.6.6-4 4 1 5.4L12 15.8 6.9 18l1-5.4-4-4L9.6 8 12 3z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    ),
  },
];

function SectionHeading() {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-16">
      <p className="reveal mb-4 text-xs font-semibold uppercase tracking-eyebrow text-amber-700">
        How it works
      </p>
      <h2 className="reveal font-serif text-[1.75rem] font-medium text-green-800 sm:text-3xl md:text-4xl">
        Three steps. Five times a day.
      </h2>
    </div>
  );
}

function StepIcon({ icon, className = "" }: { icon: React.ReactNode; className?: string }) {
  return (
    <div
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full bg-amber-400/25 text-amber-700 ${className}`}
      aria-hidden="true"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        {icon}
      </svg>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <>
      <div id="how-it-works" aria-hidden="true" className="scroll-mt-24" />
      {/* MOBILE (<640px): one full-screen snap panel holding the header + all
          three steps as compact stacked rows, sized to fit a single screen. */}
      <section className="snap-panel flex flex-col justify-center px-5 pb-10 pt-24 sm:hidden">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 text-center">
            <p className="reveal mb-3 text-xs font-semibold uppercase tracking-eyebrow text-amber-700">
              How it works
            </p>
            <h2 className="reveal font-serif text-2xl font-medium leading-tight text-green-800">
              Three steps. Five times a day.
            </h2>
          </div>
          <ol className="space-y-4">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="reveal flex gap-4 rounded-xl border border-green-600/25 bg-white/70 p-4"
              >
                <span className="shrink-0">
                  <StepIcon icon={step.icon} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-serif text-lg font-medium leading-snug text-green-800">
                    <span className="text-amber-700/80 tabular-nums">{i + 1}.</span> {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-green-700/80">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* DESKTOP (≥640px): original three-up grid, unchanged. */}
      <section className="hidden px-4 py-16 sm:block sm:py-24 md:py-28">
        <div className="mx-auto max-w-content">
          <SectionHeading />
          <ol className="grid gap-5 sm:gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.title} className="reveal rounded-xl border border-green-600/25 bg-white/70 p-6 sm:p-7">
                <StepIcon icon={step.icon} className="mb-5" />
                <h3 className="font-serif text-xl font-medium text-green-800">{step.title}</h3>
                <p className="mt-2 text-green-700/80">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
