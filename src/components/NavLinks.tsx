"use client"; // REQUIREMENT: usePathname needs a client component

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // REQUIREMENT: added to detect the active category

interface INavLinks {
  slug: string;
  icon: string;
  nameBn: string;
}

const NavLinks = () => {
  const pathname = usePathname();
  const [data, setData] = useState<INavLinks[]>([]); // REQUIREMENT: client component fetches in an effect

  useEffect(() => {
    fetch("https://openapi.programming-hero.com/api/bazardor/categories")
      .then((res) => res.json())
      .then((json) => setData(Array.isArray(json) ? json : []))
      .catch(() => setData([]));
  }, []);

  return (
    <nav className="w-full border-t border-gray-100 bg-white">
      <ul className="mx-auto m-0 flex max-w-7xl list-none items-center justify-start gap-6 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {data.map((item) => {
          const href = `/category/${item.slug}`;
          // REQUIREMENT: active category link must look different
          const isActive = pathname === href;

          return (
            <li key={item.slug} className="shrink-0">
              <Link
                href={href}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-green-700 ${
                  isActive
                    ? "text-green-700 underline underline-offset-8"
                    : "text-gray-800"
                }`}
              >
                <span className="text-sm leading-none">{item.icon}</span>
                <span>{item.nameBn}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavLinks;