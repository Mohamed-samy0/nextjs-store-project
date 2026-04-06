import { Card, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { createOrderAction } from "@/utils/actions";
import FormContainer from "../form/FormContainer";
import { SubmitButton } from "../form/Button";
import { Cart } from "@prisma/client";

function CartTotals({ cart }: { cart: Cart }) {
  const { cartTotal, shipping, tax, orderTotal } = cart;
  return (
    <div>
      <Card className="p-8 flex flex-col gap-0">
        <CartTotalRow label="Subtotal" amount={cartTotal} />
        <CartTotalRow label="Shipping" amount={shipping} />
        <CartTotalRow label="Tax" amount={tax} />
        <CardTitle className="mt-4">
          <CartTotalRow label="Order Total" amount={orderTotal} lastRow />
        </CardTitle>
      </Card>
      <FormContainer action={createOrderAction}>
        <SubmitButton text="Place Order" className="w-full mt-8" />
      </FormContainer>
    </div>
  );
}

function CartTotalRow({
  label,
  amount,
  lastRow,
}: {
  label: string;
  amount: number;
  lastRow?: boolean;
}) {
  return (
    <div className="w-full">
      <p
        className={`flex justify-between ${lastRow ? "text-base font-bold" : "text-sm"} mb-2`}
      >
        <span>{label}</span>
        <span>{formatCurrency(amount)}</span>
      </p>
      {lastRow ? null : (
        <hr className="my-2 border-t border-slate-300 dark:border-slate-700" />
      )}{" "}
    </div>
  );
}

export default CartTotals;
