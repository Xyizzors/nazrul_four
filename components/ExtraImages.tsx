import { bilingual, img } from "@/components/ui";

export interface Extra {
  after: string | number;
  src: string;
  alt?: string;
  caption_en?: string;
  caption_bn?: string;
}

/** Images added from the control panel, shown between two sections of a page (0 = above the first section). */
export default function ExtraImages({
  items,
  after,
}: {
  items: readonly Extra[];
  after: number;
}) {
  const mine = items.filter((e) => Number(e.after) === after && e.src);
  // Only when the visual editor is running (`npm run edit`): an invisible marker so it can offer "Add photo here".
  // process.env.NZ_EDIT is not set in the published build, so this never reaches the live site.
  const marker =
    process.env.NZ_EDIT === "1" ? <div data-nz-after={after} /> : null;
  if (!mine.length) return marker;
  return (
    <>
      {marker}
      <section className="section-pad">
        <div
          className={`wrap grid gap-6 ${mine.length > 1 ? "sm:grid-cols-2 lg:grid-cols-3" : "max-w-3xl"}`}
        >
          {mine.map((e, i) => (
            <figure key={`${e.src}-${i}`}>
              {img(e.src, e.alt || e.caption_en || "", "aspect-[16/10]")}
              {(e.caption_en || e.caption_bn) && (
                <figcaption className="mt-2 text-sm text-charcoal-700 leading-relaxed">
                  {bilingual(e.caption_en ?? "", e.caption_bn ?? "")}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
