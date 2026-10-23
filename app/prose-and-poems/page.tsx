import type { Metadata } from "next";
import { bilingual, innerHero } from "@/components/ui";
import data_prose_and_poems from "@/data/prose-and-poems.json";
import { textMap } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";

export function generateMetadata(): Metadata {
  const { title, description } = data_prose_and_poems.meta[0];
  return { title, description };
}

const txt = textMap(data_prose_and_poems.texts);

export default function ProseAndPoemsPage() {
  const works = data_prose_and_poems.works;

  return (
    <>
      <ExtraImages items={data_prose_and_poems.extras} after={0} />
      {innerHero({
        eyebrow_en: txt.t1.en,
        eyebrow_bn: txt.t1.bn,
        title_en: txt.t2.en,
        title_bn: txt.t2.bn,
        desc_en: txt.t3.en,
        desc_bn: txt.t3.bn,
      })}
      <ExtraImages items={data_prose_and_poems.extras} after={1} />

      <section className="section-pad">
        <div className="wrap">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="font-display text-2xl text-green-900 mb-4">
              {bilingual(txt.t5.en, txt.t5.bn)}
            </h2>
            <p className="text-charcoal-700 text-sm lang-en">{txt.t4.en}</p>
            <p className="text-charcoal-700 text-sm lang-bn">{txt.t4.bn}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {works.map((w, __i) => (
              <div
                key={__i}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display text-lg text-green-900">
                      <span className="lang-en">{w.title_en}</span>
                      <span className="lang-bn">{w.title_bn}</span>
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-charcoal-500 bg-charcoal-100 px-3 py-1 rounded-full">
                    {w.year}
                  </span>
                </div>
                <p className="text-sm text-charcoal-700">
                  <span className="lang-en">{w.desc_en}</span>
                  <span className="lang-bn">{w.desc_bn}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ExtraImages items={data_prose_and_poems.extras} after={2} />

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
          <button className="btn btn-primary">
            {bilingual(txt.t8.en, txt.t8.bn)}
          </button>
        </div>
      </section>
      <ExtraImages items={data_prose_and_poems.extras} after={3} />
    </>
  );
}
