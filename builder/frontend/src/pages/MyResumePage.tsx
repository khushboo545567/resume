import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { FilePlus2, Files, RotateCcw, Search, X } from "lucide-react";

import ResumeGrid from "../features/resume/components/ResumeGrid";
import EmptyResumeState from "../features/resume/components/EmptyResumeState";
import DashboardSection from "../features/dashboard/components/DashboardSection";

import { useResumes } from "../features/resume/hooks/useResumes";

import type { QuickActions } from "../features/dashboard/hooks/useQuickActions";
import type { Resume } from "../features/resume/types/resume.types";

type StatusFilter = "all" | "draft" | "completed";
type SortKey = "updated" | "newest" | "oldest" | "az";

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Drafts" },
  { value: "completed", label: "Completed" },
];

const time = (date?: string) => new Date(date || 0).getTime();

export default function MyResumePage() {
  const { handleCreateResume } = useOutletContext<QuickActions>();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("updated");

  const {
    resumes,
    pagination,
    loading,
    loadingMore,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useResumes();

  // ==========================================
  // INFINITE SCROLL
  // ==========================================

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !loadingMore) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasNextPage, loadingMore, fetchNextPage]);

  // ==========================================
  // SEARCH + FILTER + SORT
  // ==========================================

  const sortedResumes = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    const result = resumes.filter((resume: Resume) => {
      const title = resume.title?.toLowerCase() ?? "";
      const targetRole = resume.targetRole?.toLowerCase() ?? "";

      const matchesSearch =
        title.includes(keyword) || targetRole.includes(keyword);
      const matchesFilter = filter === "all" || resume.status === filter;

      return matchesSearch && matchesFilter;
    });

    switch (sort) {
      case "updated":
        result.sort((a, b) => time(b.updatedAt) - time(a.updatedAt));
        break;
      case "newest":
        result.sort((a, b) => time(b.createdAt) - time(a.createdAt));
        break;
      case "oldest":
        result.sort((a, b) => time(a.createdAt) - time(b.createdAt));
        break;
      case "az":
        result.sort((a, b) =>
          (a.title?.toLowerCase() ?? "").localeCompare(
            b.title?.toLowerCase() ?? "",
          ),
        );
        break;
    }

    return result;
  }, [resumes, search, filter, sort]);

  // Per-status counts are only exact once every page has been loaded, so the
  // pills show them only then (otherwise they would under-count).
  const allLoaded = !hasNextPage;
  const statusCounts: Record<StatusFilter, number> = {
    all: pagination?.totalResumes ?? resumes.length,
    draft: resumes.filter((r) => r.status === "draft").length,
    completed: resumes.filter((r) => r.status === "completed").length,
  };

  const totalResumes = statusCounts.all;
  const isFiltering = search.trim() !== "" || filter !== "all";

  const clearFilters = () => {
    setSearch("");
    setFilter("all");
  };

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="flex min-h-100 items-center justify-center rounded-3xl border border-border-popup bg-popup p-8">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600">
            Failed to load resumes
          </h2>

          <p className="mt-2 text-sm text-nav-text">
            Something went wrong while fetching your resumes.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-btn px-5 py-2.5 text-sm font-semibold text-btn-text transition hover:bg-btn-hover"
          >
            <RotateCcw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-w-0 space-y-8 sm:space-y-10">
      {/* Banner (same look as the dashboard hero) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sidebar via-sidebar-hover to-border-sidebar p-6 text-sidebar-text shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-accent/25 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-soft">
              <Files size={13} /> Resume library
            </span>

            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              My <span className="text-gold-soft">Resumes</span>
            </h1>

            <p className="mt-2 text-sm text-sidebar-text/75 sm:text-base">
              {loading
                ? "Loading your resumes..."
                : totalResumes === 0
                  ? "Create your first ATS-friendly resume to get started."
                  : `You have ${totalResumes} ${totalResumes === 1 ? "resume" : "resumes"}. Edit, share or download any of them.`}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateResume}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-sidebar-text px-5 text-sm font-semibold text-display shadow-lg transition hover:-translate-y-0.5 hover:bg-popup"
          >
            <FilePlus2 size={17} /> New resume
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl border border-border-popup bg-popup p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-nav-text"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or target role..."
              className="h-11 w-full rounded-xl border border-border bg-navbar pl-10 pr-10 text-sm text-heading outline-none transition placeholder:text-nav-text focus:border-border-strong focus:ring-2 focus:ring-ring"
            />

            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-nav-text transition hover:bg-btn-hover-bg"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status pills */}
            <div
              role="tablist"
              aria-label="Filter by status"
              className="inline-flex rounded-xl border border-border bg-navbar p-1"
            >
              {STATUS_TABS.map((tab) => {
                const active = filter === tab.value;

                return (
                  <button
                    key={tab.value}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(tab.value)}
                    className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition sm:px-4 ${
                      active
                        ? "bg-btn text-btn-text shadow-sm"
                        : "text-nav-text hover:bg-btn-hover-bg hover:text-heading"
                    }`}
                  >
                    {tab.label}
                    {allLoaded && !loading && (
                      <span
                        className={`rounded-full px-1.5 text-xs ${
                          active ? "bg-btn-text/20" : "bg-btn-hover-bg"
                        }`}
                      >
                        {statusCounts[tab.value]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sort */}
            <select
              value={sort}
              aria-label="Sort resumes"
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-11 rounded-xl border border-border bg-navbar px-4 text-sm font-medium text-heading outline-none transition focus:border-border-strong focus:ring-2 focus:ring-ring"
            >
              <option value="updated">Recently updated</option>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">A → Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resumes */}
      <DashboardSection
        title={isFiltering ? "Results" : "All Resumes"}
        count={loading ? undefined : sortedResumes.length}
      >
        {loading ? (
          <ResumeGrid
            resumes={[]}
            loading={true}
            onCreate={handleCreateResume}
            onRefresh={refetch}
          />
        ) : sortedResumes.length === 0 ? (
          resumes.length === 0 ? (
            <EmptyResumeState onCreate={handleCreateResume} />
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-border bg-navbar px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-btn-hover-bg">
                <Search size={24} className="text-subheading" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-heading">
                No resumes found
              </h3>

              <p className="mt-2 text-sm text-nav-text">
                Try a different search or status filter.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex h-10 items-center rounded-xl border border-border px-5 text-sm font-semibold text-subheading transition hover:border-btn hover:bg-btn hover:text-btn-text"
              >
                Clear filters
              </button>
            </div>
          )
        ) : (
          <ResumeGrid
            resumes={sortedResumes}
            loading={false}
            onCreate={handleCreateResume}
            onRefresh={refetch}
          />
        )}
      </DashboardSection>

      {/* Infinite scroll trigger */}
      {!loading && resumes.length > 0 && (
        <div
          ref={loadMoreRef}
          className="flex min-h-16 items-center justify-center"
        >
          {loadingMore && (
            <div className="flex items-center gap-2 text-sm text-nav-text">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-btn" />
              Loading more resumes...
            </div>
          )}

          {!hasNextPage && !loadingMore && (
            <p className="text-sm text-nav-text">
              You've reached the end of your resumes.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
