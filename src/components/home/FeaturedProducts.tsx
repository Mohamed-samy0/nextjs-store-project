import { fetchFeaturedProducts } from "@/utils/actions";
import SectionTitle from "../global/SectionTitle";
import EmptyList from "../global/EmptyList";
import ProductsGrid from "../products/ProductsGrid";

async function FeaturedProducts() {
  const featuredProducts = await fetchFeaturedProducts();
  if (!featuredProducts) return <EmptyList heading="No featured products found" />;
  return (
    <section className="py-24">
      <SectionTitle title="featured products" />
      <ProductsGrid products={featuredProducts} />
      {/* {featuredProducts.length === 0 ? (
        <EmptyList />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {featuredProducts.map((product) => (
            <article key={product.id}>{product.name}</article>
          ))}
        </div>
      )} */}
    </section>
  );
}
export default FeaturedProducts;
