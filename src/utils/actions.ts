"use server";

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { imageSchema, productSchema, validateProduct } from "./schemas";
import { uploadImage } from "./supabase";
import { revalidatePath } from "next/cache";

const authenticateUser = async () => {
  const user = await currentUser();
  if (!user) redirect("/");
  return user;
};

const authAdminUser = async () => {
  const user = await authenticateUser();
  if (user.id !== process.env.ADMIN_USER_ID) redirect("/");
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
    if (!validateFile.success) {
      return { message: validateFile.error };
    }
    const fullPath = await uploadImage(validateFile.data.image);
    if (!result.success) {
      return { message: result.error };
    }
    const validatedData = result.data;
    await db.product.create({
      data: {
        ...validatedData,
        image: fullPath,
        clerkId: user.id,
      },
    });
  } catch (error) {
    return renderErrorMessage(error);
  }
  redirect("/admin/products");
};

export const fetchAdminProducts = async () => {
  await authAdminUser();
  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return products;
};

export const deleteProductAction = async (productId: string) => {
  await authAdminUser();
  try {
    await db.product.delete({
      where: {
        id: productId,
      },
    });
  } catch (error) {
    return renderErrorMessage(error);
  }
  revalidatePath("/admin/products");
  redirect("/admin/products");
};
