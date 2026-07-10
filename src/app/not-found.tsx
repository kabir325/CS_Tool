import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <div className="rounded-[32px] border border-white/10 bg-[rgba(8,17,31,0.88)] p-10 shadow-[0_24px_80px_rgba(2,6,23,0.45)]">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200/80">
          Topic not found
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
          This visualization does not exist yet.
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-300">
          Head back to the homepage to explore the currently available networking lessons.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
