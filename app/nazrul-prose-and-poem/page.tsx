import type { Metadata } from "next";
import { bilingual, innerHero } from "@/components/ui";
import data_nazrul_prose_and_poem from "@/data/nazrul-prose-and-poem.json";
import { textMap } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";

export function generateMetadata(): Metadata {
  const { title, description } = data_nazrul_prose_and_poem.meta[0];
  return { title, description };
}

const txt = textMap(data_nazrul_prose_and_poem.texts);

interface Work {
  title_en: string;
  title_bn: string;
  group_en: string;
  group_bn: string;
}

/** Groups works by category, keeping the order in which categories first appear. */
function groupWorks(works: Work[]) {
  const groups: { en: string; bn: string; items: Work[] }[] = [];
  for (const w of works) {
    let g = groups.find((x) => x.en === w.group_en);
    if (!g) {
      g = { en: w.group_en, bn: w.group_bn, items: [] };
      groups.push(g);
    }
    g.items.push(w);
  }
  return groups;
}

function WorkList({ works }: { works: Work[] }) {
  return (
    <div className="space-y-10">
      {groupWorks(works).map((g) => (
        <div key={g.en}>
          <h3 className="font-display text-xl text-green-900 mb-4">{bilingual(g.en, g.bn)}</h3>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
            {g.items.map((w, i) => (
              <li key={i} className="flex items-baseline gap-3 py-2 border-b border-cream-200">
                <span className="text-xs font-semibold text-gold-600 w-8 shrink-0 text-right">{i + 1}</span>
                <span className="text-charcoal-900">{bilingual(w.title_en, w.title_bn)}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

export default function NazrulProseAndPoemPage() {
  return (
    <>
      <ExtraImages items={data_nazrul_prose_and_poem.extras} after={0} />
      {innerHero({
        eyebrow_en: txt.t1.en,
        eyebrow_bn: txt.t1.bn,
        title_en: txt.t2.en,
        title_bn: txt.t2.bn,
      })}
      <ExtraImages items={data_nazrul_prose_and_poem.extras} after={1} />

      <section className="section-pad">
        <div className="wrap">
          <h2 className="font-display text-3xl text-green-900 mb-8">{bilingual(txt.t3.en, txt.t3.bn)}</h2>
          <WorkList works={data_nazrul_prose_and_poem.poemTypes} />
        </div>
      </section>
      <ExtraImages items={data_nazrul_prose_and_poem.extras} after={2} />

      <section className="section-pad bg-cream-100">
        <div className="wrap">
          <h2 className="font-display text-3xl text-green-900 mb-8">{bilingual(txt.t4.en, txt.t4.bn)}</h2>
          <WorkList works={data_nazrul_prose_and_poem.proseWorks} />
        </div>
      </section>
      <ExtraImages items={data_nazrul_prose_and_poem.extras} after={3} />
    </>
  );
}
