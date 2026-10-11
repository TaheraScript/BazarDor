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
  categoryIcon: string;
  nameBn: string;
  today: number;
}

// REQUIREMENT: the spec says "green up, red down, gray flat". Your code had up/down
// reversed, so the colors now live here in one place and match the spec.
// If your Figma shows the opposite, swap these two values only.
const COLOR = {
  up: "text-[#1a9951]",
  down: "text-[#d44a4b]",
  flat: "text-[#5f6761]",
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
  // REQUIREMENT: cache the response so the ticker doesn't refetch on every request
  const res = await fetch(
    "https://openapi.programming-hero.com/api/bazardor/products",
    { next: { revalidate: 600 } },
  );

  // REQUIREMENT: app must run without errors after deployment. If the API fails or
  // returns a non-array, .map() would crash the layout on every page, so fall back
  // to an empty list and render nothing.
  const json = res.ok ? await res.json() : [];
  const headlines: IHeadlines[] = Array.isArray(json) ? json : [];

  if (headlines.length === 0) return null;

  return (
    <div className="bg-base-200">
      <MarqueeText className="py-1 text-sm" direction="right" duration={20}>
        {headlines.map((item, index: number) => {
          // REQUIREMENT: guard against an item with no `change` object
          const dir = item.change?.dir ?? "flat";
          const pct = Math.abs(Number(item.change?.pct ?? 0));
          const unit = unitBn[item.unit?.toLowerCase()] ?? item.unit;

          return (
            <span
              key={item.id ?? index}
              className="mr-6 inline-flex items-center gap-2 whitespace-nowrap"
            >
              <span>{item.categoryIcon}</span>
              <span className="text-base-content text-[14px] font-medium">
                {item.nameBn}
              </span>
              <span>{`${toBn(item.today)} টাকা/${unit}`}</span>

              {dir === "up" && (
                <span className={`inline-flex items-center gap-1 font-semibold ${COLOR.up}`}>
                  <BsCaretUpFill />
                  {`${toBnPct(pct)} %`}
                </span>
              )}

              {dir === "down" && (
                <span className={`inline-flex items-center gap-1 font-semibold ${COLOR.down}`}>
                  <BsCaretDownFill />
                  {`${toBnPct(pct)} %`}
                </span>
              )}

              {dir === "flat" && (
                <span className={`inline-flex items-center gap-1 font-semibold ${COLOR.flat}`}>
                  <BsDash size={16} />
                  {`${toBnPct(pct)} %`}
                </span>
              )}
            </span>
          );
        })}
      </MarqueeText>
    </div>
  );
};

export default Marquee;