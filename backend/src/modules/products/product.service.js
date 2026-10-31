
const prisma = require("../../lib/prisma");

// Create a product
const createProduct = async (data) => {
  return await prisma.product.create({
    data,
  });
};

// Get all products
const getAllProducts = async () => {
  return await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Get one product by ID
const getProductById = async (id) => {
  return await prisma.product.findUnique({
    where: {
      id,
    },
  });
};

// Update a product
const updateProduct = async (id, data) => {
  return await prisma.product.update({
    where: {
      id,
    },
    data,
  });
};

// Delete a product
const deleteProduct = async (id) => {
  return await prisma.product.delete({
    where: {
      id,
    },
  });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
