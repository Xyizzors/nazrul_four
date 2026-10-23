import type { Metadata } from "next";
import { bilingual, innerHero, photo } from "@/components/ui";
import data_page from "@/data/founders-and-board.json";
import { textMap, slotMap } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";

export function generateMetadata(): Metadata {
  const { title, description } = data_page.meta[0];
  return { title, description };
}

const txt = textMap(data_page.texts);
const imgs = slotMap(data_page.images);

export default function FoundersAndBoardPage() {
  return (
    <>
      <ExtraImages items={data_page.extras} after={0} />
      {innerHero({
        eyebrow_en: txt.t1.en,
        eyebrow_bn: txt.t1.bn,
        title_en: txt.t2.en,
        title_bn: txt.t2.bn,
        desc_en: txt.t3.en,
        desc_bn: txt.t3.bn,
      })}

      <section className="section-pad bg-cream-100">
        <div className="wrap">
          <div className="text-center max-w-xl mx-auto mb-12">
            
            <h2 className="font-display text-3xl mt-4 text-green-900 font-medium">
              {bilingual(txt.t5.en, txt.t5.bn)}
            </h2>
            <p className="mt-4 text-sm text-charcoal-500 lang-en">{txt.t6.en}</p>
            <p className="mt-4 text-sm text-charcoal-500 lang-bn">{txt.t6.bn}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {data_page.founders.map((f, i) => (
              <div key={i} className="text-center">
                {photo({ src: f.photo }, "Photo placeholder", "aspect-[3/4]", "!rounded-[6px]")}
                <p className="mt-4 font-semibold text-charcoal-900 lang-en">{f.name_en}</p>
                <p className="mt-4 font-semibold text-charcoal-900 lang-bn">{f.name_bn}</p>
                <p className="text-xs text-charcoal-500 mt-1">
                  <span className="lang-en">{f.role_en}</span>
                  <span className="lang-bn">{f.role_bn}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ExtraImages items={data_page.extras} after={1} />

      <section className="section-pad">
        <div className="wrap">
          <div className="text-center max-w-xl mx-auto mb-12">
            
            <h2 className="font-display text-3xl mt-4 text-green-900 font-medium">
              {bilingual(txt.t8.en, txt.t8.bn)}
            </h2>
            <p className="mt-4 text-sm text-charcoal-500 lang-en">{txt.t9.en}</p>
            <p className="mt-4 text-sm text-charcoal-500 lang-bn">{txt.t9.bn}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {data_page.board.map((m, i) => (
              <div key={i} className="text-center">
                <p className="font-semibold text-charcoal-900 text-sm lang-en">{m.name_en}</p>
                <p className="font-semibold text-charcoal-900 text-sm lang-bn">{m.name_bn}</p>
                <p className="text-xs text-charcoal-500 mt-1">
                  <span className="lang-en">{m.pos_en}</span>
                  <span className="lang-bn">{m.pos_bn}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ExtraImages items={data_page.extras} after={2} />
    </>
  );
}
