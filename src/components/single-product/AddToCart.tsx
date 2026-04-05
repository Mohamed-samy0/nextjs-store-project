"use client";
import { useState } from "react";
import SelectProductAmount, { Mode } from "./SelectProductAmount";
import FormContainer from "../form/FormContainer";
import { ProductSignInButton, SubmitButton } from "../form/Button";
import { addToCartAction } from "@/utils/actions";
import { useAuth } from "@clerk/nextjs";

function AddToCart({ productId }: { productId: string }) {
  const [amount, setAmount] = useState<number>(1);
  const { userId } = useAuth();
  return (
    <div className="mt-4">
      <SelectProductAmount
        amount={amount}
        setAmount={setAmount}
        mode={Mode.SingleProduct}
      />
      {userId ? (
        <FormContainer action={addToCartAction}>
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="amount" value={amount} />
          <SubmitButton text="add to cart" className="capitalize mt-8" size="lg" />
        </FormContainer>
      ) : (
        <ProductSignInButton />
      )}
    </div>
  );
}
export default AddToCart;
