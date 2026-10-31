const prisma = require("../db");

// Get billing reports
exports.getBillingReports = async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    // Subscription statistics
    const totalSubscriptions = await prisma.subscription.count();

    const activeSubscriptions = await prisma.subscription.count({
      where: { status: "ACTIVE" }
    });

    const pausedSubscriptions = await prisma.subscription.count({
      where: { status: "PAUSED" }
    });

    // Invoice statistics
    const invoices = await prisma.invoice.findMany({
      where: {
        status: { not: "CANCELLED" }
      },
      include: {
        payments: true
      }
    });

    let totalInvoiced = 0;
    let totalPaid = 0;
    let outstandingAmount = 0;
    let overdueAmount = 0;
    let monthlyRevenue = 0;

    for (const invoice of invoices) {
      const invoiceAmount = Number(invoice.amount);

      const paidAmount = invoice.payments.reduce(
        (total, payment) => total + Number(payment.amount),
        0
      );

      const balance = Math.max(0, invoiceAmount - paidAmount);

      totalInvoiced += invoiceAmount;
      totalPaid += paidAmount;
      outstandingAmount += balance;

      if (
        invoice.dueDate &&
        invoice.dueDate < now &&
        balance > 0
      ) {
        overdueAmount += balance;
      }

      const hasPaymentThisMonth = invoice.payments.some(
        payment => new Date(payment.paymentDate) >= monthStart &&
          new Date(payment.paymentDate) <= now
      );

      if (hasPaymentThisMonth) {
        monthlyRevenue += invoice.payments
          .filter(payment => {
            const date = new Date(payment.paymentDate);
            return date >= monthStart && date <= now;
          })
          .reduce(
            (total, payment) => total + Number(payment.amount),
            0
          );
      }
    }

    // Quotation statistics
    const totalQuotations = await prisma.quotation.count();

    const acceptedQuotations = await prisma.quotation.count({
      where: { status: "ACCEPTED" }
    });

    res.json({
      success: true,
      data: {
        subscriptions: {
          total: totalSubscriptions,
          active: activeSubscriptions,
          paused: pausedSubscriptions
        },
        quotations: {
          total: totalQuotations,
          accepted: acceptedQuotations
        },
        billing: {
          totalInvoiced,
          totalPaid,
          outstandingAmount,
          overdueAmount,
          monthlyRevenue
        }
      }
    });

  } catch (error) {
    console.error("Billing Report Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};