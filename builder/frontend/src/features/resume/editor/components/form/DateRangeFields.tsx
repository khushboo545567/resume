import Checkbox from "../../../../../components/ui/Checkbox";
import FormField from "../../../../../components/ui/FormField";
import MonthYearPicker from "../MonthYearPicker";

interface Props {
  startDate: string;
  endDate: string;
  current: boolean;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  /** Called with the new state; the caller clears the end date when true. */
  onCurrentChange: (checked: boolean) => void;
  /** e.g. "I currently work here" */
  currentLabel: string;
  startLabel?: string;
  endLabel?: string;
  /** Latest selectable year (defaults to the current year). */
  maxYear?: number;
}

/** Start / end month pickers + "currently here" checkbox (Experience, Internship, Project). */
export default function DateRangeFields({
  startDate,
  endDate,
  current,
  onStartChange,
  onEndChange,
  onCurrentChange,
  currentLabel,
  startLabel = "Start date",
  endLabel = "End date",
  maxYear = new Date().getFullYear(),
}: Props) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <FormField label={startLabel}>
          <MonthYearPicker
            value={startDate}
            onChange={onStartChange}
            maxYear={maxYear}
            placeholder="Select start month"
          />
        </FormField>

        <FormField
          label={endLabel}
          hint={current ? "Present will be shown on the resume." : undefined}
        >
          <MonthYearPicker
            value={endDate}
            onChange={onEndChange}
            maxYear={maxYear}
            disabled={current}
            placeholder="Select end month"
            align="end"
          />
        </FormField>
      </div>

      <Checkbox
        label={currentLabel}
        checked={current}
        onChange={(e) => onCurrentChange(e.target.checked)}
      />
    </div>
  );
}
