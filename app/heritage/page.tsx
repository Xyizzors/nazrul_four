import type { Metadata } from "next";
import { img, bilingual, innerHero } from "@/components/ui";
import { Fragment } from "react";
import data_heritage from "@/data/heritage.json";
import { textMap, slotMap } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";

export function generateMetadata(): Metadata {
  const { title, description } = data_heritage.meta[0];
  return { title, description };
}

const txt = textMap(data_heritage.texts);
const imgs = slotMap(data_heritage.images);

export default function HeritagePage() {
  const timeline = data_heritage.timeline;

  const archivePlain = Array.from(
    { length: 31 },
    (_, i) => `/assets/img/heritage/h-${String(i + 1).padStart(2, "0")}.jpg`,
  );

  /* Individual photos, cropped from the "Established in 1968" composite scan (About_Us_File_1.pdf) with the printed caption removed and rewritten below each photo */
  const archiveCaptioned = data_heritage.archiveCaptioned;

  return (
    <>
      <ExtraImages items={data_heritage.extras} after={0} />
      {innerHero({
        eyebrow_en: txt.t1.en,
        eyebrow_bn: txt.t1.bn,
        title_en: txt.t2.en,
        title_bn: txt.t2.bn,
        desc_en: txt.t3.en,
        desc_bn: txt.t3.bn,
      })}
      <ExtraImages items={data_heritage.extras} after={1} />

      <section className="section-pad">
        <div className="wrap max-w-3xl">
          
          <h2 className="font-display text-3xl mt-4 text-green-900 font-medium">
            {bilingual(txt.t6.en, txt.t6.bn)}
          </h2>
          <p className="mt-5 text-charcoal-700 leading-relaxed lang-en">
            {txt.t4.en}
          </p>
          <p className="mt-5 text-charcoal-700 leading-relaxed lang-bn">
            {txt.t4.bn}
          </p>
        </div>
      </section>
      <ExtraImages items={data_heritage.extras} after={2} />

      <section className="section-pad bg-cream-100">
        <div className="wrap">
          <div className="text-center max-w-xl mx-auto mb-12">
            
            <h2 className="font-display text-3xl mt-4 text-green-900 font-medium">
              {bilingual(txt.t8.en, txt.t8.bn)}
            </h2>
          </div>
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 items-center bg-cream-50 border border-charcoal-900/10 rounded-sm p-6 sm:p-10 motif-corner">
            <div>
              {img(imgs.i1.src, imgs.i1.alt, "aspect-[4/3]")}
              <p className="mt-3 text-xs text-charcoal-500 leading-relaxed lang-en">
                {txt.t9.en}
              </p>
              <p className="mt-3 text-xs text-charcoal-500 leading-relaxed lang-bn">
                {txt.t9.bn}
              </p>
            </div>
            <div>
              <p className="text-charcoal-700 leading-relaxed lang-en">
                {txt.t10.en}
              </p>
              <p className="mt-4 text-charcoal-700 leading-relaxed lang-bn">
                {txt.t10.bn}
              </p>
            </div>
          </div>
        </div>
      </section>
      <ExtraImages items={data_heritage.extras} after={3} />

      <section className="section-pad">
        <div className="wrap">
          <div className="text-center max-w-xl mx-auto mb-14">
            
            <h2 className="font-display text-3xl mt-4 text-green-900 font-medium">
              {bilingual(txt.t12.en, txt.t12.bn)}
            </h2>
          </div>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-[7px] sm:left-1/2 top-0 bottom-0 w-px bg-green-800/25 sm:-translate-x-1/2"></div>
            <div className="flex flex-col gap-10">
              {timeline.map((t, i) => (
                <div
                  key={i}
                  className={`relative pl-8 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-10 ${i % 2 === 1 ? "" : ""}`}
                >
                  <div className="absolute left-0 sm:left-1/2 top-1 w-3.5 h-3.5 rounded-full bg-gold-500 border-2 border-cream-100 sm:-translate-x-1/2"></div>
                  <div
                    className={
                      i % 2 === 0
                        ? "sm:text-right sm:pr-2"
                        : "sm:col-start-2 sm:pl-2"
                    }
                  >
                    <p className="font-display text-xl text-green-900 font-semibold">
                      {t.year}
                    </p>
                    <p className="text-sm text-charcoal-700 mt-1 leading-relaxed lang-en">
                      {t.en}
                    </p>
                    <p className="text-sm text-charcoal-700 mt-1 leading-relaxed lang-bn">
                      {t.bn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <ExtraImages items={data_heritage.extras} after={4} />

      <section className="section-pad bg-cream-100">
        <div className="wrap">
          <div className="text-center max-w-xl mx-auto mb-10">
            
            <h2 className="font-display text-3xl mt-4 text-green-900 font-medium">
              {bilingual(txt.t15.en, txt.t15.bn)}
            </h2>
            <p className="mt-4 text-sm text-charcoal-500 lang-en">
              {txt.t13.en}
            </p>
            <p className="mt-4 text-sm text-charcoal-500 lang-bn">
              {txt.t13.bn}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {archiveCaptioned.map((p, __i) => (
              <figure key={__i}>
                {img(
                  p.src,
                  "Nazrul Academy archive photo, 1968",
                  "aspect-[4/3]",
                )}
                <figcaption className="mt-2 text-xs text-charcoal-500 leading-relaxed lang-en">
                  {p.en}
                </figcaption>
                <figcaption className="mt-2 text-xs text-charcoal-500 leading-relaxed lang-bn">
                  {p.bn}
                </figcaption>
              </figure>
            ))}
            {archivePlain.map((src, i) => (
              <Fragment key={i}>
                {img(
                  src,
                  `Nazrul Academy archive clipping ${i + 1}`,
                  "aspect-[4/3]",
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>
      <ExtraImages items={data_heritage.extras} after={5} />
    </>
  );
}
