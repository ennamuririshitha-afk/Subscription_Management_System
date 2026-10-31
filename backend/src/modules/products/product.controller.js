
const productService = require("./product.service");
const {
  createProductSchema,
  updateProductSchema,
} = require("./product.validation");

// Create product
const createProduct = async (req, res) => {
  try {
    const validation = createProductSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        status: "error",
        message: "Invalid product data",
        errors: validation.error.issues,
      });
    }

    const product = await productService.createProduct(validation.data);

    return res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to create product",
    });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();

    return res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to fetch products",
    });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to fetch product",
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const validation = updateProductSchema.safeParse(req.body);

    if (!validation.success || Object.keys(validation.data || {}).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or empty product data",
        errors: validation.success ? [] : validation.error.issues,
      });
    }

    const product = await productService.updateProduct(
      req.params.id,
      validation.data
    );

    return res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to update product",
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);

    return res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to delete product",
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
