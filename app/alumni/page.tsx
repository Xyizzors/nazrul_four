import type { Metadata } from "next";
import { bilingual, innerHero, photo } from "@/components/ui";
import data_alumni from "@/data/alumni.json";
import { textMap } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";

export function generateMetadata(): Metadata {
  const { title, description } = data_alumni.meta[0];
  return { title, description };
}

const txt = textMap(data_alumni.texts);

export default function AlumniPage() {
  const alumni = data_alumni.alumni;

  return (
    <>
      <ExtraImages items={data_alumni.extras} after={0} />
      {innerHero({
        eyebrow_en: txt.t1.en,
        eyebrow_bn: txt.t1.bn,
        title_en: txt.t2.en,
        title_bn: txt.t2.bn,
        desc_en: txt.t3.en,
        desc_bn: txt.t3.bn,
      })}
      <ExtraImages items={data_alumni.extras} after={1} />

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
            {alumni.map((a, __i) => (
              <div key={__i} className="card overflow-hidden flex flex-col">
                {photo(
                  { src: a.photo },
                  "Alumni photo — placeholder",
                  "aspect-[4/5]",
                )}
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <p className="text-xs text-charcoal-500 font-semibold">
                    {a.class}
                  </p>
                  <h3 className="font-display text-lg text-green-900 leading-snug">
                    <span className="lang-en">{a.name_en}</span>
                    <span className="lang-bn">{a.name_bn}</span>
                  </h3>
                  <p className="text-sm text-charcoal-700">
                    <span className="lang-en">{a.field_en}</span>
                    <span className="lang-bn">{a.field_bn}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ExtraImages items={data_alumni.extras} after={2} />

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
          <button className="btn btn-primary mt-4">
            {bilingual(txt.t8.en, txt.t8.bn)}
          </button>
        </div>
      </section>
      <ExtraImages items={data_alumni.extras} after={3} />
    </>
  );
}
