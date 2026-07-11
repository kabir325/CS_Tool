"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { AppSidebar } from "@/components/shell/AppSidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full">
        <AppSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-6">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">Visualization Library</p>
            </div>
          </header>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
