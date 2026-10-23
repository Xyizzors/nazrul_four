import type { Metadata } from "next";
import { bilingual, ICON, innerHero, photo } from "@/components/ui";
import data_admission from "@/data/admission.json";
import data_programs from "@/data/programs.json";
import { textMap } from "@/lib/content";
import ExtraImages from "@/components/ExtraImages";

export function generateMetadata(): Metadata {
  const { title, description } = data_programs.meta[0];
  return { title: "Programs and Admission", description };
}

const txt = textMap(data_programs.texts);
const admissionText = textMap(data_admission.texts);

export default function ProgramsPage() {
  const programs = data_programs.programs;
  const steps = data_admission.steps;

  return (
    <>
      <ExtraImages items={data_programs.extras} after={0} />
      {innerHero({
        eyebrow_en: txt.t9.en,
        eyebrow_bn: txt.t9.bn,
        title_en: "Programs and Admission",
        title_bn: "কর্মসূচি ও ভর্তি",
        desc_en: "Courses and workshops in music, dance, poetry and performing arts, open to the public and guidance for prospective students application process.",
        desc_bn: "সংগীত, নৃত্য, কবিতা ও পরিবেশনশিল্পে সবার জন্য উন্মুক্ত কোর্স ও কর্মশালা এবং সম্ভাব্য শিক্ষার্থীদের আবেদন প্রক্রিয়া সম্পর্কে দিকনির্দেশনা।",
      })}
      <ExtraImages items={data_programs.extras} after={1} />

      <section className="section-pad bg-cream-100">
        <div className="wrap grid lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-16 items-center">
          <h2 className="font-display text-3xl sm:text-4xl text-green-900 font-medium">
            <span className="lang-en">
              Learn Music <span className="text-gold-700 italic">&amp;</span> Recitation and Join programs.
            </span>
            <span className="lang-bn">সংগীত ও আবৃত্তি শিখুন এবং কর্মসূচিতে যোগ দিন।</span>
          </h2>
          <div className="text-charcoal-700 leading-relaxed text-lg">
            <p className="lang-en">{admissionText.t4.en}</p>
            <p className="lang-bn">{admissionText.t4.bn}</p>
            <a href="#admission" className="btn btn-outline-dark btn-sm mt-6 inline-flex">
              {ICON.download} {bilingual(admissionText.t7.en, admissionText.t7.bn)}
            </a>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="wrap grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((p, __i) => (
            <div key={__i} className="card overflow-hidden flex flex-col">
              {photo({ src: p.photo }, p.en + " — placeholder", "aspect-[4/3]")}
              <div className="p-5 flex flex-col gap-2 flex-1">
                <h3 className="font-display text-lg text-green-900 leading-snug">
                  <span className="lang-en">{p.en}</span>
                  <span className="lang-bn">{p.bn}</span>
                </h3>
                <p className="text-xs text-charcoal-500">
                  <span className="lang-en">{p.sched_en}</span>
                  <span className="lang-bn">{p.sched_bn}</span>
                </p>
                <p className="text-sm text-charcoal-700 leading-relaxed flex-1">
                  <span className="lang-en">{p.desc_en}</span>
                  <span className="lang-bn">{p.desc_bn}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <ExtraImages items={data_programs.extras} after={2} />

      <ExtraImages items={data_admission.extras} after={2} />

      <section id="admission" className="section-pad bg-cream-100 scroll-mt-24">
        <div className="wrap">
          <div className="max-w-xl mb-12">
            <span className="eyebrow">
              {bilingual(admissionText.t12.en, admissionText.t12.bn)}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl mt-4 text-green-900 font-medium">
              {bilingual(admissionText.t13.en, admissionText.t13.bn)}
            </h2>
          </div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 list-none p-0 m-0">
            {steps.map((step, index) => (
              <li key={index} className="max-w-xs">
                <span className="w-12 h-12 rounded-full bg-green-900 text-gold-300 font-display text-lg flex items-center justify-center">
                  {index + 1}
                </span>
                <p className="mt-4 text-sm text-charcoal-700 leading-relaxed lang-en">
                  {step.en}
                </p>
                <p className="mt-4 text-sm text-charcoal-700 leading-relaxed lang-bn">
                  {step.bn}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <ExtraImages items={data_admission.extras} after={3} />
    </>
  );
}
