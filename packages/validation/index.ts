import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().min(2),
  description: z.string(),
  shortDescription: z.string(),
  price: z.number().positive(),
  oldPrice: z.number().positive().optional(),
  stock: z.number().int().min(0),
  categoryId: z.string().uuid(),
  brandId: z.string().uuid().optional(),
});
