import MissedPrayersCalculator from "./MissedPrayersCalculator";
import MissedPrayersCalculatorMobile from "./MissedPrayersCalculatorMobile";

export default function Reckoning() {
  return (
    <section className="snap-panel flex flex-col justify-center px-4 pb-16 pt-24 sm:py-24 md:py-32">
      <div className="mx-auto max-w-content">
        <div className="mx-auto max-w-2xl text-center">
          <p className="reveal mb-5 text-xs font-semibold uppercase tracking-eyebrow text-amber-700">
            The quiet cost
          </p>
          <h2 className="reveal font-serif text-2xl font-medium leading-tight text-green-800 sm:text-3xl md:text-4xl">
            {/* Mobile: short. Desktop: full sentence. */}
            <span className="sm:hidden">How many prayers slipped away?</span>
            <span className="hidden sm:inline">
              How many prayers slipped away
              <br className="hidden sm:block" /> while the screen kept pulling?
            </span>
          </h2>
        </div>

        <div className="md:hidden">
          <MissedPrayersCalculatorMobile />
        </div>
        <div className="hidden md:block">
          <MissedPrayersCalculator />
        </div>

        {/* Ayah — Qur'an 4:103, Sahih International (user-approved) */}
        <figure className="reveal mx-auto mt-12 max-w-xl border-t border-green-600/70 pt-9 text-center sm:mt-16 sm:pt-10">
          <blockquote className="font-serif text-xl italic leading-relaxed text-green-800 sm:text-2xl md:text-3xl">
            &ldquo;Indeed, prayer has been decreed upon the believers a decree of specified times.&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-sm font-semibold uppercase tracking-eyebrow text-amber-700">
            Qur&rsquo;an 4:103
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
