const prisma = require("../db");

const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(
      now.getFullYear(), now.getMonth(), 1
    );
    const nextMonth = new Date(
      now.getFullYear(), now.getMonth() + 1, 1
    );

    const [
      activeSubscriptions,
      pendingInvoices,
      overduePayments,
      revenue
    ] = await Promise.all([
      prisma.subscription.count({
        where: { status: "ACTIVE" }
      }),
      prisma.invoice.count({
        where: { status: { in: ["DRAFT", "CONFIRMED"] } }
      }),
      prisma.invoice.count({
        where: {
          status: { in: ["DRAFT", "CONFIRMED"] },
          dueDate: { lt: now }
        }
      }),
      prisma.invoice.aggregate({
        where: {
          status: "PAID",
          createdAt: { gte: monthStart, lt: nextMonth }
        },
        _sum: { amount: true }
      })
    ]);

    res.json({
      success: true,
      data: {
        activeSubscriptions,
        monthlyRevenue: Number(revenue._sum.amount || 0),
        pendingInvoices,
        overduePayments
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch dashboard statistics"
    });
  }
};

module.exports = { getDashboardStats };