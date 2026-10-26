import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../features/dashboard/components/Sidebar";
import Navbar from "../features/dashboard/components/Navbar";
import UploadResumeModal from "../features/resume/components/UploadResumeModal";
import CreateResumeChooserModal from "../features/resume/components/CreateResumeChooserModal";
import { useQuickActions } from "../features/dashboard/hooks/useQuickActions";

// Routes whose editor needs the full viewport width/height to itself —
// the dashboard sidebar is never pinned open here, even on large
// screens. It's always tucked behind the navbar's hamburger instead,
// and the page manages its own internal scrolling rather than the
// page-level padding/scroll every other route gets.
const FULL_BLEED_EDITOR_PATTERN =
  /^\/(resume\/[^/]+\/edit|cover-letter\/[^/]+\/edit)/;

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    isUploadModalOpen,
    closeUploadModal,
    isCreateChooserOpen,
    closeCreateChooser,
    ...quickActions
  } = useQuickActions();
  const { pathname } = useLocation();

  const isFullBleedEditor = FULL_BLEED_EDITOR_PATTERN.test(pathname);

  return (
    <div
      className={`bg-background ${
        isFullBleedEditor ? "h-[100dvh] overflow-hidden" : "min-h-screen"
      }`}
    >
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        quickActions={quickActions}
        forceCollapsed={isFullBleedEditor}
      />

      <div
        className={`flex min-w-0 flex-col ${
          isFullBleedEditor
            ? "h-full"
            : "min-h-screen [@media(min-width:1400px)]:ml-64"
        }`}
      >
        <Navbar
          onMenuClick={() => setIsSidebarOpen(true)}
          quickActions={quickActions}
          forceCollapsed={isFullBleedEditor}
        />

        <main
          className={
            isFullBleedEditor
              ? "flex-1 min-h-0 overflow-hidden"
              : "min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 [@media(min-width:1400px)]:p-8"
          }
        >
          <Outlet context={quickActions} />
        </main>
      </div>

      <CreateResumeChooserModal
        open={isCreateChooserOpen}
        onClose={closeCreateChooser}
        onChooseTemplate={quickActions.handleChooseTemplate}
        onImport={quickActions.handleOpenUploadResume}
        onQuickStart={quickActions.handleQuickStart}
        quickStartLoading={quickActions.isCreatingQuickResume}
      />

      <UploadResumeModal open={isUploadModalOpen} onClose={closeUploadModal} />
    </div>
  );
}
