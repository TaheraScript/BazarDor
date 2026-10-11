import ProductCard, { IProductCard } from "./ProductCard";

const toBn = (n: number) => Number(n).toLocaleString("bn-BD");

const Products = async () => {
  const res = await fetch("https://openapi.programming-hero.com/api/bazardor/products");
  const products: IProductCard[] = await res.json();

  return (
    // REQUIREMENT: id matches the hero CTA href="#সব-পণ্য"; scroll-mt-4 keeps a little space above the heading
    <section id="সব-পণ্য" className="mx-5 max-w-7xl xl:mx-auto mt-4 scroll-mt-4">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
        সব পণ্য
      </h2>
      <p className="mb-4 text-[14px] font-normal">{`মোট ${toBn(products.length)}টি পণ্য দেখানো হচ্ছে`}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {products.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default Products;