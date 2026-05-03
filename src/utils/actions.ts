"use server";

import db from "@/utils/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { imageSchema, productSchema, reviewSchema, validateProduct } from "./schemas";
import { deleteImage, uploadImage } from "./supabase";
import { cacheTag, revalidatePath, updateTag } from "next/cache";
import { Cart } from "@prisma/client";

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
  "use cache";
  cacheTag("products");
  const products = await db.product.findMany({
    where: {
      featured: true,
    },
  });
  return products;
};

export const fetchAllProducts = async ({ searchTerm = "" }: { searchTerm: string }) => {
  "use cache";
  cacheTag("products");
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
  "use cache";
  cacheTag("products");
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
    updateTag("products");
    revalidatePath("/");
    revalidatePath("/products");
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
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!product) redirect("/admin/products");
    await deleteImage(product.image);
    await db.product.delete({
      where: {
        id: productId,
      },
    });
    updateTag("products");
  } catch (error) {
    return renderErrorMessage(error);
  }
  revalidatePath("/admin/products");
  redirect("/admin/products");
};

export const fetchAdminProduct = async (productId: string) => {
  await authAdminUser();
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) redirect("/admin/products");
  return product;
};

export const updateProductAction = async (
  prevState: { message: string } | null,
  formData: FormData,
) => {
  await authAdminUser();
  try {
    const productId = formData.get("id") as string;
    const rawData = Object.fromEntries(formData.entries());
    const validateResult = validateProduct(productSchema, rawData);
    if (!validateResult.success) {
      return { message: validateResult.error };
    }
    const validatedData = validateResult.data;
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        ...validatedData,
      },
    });
    updateTag("products");
    revalidatePath("/admin/products");
    return { message: "Product updated successfully" };
  } catch (error) {
    return renderErrorMessage(error);
  }
};

export const updateProductImageAction = async (
  prevState: { message: string } | null,
  formData: FormData,
) => {
  await authAdminUser();
  try {
    const image = formData.get("image") as File;
    const productId = formData.get("id") as string;
    const url = formData.get("url") as string;
    const validateResult = validateProduct(imageSchema, { image });
    if (!validateResult.success) {
      return { message: validateResult.error };
    }
    const newUrl = await uploadImage(validateResult.data.image);
    await deleteImage(url);
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        image: newUrl,
      },
    });
    revalidatePath(`/admin/products/${productId}/edit`);
    return { message: "Product image updated successfully" };
  } catch (error) {
    return renderErrorMessage(error);
  }
};

export const fetchFavoriteId = async ({ productId }: { productId: string }) => {
  const user = await authenticateUser();
  const favorite = await db.favorite.findFirst({
    where: {
      clerkId: user.id,
      productId,
    },
    select: {
      id: true,
    },
  });
  return favorite?.id || null;
};

export const toggleFavoriteAction = async (payload: {
  productId: string;
  favoriteId: string | null;
  pathname: string;
}) => {
  const user = await authenticateUser();
  const { productId, favoriteId, pathname } = payload;
  try {
    if (favoriteId) {
      await db.favorite.delete({
        where: {
          id: favoriteId,
        },
      });
    } else {
      await db.favorite.create({
        data: {
          clerkId: user.id,
          productId,
        },
      });
    }
    revalidatePath(pathname);
    return { message: favoriteId ? "Removed from favorites" : "Added to favorites" };
  } catch (error) {
    return renderErrorMessage(error);
  }
};

export const fetchUserFavorites = async () => {
  const user = await authenticateUser();
  const favorites = await db.favorite.findMany({
    where: {
      clerkId: user.id,
    },
    include: {
      product: true,
    },
  });
  return favorites;
};

export const createReviewAction = async (
  prevState: { message: string } | null,
  formData: FormData,
) => {
  const user = await authenticateUser();
  try {
    const rawData = Object.fromEntries(formData);
    const result = validateProduct(reviewSchema, rawData);
    if (!result.success) {
      return { message: result.error };
    }
    await db.review.create({
      data: {
        ...result.data,
        clerkId: user.id,
      },
    });
    revalidatePath(`/products/${result.data.productId}`);
    updateTag("products");
    return { message: "review submitted successfully" };
  } catch (error) {
    return renderErrorMessage(error);
  }
};

export const fetchProductReviews = async (productId: string) => {
  const reviews = await db.review.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return reviews;
};
export const fetchProductRating = async (productId: string) => {
  const result = await db.review.groupBy({
    by: ["productId"],
    where: {
      productId,
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });
  return {
    rating: result[0]?._avg.rating?.toFixed(1) ?? 0,
    count: result[0]?._count.rating ?? 0,
  };
};

export const fetchProductReviewsByUser = async () => {
  const user = await authenticateUser();
  const reviews = await db.review.findMany({
    where: {
      clerkId: user.id,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      product: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
  return reviews;
};
export const deleteReviewAction = async (
  payload: { reviewId: string },
  prevState: { message: string } | null,
) => {
  const user = await authenticateUser();
  const { reviewId } = payload;
  try {
    await db.review.delete({
      where: {
        id: reviewId,
        clerkId: user.id,
      },
    });
    revalidatePath("/reviews");
    return { message: "Review deleted successfully" };
  } catch (error) {
    return renderErrorMessage(error);
  }
};
export const findExistingReview = async (userId: string, productId: string) => {
  return await db.review.findFirst({
    where: {
      clerkId: userId,
      productId,
    },
  });
};

export const fetchCartItems = async () => {
  const { userId } = await auth();
  const cart = await db.cart.findFirst({
    where: {
      clerkId: userId ?? "",
    },
    select: {
      numItemsInCart: true,
    },
  });
  return cart?.numItemsInCart ?? 0;
};

const fetchProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) throw new Error("Product not found");
  return product;
};

const includeProductClause = {
  cartItems: {
    include: {
      product: true,
    },
  },
};

export const fetchOrCreateCart = async ({
  userId,
  errorOnFailure = false,
}: {
  userId: string;
  errorOnFailure?: boolean;
}) => {
  let cart = await db.cart.findFirst({
    where: {
      clerkId: userId,
    },
    include: includeProductClause,
  });
  if (!cart && errorOnFailure) throw new Error("Cart not found");
  if (!cart) {
    cart = await db.cart.create({
      data: {
        clerkId: userId,
      },
      include: includeProductClause,
    });
  }
  return cart;
};

const updateOrCreateCartItem = async ({
  cartId,
  productId,
  amount,
}: {
  cartId: string;
  productId: string;
  amount: number;
}) => {
  let cartItem = await db.cartItem.findFirst({
    where: {
      cartId,
      productId,
    },
  });
  if (cartItem) {
    cartItem = await db.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        amount: cartItem.amount + amount,
      },
    });
  } else {
    cartItem = await db.cartItem.create({
      data: {
        cartId,
        productId,
        amount,
      },
    });
  }
};

export const updateCart = async (cart: Cart) => {
  const cartItems = await db.cartItem.findMany({
    where: {
      cartId: cart.id,
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  const { numItemsInCart, cartTotal } = cartItems.reduce(
    (totals, cartItem) => {
      totals.numItemsInCart += cartItem.amount;
      totals.cartTotal += cartItem.product.price * cartItem.amount;
      return totals;
    },
    { numItemsInCart: 0, cartTotal: 0 },
  );
  const tax = cart.taxRate * cartTotal;
  const shipping = cartTotal ? cart.shipping : 0;
  const orderTotal = cartTotal + tax + shipping;
  const updatedCart = await db.cart.update({
    where: {
      id: cart.id,
    },
    data: {
      numItemsInCart,
      cartTotal,
      tax,
      shipping,
      orderTotal,
    },
    include: includeProductClause,
  });
  return { cartItems, currentCart: updatedCart };
};

export const addToCartAction = async (
  prevState: { message: string } | null,
  formData: FormData,
) => {
  const user = await authenticateUser();
  try {
    const productId = formData.get("productId") as string;
    const amount = Number(formData.get("amount"));
    await fetchProduct(productId);
    const cart = await fetchOrCreateCart({ userId: user.id });
    await updateOrCreateCartItem({ cartId: cart.id, productId, amount });
    await updateCart(cart);
    revalidatePath("/");
  } catch (error) {
    return renderErrorMessage(error);
  }
  redirect("/cart");
};

export const removeCartItemAction = async (
  prevState: { message: string } | null,
  formData: FormData,
) => {
  const user = await authenticateUser();
  try {
    const cartItemId = formData.get("id") as string;
    const cart = await fetchOrCreateCart({ userId: user.id, errorOnFailure: true });
    await db.cartItem.delete({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });
    await updateCart(cart);
    revalidatePath("/cart");
    return { message: "Item removed from cart" };
  } catch (error) {
    return renderErrorMessage(error);
  }
};
export const updateCartItemAction = async ({
  amount,
  cartItemId,
}: {
  amount: number;
  cartItemId: string;
}) => {
  const user = await authenticateUser();
  try {
    const cart = await fetchOrCreateCart({ userId: user.id, errorOnFailure: true });
    await db.cartItem.update({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
      data: {
        amount,
      },
    });
    await updateCart(cart);
    revalidatePath("/cart");
    return { message: "Item updated successfully" };
  } catch (error) {
    return renderErrorMessage(error);
  }
};

export const createOrderAction = async (
  prevState: { message: string } | null,
  formData: FormData,
) => {
  const user = await authenticateUser();
  let orderId: null | string = null;
  let cartId: null | string = null;
  try {
    const cart = await fetchOrCreateCart({ userId: user.id, errorOnFailure: true });
    cartId = cart.id;

    await db.order.deleteMany({
      where: {
        clerkId: user.id,
        isPaid: false,
      },
    });

    const order = await db.order.create({
      data: {
        clerkId: user.id,
        products: cart.numItemsInCart,
        orderTotal: cart.orderTotal,
        tax: cart.tax,
        shipping: cart.shipping,
        email: user.emailAddresses[0].emailAddress,
      },
    });
    orderId = order.id;
  } catch (error) {
    return renderErrorMessage(error);
  }
  redirect(`/checkout?orderId=${orderId}&cartId=${cartId}`);
};

export const fetchUserOrders = async () => {
  const user = await authenticateUser();
  const orders = await db.order.findMany({
    where: {
      clerkId: user.id,
      isPaid: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
};

export const fetchAdminOrders = async () => {
  await authenticateUser();
  const orders = await db.order.findMany({
    where: {
      isPaid: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
};
