"use server";

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { productSchema } from "./schemas";

const authenticateUser = async () => {
  const user = await currentUser();
  if (!user) redirect("/");
  return user;
};

const renderErrorMessage = (error: unknown): { message: string } => {
  console.log(error);
  return { message: error instanceof Error ? error.message : "there was an error" };
};

export const fetchFeaturedProducts = async () => {
  const products = await db.product.findMany({
    where: {
      featured: true,
    },
  });
  return products;
};

export const fetchAllProducts = async ({ searchTerm = "" }: { searchTerm: string }) => {
  return await db.product.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { company: { contains: searchTerm, mode: "insensitive" } },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const fetchSingleProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) redirect("/products");
  return product;
};

export const createProductAction = async (
  prevState: { message: string } | null,
  formData: FormData,
): Promise<{ message: string }> => {
  const user = await authenticateUser();

  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = productSchema.parse(rawData);
    console.log(validatedData);

    return { message: "product created" };
  } catch (error) {
    return renderErrorMessage(error);
  }
};
