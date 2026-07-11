"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Folder, LayoutPanelLeft, X } from "lucide-react";
import { useMemo, useState } from "react";
import { topicSections } from "@/lib/topics";

type AppSidebarProps = {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
};

export function AppSidebar({
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onCloseMobile,
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
      {isMobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          onClick={onCloseMobile}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex border-r border-slate-200 bg-white transition-all duration-200 lg:sticky lg:translate-x-0 ${
          isCollapsed ? "w-[76px]" : "w-[280px]"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        <div className="flex h-screen w-full flex-col">
          <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
            <Link href="/" className="min-w-0" onClick={onCloseMobile}>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-slate-100 text-slate-700">
                  <LayoutPanelLeft className="h-4 w-4" />
                </div>
                {!isCollapsed ? (
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">Visualization Library</p>
                    <p className="truncate text-xs text-slate-500">Topics and tools</p>
                  </div>
                ) : null}
              </div>
            </Link>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:inline-flex"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <LayoutPanelLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onCloseMobile}
                className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-3">
            <div className="space-y-2">
              {topicSections.map((section) => {
                const isOpen = openSections[section.slug] ?? true;
                const sectionHasActiveTopic = section.topics.some(
                  (topic) => topic.slug === activeTopicSlug,
                );

                return (
                  <div key={section.slug} className="rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSections((current) => ({
                          ...current,
                          [section.slug]: !isOpen,
                        }))
                      }
                      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm ${
                        sectionHasActiveTopic ? "bg-slate-50 text-slate-900" : "text-slate-700"
                      }`}
                    >
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4 shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0" />
                      )}
                      <Folder className="h-4 w-4 shrink-0" />
                      {!isCollapsed ? <span className="font-medium">{section.title}</span> : null}
                    </button>

                    {isOpen && !isCollapsed ? (
                      <div className="border-t border-slate-200 py-1">
                        {section.topics.map((topic) => {
                          const isActive = pathname === `/topics/${topic.slug}`;

                          return (
                            <Link
                              key={topic.slug}
                              href={`/topics/${topic.slug}`}
                              onClick={onCloseMobile}
                              className={`block px-10 py-2 text-sm ${
                                isActive
                                  ? "bg-slate-900 font-medium text-white"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
