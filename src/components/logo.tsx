import Image from "next/image";
import Link from "next/link";
import logo from "../../public/images/logo.png";
import mark from "../../public/images/logo-mark.png";

// `full` shows the stacked logo with its own wordmark, for light backgrounds with room to spare.
// Otherwise the globe mark sits on a white disc beside the name, so it reads on the coloured bars.
export function Logo({ light = false, full = false }: { light?: boolean; full?: boolean }) {
  if (full) {
    return (
      <Link href="/" aria-label="Bridge Careers Global home" className="inline-block">
        <Image src={logo} alt="Bridge Careers Global" sizes="176px" priority className="h-auto w-44" />
      </Link>
    );
  }

  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Bridge Careers Global home">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-sm">
        <Image src={mark} alt="" sizes="48px" priority className="h-full w-full object-contain" />
      </span>
      <span className={`leading-tight ${light ? "text-white" : "text-brand-dark"}`}>
        <span className="block text-lg font-extrabold uppercase tracking-wide">Bridge</span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] opacity-80">Careers Global</span>
      </span>
    </Link>
  );
}
