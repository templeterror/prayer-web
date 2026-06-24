import WaitlistForm from "./WaitlistForm";

export default function Hero() {
  return (
    <section className="snap-panel hero-bg relative flex flex-col justify-center overflow-hidden px-4 pt-24 pb-20 sm:pt-40 sm:pb-28 md:pt-48 md:pb-36">
      <div className="arc glow-pulse top-24 sm:top-28 md:top-32" aria-hidden="true" />

      <div className="relative mx-auto max-w-content text-center">
        <p className="reveal mb-5 text-xs font-semibold uppercase tracking-eyebrow text-amber-700 sm:mb-6">
          Built for the five
        </p>

        <h1 className="reveal mx-auto max-w-3xl font-serif text-[2.6rem] font-semibold leading-[1.1] text-green-800 sm:text-5xl md:text-6xl">
          Don&rsquo;t scroll through
          <br className="hidden sm:block" /> your{" "}
          <span className="amber-text-gradient">salah</span>.
        </h1>

        <p className="reveal mx-auto mt-5 max-w-lg text-base leading-relaxed text-green-800 sm:mt-6 sm:text-lg">
          Every app on your phone is built to win your attention. Reclaim the five prayers from the scroll.
        </p>

        <div id="waitlist" className="reveal scroll-mt-28">
          <WaitlistForm variant="hero" />
        </div>
      </div>
    </section>
  );
}
