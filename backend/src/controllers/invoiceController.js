const prisma = require("../db");

// Create invoice
exports.createInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      amount,
      userId,
      subscriptionId,
      dueDate,
      status
    } = req.body;

    if (!invoiceNumber || amount === undefined || !userId) {
      return res.status(400).json({
        success: false,
        message: "Invoice number, amount and user ID are required"
      });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invoice amount must be greater than zero"
      });
    }

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        amount: numericAmount,
        userId,
        subscriptionId: subscriptionId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status || "DRAFT"
      }
    });

    res.status(201).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all invoices
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        subscription: { include: { plan: true } },
        payments: true
      },
      orderBy: { createdAt: "desc" }
    });

    const result = invoices.map((invoice) => {
      const paidAmount = invoice.payments.reduce(
        (total, payment) => total + Number(payment.amount),
        0
      );

      return {
        ...invoice,
        paidAmount,
        balance: Math.max(0, Number(invoice.amount) - paidAmount),
        isOverdue:
          invoice.dueDate &&
          invoice.dueDate < new Date() &&
          invoice.status !== "PAID" &&
          invoice.status !== "CANCELLED"
      };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        subscription: { include: { plan: true } },
        payments: true
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    const paidAmount = invoice.payments.reduce(
      (total, payment) => total + Number(payment.amount),
      0
    );

    res.json({
      success: true,
      data: {
        ...invoice,
        paidAmount,
        balance: Math.max(0, Number(invoice.amount) - paidAmount),
        isOverdue:
          invoice.dueDate &&
          invoice.dueDate < new Date() &&
          invoice.status !== "PAID" &&
          invoice.status !== "CANCELLED"
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update invoice status
exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["DRAFT", "CONFIRMED", "PAID", "CANCELLED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice status"
      });
    }

    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};