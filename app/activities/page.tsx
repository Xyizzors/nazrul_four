import type { Metadata } from "next";
import { innerHero, photo } from "@/components/ui";
import data_activities from "@/data/activities.json";
import { textMap } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";

export function generateMetadata(): Metadata {
  const { title, description } = data_activities.meta[0];
  return { title, description };
}

const txt = textMap(data_activities.texts);

export default function ActivitiesPage() {
  const acts = data_activities.acts;

  return (
    <>
      <ExtraImages items={data_activities.extras} after={0} />
      {innerHero({
        eyebrow_en: txt.t1.en,
        eyebrow_bn: txt.t1.bn,
        title_en: txt.t2.en,
        title_bn: txt.t2.bn,
        desc_en: txt.t3.en,
        desc_bn: txt.t3.bn,
      })}
      <ExtraImages items={data_activities.extras} after={1} />

      <section className="section-pad">
        <div className="wrap grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {acts.map((a, __i) => (
            <article key={__i} className="card overflow-hidden flex flex-col">
              {photo(
                { src: a.photo },
                "Activity photo — placeholder",
                "aspect-[4/3]",
              )}
              <div className="p-5 flex flex-col gap-2 flex-1">
                <p className="text-xs text-charcoal-500">{a.date}</p>
                <h3 className="font-display text-lg text-green-900 leading-snug">
                  <span className="lang-en">{a.en}</span>
                  <span className="lang-bn">{a.bn}</span>
                </h3>
                <p className="text-sm text-charcoal-700 leading-relaxed flex-1">
                  <span className="lang-en">{a.desc_en}</span>
                  <span className="lang-bn">{a.desc_bn}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <ExtraImages items={data_activities.extras} after={2} />
    </>
  );
}
