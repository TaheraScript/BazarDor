// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-5 flex min-h-[60vh] max-w-7xl flex-col items-center justify-center text-center xl:mx-auto">
      <p className="text-sm font-semibold text-green-700">৪০৪</p>

      <h1 className="mt-2 text-2xl font-bold text-gray-900">
        পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
      </h1>

      <p className="mt-2 max-w-sm text-sm text-gray-500">
        আপনি যে পৃষ্ঠাটি খুঁজছেন তা পাওয়া যায়নি। লিংকটি যাচাই করুন বা হোম পেজে
        ফিরে যান।
      </p>

      <Link
        href="/"
        className="mt-6 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
      >
        হোম পেজে ফিরে যান
      </Link>
    </section>
  );
}
