const prisma = require("../db");

// Create quotation
exports.createQuotation = async (req, res) => {
  try {
    const { quotationNumber, amount, userId, planId, validUntil, notes } = req.body;

    if (!quotationNumber || amount === undefined || !userId) {
      return res.status(400).json({
        success: false,
        message: "Quotation number, amount and user ID are required"
      });
    }

    const quotation = await prisma.quotation.create({
      data: {
        quotationNumber,
        amount: Number(amount),
        userId,
        planId: planId || null,
        validUntil: validUntil ? new Date(validUntil) : null,
        notes: notes || null
      }
    });

    res.status(201).json({ success: true, data: quotation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all quotations
exports.getQuotations = async (req, res) => {
  try {
    const quotations = await prisma.quotation.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        plan: true
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({ success: true, data: quotations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get quotation by ID
exports.getQuotationById = async (req, res) => {
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: req.params.id },
      include: { user: true, plan: true }
    });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found"
      });
    }

    res.json({ success: true, data: quotation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update quotation status
exports.updateQuotationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quotation status"
      });
    }

    const quotation = await prisma.quotation.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json({ success: true, data: quotation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};