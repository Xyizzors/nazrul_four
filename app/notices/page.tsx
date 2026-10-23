import type { Metadata } from "next";
import { ICON, bilingual, innerHero } from "@/components/ui";
import data_notices from "@/data/notices.json";
import { textMap, type NoticeItem } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";

export function generateMetadata(): Metadata {
  const { title, description } = data_notices.meta[0];
  return { title, description };
}

const txt = textMap(data_notices.texts);

export default function NoticesPage() {
  const notices: NoticeItem[] = data_notices.notices;

  return (
    <>
      <ExtraImages items={data_notices.extras} after={0} />
      {innerHero({
        eyebrow_en: txt.t1.en,
        eyebrow_bn: txt.t1.bn,
        title_en: txt.t2.en,
        title_bn: txt.t2.bn,
        desc_en: txt.t3.en,
        desc_bn: txt.t3.bn,
      })}
      <ExtraImages items={data_notices.extras} after={1} />

      <section className="section-pad">
        <div className="wrap max-w-3xl">
          <p className="text-xs text-charcoal-500 mb-8 border border-charcoal-900/15 rounded-sm px-4 py-3 bg-cream-100 lang-en">
            {txt.t4.en}
          </p>
          <p className="text-xs text-charcoal-500 mb-8 border border-charcoal-900/15 rounded-sm px-4 py-3 bg-cream-100 lang-bn">
            {txt.t4.bn}
          </p>

          <div className="flex flex-col divide-y divide-charcoal-900/10 border-t border-b border-charcoal-900/10">
            {notices.map((n, __i) => (
              <div
                key={__i}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-5"
              >
                <span className="tag-pill tag-notice shrink-0 w-fit">
                  {bilingual(txt.t5.en, txt.t5.bn)}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-charcoal-900 lang-en">
                    {n.en}
                  </p>
                  <p className="font-semibold text-charcoal-900 lang-bn">
                    {n.bn}
                  </p>
                </div>
                <p className="text-xs text-charcoal-500 shrink-0 sm:w-28">
                  {n.date}
                </p>
                <button className="btn btn-outline-dark btn-sm shrink-0">
                  {ICON.download} {bilingual(txt.t6.en, txt.t6.bn)}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ExtraImages items={data_notices.extras} after={2} />
    </>
  );
}
