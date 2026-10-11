import ProductDetails from "@/components/ProductDetails";
import { notFound } from "next/navigation";

const ProductsDetailPage = async ({
  params,
}: {
  params: Promise<{ productsId: string }>;
}) => {
  const { productsId } = await params;
  if(!productsId){
    notFound()
  }

  return <ProductDetails id={productsId} />;
};

export default ProductsDetailPage;