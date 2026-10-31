
const customerService = require("../services/customerService");

const handleError = (res, error) => {
  console.error("Customer API error:", error.message);

  if (error.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "Email is already registered",
    });
  }

  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal server error"
        : error.message,
  });
};

const listCustomers = async (req, res) => {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const customers = await customerService.listCustomers(search);

    return res.status(200).json({
      success: true,
      count: customers.length,
      data: { customers },
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const getCustomer = async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(
      req.params.id
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { customer },
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const createCustomer = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof password !== "string" ||
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide a valid name, email and password (8–72 bytes)",
      });
    }

    const customer = await customerService.createCustomer({
      name,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: { customer },
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (
      (name !== undefined &&
        (typeof name !== "string" || !name.trim())) ||
      (email !== undefined &&
        (typeof email !== "string" ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) ||
      (password !== undefined &&
        (typeof password !== "string" ||
          password.length < 8 ||
          Buffer.byteLength(password, "utf8") > 72))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer update details",
      });
    }

    if (
      name === undefined &&
      email === undefined &&
      password === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update",
      });
    }

    const customer = await customerService.updateCustomer(
      req.params.id,
      { name, email, password }
    );

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: { customer },
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const result = await customerService.deleteCustomer(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
