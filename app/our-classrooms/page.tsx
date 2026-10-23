import type { Metadata } from "next";
import { bilingual, innerHero, photo } from "@/components/ui";
import data_our_classrooms from "@/data/our-classrooms.json";
import { textMap } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";

export function generateMetadata(): Metadata {
  const { title, description } = data_our_classrooms.meta[0];
  return { title, description };
}

const txt = textMap(data_our_classrooms.texts);

export default function OurClassroomsPage() {
  const classrooms = data_our_classrooms.classrooms;

  return (
    <>
      <ExtraImages items={data_our_classrooms.extras} after={0} />
      {innerHero({
        eyebrow_en: txt.t1.en,
        eyebrow_bn: txt.t1.bn,
        title_en: txt.t2.en,
        title_bn: txt.t2.bn,
        desc_en: txt.t3.en,
        desc_bn: txt.t3.bn,
      })}
      <ExtraImages items={data_our_classrooms.extras} after={1} />

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
            {classrooms.map((c, __i) => (
              <div key={__i} className="card overflow-hidden">
                <div className="h-48 relative">
                  {photo(
                    { src: c.photo },
                    "Classroom — placeholder",
                    "aspect-[4/3]",
                    "!rounded-none h-full",
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg text-green-900 mb-2">
                    <span className="lang-en">{c.name_en}</span>
                    <span className="lang-bn">{c.name_bn}</span>
                  </h3>
                  <p className="text-xs text-charcoal-500 font-semibold mb-3">
                    {bilingual(txt.t6.en, txt.t6.bn)}
                    {c.capacity}
                  </p>
                  <p className="text-sm text-charcoal-700">
                    <span className="lang-en">{c.desc_en}</span>
                    <span className="lang-bn">{c.desc_bn}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ExtraImages items={data_our_classrooms.extras} after={2} />

      <section className="section-pad bg-cream-100">
        <div className="wrap max-w-2xl">
          <h2 className="font-display text-2xl text-green-900 mb-6">
            {bilingual(txt.t8.en, txt.t8.bn)}
          </h2>
          <p className="text-charcoal-700 leading-relaxed mb-4 lang-en">
            {txt.t7.en}
          </p>
          <p className="text-charcoal-700 leading-relaxed mb-4 lang-bn">
            {txt.t7.bn}
          </p>
          <button className="btn btn-primary">
            {bilingual(txt.t9.en, txt.t9.bn)}
          </button>
        </div>
      </section>
      <ExtraImages items={data_our_classrooms.extras} after={3} />
    </>
  );
}
