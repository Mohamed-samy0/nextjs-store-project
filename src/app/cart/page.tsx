import CartItemsList from "@/components/cart/CartItemsList";
import CartTotals from "@/components/cart/CartTotals";
import SectionTitle from "@/components/global/SectionTitle";
import { fetchOrCreateCart, updateCart } from "@/utils/actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function CartPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");
  const previousCart = await fetchOrCreateCart({ userId });
  const cart = await updateCart(previousCart);
  if (cart.numItemsInCart === 0) {
    return (
      <>
        <SectionTitle title="Your Cart" />
        <p className="text-center text-muted-foreground">Your cart is empty</p>
      </>
    );
  }
  return (
    <>
      <SectionTitle title="Shopping Cart" />
      <div className="mt-8 grid gap-4 lg:grid-cols-12 items-start">
        <div className="lg:col-span-8">
          <CartItemsList cartItems={cart.cartItems} />
        </div>
        <div className="lg:col-span-4 lg:pl-4">
          <CartTotals cart={cart} />
        </div>
      </div>
    </>
  );
}
export default CartPage;
