import { BUSINESS, CTA, NAV_LINKS, SERVICE_CARDS } from "@/content/site";

export default function CTAFooter() {
  return (
    <>
      {/* Pink banner CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="rounded-4xl bg-gradient-to-br from-blush to-blush-mid px-6 py-14 text-center shadow-soft">
          <h2 className="font-heading text-3xl text-white sm:text-4xl">
            Ready for a fluffier, happier pup?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/90">
            Same-week spots fill fast. Book online in a couple of minutes — no
            deposit, pay at pickup.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href="/book"
              className="rounded-full bg-white px-6 py-3 font-semibold text-blush shadow-card transition hover:bg-cream"
            >
              {CTA.primary}
            </a>
            <a
              href={BUSINESS.phoneHref}
              className="rounded-full border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Call {BUSINESS.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="visit" className="border-t border-black/5 bg-cream-deep">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
          {/* Brand + social */}
          <div>
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="grid h-9 w-9 place-items-center rounded-full bg-blush text-lg"
              >
                🐾
              </span>
              <span className="font-heading text-xl text-brown">GumiPaws</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-brown-soft">
              A boutique dog grooming spa. Warm baths, honest prices, happy pups.
            </p>
            <div className="mt-4 flex gap-3 text-brown-soft">
              <a href="#" aria-label="Instagram" className="hover:text-brown">
                Instagram
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-brown">
                Facebook
              </a>
              <a href="#" aria-label="TikTok" className="hover:text-brown">
                TikTok
              </a>
            </div>
          </div>

          {/* Services links */}
          <div>
            <h3 className="font-heading text-lg text-brown">Services</h3>
            <ul className="mt-3 space-y-2 text-sm text-brown-soft">
              {SERVICE_CARDS.filter((c) => !c.accent).map((c) => (
                <li key={c.title}>
                  <a href="/#services" className="hover:text-brown">
                    {c.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Spa links */}
          <div>
            <h3 className="font-heading text-lg text-brown">Spa</h3>
            <ul className="mt-3 space-y-2 text-sm text-brown-soft">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-brown">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="/admin" className="hover:text-brown">
                  Staff login
                </a>
              </li>
            </ul>
          </div>

          {/* Visit info */}
          <div>
            <h3 className="font-heading text-lg text-brown">Visit</h3>
            <address className="mt-3 space-y-2 text-sm not-italic text-brown-soft">
              <p>{BUSINESS.address}</p>
              <p>
                <a href={BUSINESS.phoneHref} className="hover:text-brown">
                  {BUSINESS.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="hover:text-brown"
                >
                  {BUSINESS.email}
                </a>
              </p>
              <p>{BUSINESS.hours}</p>
            </address>
          </div>
        </div>

        <div className="border-t border-black/5 py-5 text-center text-xs text-brown-soft">
          © {new Date().getFullYear()} GumiPaws. All rights reserved.
        </div>
      </footer>
    </>
  );
}
