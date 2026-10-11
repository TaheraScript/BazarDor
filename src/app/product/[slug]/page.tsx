import ProductDetails from "@/components/ProductDetails";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const ProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>; // REQUIREMENT: folder is now [slug]
}) => {
  // REQUIREMENT: protected route, requires login
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/signin?redirect=product"); // the sign-in page shows the toast
  }

  const { slug } = await params;
  if (!slug) {
    notFound();
  }

  return <ProductDetails slug={slug} />;
};

export default ProductPage;