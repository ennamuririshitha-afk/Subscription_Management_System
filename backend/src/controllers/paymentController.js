const prisma = require("../db");

// Record a payment
exports.createPayment = async (req, res) => {
  try {
    const { invoiceId, amount, method, reference, paymentDate } = req.body;

    if (!invoiceId || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Invoice ID and payment amount are required"
      });
    }

    const paymentAmount = Number(amount);

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Payment amount must be greater than zero"
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: { id: invoiceId },
        include: { payments: true }
      });

      if (!invoice) {
        throw new Error("Invoice not found");
      }

      if (invoice.status === "CANCELLED") {
        throw new Error("Cannot pay a cancelled invoice");
      }

      const paidAmount = invoice.payments.reduce(
        (total, payment) => total + Number(payment.amount),
        0
      );

      const balance = Number(invoice.amount) - paidAmount;

      if (paymentAmount > balance) {
        throw new Error(`Payment exceeds outstanding balance of ${balance}`);
      }

      const payment = await tx.payment.create({
        data: {
          invoiceId,
          amount: paymentAmount,
          method: method || "OTHER",
          reference: reference || null,
          paymentDate: paymentDate ? new Date(paymentDate) : new Date()
        }
      });

      const newPaidAmount = paidAmount + paymentAmount;

      if (newPaidAmount >= Number(invoice.amount)) {
        await tx.invoice.update({
          where: { id: invoiceId },
          data: { status: "PAID" }
        });
      }

      return {
        payment,
        paidAmount: newPaidAmount,
        balance: Math.max(0, Number(invoice.amount) - newPaidAmount)
      };
    });

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        invoice: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      },
      orderBy: { paymentDate: "desc" }
    });

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get payments for one invoice
exports.getPaymentsByInvoice = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { invoiceId: req.params.invoiceId },
      orderBy: { paymentDate: "desc" }
    });

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createPayment: exports.createPayment,
  getPayments: exports.getPayments,
  getPaymentsByInvoice: exports.getPaymentsByInvoice
};