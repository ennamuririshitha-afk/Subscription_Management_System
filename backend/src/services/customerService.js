
const bcrypt = require("bcryptjs");
const prisma = require("./prisma");

const sanitizeCustomer = (customer) => {
  if (!customer) return null;

  const { password, ...safeCustomer } = customer;
  return safeCustomer;
};

const listCustomers = async (search = "") => {
  const customers = await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return customers;
};

const getCustomerById = async (id) => {
  const customer = await prisma.user.findFirst({
    where: { id, role: "CUSTOMER" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return customer;
};

const createCustomer = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const customer = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  return sanitizeCustomer(customer);
};

const updateCustomer = async (id, data) => {
  const existing = await prisma.user.findFirst({
    where: { id, role: "CUSTOMER" },
  });

  if (!existing) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  const updateData = {};

  if (data.name !== undefined) {
    updateData.name = data.name.trim();
  }

  if (data.email !== undefined) {
    updateData.email = data.email.trim().toLowerCase();
  }

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 12);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  return sanitizeCustomer(updated);
};

const deleteCustomer = async (id) => {
  const existing = await prisma.user.findFirst({
    where: { id, role: "CUSTOMER" },
  });

  if (!existing) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  await prisma.user.delete({ where: { id } });

  return { message: "Customer deleted successfully" };
};

module.exports = {
  listCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
