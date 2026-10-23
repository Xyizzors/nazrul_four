"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

/* ---------------------------------------------------------------------------
 * Modals (search box, registration forms)
 * ------------------------------------------------------------------------- */
interface ModalState {
  openId: string | null;
  open: (id: string) => void;
  close: () => void;
}

const ModalContext = createContext<ModalState | null>(null);

function useModal(): ModalState {
  const ctx = useContext(ModalContext);
  if (!ctx)
    throw new Error(
      "Modal components must be rendered inside <ModalProvider>.",
    );
  return ctx;
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = openId ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ModalContext.Provider
      value={{ openId, open: setOpenId, close: () => setOpenId(null) }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function ModalTrigger({
  modal,
  onClick,
  ...props
}: { modal: string } & ComponentPropsWithoutRef<"button">) {
  const { open } = useModal();
  return (
    <button
      type="button"
      {...props}
      onClick={(e) => {
        onClick?.(e);
        open(modal);
      }}
    />
  );
}

export function ModalClose({
  onClick,
  ...props
}: ComponentPropsWithoutRef<"button">) {
  const { close } = useModal();
  return (
    <button
      type="button"
      {...props}
      onClick={(e) => {
        onClick?.(e);
        close();
      }}
    />
  );
}

export function Modal({
  id,
  className = "",
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  const { openId } = useModal();
  const isOpen = openId === id;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const target = ref.current?.querySelector<HTMLElement>(
      "[data-autofocus], button, input, textarea, a",
    );
    target?.focus();
  }, [isOpen]);

  return (
    <div
      ref={ref}
      id={id}
      className={`modal-overlay ${isOpen ? "" : "hidden"} ${className}`.trim()}
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Demo forms: no backend yet, submitting reveals the confirmation note
 * ------------------------------------------------------------------------- */
const FormSentContext = createContext(false);

export function DemoForm({
  children,
  ...props
}: ComponentPropsWithoutRef<"form">) {
  const [sent, setSent] = useState(false);
  return (
    <FormSentContext.Provider value={sent}>
      <form
        {...props}
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        {children}
      </form>
    </FormSentContext.Provider>
  );
}

export function FormNote({
  className = "",
  ...props
}: ComponentPropsWithoutRef<"p">) {
  const sent = useContext(FormSentContext);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (sent)
      ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [sent]);

  return (
    <p
      ref={ref}
      {...props}
      className={`${className} ${sent ? "" : "hidden"}`.trim()}
    />
  );
}

/* ---------------------------------------------------------------------------
 * Footer year (computed in the browser so a static build never goes stale)
 * ------------------------------------------------------------------------- */
export function CurrentYear() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
