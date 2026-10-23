import type { Metadata } from "next";
import { bilingual, innerHero } from "@/components/ui";
import data_gallery from "@/data/gallery.json";
import { textMap } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";
import GalleryGrid from "@/components/GalleryGrid";

export function generateMetadata(): Metadata {
  const { title, description } = data_gallery.meta[0];
  return { title, description };
}

const txt = textMap(data_gallery.texts);

export default function GalleryPage() {
  return (
    <>
      <ExtraImages items={data_gallery.extras} after={0} />
      {innerHero({
        eyebrow_en: txt.t1.en,
        eyebrow_bn: txt.t1.bn,
        title_en: txt.t2.en,
        title_bn: txt.t2.bn,
        desc_en: txt.t3.en,
        desc_bn: txt.t3.bn,
      })}

      <section className="section-pad">
        <div className="wrap">
          <p className="mb-8 text-center text-sm text-charcoal-500">{bilingual(txt.t6.en, txt.t6.bn)}</p>
          <h2 className="font-display text-3xl text-green-900 font-medium mb-8">{bilingual(txt.t4.en, txt.t4.bn)}</h2>
          <GalleryGrid photos={data_gallery.eventPhotos} label={txt.t4.en} />
        </div>
      </section>
      <ExtraImages items={data_gallery.extras} after={1} />

      <section className="section-pad bg-cream-100">
        <div className="wrap">
          <h2 className="font-display text-3xl text-green-900 font-medium mb-8">{bilingual(txt.t5.en, txt.t5.bn)}</h2>
          <GalleryGrid photos={data_gallery.speakerPhotos} label={txt.t5.en} />
        </div>
      </section>
      <ExtraImages items={data_gallery.extras} after={2} />
    </>
  );
}
