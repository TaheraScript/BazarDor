// REQUIREMENT: skeleton while Home data is being fetched (replaces the spinner)
export default function Loading() {
  return (
    <section className="mx-5 mt-4 max-w-7xl xl:mx-auto">
      <div className="mb-4 h-6 w-40 animate-pulse rounded bg-gray-200" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-lg border border-gray-200 bg-gray-100"
          />
        ))}
      </div>
    </section>
  );
}