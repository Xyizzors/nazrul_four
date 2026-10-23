import type { Metadata } from "next";
import { ICON, bilingual, innerHero } from "@/components/ui";
import data_annual_newsletter from "@/data/annual-newsletter.json";
import { textMap } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";

export function generateMetadata(): Metadata {
  const { title, description } = data_annual_newsletter.meta[0];
  return { title, description };
}

const txt = textMap(data_annual_newsletter.texts);

export default function AnnualNewsletterPage() {
  const newsletters = data_annual_newsletter.newsletters;

  return (
    <>
      <ExtraImages items={data_annual_newsletter.extras} after={0} />
      {innerHero({
        eyebrow_en: txt.t1.en,
        eyebrow_bn: txt.t1.bn,
        title_en: txt.t2.en,
        title_bn: txt.t2.bn,
        desc_en: txt.t3.en,
        desc_bn: txt.t3.bn,
      })}
      <ExtraImages items={data_annual_newsletter.extras} after={1} />

      <section className="section-pad">
        <div className="wrap">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="font-display text-2xl text-green-900 mb-4">
              {bilingual(txt.t5.en, txt.t5.bn)}
            </h2>
            <p className="text-charcoal-700 text-sm lang-en">{txt.t4.en}</p>
            <p className="text-charcoal-700 text-sm lang-bn">{txt.t4.bn}</p>
          </div>

          <div className={newsletters.length === 1 ? "grid gap-6 max-w-md mx-auto" : "grid sm:grid-cols-2 gap-6"}>
            {newsletters.map((n, __i) => (
              <div
                key={__i}
                className="card overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="h-48 bg-gradient-to-br from-green-900/10 to-gold-500/10 flex items-center justify-center p-6">
                  <div className="text-center">
                    <span className="text-6xl font-display text-green-900/30">
                      {n.year}
                    </span>
                    <p className="text-sm text-charcoal-600 mt-2 lang-en">
                      {txt.t6.en}
                    </p>
                    <p className="text-sm text-charcoal-600 mt-2 lang-bn">
                      {txt.t6.bn}
                    </p>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-lg text-green-900 mb-3">
                    <span className="lang-en">{n.title_en}</span>
                    <span className="lang-bn">{n.title_bn}</span>
                  </h3>
                  <p className="text-sm text-charcoal-700 mb-6 flex-1">
                    <span className="lang-en">{n.desc_en}</span>
                    <span className="lang-bn">{n.desc_bn}</span>
                  </p>
                  <button className="btn btn-outline-dark btn-sm w-full flex items-center justify-center gap-2">
                    {ICON.download} {bilingual(txt.t7.en, txt.t7.bn)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ExtraImages items={data_annual_newsletter.extras} after={2} />

      <section className="section-pad bg-cream-100">
        <div className="wrap max-w-2xl">
          <h2 className="font-display text-2xl text-green-900 mb-6">
            {bilingual(txt.t9.en, txt.t9.bn)}
          </h2>
          <p className="text-charcoal-700 leading-relaxed mb-6 lang-en">
            {txt.t8.en}
          </p>
          <p className="text-charcoal-700 leading-relaxed mb-6 lang-bn">
            {txt.t8.bn}
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder={txt.email_ph.text}
              className="flex-1 px-4 py-2 border border-charcoal-900/20 rounded-sm bg-white"
            />
            <button type="submit" className="btn btn-primary">
              {bilingual(txt.t10.en, txt.t10.bn)}
            </button>
          </form>
        </div>
      </section>
      <ExtraImages items={data_annual_newsletter.extras} after={3} />
    </>
  );
}
