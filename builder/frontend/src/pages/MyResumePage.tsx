import { useEffect, useRef, useState } from "react";

import { Plus, Search } from "lucide-react";

import ResumeGrid from "../features/resume/components/ResumeGrid";
import CreateResumeModal from "../features/resume/components/CreateResumeModal";
import EmptyResumeState from "../features/resume/components/EmptyResumeState";

import { useResumes } from "../features/resume/hooks/useResumes";

import type { Resume } from "../features/resume/types/resume.types";

export default function MyResumePage() {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<"all" | "draft" | "completed">("all");

  const [sort, setSort] = useState<"updated" | "newest" | "oldest" | "az">(
    "updated",
  );

  // ==========================================
  // GET RESUMES
  // ==========================================

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
  // INFINITE SCROLL REF
  // ==========================================

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // ==========================================
  // INFINITE SCROLL
  // ==========================================

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting && hasNextPage && !loadingMore) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, loadingMore, fetchNextPage]);

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="flex min-h-100 items-center bg-background justify-center">
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
            className="mt-4 rounded-lg bg-btn px-4 py-2 text-sm font-medium text-btn-text"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredResumes = resumes.filter((resume: Resume) => {
    const keyword = search.toLowerCase().trim();

    const title = resume.title?.toLowerCase() ?? "";

    const targetRole = resume.targetRole?.toLowerCase() ?? "";

    const matchesSearch =
      title.includes(keyword) || targetRole.includes(keyword);

    const matchesFilter = filter === "all" || resume.status === filter;

    return matchesSearch && matchesFilter;
  });

  // ==========================================
  // SORT
  // ==========================================

  const sortedResumes = [...filteredResumes];

  switch (sort) {
    case "updated":
      sortedResumes.sort((a, b) => {
        const dateA = new Date(a.updatedAt || 0).getTime();

        const dateB = new Date(b.updatedAt || 0).getTime();

        return dateB - dateA;
      });
      break;

    case "newest":
      sortedResumes.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();

        const dateB = new Date(b.createdAt || 0).getTime();

        return dateB - dateA;
      });
      break;

    case "oldest":
      sortedResumes.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();

        const dateB = new Date(b.createdAt || 0).getTime();

        return dateA - dateB;
      });
      break;

    case "az":
      sortedResumes.sort((a, b) => {
        const titleA = a.title?.toLowerCase() ?? "";

        const titleB = b.title?.toLowerCase() ?? "";

        return titleA.localeCompare(titleB);
      });
      break;
  }

  // ==========================================
  // COUNT LABEL (shown under the page title)
  // ==========================================

  const totalResumes = pagination?.totalResumes ?? resumes.length;

  const countLabel = loading
    ? "Loading your resumes..."
    : sortedResumes.length === totalResumes
      ? `${totalResumes} ${totalResumes === 1 ? "resume" : "resumes"}`
      : `Showing ${sortedResumes.length} of ${totalResumes} resumes`;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-8">
      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-heading sm:text-2xl">
            My Resumes
          </h1>

          <p className="mt-1 text-sm text-nav-text">{countLabel}</p>
        </div>

        {/* The navbar already has Create Resume from 1400px up, so this button
            only shows where the navbar's one is tucked into the side menu. */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-btn px-5 text-sm font-semibold text-btn-text transition hover:bg-btn-hover [@media(min-width:1400px)]:hidden"
        >
          <Plus size={18} />
          Create Resume
        </button>
      </div>

      {/* ======================================
          SEARCH + FILTER
      ====================================== */}

      <div className="rounded-2xl border border-border bg-popup p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* SEARCH */}

          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-nav-text"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resumes or target roles..."
              className="h-11 w-full rounded-xl border border-border bg-navbar pl-10 pr-4 text-sm outline-none transition focus:border-border-strong focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* FILTERS */}

          <div className="flex flex-wrap gap-3">
            {/* STATUS FILTER */}

            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "all" | "draft" | "completed")
              }
              className="h-11 rounded-xl border border-border bg-popup px-4 text-sm font-medium text-heading outline-none focus:border-border-strong"
            >
              <option value="all">All Resumes</option>

              <option value="draft">Drafts</option>

              <option value="completed">Completed</option>
            </select>

            {/* SORT */}

            <select
              value={sort}
              onChange={(e) =>
                setSort(
                  e.target.value as "updated" | "newest" | "oldest" | "az",
                )
              }
              className="h-11 rounded-xl border border-border bg-popup px-4 text-sm font-medium text-heading outline-none focus:border-border-strong"
            >
              <option value="updated">Recently Updated</option>

              <option value="newest">Newest First</option>

              <option value="oldest">Oldest First</option>

              <option value="az">A → Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* ======================================
          INITIAL LOADING
      ====================================== */}

      {loading ? (
        <ResumeGrid
          resumes={[]}
          loading={true}
          onCreate={() => setOpen(true)}
          onRefresh={refetch}
        />
      ) : sortedResumes.length === 0 ? (
        /* ====================================
           EMPTY / SEARCH EMPTY
        ==================================== */

        resumes.length === 0 ? (
          <EmptyResumeState onCreate={() => setOpen(true)} />
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-popup p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-btn-hover-bg">
              <Search size={24} className="text-nav-text" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-heading">
              No resumes found
            </h3>

            <p className="mt-2 text-sm text-nav-text">
              Try changing your search or filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="mt-5 text-sm font-semibold text-subheading hover:underline"
            >
              Clear filters
            </button>
          </div>
        )
      ) : (
        /* ====================================
           RESUME GRID
        ==================================== */

        <ResumeGrid
          resumes={sortedResumes}
          loading={false}
          onCreate={() => setOpen(true)}
          onRefresh={refetch}
        />
      )}

      {/* ======================================
          INFINITE SCROLL TRIGGER
      ====================================== */}

      {!loading && resumes.length > 0 && (
        <div
          ref={loadMoreRef}
          className="flex min-h-20 items-center justify-center"
        >
          {loadingMore && (
            <div className="flex items-center gap-2 text-sm text-nav-text">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-btn" />
              Loading more resumes...
            </div>
          )}

          {!hasNextPage && !loadingMore && (
            <p className="text-sm text-nav-text">You have reached the end.</p>
          )}
        </div>
      )}

      {/* ======================================
          CREATE RESUME MODAL
      ====================================== */}

      <CreateResumeModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
