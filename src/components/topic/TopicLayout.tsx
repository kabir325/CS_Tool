"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type TopicLayoutProps = {
  sectionTitle: string;
  title: string;
  introduction: string;
  overview?: React.ReactNode;
  process?: React.ReactNode;
  controls: React.ReactNode;
  stepIndicator: React.ReactNode;
  explanation: React.ReactNode;
  visualization: React.ReactNode;
  tools: React.ReactNode;
};

export function TopicLayout({
  sectionTitle,
  title,
  introduction,
  overview,
  process,
  controls,
  stepIndicator,
  explanation,
  visualization,
  tools,
}: TopicLayoutProps) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to topics</span>
        </Link>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="max-w-4xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {sectionTitle}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-slate-600">{introduction}</p>
        </div>
      </section>

      {overview ? (
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
          <div className="mt-3 text-sm leading-7 text-slate-600">{overview}</div>
        </section>
      ) : null}

      {process ? (
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">How it works</h2>
          <div className="mt-3 text-sm leading-7 text-slate-600">{process}</div>
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_340px]">
        <div className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Tool</h2>
            <div className="mt-4">{tools}</div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Visualization</h2>
            <div className="mt-4">{visualization}</div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Controls</h2>
            <div className="mt-4 space-y-4">
              {controls}
              {stepIndicator}
            </div>
          </section>
        </div>

        <div className="space-y-6 xl:sticky xl:top-20 xl:self-start">
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Current step</h2>
            <div className="mt-4">{explanation}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
