"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type TopicLayoutProps = {
  title: string;
  introduction: string;
  meta: { label: string; value: string }[];
  controls: React.ReactNode;
  stepIndicator: React.ReactNode;
  explanation: React.ReactNode;
  visualization: React.ReactNode;
  tools?: React.ReactNode;
};

export function TopicLayout({
  title,
  introduction,
  meta,
  controls,
  stepIndicator,
  explanation,
  visualization,
  tools,
}: TopicLayoutProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-8 sm:px-8 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-300/40 hover:bg-white/[0.06]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to topics</span>
        </Link>
      </div>

      <section className="rounded-[32px] border border-white/10 bg-[rgba(6,12,24,0.78)] p-8 shadow-[0_24px_80px_rgba(3,7,18,0.45)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/80">
              Visual Topic
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {introduction}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {meta.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_380px]">
        <div className="space-y-6">
          {tools ? (
            <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              {tools}
            </section>
          ) : null}
          <section className="rounded-[30px] border border-white/10 bg-[rgba(7,16,32,0.88)] p-5 shadow-[0_18px_60px_rgba(3,7,18,0.4)] sm:p-6">
            {visualization}
          </section>
          <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <div className="space-y-5">
              {controls}
              {stepIndicator}
            </div>
          </section>
        </div>
        <div className="space-y-6">{explanation}</div>
      </div>
    </main>
  );
}
