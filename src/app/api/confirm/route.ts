import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
import { redirect } from "next/navigation";

import { NextResponse, type NextRequest } from "next/server";
import db from "@/utils/db";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id") as string;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const orderId = session.metadata?.orderId;
    const cartId = session.metadata?.cartId;

    if (session.status === "complete") {
      await db.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
        },
      });
    }
    await db.cart.delete({
      where: {
        id: cartId,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
  redirect("/orders");
};
