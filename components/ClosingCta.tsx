import WaitlistForm from "./WaitlistForm";

export default function ClosingCta() {
  return (
    <section className="snap-panel flex flex-col justify-center px-4 pb-20 pt-24 sm:pb-28 sm:pt-12">
      <div className="reveal mx-auto max-w-2xl overflow-hidden rounded-2xl border border-green-600/25 bg-gradient-to-b from-white/80 to-amber-400/15 p-8 text-center shadow-sm sm:p-10 md:p-14">
        <h2 className="font-serif text-[1.75rem] font-medium text-green-800 sm:text-3xl md:text-4xl">Be there for the first five.</h2>
        <p className="mx-auto mt-4 max-w-md text-green-700/80">
          We&rsquo;ll send one email when Iqama is ready — nothing else. Guard your prayer from the scroll, in shā&rsquo;
          Allah.
        </p>
        <WaitlistForm variant="footer" />
      </div>
    </section>
  );
}
