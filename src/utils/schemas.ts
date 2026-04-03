import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(100, {
      message: "name must be less than 100 characters.",
    }),
  company: z.string(),
  featured: z.coerce.boolean(),
  price: z.coerce.number().int().min(0, {
    message: "price must be a positive number.",
  }),
  description: z.string().refine(
    (description) => {
      const wordCount = description.split(" ").length;
      return wordCount >= 10 && wordCount <= 1000;
    },
    {
      message: "description must be between 10 and 1000 words.",
    },
  ),
});

export const imageSchema = z.object({
  image: validateImage(),
});

export function validateImage() {
  const maxSize = 1024 * 1024;
  return z
    .instanceof(File, {
      message: "image is required",
    })
    .refine((file) => file.size > 0, {
      message: "image is required",
    })
    .refine((file) => file.size <= maxSize, {
      message: "image must be less than 1MB",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "image must be a valid image type",
    });
}

export function validateProduct<T>(
  schema: z.ZodType<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: string } {
  const validatedData = schema.safeParse(data);
  if (!validatedData.success) {
    const errors = validatedData.error.issues.map((issue) => issue.message);
    return {
      success: false,
      error: errors.join(", "),
    };
  }
  return {
    success: true,
    data: validatedData.data,
  };
}

export const reviewSchema = z.object({
  productId: z.string().refine((value) => value !== "", {
    message: "Product ID cannot be empty",
  }),
  authorName: z.string().refine((value) => value !== "", {
    message: "Author name cannot be empty",
  }),
  authorImageUrl: z.string().refine((value) => value !== "", {
    message: "Author image URL cannot be empty",
  }),
  rating: z.coerce
    .number()
    .int()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating must be at most 5" }),
  comment: z
    .string()
    .min(10, { message: "Comment must be at least 10 characters long" })
    .max(1000, { message: "Comment must be at most 1000 characters long" }),
});
