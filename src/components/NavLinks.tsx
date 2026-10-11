"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface INavLinks {
  slug: string;
  icon: string;
  nameBn: string;
}

const NavLinks = () => {
  const pathname = usePathname();
  const [data, setData] = useState<INavLinks[]>([]);

  useEffect(() => {
    fetch("https://openapi.programming-hero.com/api/bazardor/categories")
      .then((res) => res.json())
      .then((json) => setData(Array.isArray(json) ? json : []))
      .catch(() => setData([]));
  }, []);

  return (
    <nav className="w-full border-t border-gray-100 bg-white">
      <ul className="mx-auto m-0 flex max-w-6xl list-none items-center justify-start gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {data.map((item) => {
          const href = `/category/${item.slug}`;
          const isActive = pathname === href;

          return (
            <li key={item.slug} className="shrink-0">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-[#05893E] text-white shadow-sm"
                    : "text-gray-800 hover:bg-gray-100 hover:text-[#05893E]"
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
