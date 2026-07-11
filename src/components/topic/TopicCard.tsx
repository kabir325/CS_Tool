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
      className="block rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:bg-slate-50"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-700">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-4 space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">{topic.title}</h2>
        <p className="text-sm leading-6 text-slate-600">{topic.description}</p>
      </div>
      <div className="mt-4 text-sm font-medium text-slate-700">
        Open topic
      </div>
    </Link>
  );
}
