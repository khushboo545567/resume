/** Centered loading circle for the content area of a page (the sidebar and navbar stay visible). */
export default function PageSpinner() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-[60vh] items-center justify-center"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-btn" />
    </div>
  );
}
