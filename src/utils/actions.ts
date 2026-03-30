"use server";

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { imageSchema, productSchema, validateImage, validateProduct } from "./schemas";

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
    const result = validateProduct(productSchema, rawData);
    const file = formData.get("image") as File;
    const validateFile = validateProduct(imageSchema, { image: file });
    if (!result.success) {
      return { message: result.error };
    }
    if (!validateFile.success) {
      return { message: validateFile.error };
    }
    const validatedData = result.data;
    await db.product.create({
      data: {
        ...validatedData,
        image: "/images/product-3.jpg",
        clerkId: user.id,
      },
    });

    return { message: "product created" };
  } catch (error) {
    return renderErrorMessage(error);
  }
};
