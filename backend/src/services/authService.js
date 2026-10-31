const bcrypt = require("bcryptjs");
const prisma = require("./prisma");

const sanitizeUser = (user) => {
  if (!user) return null;

  const { password, ...safeUser } = user;
  return safeUser;
};

const registerCustomer = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  return sanitizeUser(user);
};

const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return sanitizeUser(user);
};

const createStaff = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "STAFF",
    },
  });

  return sanitizeUser(user);
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  return sanitizeUser(user);
};

module.exports = {
  registerCustomer,
  loginUser,
  createStaff,
  getUserById,
};