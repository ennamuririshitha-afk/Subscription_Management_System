const { z } = require("zod");

const createProductSchema = z.object({
  name: z.string().trim().min(2, "Product name must contain at least 2 characters"),
  type: z.string().trim().optional().nullable(),
  salesPrice: z.coerce.number().positive("Sales price must be greater than zero"),
  costPrice: z.coerce.number().min(0, "Cost price cannot be negative"),
  description: z.string().trim().optional().nullable(),
});

const updateProductSchema = createProductSchema.partial();

module.exports = {
  createProductSchema,
  updateProductSchema,
};