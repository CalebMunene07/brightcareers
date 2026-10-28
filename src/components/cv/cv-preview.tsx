import { dateRange, type CvData } from "@/lib/cv";
import type { CvLabels } from "@/lib/cv-strings";

type Lfn = (s: string) => string;

function Bullets({ text }: { text: string }) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;
  if (lines.length === 1) return <p className="mt-1 text-[11px] leading-relaxed text-slate-700">{lines[0]}</p>;
  return (
    <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed text-slate-700">
      {lines.map((l, i) => (
        <li key={i}>{l}</li>
      ))}
    </ul>
  );
}

function SectionTitle({ children, accent, variant }: { children: React.ReactNode; accent: string; variant: CvData["template"] }) {
  if (variant === "classic") {
    return (
      <h2 className="mb-2 border-b pb-1 text-[12px] font-bold uppercase tracking-[0.15em]" style={{ color: accent, borderColor: accent }}>
        {children}
      </h2>
    );
  }
  if (variant === "minimal") {
    return <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">{children}</h2>;
  }
  return (
    <h2 className="mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider" style={{ color: accent }}>
      <span className="h-[3px] w-5 rounded" style={{ background: accent }} />
      {children}
    </h2>
  );
}

function MainSections({ cv, L }: { cv: CvData; L: Lfn }) {
  const { personal, experience, education, template, accent } = cv;
  return (
    <>
      {personal.summary && (
        <section className="mb-5">
          <SectionTitle accent={accent} variant={template}>{L("Profile")}</SectionTitle>
          <p className="text-[11px] leading-relaxed text-slate-700">{personal.summary}</p>
        </section>
      )}
      {experience.length > 0 && (
        <section className="mb-5">
          <SectionTitle accent={accent} variant={template}>{L("Experience")}</SectionTitle>
          <div className="space-y-3">
            {experience.map((e) => (
              <div key={e.id} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[12px] font-bold text-slate-900">{e.role || L("Job title")}</h3>
                  <span className="shrink-0 text-[10px] text-slate-500">{dateRange(e.start, e.end, e.current, L("Present"))}</span>
                </div>
                <p className="text-[11px] font-medium" style={{ color: template === "minimal" ? undefined : accent }}>
                  {[e.company, e.location].filter(Boolean).join(" · ")}
                </p>
                <Bullets text={e.description} />
              </div>
            ))}
          </div>
        </section>
      )}
      {education.length > 0 && (
        <section className="mb-5">
          <SectionTitle accent={accent} variant={template}>{L("Education")}</SectionTitle>
          <div className="space-y-3">
            {education.map((d) => (
              <div key={d.id} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[12px] font-bold text-slate-900">{d.qualification || L("Qualification")}</h3>
                  <span className="shrink-0 text-[10px] text-slate-500">{dateRange(d.start, d.end, false)}</span>
                </div>
                <p className="text-[11px] text-slate-600">{[d.school, d.location].filter(Boolean).join(" · ")}</p>
                <Bullets text={d.details} />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function SideSections({ cv, light = false, L }: { cv: CvData; light?: boolean; L: Lfn }) {
  const { skills, languages, certifications, template, accent } = cv;
  const muted = light ? "text-white/80" : "text-slate-600";
  const strong = light ? "text-white" : "text-slate-900";
  const title = (t: string) =>
    light ? (
      <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-white/90">{t}</h2>
    ) : (
      <SectionTitle accent={accent} variant={template}>{t}</SectionTitle>
    );

  return (
    <>
      {skills.length > 0 && (
        <section className="mb-5">
          {title(L("Skills"))}
          <ul className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <li
                key={s}
                className={`rounded px-2 py-0.5 text-[10px] font-medium ${light ? "bg-white/15 text-white" : "bg-slate-100 text-slate-800"}`}
              >
                {s}
              </li>
            ))}
          </ul>
        </section>
      )}
      {languages.length > 0 && (
        <section className="mb-5">
          {title(L("Languages"))}
          <ul className="space-y-1 text-[11px]">
            {languages.map((l) => (
              <li key={l.id} className="flex justify-between gap-2">
                <span className={`font-medium ${strong}`}>{l.name}</span>
                <span className={muted}>{L(l.level)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {certifications.length > 0 && (
        <section className="mb-5">
          {title(L("Certifications"))}
          <ul className="space-y-1.5 text-[11px]">
            {certifications.map((c) => (
              <li key={c.id}>
                <span className={`font-medium ${strong}`}>{c.name}</span>
                <span className={`block ${muted}`}>{[c.issuer, c.year].filter(Boolean).join(", ")}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function Contact({ cv, light = false, inline = false }: { cv: CvData; light?: boolean; inline?: boolean }) {
  const items = [cv.personal.email, cv.personal.phone, cv.personal.location, cv.personal.website].filter(Boolean);
  if (items.length === 0) return null;
  if (inline) {
    return <p className="mt-2 text-[11px] text-slate-600">{items.join("  •  ")}</p>;
  }
  return (
    <ul className={`space-y-1 break-all text-[11px] ${light ? "text-white/90" : "text-slate-700"}`}>
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

/* A4 page: 210mm x 297mm. Rendered at a fixed width and scaled by the parent. */
export function CvPreview({ cv, labels = {} }: { cv: CvData; labels?: CvLabels }) {
  const L: Lfn = (s) => labels[s] ?? s;
  const { personal, template, accent } = cv;
  const name = personal.name || L("Your Name");

  if (template === "modern") {
    return (
      <div className="cv-page flex bg-white text-slate-900">
        <aside className="w-[34%] shrink-0 px-6 py-8 text-white" style={{ background: accent }}>
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-xl font-bold">
            {name
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <section className="mb-5">
            <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-white/90">{L("Contact")}</h2>
            <Contact cv={cv} light />
          </section>
          <SideSections cv={cv} light L={L} />
        </aside>
        <main className="flex-1 px-7 py-8">
          <h1 className="text-[26px] font-bold leading-tight">{name}</h1>
          {personal.title && <p className="mb-5 text-[13px] font-medium" style={{ color: accent }}>{personal.title}</p>}
          <MainSections cv={cv} L={L} />
        </main>
      </div>
    );
  }

  if (template === "classic") {
    return (
      <div className="cv-page bg-white px-10 py-9 font-serif text-slate-900">
        <header className="mb-5 text-center">
          <h1 className="text-[28px] font-bold tracking-wide" style={{ color: accent }}>{name}</h1>
          {personal.title && <p className="text-[13px] italic text-slate-600">{personal.title}</p>}
          <Contact cv={cv} inline />
        </header>
        <MainSections cv={cv} L={L} />
        <div className="grid grid-cols-2 gap-x-8">
          <SideSections cv={cv} L={L} />
        </div>
      </div>
    );
  }

  return (
    <div className="cv-page bg-white px-10 py-10 text-slate-900">
      <header className="mb-6 border-b border-slate-200 pb-5">
        <h1 className="text-[30px] font-light tracking-tight">{name}</h1>
        {personal.title && <p className="mt-1 text-[13px] font-medium" style={{ color: accent }}>{personal.title}</p>}
        <Contact cv={cv} inline />
      </header>
      <div className="grid grid-cols-[1fr_32%] gap-8">
        <div>
          <MainSections cv={cv} L={L} />
        </div>
        <div>
          <SideSections cv={cv} L={L} />
        </div>
      </div>
    </div>
  );
}
