"use client";
import { useState } from "react";
import SelectProductAmount from "../single-product/SelectProductAmount";
import { Mode } from "../single-product/SelectProductAmount";
import FormContainer from "../form/FormContainer";
import { SubmitButton } from "../form/Button";
import { removeCartItemAction, updateCartItemAction } from "@/utils/actions";
import { toast } from "sonner";

function ThirdColumn({ quantity, id }: { quantity: number; id: string }) {
  const [amount, setAmount] = useState(quantity);
  const [isLoading, setIsLoading] = useState(false);

  const handleAmountChange = async (value: number) => {
    setIsLoading(true);
    const toastId = toast.loading("Updating cart...");
    try {
      const result = await updateCartItemAction({ amount: value, cartItemId: id });
      setAmount(value);
      toast.success(result?.message || "Cart updated successfully", {
        id: toastId,
      });
    } catch {
      toast.error("Failed to update cart", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="md:ml-8">
      <SelectProductAmount
        amount={amount}
        setAmount={handleAmountChange}
        mode={Mode.CartItem}
        isLoading={isLoading}
      />
      <FormContainer action={removeCartItemAction}>
        <input type="hidden" name="id" value={id} />
        <SubmitButton size="sm" className="mt-4" text="Remove" />
      </FormContainer>
    </div>
  );
}

export default ThirdColumn;
