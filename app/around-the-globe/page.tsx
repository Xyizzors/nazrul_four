import type { Metadata } from "next";
import { ICON, bilingual, innerHero } from "@/components/ui";
import data_around_the_globe from "@/data/around-the-globe.json";
import { textMap } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";

export function generateMetadata(): Metadata {
  const { title, description } = data_around_the_globe.meta[0];
  return { title, description };
}

const txt = textMap(data_around_the_globe.texts);

export default function AroundTheGlobePage() {
  const regions = data_around_the_globe.regions;

  return (
    <>
      <ExtraImages items={data_around_the_globe.extras} after={0} />
      {innerHero({
        eyebrow_en: txt.t1.en,
        eyebrow_bn: txt.t1.bn,
        title_en: txt.t2.en,
        title_bn: txt.t2.bn,
        desc_en: txt.t3.en,
        desc_bn: txt.t3.bn,
      })}
      <ExtraImages items={data_around_the_globe.extras} after={1} />

      <section className="section-pad">
        <div className="wrap">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="font-display text-2xl text-green-900 mb-4">
              {bilingual(txt.t5.en, txt.t5.bn)}
            </h2>
            <p className="text-charcoal-700 text-sm lang-en">{txt.t4.en}</p>
            <p className="text-charcoal-700 text-sm lang-bn">{txt.t4.bn}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions.map((r, __i) => (
              <div
                key={__i}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-gold-500/15 flex items-center justify-center mb-4">
                  {ICON.pin}
                </div>
                <h3 className="font-display text-lg text-green-900 mb-2">
                  <span className="lang-en">{r.country_en}</span>
                  <span className="lang-bn">{r.country_bn}</span>
                </h3>
                <p className="text-sm text-charcoal-600 mb-3">
                  <span className="lang-en">{r.city_en}</span>
                  <span className="lang-bn">{r.city_bn}</span>
                </p>
                <div className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full w-fit">
                  <span className="lang-en">{r.status_en}</span>
                  <span className="lang-bn">{r.status_bn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ExtraImages items={data_around_the_globe.extras} after={2} />

      <section className="section-pad bg-cream-100">
        <div className="wrap max-w-2xl">
          <h2 className="font-display text-2xl text-green-900 mb-6">
            {bilingual(txt.t7.en, txt.t7.bn)}
          </h2>
          <p className="text-charcoal-700 leading-relaxed mb-4 lang-en">
            {txt.t6.en}
          </p>
          <p className="text-charcoal-700 leading-relaxed mb-4 lang-bn">
            {txt.t6.bn}
          </p>
        </div>
      </section>
      <ExtraImages items={data_around_the_globe.extras} after={3} />
    </>
  );
}
