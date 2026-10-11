import Banner from "@/components/Banner";
import PriceDecrease from "@/components/PriceDecrease";
import PriceIncrease from "@/components/PriceIncrease";
import Products from "@/components/Products";

export default function Home() {
  return (
    <main>
      <Banner></Banner>
      <PriceIncrease></PriceIncrease>
      <PriceDecrease></PriceDecrease>
      <Products></Products>
    </main>
  );
}
