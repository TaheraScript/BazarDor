import { BsCaretDownFill } from "react-icons/bs";
import ProductCard, { IProductCard } from "./ProductCard";

const PriceDecrease = async () => {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/bazardor/products",
  );
  const products: IProductCard[] = await res.json();

  return (
    <section className="mx-5 max-w-7xl xl:mx-auto mt-4">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
        <BsCaretDownFill className="text-[#1a9951]" />
        আজ দাম কমেছে
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {products
          .filter((item) => item.change?.dir === "down")

          .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
          .slice(0, 6)
          .map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
      </div>
    </section>
  );
};

export default PriceDecrease;
