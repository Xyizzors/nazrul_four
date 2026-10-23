import type { Metadata } from "next";
import { bilingual, innerHero } from "@/components/ui";
import data_nazrul_song from "@/data/nazrul-song.json";
import { textMap } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";

export function generateMetadata(): Metadata {
  const { title, description } = data_nazrul_song.meta[0];
  return { title, description };
}

const txt = textMap(data_nazrul_song.texts);

export default function NazrulSongPage() {
  const songs = data_nazrul_song.songTypes;

  return (
    <>
      <ExtraImages items={data_nazrul_song.extras} after={0} />
      {innerHero({
        eyebrow_en: txt.t1.en,
        eyebrow_bn: txt.t1.bn,
        title_en: txt.t2.en,
        title_bn: txt.t2.bn,
      })}
      <ExtraImages items={data_nazrul_song.extras} after={1} />

      <section className="section-pad">
        <div className="wrap">
          <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
            {songs.map((s, i) => (
              <li key={i} className="flex items-baseline gap-3 py-2 border-b border-cream-200">
                <span className="text-xs font-semibold text-gold-600 w-8 shrink-0 text-right">{i + 1}</span>
                <span className="text-charcoal-900">{bilingual(s.title_en, s.title_bn)}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <ExtraImages items={data_nazrul_song.extras} after={2} />
    </>
  );
}
