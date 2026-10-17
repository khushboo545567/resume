// DashboardHeader.tsx
import { Search, Plus, ScanSearch } from "lucide-react";

import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

interface Props {
  total: number;
  search: string;
  filter: "all" | "draft" | "completed";
  sort: "updated" | "newest" | "oldest" | "az";
  onSearch: (value: string) => void;
  onFilter: (value: "all" | "draft" | "completed") => void;
  onSort: (value: "updated" | "newest" | "oldest" | "az") => void;
  onCreate: () => void;
  onAnalyseATS: () => void;
}

export default function DashboardHeader({
  total,
  search,
  filter,
  sort,
  onSearch,
  onFilter,
  onSort,
  onCreate,
  onAnalyseATS,
}: Props) {
  return (
    <div className="flex min-w-0 flex-col gap-5 rounded-2xl border border-border-popup bg-navbar p-5 shadow-sm sm:gap-6 sm:p-8 xl:flex-row xl:items-center xl:justify-between">
      {/* Left Side - Title */}
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-heading sm:text-3xl">My Resumes</h1>
        <p className="mt-1 text-sm text-nav-text sm:mt-2 sm:text-base">
          {total} resumes available
        </p>
      </div>

      {/* Right Side - Controls */}
      <div className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center xl:flex xl:flex-1 xl:justify-end">
        {/* Search Input */}
        <div className="min-w-0 sm:col-span-2 lg:col-span-1 lg:w-full xl:w-80">
          <Input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search resume..."
            leftIcon={<Search size={18} />}
          />
        </div>

        {/* Filter + Sort */}
        <div className="grid min-w-0 grid-cols-2 gap-3">
          <select
            value={filter}
            onChange={(e) =>
              onFilter(e.target.value as "all" | "draft" | "completed")
            }
            className="h-11 w-full min-w-0 rounded-xl border border-border-popup bg-navbar px-3 text-sm text-heading focus:border-border-strong focus:outline-none sm:h-12 sm:w-auto sm:px-4"
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={sort}
            onChange={(e) =>
              onSort(e.target.value as "updated" | "newest" | "oldest" | "az")
            }
            className="h-11 w-full min-w-0 rounded-xl border border-border-popup bg-navbar px-3 text-sm text-heading focus:border-border-strong focus:outline-none sm:h-12 sm:w-auto sm:px-4"
          >
            <option value="updated">Recently Updated</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A-Z</option>
          </select>
        </div>

        {/* Create / Analyse buttons */}
        <div className="grid min-w-0 grid-cols-2 gap-3">
          <Button
            leftIcon={<ScanSearch size={18} />}
            onClick={onAnalyseATS}
            className="w-full whitespace-nowrap sm:w-auto"
          >
            <span className="hidden sm:inline">Analyse ATS Score</span>
            <span className="sm:hidden">Analyse</span>
          </Button>

          <Button
            leftIcon={<Plus size={18} />}
            onClick={onCreate}
            className="w-full whitespace-nowrap sm:w-auto"
          >
            <span className="hidden sm:inline">Create Resume</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
