import { Modal, ModalClose } from "@/components/interactive";
import { ICON, bilingual } from "@/components/ui";
import data_site from "@/data/site.json";
import { textMap } from "@/lib/content";

const txt = textMap(data_site.texts);

export default function SearchModal() {
  return (
    <Modal
      id="searchModal"
      className="fixed inset-0 z-[70] bg-charcoal-900/60 flex items-start justify-center p-4 pt-24"
    >
      <div className="bg-cream-50 w-full max-w-xl rounded-sm shadow-2xl p-6 motif-corner">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-green-900">
            {bilingual(txt.t23.en, txt.t23.bn)}
          </h2>
          <ModalClose aria-label="Close" className="text-charcoal-700">
            {ICON.close}
          </ModalClose>
        </div>
        <div className="flex items-center gap-2 border border-charcoal-900/20 rounded-sm px-3 py-2.5 bg-white">
          {ICON.search}
          <input
            data-autofocus
            type="text"
            placeholder={txt.t24.en}
            className="w-full outline-none text-sm bg-transparent lang-en"
          />
          <input
            type="text"
            placeholder={txt.t24.bn}
            className="w-full outline-none text-sm bg-transparent lang-bn"
          />
        </div>
        <p className="text-xs text-charcoal-500 mt-3">
          {bilingual(txt.t25.en, txt.t25.bn)}
        </p>
      </div>
    </Modal>
  );
}
