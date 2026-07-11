"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Folder, LayoutPanelLeft, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { topicSections } from "@/lib/topics";

type AppSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AppSidebar({
  isOpen,
  onClose,
}: AppSidebarProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    networking: true,
  });

  const activeTopicSlug = useMemo(() => {
    if (!pathname.startsWith("/topics/")) {
      return null;
    }

    return pathname.replace("/topics/", "");
  }, [pathname]);

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-[1px]"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[300px] border-r border-slate-200 bg-white shadow-2xl transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-screen w-full flex-col">
          <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
            <Link href="/" className="min-w-0" onClick={onClose}>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-slate-100 text-slate-700">
                  <LayoutPanelLeft className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">Visualization Library</p>
                  <p className="truncate text-xs text-slate-500">Interactive topics</p>
                </div>
              </div>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
              <Search className="h-4 w-4" />
              <span>Browse topics</span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {topicSections.map((section) => {
                const isOpen = openSections[section.slug] ?? true;
                const sectionHasActiveTopic = section.topics.some(
                  (topic) => topic.slug === activeTopicSlug,
                );

                return (
                  <div key={section.slug} className="rounded-xl border border-slate-200 bg-slate-50/60">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSections((current) => ({
                          ...current,
                          [section.slug]: !isOpen,
                        }))
                      }
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm ${
                        sectionHasActiveTopic ? "text-slate-900" : "text-slate-700"
                      }`}
                    >
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4 shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0" />
                      )}
                      <Folder className="h-4 w-4 shrink-0" />
                      <div className="min-w-0">
                        <span className="block font-medium">{section.title}</span>
                        <span className="block truncate text-xs text-slate-500">
                          {section.description}
                        </span>
                      </div>
                    </button>

                    {isOpen ? (
                      <div className="border-t border-slate-200 px-2 py-2">
                        {section.topics.map((topic) => {
                          const isActive = pathname === `/topics/${topic.slug}`;

                          return (
                            <Link
                              key={topic.slug}
                              href={`/topics/${topic.slug}`}
                              onClick={onClose}
                              className={`mb-1 block rounded-lg px-3 py-2.5 text-sm ${
                                isActive
                                  ? "bg-slate-900 font-medium text-white shadow-sm"
                                  : "text-slate-600 hover:bg-white hover:text-slate-900"
                              }`}
                            >
                              {topic.title}
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
