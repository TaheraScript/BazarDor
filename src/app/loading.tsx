// src/app/loading.tsx
export default function Loading() {
  return (
    <section
      role="status"
      aria-live="polite"
      className="mx-5 flex min-h-[60vh] max-w-7xl flex-col items-center justify-center text-center xl:mx-auto"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-700/20 border-t-green-700" />
      <p className="mt-4 text-sm text-gray-500">লোড হচ্ছে...</p>
    </section>
  );
}