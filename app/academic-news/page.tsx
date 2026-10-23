import type { Metadata } from "next";
import { bilingual, innerHero } from "@/components/ui";
import data_academic_news from "@/data/academic-news.json";
import { textMap } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";

export function generateMetadata(): Metadata {
  const { title, description } = data_academic_news.meta[0];
  return { title, description };
}

const txt = textMap(data_academic_news.texts);

export default function AcademicNewsPage() {
  const news = data_academic_news.news;

  return (
    <>
      <ExtraImages items={data_academic_news.extras} after={0} />
      {innerHero({
        eyebrow_en: txt.t1.en,
        eyebrow_bn: txt.t1.bn,
        title_en: txt.t2.en,
        title_bn: txt.t2.bn,
        desc_en: txt.t3.en,
        desc_bn: txt.t3.bn,
      })}
      <ExtraImages items={data_academic_news.extras} after={1} />

      <section className="section-pad">
        <div className="wrap max-w-3xl">
          <div className="flex flex-col divide-y divide-charcoal-900/10 border-t border-b border-charcoal-900/10">
            {news.map((n, __i) => (
              <div
                key={__i}
                className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 py-6"
              >
                <span
                  className="tag-pill tag-notice shrink-0 w-fit"
                  style={{
                    backgroundColor: `var(--color-teal-500)`,
                    color: `white`,
                  }}
                >
                  {bilingual(txt.t4.en, txt.t4.bn)}
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-charcoal-900 text-lg">
                    <span className="lang-en">{n.en}</span>
                    <span className="lang-bn">{n.bn}</span>
                  </h3>
                  <p className="text-sm text-charcoal-700 leading-relaxed mt-2">
                    <span className="lang-en">{n.desc_en}</span>
                    <span className="lang-bn">{n.desc_bn}</span>
                  </p>
                </div>
                <p className="text-xs text-charcoal-500 shrink-0 sm:w-28 mt-2 sm:mt-0">
                  {n.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ExtraImages items={data_academic_news.extras} after={2} />
    </>
  );
}
