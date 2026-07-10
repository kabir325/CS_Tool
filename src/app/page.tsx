import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TopicCard } from "@/components/topic/TopicCard";
import { topics } from "@/lib/topics";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-8 lg:px-10">
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_32%),linear-gradient(180deg,rgba(8,17,31,0.96),rgba(7,12,24,0.85))] px-6 py-14 shadow-[0_28px_80px_rgba(2,6,23,0.45)] sm:px-10 sm:py-18 lg:px-14">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.03),transparent)]" />
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
            Interactive networking docs
          </div>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Networking, Explained Visually.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            Interactive networking visualizations that help you understand concepts instead of memorizing them.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="#topics"
              className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              <span>Explore Topics</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-sm text-slate-400">
              Built with reusable topic modules so new lessons slot in cleanly.
            </p>
          </div>
        </div>
      </section>

      <section id="topics" className="mt-12 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/80">
              Start learning
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Visual topics
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-400">
            Each topic combines animation controls, step-based explanations, and an SVG playground you can manipulate directly.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {topics.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </div>
      </section>
    </main>
  );
}
