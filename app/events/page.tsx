import type { Metadata } from "next";
import { ICON, bilingual, innerHero, photo } from "@/components/ui";
import data_events from "@/data/events.json";
import { textMap, type EventItem } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";

const txt = textMap(data_events.texts);

export function generateMetadata(): Metadata {
  const { title, description } = data_events.meta[0];
  return { title, description };
}

export default function EventsPage() {
  const upcoming: EventItem[] = data_events.upcoming;
  const past: EventItem[] = data_events.past;

  const grid = (list: EventItem[], tag: string) => (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {list.map((e, __i) => (
        <div key={__i} className="card overflow-hidden">
          {photo({ src: e.photo }, e.en + " — placeholder", "aspect-[4/3]")}
          <div className="p-5">
            <span className={`tag-pill tag-${tag} w-fit`}>
              {tag === "event"
                ? bilingual(txt.t1.en, txt.t1.bn)
                : bilingual(txt.t2.en, txt.t2.bn)}
            </span>
            <h3 className="font-display text-base text-green-900 mt-3 leading-snug">
              <span className="lang-en">{e.en}</span>
              <span className="lang-bn">{e.bn}</span>
            </h3>
            <a
              href="#"
              className="text-sm font-semibold text-green-900 inline-flex items-center gap-1 mt-2"
            >
              {bilingual(txt.t3.en, txt.t3.bn)} {ICON.arrow}
            </a>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <ExtraImages items={data_events.extras} after={0} />
      {innerHero({
        eyebrow_en: txt.t4.en,
        eyebrow_bn: txt.t4.bn,
        title_en: txt.t5.en,
        title_bn: txt.t5.bn,
        desc_en: txt.t6.en,
        desc_bn: txt.t6.bn,
      })}
      <ExtraImages items={data_events.extras} after={1} />

      {upcoming.length > 0 && (
        <section className="section-pad">
          <div className="wrap">
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-display text-3xl text-green-900 font-medium">
                {bilingual(txt.t7.en, txt.t7.bn)}
              </h2>
            </div>
            {grid(upcoming, "event")}
          </div>
        </section>
      )}
      <ExtraImages items={data_events.extras} after={2} />

      <section className="section-pad bg-cream-100">
        <div className="wrap">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-display text-3xl text-green-900 font-medium">
              {bilingual(txt.t8.en, txt.t8.bn)}
            </h2>
          </div>
          {grid(past, "program")}
        </div>
      </section>
      <ExtraImages items={data_events.extras} after={3} />
    </>
  );
}
