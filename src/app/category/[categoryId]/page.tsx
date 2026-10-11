"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { BsChevronDown } from "react-icons/bs";
import ProductCard, { IProductCard } from "@/components/ProductCard";

interface ICategory {
  slug: string;
  icon: string;
  nameBn: string;
}

type SortType = "default" | "asc" | "desc";

const toBn = (n: number) => Number(n).toLocaleString("bn-BD");

const toNumber = (v: unknown) => {
  const s = String(v).replace(/[০-৯]/g, (d) => String("০১২৩৪৫৬৭৮৯".indexOf(d)));
  return Number(s.replace(/,/g, ""));
};

const CategoryWiseProduct = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  const [products, setProducts] = useState<IProductCard[]>([]);
  const [category, setCategory] = useState<ICategory | undefined>();
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [sort, setSort] = useState<SortType>("default");

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch(
        `https://openapi.programming-hero.com/api/bazardor/products?category=${categoryId}`,
      ),
      fetch("https://openapi.programming-hero.com/api/bazardor/categories"),
    ])
      .then(async ([res, catRes]) => {
        const list = res.ok ? await res.json() : [];
        const cats = catRes.ok ? await catRes.json() : [];
        if (cancelled) return;

        const valid = Array.isArray(list) && list.length > 0;
        setProducts(valid ? list : []);
        setCategory(
          Array.isArray(cats)
            ? cats.find((c: ICategory) => c.slug === categoryId)
            : undefined,
        );
        setInvalid(!valid);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setInvalid(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  if (loading) {
    return (
      <section className="mx-auto mt-6 max-w-6xl space-y-4 px-4 pb-10 sm:px-6 lg:px-8">
        <div className="h-24 animate-pulse rounded-2xl border border-gray-200 bg-gray-100" />
        <div className="h-16 animate-pulse rounded-2xl border border-gray-200 bg-gray-100" />
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl border border-gray-200 bg-gray-100"
            />
          ))}
        </div>
      </section>
    );
  }

  if (invalid) notFound();

  const sorted =
    sort === "default"
      ? products
      : [...products].sort((a, b) =>
          sort === "asc"
            ? toNumber(a.today) - toNumber(b.today)
            : toNumber(b.today) - toNumber(a.today),
        );

  return (
    <section className="mx-auto mt-6 max-w-6xl space-y-4 px-4 pb-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-[#fafcfa] p-5">
        <span className="text-4xl leading-none">
          {category?.icon ?? products[0]?.categoryIcon}
        </span>
        <div>
          <h1 className="text-2xl font-bold leading-normal text-[#1d271f]">
            {category?.nameBn ?? "পণ্য"}
          </h1>
          <p className="text-xs leading-normal text-[#5f6761] sm:text-sm">
            {toBn(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 rounded-2xl border border-gray-200 bg-[#fafcfa] px-5 py-4">
        <label htmlFor="sort" className="text-sm text-[#5f6761]">
          সাজান
        </label>
        <div className="relative">
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="h-9 cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white py-0 pl-3 pr-8 text-xs font-medium text-[#1d271f] outline-none focus:border-[#05893E]"
          >
            <option value="default">ডিফল্ট</option>
            <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
          </select>
          <BsChevronDown
            size={11}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#1d271f]"
          />
        </div>
      </div>

      <p className="text-xs leading-normal text-[#5f6761] sm:text-sm">
        মোট {toBn(products.length)}টি পণ্য দেখানো হচ্ছে
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default CategoryWiseProduct;
