export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-4 z-20 px-4">
      <nav className="mx-auto flex max-w-content items-center justify-between rounded-full border border-green-600/20 bg-cream/80 px-5 py-3 shadow-sm backdrop-blur-md">
        <a href="#top" className="flex items-center gap-2 font-serif text-lg font-semibold text-green-800">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 14c4-5 6-6 9-6s5 1 9 6" stroke="#cf7f1d" strokeWidth="1.6" strokeLinecap="round" />
            <path
              d="M4 17c3.5-4 5-5 8-5s4.5 1 8 5"
              stroke="#b56a14"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.8"
            />
          </svg>
          Iqama
        </a>
        <a
          href="#waitlist"
          className="cta-amber cursor-pointer rounded-full px-4 py-2 text-sm font-bold text-ink transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf4e8]"
        >
          Join the waitlist
        </a>
      </nav>
    </header>
  );
}
