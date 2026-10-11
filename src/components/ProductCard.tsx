import Link from "next/link";
import { BsCaretDownFill, BsCaretUpFill, BsDash } from "react-icons/bs";

export interface IProductCard {
  id: number;
  slug?: string;
  nameBn: string;
  categoryIcon: string;
  unit: string;
  today: number;
  change: { pct: number; dir: "up" | "down" | "flat" };
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

const toBnPct = (n: number) =>
  Number(n).toLocaleString("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const ProductCard = ({ item }: { item: IProductCard }) => {
  const unit = unitBn[item.unit?.toLowerCase()] ?? item.unit;

  return (
    // REQUIREMENT: route is /product/[slug] (was /products/[id]); falls back to the id if there is no slug
    <Link href={`/product/${item.slug ?? item.id}`} className="block">
      <div className="rounded-xl border border-gray-200 bg-[#fafcfa] p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f0f5f0] text-xl">
            {item.categoryIcon}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold leading-normal">
              {item.nameBn}
            </h3>
            <span className="text-[11px] font-normal text-[#5f6761]">
              প্রতি {unit}
            </span>
          </div>
        </div>

        <p className="mt-3 text-[11px] font-normal text-[#5f6761]">আজকের দাম</p>

        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <p className="text-[18px] font-bold leading-tight">{toBn(item.today)}</p>
            <p className="text-[13px] font-medium">টাকা</p>
          </div>

          {item.change?.dir === "up" && (
            <div className="inline-flex items-center gap-1 rounded-full bg-[#f0f5f0] px-2 py-0.5 text-[11px] font-semibold text-[#d44a4b]">
              <BsCaretUpFill size={9} />
              {toBnPct(Math.abs(item.change.pct))}%
            </div>
          )}

          {item.change?.dir === "down" && (
            <div className="inline-flex items-center gap-1 rounded-full bg-[#f0f5f0] px-2 py-0.5 text-[11px] font-semibold text-[#1a9951]">
              <BsCaretDownFill size={9} />
              {toBnPct(Math.abs(item.change.pct))}%
            </div>
          )}

          {item.change?.dir === "flat" && (
            <div className="inline-flex items-center gap-1 rounded-full bg-[#f0f5f0] px-2 py-0.5 text-[11px] font-semibold text-[#5f6761]">
              <BsDash size={12} />
              {toBnPct(Math.abs(item.change.pct))}%
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;