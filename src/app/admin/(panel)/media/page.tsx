import Link from "next/link";
import Image from "@/components/site-image";
import { deleteImageAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/app/admin/(panel)/confirm-button";
import { requireAdmin } from "@/lib/auth";
import { imageUsage, listBuiltInImages, listLibraryImages, removableBuiltInFiles, storageConfigured } from "@/lib/media";
import { UploadForm } from "./upload-form";

function size(n?: number) {
  if (!n) return "";
  return n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`;
}

export default async function MediaPage() {
  await requireAdmin();
  const [library, usage, removable, storageReady] = await Promise.all([
    listLibraryImages(),
    imageUsage(),
    removableBuiltInFiles(),
    storageConfigured(),
  ]);
  // Before the library is seeded, show the filler files so admins still see what's available.
  const seeded = library.length > 0;
  const images = seeded ? library : await listBuiltInImages();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold text-brand-dark">Media library</h1>
      <p className="mt-1 text-sm text-slate-500">
        JPG, PNG or WebP, up to 4 MB each, stored in Cloudflare R2. Built-in images are the starter photos that ship with the site.
      </p>

      {storageReady ? (
        <div className="mt-6">
          <UploadForm />
        </div>
      ) : (
        <div role="note" className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Cloudflare R2 isn&apos;t connected yet</p>
          <p className="mt-1">
            Add your R2 details in <Link href="/admin/settings#storage" className="font-semibold underline">Settings → Cloudflare R2 storage</Link> to
            enable uploads. Built-in images can still be used.
          </p>
        </div>
      )}

      {!seeded && (
        <p className="mt-6 rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
          The library hasn&apos;t been set up yet, so these are the built-in images from the code. Load the starter content from the{" "}
          <Link href="/admin" className="font-semibold text-brand underline">dashboard</Link> to manage them here.
        </p>
      )}

      <h2 className="mt-10 font-bold text-brand-dark">Images ({images.length})</h2>
      <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img) => {
          const used = usage[img.src] ?? 0;
          return (
            <li key={img.src} className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
              <div className="relative aspect-[4/3]">
                <Image src={img.src} alt={img.name} fill sizes="25vw" className="object-cover" />
                {img.builtIn && (
                  <span className="absolute left-2 top-2 rounded bg-slate-900/70 px-1.5 py-0.5 text-[10px] font-bold text-white">Built-in</span>
                )}
              </div>
              <div className="space-y-2 p-3">
                <p className="truncate text-sm font-medium" title={img.name}>{img.name}</p>
                <p className="text-xs text-slate-500">
                  {[size(img.size), used ? `Used in ${used} place${used === 1 ? "" : "s"}` : "Not used"].filter(Boolean).join(" · ")}
                </p>
                {seeded && img.id &&
                  (used === 0 ? (
                    <ConfirmButton action={deleteImageAction.bind(null, img.id)} label="Delete" confirmLabel="Delete" />
                  ) : (
                    <p className="text-[11px] text-slate-400">Replace it where it&apos;s used before deleting.</p>
                  ))}
              </div>
            </li>
          );
        })}
      </ul>

      {removable.length > 0 && (
        <section className="mt-10 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          <h2 className="font-bold text-brand-dark">Built-in files you can remove from the code</h2>
          <p className="mt-1 text-sm text-slate-500">
            These were deleted from the library and aren&apos;t used anywhere. A developer can delete them from <code>public/images</code>.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2 text-xs">
            {removable.map((name) => (
              <li key={name} className="rounded bg-slate-100 px-2 py-1 font-mono">{name}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
