import Link from "next/link";
import MarqueeText from "react-marquee-text";
import "react-marquee-text/dist/styles.css";
import { BsCaretUpFill, BsCaretDownFill, BsDash } from "react-icons/bs";

interface IHeadlines {
  change: {
    pct: number;
    dir: "up" | "down" | "flat";
  };
  unit: string;
  id: number;
  slug?: string;
  categoryIcon: string;
  nameBn: string;
  today: number;
}

const COLOR = {
  up: "text-[#d44a4b] group-hover:text-white/80",
  down: "text-[#1a9951] group-hover:text-white/80",
  flat: "text-[#5f6761] group-hover:text-white/80",
};

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

const toBnPct = (n: number) =>
  Number(n).toLocaleString("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const Marquee = async () => {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/bazardor/products",
    { next: { revalidate: 600 } },
  );

  const json = res.ok ? await res.json() : [];
  const headlines: IHeadlines[] = Array.isArray(json) ? json : [];

  if (headlines.length === 0) return null;

  return (
    <div className="border-y border-gray-200 bg-[#fafcfa]">
      <MarqueeText className="text-sm" direction="right" duration={20}>
        {headlines.map((item, index: number) => {
          const dir = item.change?.dir ?? "flat";
          const pct = Math.abs(Number(item.change?.pct ?? 0));
          const unit = unitBn[item.unit?.toLowerCase()] ?? item.unit;

          return (
            <Link
              key={item.id ?? index}
              href={`/product/${item.slug ?? item.id}`}
              className="group inline-flex items-center gap-2 whitespace-nowrap px-5 py-1.5 transition-colors hover:bg-[#05893E] hover:text-white"
            >
              <span>{item.categoryIcon}</span>
              <span className="text-base-content text-[14px] font-medium group-hover:text-white">
                {item.nameBn}
              </span>
              <span>{`${toBn(item.today)} টাকা/${unit}`}</span>

              {dir === "up" && (
                <span
                  className={`inline-flex items-center gap-1 font-semibold ${COLOR.up}`}
                >
                  <BsCaretUpFill />
                  {`${toBnPct(pct)} %`}
                </span>
              )}

              {dir === "down" && (
                <span
                  className={`inline-flex items-center gap-1 font-semibold ${COLOR.down}`}
                >
                  <BsCaretDownFill />
                  {`${toBnPct(pct)} %`}
                </span>
              )}

              {dir === "flat" && (
                <span
                  className={`inline-flex items-center gap-1 font-semibold ${COLOR.flat}`}
                >
                  <BsDash size={16} />
                  {`${toBnPct(pct)} %`}
                </span>
              )}
            </Link>
          );
        })}
      </MarqueeText>
    </div>
  );
};

export default Marquee;
