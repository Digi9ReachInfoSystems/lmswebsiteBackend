// routes/invoice.routes.js

const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

// POST /api/invoices -> Create new invoice
router.post("/create", invoiceController.createInvoice);

// GET /api/invoices/:id -> Get invoice by ID
router.get("/getInvoiceBYId/:id", invoiceController.getInvoice);

// GET /api/invoices/:id/pdf -> Download invoice PDF
router.post("/downloadInvoicePDF/pdf", invoiceController.getInvoicePDF);

module.exports = router;
