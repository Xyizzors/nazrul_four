import type { Metadata } from "next";
import { img, bilingual, innerHero } from "@/components/ui";
import data_about from "@/data/about.json";
import { textMap } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";

export function generateMetadata(): Metadata {
  const { title, description } = data_about.meta[0];
  return { title, description };
}

const txt = textMap(data_about.texts);

export default function AboutPage() {
  
  /* About_Us_File_1.pdf — early academy activities (1968 onward) — individual photos, cropped from the original scans with the printed captions removed and rewritten below each photo */
  const gallery1 = data_about.gallery1;

  /* About_Us_File_2.pdf — programs & conferences over the years — individual photos */
  const gallery2 = data_about.gallery2;

  const photoBlock = (g: typeof gallery1) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
      {g.map((p, __i) => (
        <figure key={__i}>
          {img(p.src, "Nazrul Academy archive photo", "aspect-[4/3]")}
          <figcaption className="mt-2 text-xs text-charcoal-500 leading-relaxed lang-en">
            {p.en}
          </figcaption>
          <figcaption className="mt-2 text-xs text-charcoal-500 leading-relaxed lang-bn">
            {p.bn}
          </figcaption>
        </figure>
      ))}
    </div>
  );

  return (
    <>
      <ExtraImages items={data_about.extras} after={0} />
      {innerHero({
        eyebrow_en: txt.t1.en,
        eyebrow_bn: txt.t1.bn,
        title_en: txt.t2.en,
        title_bn: txt.t2.bn,
        desc_en: txt.t3.en,
        desc_bn: txt.t3.bn,
      })}
      <ExtraImages items={data_about.extras} after={1} />

      <section className="section-pad">
        <div className="wrap max-w-3xl">
          
          <h2 className="font-display text-3xl mt-4 text-green-900 font-medium">
            {bilingual(txt.t7.en, txt.t7.bn)}
          </h2>
          <p className="mt-5 text-charcoal-700 leading-relaxed lang-en">
            {txt.t4.en}
          </p>
          <p className="mt-5 text-charcoal-700 leading-relaxed lang-bn">
            {txt.t4.bn}
          </p>
          <p className="mt-5 text-charcoal-700 leading-relaxed lang-en">
            {txt.t5.en}
          </p>
          <p className="mt-5 text-charcoal-700 leading-relaxed lang-bn">
            {txt.t5.bn}
          </p>
        </div>
      </section>
      <ExtraImages items={data_about.extras} after={2} />

      <section className="section-pad bg-cream-100">
        <div className="wrap max-w-3xl">
          <div className="card p-8 motif-corner">
            
            <h3 className="font-display text-2xl text-green-900 mt-4">
              {bilingual(txt.t10.en, txt.t10.bn)}
            </h3>
            <p className="mt-4 text-charcoal-700 leading-relaxed lang-en">
              {txt.t8.en}
            </p>
            <p className="mt-4 text-charcoal-700 leading-relaxed lang-bn">
              {txt.t8.bn}
            </p>
          </div>
        </div>
      </section>
      <ExtraImages items={data_about.extras} after={3} />

      <section className="section-pad">
        <div className="wrap max-w-3xl">
          
          <h2 className="font-display text-3xl mt-4 text-green-900 font-medium">
            {bilingual(txt.t27.en, txt.t27.bn)}
          </h2>
          {["t28", "t29", "t30", "t31", "t32", "t33", "t34", "t35", "t36"].map((id) => (
            <div key={id}>
              <p className="mt-5 text-charcoal-700 leading-relaxed lang-en">{txt[id].en}</p>
              <p className="mt-5 text-charcoal-700 leading-relaxed lang-bn">{txt[id].bn}</p>
            </div>
          ))}
        </div>
      </section>
      <ExtraImages items={data_about.extras} after={4} />


      <section className="section-pad">
        <div className="wrap">
          <div className="text-center max-w-xl mx-auto mb-12">
            
            <h2 className="font-display text-3xl mt-4 text-green-900 font-medium">
              {bilingual(txt.t16.en, txt.t16.bn)}
            </h2>
            <p className="mt-4 text-sm text-charcoal-500 lang-en">
              {txt.t14.en}
            </p>
            <p className="mt-4 text-sm text-charcoal-500 lang-bn">
              {txt.t14.bn}
            </p>
          </div>
          {photoBlock(gallery1)}
        </div>
      </section>
      <ExtraImages items={data_about.extras} after={5} />

      <section className="section-pad bg-cream-100">
        <div className="wrap">
          <div className="text-center max-w-xl mx-auto mb-12">
            
            <h2 className="font-display text-3xl mt-4 text-green-900 font-medium">
              {bilingual(txt.t19.en, txt.t19.bn)}
            </h2>
            <p className="mt-4 text-sm text-charcoal-500 lang-en">
              {txt.t17.en}
            </p>
            <p className="mt-4 text-sm text-charcoal-500 lang-bn">
              {txt.t17.bn}
            </p>
          </div>
          {photoBlock(gallery2)}
        </div>
      </section>
      <ExtraImages items={data_about.extras} after={6} />



      <section className="section-pad">
        <div className="wrap max-w-3xl text-center">
          
          <h2 className="font-display text-3xl mt-4 text-green-900 font-medium">
            {bilingual(txt.t41.en, txt.t41.bn)}
          </h2>
          <p className="mt-5 text-charcoal-700 leading-relaxed lang-en">{txt.t42.en}</p>
          <p className="mt-5 text-charcoal-700 leading-relaxed lang-bn">{txt.t42.bn}</p>
        </div>
      </section>
      <ExtraImages items={data_about.extras} after={7} />
    </>
  );
}
