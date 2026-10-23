import type { Metadata } from "next";
import { ICON, innerHero, photo } from "@/components/ui";
import data_publications from "@/data/publications.json";
import { textMap } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";

export function generateMetadata(): Metadata {
  const { title, description } = data_publications.meta[0];
  return { title, description };
}

const txt = textMap(data_publications.texts);

export default function PublicationsPage() {
  const pubs = data_publications.pubs;

  return (
    <>
      <ExtraImages items={data_publications.extras} after={0} />
      {innerHero({
        eyebrow_en: txt.t1.en,
        eyebrow_bn: txt.t1.bn,
        title_en: txt.t2.en,
        title_bn: txt.t2.bn,
        desc_en: txt.t3.en,
        desc_bn: txt.t3.bn,
      })}
      <ExtraImages items={data_publications.extras} after={1} />

      <section className="section-pad">
        <div className="wrap">
          <div
            id="pubGrid"
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {pubs.map((p, i) => (
              <div key={i} className="flex flex-col">
                {photo({ src: p.photo }, "Cover — placeholder", "aspect-[3/4]")}
                <h3 className="font-display text-base text-green-900 mt-4 leading-snug">
                  <span className="lang-en">{p.title_en}</span>
                  <span className="lang-bn">{p.title_bn}</span>
                </h3>
                {p.auth ? (
                  <p className="text-xs text-charcoal-500 mt-1">{p.auth}</p>
                ) : (
                  ""
                )}
                <details className="mt-2 group">
                  <summary className="text-sm font-semibold text-green-900 inline-flex items-center gap-1 cursor-pointer list-none w-fit">
                    <span className="lang-en">{txt.t4.en}</span>
                    <span className="lang-bn">{txt.t4.bn}</span>
                    <span className="transition-transform group-open:rotate-90">
                      {ICON.arrow}
                    </span>
                  </summary>
                  <div className="mt-2 text-xs text-charcoal-500 leading-relaxed">
                    <p className="lang-en">{txt.t5.en}</p>
                    <p className="lang-bn">{txt.t5.bn}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ExtraImages items={data_publications.extras} after={2} />
    </>
  );
}
