import Link from "next/link";
import type { TopicDefinition } from "@/types/topic";

type TopicCardProps = {
  topic: TopicDefinition;
};

export function TopicCard({ topic }: TopicCardProps) {
  const Icon = topic.icon;

  return (
    <Link
      href={`/topics/${topic.slug}`}
      className="group rounded-[28px] border border-white/10 bg-[rgba(8,17,31,0.72)] p-6 shadow-[0_16px_40px_rgba(2,6,23,0.3)] transition duration-300 hover:-translate-y-1.5 hover:border-cyan-300/35 hover:bg-[rgba(10,22,40,0.92)] hover:shadow-[0_22px_60px_rgba(14,165,233,0.12)]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200">
        <Icon className="h-6 w-6" />
      </div>
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-white">{topic.title}</h2>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-300">
            {topic.difficulty}
          </span>
        </div>
        <p className="text-sm leading-7 text-slate-300">{topic.description}</p>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
        <span>{topic.readingTime}</span>
        <span className="transition group-hover:translate-x-1 group-hover:text-cyan-200">
          Explore
        </span>
      </div>
    </Link>
  );
}
