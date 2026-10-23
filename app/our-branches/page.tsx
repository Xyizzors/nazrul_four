import type { Metadata } from "next";
import { ICON, bilingual, innerHero } from "@/components/ui";
import data_our_branches from "@/data/our-branches.json";
import { textMap } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";

const txt = textMap(data_our_branches.texts);

export function generateMetadata(): Metadata {
  const { title, description } = data_our_branches.meta[0];
  return { title, description };
}

export default function OurBranchesPage() {
  const branches = data_our_branches.branches;

  return (
    <>
      <ExtraImages items={data_our_branches.extras} after={0} />
      {innerHero({
        eyebrow_en: txt.t1.en,
        eyebrow_bn: txt.t1.bn,
        title_en: txt.t2.en,
        title_bn: txt.t2.bn,
        desc_en: txt.t3.en,
        desc_bn: txt.t3.bn,
      })}
      <ExtraImages items={data_our_branches.extras} after={1} />

      <section className="section-pad">
        <div className="wrap">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="font-display text-2xl text-green-900 mb-4">
              {bilingual(txt.t5.en, txt.t5.bn)}
            </h2>
            <p className="text-charcoal-700 text-sm lang-en">{txt.t4.en}</p>
            <p className="text-charcoal-700 text-sm lang-bn">{txt.t4.bn}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {branches.map((b, __i) => (
              <div key={__i} className="card p-6 border-l-4 border-gold-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display text-lg text-green-900">
                      <span className="lang-en">{b.name_en}</span>
                      <span className="lang-bn">{b.name_bn}</span>
                    </h3>
                    <p className="text-sm text-charcoal-600 mt-1 flex items-center gap-2">
                      {ICON.pin}
                      <span className="lang-en">{b.location_en}</span>
                      <span className="lang-bn">{b.location_bn}</span>
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-gold-700 bg-gold-50 px-3 py-1 rounded-full">
                    {txt.t6.text} {b.est}
                  </span>
                </div>
                <p className="text-sm text-charcoal-700">
                  <span className="lang-en">{b.programs_en}</span>
                  <span className="lang-bn">{b.programs_bn}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ExtraImages items={data_our_branches.extras} after={2} />

      <section className="section-pad bg-cream-100">
        <div className="wrap max-w-2xl">
          <h2 className="font-display text-2xl text-green-900 mb-6">
            {bilingual(txt.t8.en, txt.t8.bn)}
          </h2>
          <p className="text-charcoal-700 leading-relaxed mb-6 lang-en">
            {txt.t7.en}
          </p>
          <p className="text-charcoal-700 leading-relaxed mb-6 lang-bn">
            {txt.t7.bn}
          </p>
          <button className="btn btn-primary">
            {bilingual(txt.t9.en, txt.t9.bn)}
          </button>
        </div>
      </section>
      <ExtraImages items={data_our_branches.extras} after={3} />
    </>
  );
}
