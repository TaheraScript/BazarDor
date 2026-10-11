"use client";

// REQUIREMENT (C1): sort dropdown "সাজান" with ডিফল্ট / দাম: কম থেকে বেশি / দাম: বেশি থেকে কম
import { useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import ProductCard, { IProductCard } from "./ProductCard";

type SortType = "default" | "asc" | "desc";

const toBn = (n: number) => Number(n).toLocaleString("bn-BD");

// REQUIREMENT (C1): sort by numeric value, not string. This also converts Bengali digits
// (e.g. "১৪৮") to a number, in case the API ever returns the price as a Bengali string.
const toNumber = (v: unknown) => {
  const s = String(v).replace(/[০-৯]/g, (d) => String("০১২৩৪৫৬৭৮৯".indexOf(d)));
  return Number(s.replace(/,/g, ""));
};

const CategoryProducts = ({ products }: { products: IProductCard[] }) => {
  const [sort, setSort] = useState<SortType>("default");

  const sorted =
    sort === "default"
      ? products
      : [...products].sort((a, b) =>
          sort === "asc"
            ? toNumber(a.today) - toNumber(b.today)
            : toNumber(b.today) - toNumber(a.today),
        );

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] font-normal">
          {`মোট ${toBn(products.length)}টি পণ্য`}
        </p>

        <label className="flex items-center gap-2 text-sm text-[#1d271f]">
          সাজান:
          <span className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
              className="h-9 cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white py-0 pl-3 pr-8 text-sm outline-none focus:border-[#05893E]"
            >
              <option value="default">ডিফল্ট</option>
              <option value="asc">দাম: কম থেকে বেশি</option>
              <option value="desc">দাম: বেশি থেকে কম</option>
            </select>
            <BsChevronDown
              size={12}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#5f6761]"
            />
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {sorted.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
};

export default CategoryProducts;