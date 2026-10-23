import type { Metadata } from "next";
import { innerHero } from "@/components/ui";
import poem from "@/data/bidrohi.json";

export const metadata: Metadata = {
  title: "Bidrohi",
  description: "The rebel poem of Kazi Nazrul Islam.",
};

export default function BidrohiPage() {
  return (
    <>
      {innerHero({
        eyebrow_en: "Nazrul Corner",
        eyebrow_bn: "নজরুল কর্নার",
        title_en: "Bidrohi",
        title_bn: "বিদ্রোহী",
        desc_en: "The rebel poem that gave a voice to defiance and freedom.",
        desc_bn: "বিদ্রোহ ও মুক্তির কণ্ঠস্বর হয়ে ওঠা বিদ্রোহী কবিতা।",
      })}

      <section className="section-pad pb-0">
        <div className="wrap max-w-4xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/img/bidrohi/plaque.png"
            alt="Plaque marking the room where Kazi Nazrul Islam wrote Bidrohi in 1921–22"
            className="block w-full h-auto max-h-[70vh] object-contain"
          />
        </div>
      </section>

      {poem.bengali.length > 0 && (
        <section className="section-pad pb-0">
          <article className="wrap max-w-3xl text-center" lang="bn">
            <h2 className="font-display text-3xl sm:text-4xl text-green-900 font-medium mb-10">
              মূল বাংলা কবিতা
            </h2>
            <div className="space-y-8 text-lg sm:text-xl leading-relaxed text-charcoal-900">
              {poem.bengali.map((stanza, index) => (
                <p key={index} className="whitespace-pre-line">
                  {stanza}
                </p>
              ))}
            </div>
          </article>
        </section>
      )}

      {poem.english.length > 0 && (
        <section className="section-pad">
          <article className="wrap max-w-3xl text-center" lang="en">
            <h2 className="font-display text-3xl sm:text-4xl text-green-900 font-medium mb-10">
              English Translation
            </h2>
            <div className="space-y-8 text-lg sm:text-xl leading-relaxed text-charcoal-900">
              {poem.english.map((stanza, index) => (
                <p key={index} className="whitespace-pre-line">
                  {stanza}
                </p>
              ))}
            </div>
          </article>
        </section>
      )}
    </>
  );
}
