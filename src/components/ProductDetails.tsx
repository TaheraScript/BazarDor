import Link from "next/link";
import { notFound } from "next/navigation";
import { BsCaretDownFill, BsCaretUpFill, BsChevronRight, BsDash } from "react-icons/bs";

interface IMarket {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface IProductDetails {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: { pct: number; dir: "up" | "down" | "flat" };
  markets: IMarket[];
}

const unitBn: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
  l: "লিটার",
  piece: "পিস",
  pcs: "পিস",
  dozen: "ডজন",
  hali: "হালি",
  gram: "গ্রাম",
  g: "গ্রাম",
};

const toBn = (n: number) => Number(n).toLocaleString("bn-BD");

const toBnPrice = (n: number) =>
  Number.isInteger(n)
    ? toBn(n)
    : n.toLocaleString("bn-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

const toBnPct = (n: number) =>
  Number(n).toLocaleString("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const ProductDetails = async ({ id }: { id: string }) => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/bazardor/products/${id}`,
  );
  if (!res.ok) notFound();
  const product: IProductDetails = await res.json();

  const unit = unitBn[product.unit?.toLowerCase()] ?? product.unit;
  const dir = product.change?.dir;
  const pct = Math.abs(product.change?.pct ?? 0);
  const diff = Math.abs(product.today - product.yesterday);

  const rows = [...(product.markets ?? [])]
    .map((m) => ({ ...m, avg: (m.min + m.max) / 2 }))
    .sort((a, b) => a.avg - b.avg);

  const lowest = rows.length ? Math.min(...rows.map((r) => r.min)) : 0;
  const highest = rows.length ? Math.max(...rows.map((r) => r.max)) : 0;

  const changeColor =
    dir === "up"
      ? "text-[#d44a4b]"
      : dir === "down"
        ? "text-[#1a9951]"
        : "text-[#5f6761]";

  const changeWord =
    dir === "up" ? "বেড়েছে" : dir === "down" ? "কমেছে" : "অপরিবর্তিত";

  return (
    <div className="mx-5 mt-6 mb-10 max-w-5xl space-y-4 xl:mx-auto">
      <nav className="flex items-center gap-2 text-xs leading-normal text-[#5f6761]">
        <Link href="/" className="hover:text-[#05893E]">
          হোম
        </Link>
        <BsChevronRight size={8} />
        <Link
          href={`/category/${product.category}`}
          className="hover:text-[#05893E]"
        >
          {product.categoryNameBn}
        </Link>
        <BsChevronRight size={8} />
        <span className="text-[#1d271f]">{product.nameBn}</span>
      </nav>

      <section className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-[#fafcfa] p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <span className="flex h-21 w-21 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f0] text-4xl">
            {product.image}
          </span>

          <div>
            <h1 className="text-[26px] font-bold leading-normal text-[#1d271f]">
              {product.nameBn}
            </h1>
            <p className="text-xs leading-normal text-[#5f6761]">
              প্রতি {unit} · {product.categoryNameBn}
            </p>

            {/* REQUIREMENT: category tags */}
            <div className="mt-1 flex flex-wrap gap-1.5">
              <Link
                href={`/category/${product.category}`}
                className="rounded-full border border-[#cfe5d7] bg-[#e1f1e7] px-2.5 py-0.5 text-[11px] font-medium text-[#1d271f]"
              >
                {product.categoryNameBn}
              </Link>
            </div>

            <p className="mt-1 text-xs leading-normal text-[#1d271f]">
              গতকালের তুলনায় আজ দাম{" "}
              <span className="font-bold">{changeWord}</span>
              {dir !== "flat" && <> · {toBn(diff)} টাকা</>}
            </p>
          </div>
        </div>

        <div className="min-w-32 rounded-xl bg-[#f0f5f0] px-6 py-3 text-center">
          <p className="text-[11px] leading-normal text-[#5f6761]">আজকের দাম</p>
          <p className="text-3xl font-extrabold leading-normal text-[#1d271f]">
            {toBn(product.today)}
          </p>
          <p className="text-[11px] leading-normal text-[#5f6761]">
            টাকা / {unit}
          </p>
          <p
            className={`mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold leading-normal ${changeColor}`}
          >
            {dir === "up" && <BsCaretUpFill size={9} />}
            {dir === "down" && <BsCaretDownFill size={9} />}
            {dir === "flat" && <BsDash size={12} />}
            {toBnPct(pct)}%
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-[#fafcfa] p-5">
        <h2 className="mb-3 text-base font-semibold leading-normal text-[#1d271f]">
          দামের সারসংক্ষেপ
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 p-3">
            <p className="text-[11px] leading-normal text-[#5f6761]">
              সর্বনিম্ন দাম
            </p>
            <p className="text-lg font-bold leading-normal text-[#1a9951]">
              {toBn(lowest)}{" "}
              <span className="text-xs font-medium">টাকা</span>
            </p>
            <p className="text-[11px] leading-normal text-[#5f6761]">
              সবচেয়ে কম দামের বাজার
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-3">
            <p className="text-[11px] leading-normal text-[#5f6761]">
              সর্বাধিক দাম
            </p>
            <p className="text-lg font-bold leading-normal text-[#d44a4b]">
              {toBn(highest)}{" "}
              <span className="text-xs font-medium">টাকা</span>
            </p>
            <p className="text-[11px] leading-normal text-[#5f6761]">
              সবচেয়ে বেশি দামের বাজার
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-3">
            <p className="text-[11px] leading-normal text-[#5f6761]">গড় দাম</p>
            <p className="text-lg font-bold leading-normal text-[#1a9951]">
              {toBn(product.today)}{" "}
              <span className="text-xs font-medium">টাকা</span>
            </p>
            <p className="text-[11px] leading-normal text-[#5f6761]">
              প্রতি {unit}-এর হিসাব
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-[#fafcfa] p-5">
        <h2 className="mb-3 text-base font-semibold leading-normal text-[#1d271f]">
          বাজারভিত্তিক আজকের দাম
        </h2>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-140 border-collapse text-left text-xs">
            <thead>
              <tr className="bg-[#f0f5f0] text-[#5f6761]">
                <th className="px-4 py-2.5 font-normal leading-normal">বাজার</th>
                <th className="px-4 py-2.5 font-normal leading-normal">বিভাগ</th>
                <th className="px-4 py-2.5 text-right font-normal leading-normal">
                  সর্বনিম্ন
                </th>
                <th className="px-4 py-2.5 text-right font-normal leading-normal">
                  সর্বাধিক
                </th>
                <th className="px-4 py-2.5 text-right font-normal leading-normal">
                  গড়
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.market}
                  className={`text-[#1d271f] ${
                    i % 2 === 0
                      ? "border-y border-[#c3c7c3] bg-[#f0f5f0]"
                      : "bg-[#fafcfa]"
                  }`}
                >
                  <td className="px-4 py-2.5 leading-normal">{row.market}</td>
                  <td className="px-4 py-2.5 leading-normal">{row.division}</td>
                  <td className="px-4 py-2.5 text-right leading-normal">
                    {toBnPrice(row.min)} টাকা
                  </td>
                  <td className="px-4 py-2.5 text-right leading-normal">
                    {toBnPrice(row.max)} টাকা
                  </td>
                  <td className="px-4 py-2.5 text-right font-bold leading-normal">
                    {toBnPrice(row.avg)} টাকা
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;