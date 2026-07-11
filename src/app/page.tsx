import { TopicCard } from "@/components/topic/TopicCard";
import { topicSections } from "@/lib/topics";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-8">
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Library</h1>
      </section>

      <div className="mt-6 space-y-6">
        {topicSections.map((section) => (
          <section
            key={section.slug}
            className="rounded-lg border border-slate-200 bg-white p-6"
          >
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{section.description}</p>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {section.topics.map((topic) => (
                <TopicCard key={topic.slug} topic={topic} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
