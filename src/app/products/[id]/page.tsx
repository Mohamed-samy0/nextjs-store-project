import BreadCrumbs from "@/components/single-product/BreadCrumbs";
import { fetchSingleProduct } from "@/utils/actions";
import Image from "next/image";
import { formatCurrency } from "@/utils/format";
import FavoriteToggleButton from "@/components/products/FavoriteToggleButton";
import AddToCart from "@/components/single-product/AddToCart";
import ProductRating from "@/components/single-product/ProductRating";
import ShareButton from "@/components/single-product/ShareButton";

async function SingleProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await fetchSingleProduct(id);
  const { name, image, price, company, description } = product;
  const dollarAmount = formatCurrency(price);
  return (
    <section>
      <BreadCrumbs name={name} />
      <div className="mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16">
        <div className="relative h-full">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="object-cover w-full rounded-lg"
          />
        </div>
        <div>
          <div className="flex gap-x-8 items-center">
            <h1 className="capitalize text-3xl font-bold tracking-tight">{name}</h1>
            <div className="flex items-center gap-x-2">
              <FavoriteToggleButton productId={id} />
              <ShareButton name={name} productId={id} />
            </div>
          </div>
          <ProductRating productId={id} />
          <h4 className="capitalize text-xl font-bold tracking-tight mt-2">{company}</h4>
          <p className="mt-3 text-md bg-muted inline-block p-2 rounded">{dollarAmount}</p>
          <p className="mt-6 text-muted-foreground leading-8 max-w-2xl">{description}</p>
          <AddToCart productId={id} />
        </div>
      </div>
    </section>
  );
}
export default SingleProductPage;
