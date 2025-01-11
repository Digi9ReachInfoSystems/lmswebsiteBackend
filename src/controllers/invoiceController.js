// controllers/invoice.controller.js

const { generateInvoicePDF } = require("../utils/pdfGenerator");
const Pricing = require("../models/pricingModel");
const Invoice = require("../models/invoiceModel");
const mongoose = require("mongoose");

// In-memory storage for invoices (not persisted!)
// let invoices = [];

/**
 * Create and store a new invoice in the in-memory array
 */exports.createInvoice = async (req, res) => {
  try {
    const gst= await  Pricing.findOne();
    console.log(gst);
    const {
      invoiceNumber,
      invoiceDate,
      from,       // { name, email, phone, address }
      billTo,     // { name, email, phone }
      items,      // [ { description, product, quantity, price, gst }, ... ]
      discount = 0 // Discount field (default to 0 if not provided)
    } = req.body;

    // Calculate subtotal & gst amounts
    let subtotal = 0;
    let totalGst = 0;
    console.log(items);


    items.forEach((item) => {
      const itemSubtotal = item.price * item.quantity;
      const itemGstAmount = itemSubtotal * (gst.gst || 0) / 100;

      subtotal += itemSubtotal;
      // totalGst += itemGstAmount;
    });

    const discountPer= (discount/subtotal)*100;
    console.log(discountPer);

    items.forEach((item) => {
      const itemSubtotal = item.price * item.quantity;
      const itemGstAmount =( itemSubtotal-(itemSubtotal*(discountPer/100))) * (gst.gst || 0) / 100;
      // console.log(itemGstAmount);

      // subtotal += itemSubtotal;
      totalGst += itemGstAmount;
    });

    // Calculate total after applying discount
    const total = subtotal + totalGst - discount;
  console.log(total);
    if (total < 0) {
      return res.status(400).json({ message: "Total cannot be negative after discount" });
    }

    // Build invoice object
    const newInvoice = new Invoice( {
      // id: invoices.length + 1, // simplistic ID assignment for in-memory usage
      invoiceNumber,
      invoiceDate: invoiceDate || new Date().toISOString().split("T")[0],
      from,
      billTo,
      items,
      discount, // Include discount in the invoice object
      subtotal,
      gst: totalGst,
      total,
      createdAt: new Date()
    });

    // Store in array
   newInvoice.save();
    console.log(newInvoice);
     return newInvoice;
    // Return newly created invoice
  //  res.status(201).json(newInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating invoice" });
  }
};

/**
 * Get a single invoice by its ID
 */
exports.getInvoice = (req, res) => {
  try {
    const id = req.params.id;
    const invoice = Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching invoice" });
  }
};

/**
 * Generate and serve a PDF of the invoice
 */
exports.getInvoicePDF = async (req,res) => {
  try {
    // const id = req.params.id;
    console.log(req);
    const{id,mode} = req.body;
    // const id= new mongoose.Types.ObjectId(req.body.id) ;
    // const mode= req.body.mode;
    const invoice = await Invoice.findById(id);
    console.log("invoiceFound",invoice);

    if (!invoice) {
      // return res.status(404).json({ message: "Invoice not found" });
    }

    // Generate PDF in memory
    const pdfBuffer = await generateInvoicePDF(invoice);

    // Sanitize invoice number so it doesn't contain invalid characters (e.g., ₹)
    const safeInvoiceNumber = (invoice.invoiceNumber || "unknown").replace(/[^\w.-]/g, "");
    if(mode=="api"){
       // Set headers to download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${safeInvoiceNumber}.pdf`
    );
    // console.log(pdfBuffer);
    // return pdfBuffer;
    return res.send(pdfBuffer);
    }else{
      return pdfBuffer;
    }
   
  } catch (error) {
    console.error(error);
    console.log("Error generating PDF",error);
    res.status(200).json({ message: "Error generating PDF" });
  }
};
