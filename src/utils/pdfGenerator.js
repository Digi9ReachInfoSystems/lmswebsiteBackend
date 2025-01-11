const PDFDocument = require("pdfkit");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if day is single digit
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth is zero-indexed, so add 1
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
};

/**
 * Generates an Invoice PDF with the specified formatting.
 * @param {Object} invoice - The invoice data.
 * @returns {Promise<Buffer>} - A promise that resolves to the PDF buffer.
 */
function generateInvoicePDF(invoice) {
  console.log("invoice",invoice);
  const discountPer= (invoice.discount/invoice.subtotal)*100;
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      // Collect PDF data
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      // -------------------- LOGO --------------------
      const logoUrl =
        "https://firebasestorage.googleapis.com/v0/b/demoproject-6d5cd.appspot.com/o/image%20(4).png?alt=media&token=29dfa005-15a7-4d7c-a0d9-410a149ebeee";
      const response = await axios.get(logoUrl, { responseType: "arraybuffer" });
      const logoBuffer = Buffer.from(response.data, "binary");
      doc.image(logoBuffer, 20, 20, { width: 100 });

      // -------------------- FONTS --------------------
      const fontsDir = path.join(__dirname, "fonts");
      const regularFontPath = path.join(fontsDir, "DejaVuSans.ttf");
      const boldFontPath = path.join(fontsDir, "DejaVuSans-Bold.ttf");
      doc.registerFont("DejaVuSans", regularFontPath);
      doc.registerFont("DejaVuSans-Bold", boldFontPath);

      // -------------------- INVOICE HEADER --------------------
      doc.font("DejaVuSans").fontSize(20).text("Invoice", 400, 45, { align: "right" });
      doc.fontSize(10).fillColor("gray").text(`Invoice No    : ${invoice.invoiceNumber}`, 370, 80, { align: "left" })
        .text(`Invoice Date : ${formatDate(invoice.invoiceDate)}`, 370, 95, { align: "left" });

      // -------------------- FROM & BILL TO --------------------
      const fromX = 50, billToX = 400, currentY = 150;

      // "From" section
      doc.fontSize(10).font("DejaVuSans-Bold").fillColor("black").text("From", fromX, currentY);
      doc.font("DejaVuSans").fillColor("gray")
        .text("Roy Career Solution (Parent company)", fromX, doc.y + 5)
        .moveDown(0.1)
        .text("GSTIN - 29AAOCR0214J1Z8")
        .moveDown(0.1)
        .text("info@thetopperacademy.com")
        .moveDown(0.1)
        .text("+91 7667840906")
        .moveDown(0.5)
        .text("ClayWorks MiniForest, 3rd Floor,")
        .moveDown(0.1)
        .text("Mass Complex, 15th Cross Rd,")
        .moveDown(0.1)
        .text("Sarakki Industrial Layout, RBI Layout,")
        .moveDown(0.1)
        .text("3rd Phase, J. P. Nagar,")
        .moveDown(0.1)
        .text("Bengaluru, Karnataka  - 560078");

      // "Bill To" section
      doc.fontSize(10).font("DejaVuSans-Bold").fillColor("black").text("Bill To", billToX, 150);
      doc.font("DejaVuSans").fillColor("gray")
        .text(`${invoice.billTo.name}`, billToX, doc.y + 5)
        .moveDown(0.1)
        .text(`${invoice.billTo.email}`)
        .moveDown(0.1)
        .text(`${invoice.billTo.phone}`);

      // -------------------- TABLE HEADER --------------------
     // -------------------- TABLE HEADER --------------------
const tableTop = doc.y + 100;
const tableWidth = 520; // Total table width
const rowHeight = 20;

// Define column widths as percentages
const columnWidths = {
  description: 0.4, // 40%
  price: 0.15,      // 15%
  cgst: 0.15,       // 15%
  sgst: 0.15,       // 15%
  total: 0.15,      // 15%
};

// Calculate absolute widths
const columns = {
  description: 50,
  price: 50 + tableWidth * columnWidths.description,
  cgst: 50 + tableWidth * (columnWidths.description + columnWidths.price),
  sgst: 50 + tableWidth * (columnWidths.description + columnWidths.price + columnWidths.cgst),
  total: 50 + tableWidth * (columnWidths.description + columnWidths.price + columnWidths.cgst + columnWidths.sgst),
};

// Draw header background
doc.rect(50, tableTop, tableWidth, rowHeight).fill("#8ce9fa").stroke(false);
doc.fillColor("black").font("DejaVuSans-Bold").fontSize(11);

// Draw headers
doc.text("DESCRIPTION", columns.description + 5, tableTop + 5, { width: tableWidth * columnWidths.description - 10 });
doc.text("PRICE", columns.price + 5, tableTop + 5, { width: tableWidth * columnWidths.price - 10, align: "right" });
doc.text("CGST", columns.cgst + 5, tableTop + 5, { width: tableWidth * columnWidths.cgst - 10, align: "right" });
doc.text("SGST", columns.sgst + 5, tableTop + 5, { width: tableWidth * columnWidths.sgst - 10, align: "right" });
doc.text("TOTAL", columns.total + 5, tableTop + 5, { width: tableWidth * columnWidths.total - 10, align: "right" });

// -------------------- TABLE ROWS --------------------
doc.font("DejaVuSans").fontSize(10).fillColor("black");
let yPosition = tableTop + rowHeight;
let subtotal = 0;

invoice.items.forEach((item, index) => {
  const rowColor = index % 2 === 0 ? "#ffffff" : "#f7f7f7"; // Alternating row colors
  doc.rect(50, yPosition, tableWidth, rowHeight).fill(rowColor).stroke(false);

  const itemTotalExclTax = item.price * item.quantity;
  const itempriceAfterDiscount = itemTotalExclTax - ((itemTotalExclTax / 100)* discountPer);
  const cgst = parseFloat((itempriceAfterDiscount * 0.09).toFixed(2));
  const sgst = parseFloat((itempriceAfterDiscount * 0.09).toFixed(2));
  const itemTotal = parseFloat((itemTotalExclTax + cgst + sgst).toFixed(2));
  subtotal += itemTotalExclTax;

  doc.fillColor("black")
    .text(item.description, columns.description + 5, yPosition + 5, { width: tableWidth * columnWidths.description - 10 })
    .text(`₹ ${item.price.toFixed(2)}`, columns.price + 5, yPosition + 5, { width: tableWidth * columnWidths.price - 10, align: "right" })
    .text(`₹ ${cgst.toFixed(2)}`, columns.cgst + 5, yPosition + 5, { width: tableWidth * columnWidths.cgst - 10, align: "right" })
    .text(`₹ ${sgst.toFixed(2)}`, columns.sgst + 5, yPosition + 5, { width: tableWidth * columnWidths.sgst - 10, align: "right" })
    .text(`₹ ${itemTotal.toFixed(2)}`, columns.total + 5, yPosition + 5, { width: tableWidth * columnWidths.total - 10, align: "right" });

  yPosition += rowHeight;
});


      // -------------------- TOTALS --------------------
      const totalDiscount = parseFloat((invoice.discount || 0).toFixed(2));
      const totalCGST = parseFloat(((subtotal-totalDiscount) * 0.09).toFixed(2));
      const totalSGST = parseFloat(((subtotal-totalDiscount) * 0.09).toFixed(2));
      // const grandTotal =Math.ceil( parseFloat((subtotal - totalDiscount + totalCGST + totalSGST).toFixed(2)));
      const grandTotal =parseFloat((subtotal - totalDiscount + totalCGST + totalSGST).toFixed(2));
      yPosition += 20;

      const totalsXLabel = 300, totalsXValue = 400, lineSpacing = 20;

      // Subtotal
      doc.fillColor("black").font("DejaVuSans").fontSize(9)
        .text("Subtotal", totalsXLabel, yPosition, { align: "left" })
        .text(`₹ ${subtotal.toFixed(2)}`, totalsXValue, yPosition, { align: "right" });

      // Discount
      doc.fillColor("gray").font("DejaVuSans").fontSize(9)
        .text("Discount", totalsXLabel, yPosition + lineSpacing, { align: "left" })
        .text(`₹ ${totalDiscount.toFixed(2)}`, totalsXValue, yPosition + lineSpacing, { align: "right" });

      // CGST
      doc.fillColor("gray").font("DejaVuSans").fontSize(9)
        .text("CGST (9%)", totalsXLabel, yPosition + lineSpacing * 2, { align: "left" })
        .text(`₹ ${totalCGST.toFixed(2)}`, totalsXValue, yPosition + lineSpacing * 2, { align: "right" });

      // SGST
      doc.fillColor("gray").font("DejaVuSans").fontSize(9)
        .text("SGST (9%)", totalsXLabel, yPosition + lineSpacing * 3, { align: "left" })
        .text(`₹ ${totalSGST.toFixed(2)}`, totalsXValue, yPosition + lineSpacing * 3, { align: "right" });

      // Total
      doc.fillColor("black").font("DejaVuSans-Bold").fontSize(11)
        .text("Total", totalsXLabel, yPosition + lineSpacing * 4, { align: "left" })
        .text(`₹ ${grandTotal.toFixed(2)}`, totalsXValue, yPosition + lineSpacing * 4, { align: "right" });

      yPosition += lineSpacing * 12;
      doc.font("DejaVuSans-Bold").fontSize(10).fillColor("black")
        .text("Terms and Conditions", 50, yPosition);

      const termsText = [
        "• The Topper Academy operates under a strict no-refund policy for all courses, subscriptions, and educational services provided on our platform. Once a student enrols and payment has been made, fees are generally non-refundable.",
        "• Refunds are not available for cancellations initiated due to personal reasons, including but not limited to changes in schedule, personal preferences, or alternate study plans."
      ];

      termsText.forEach((term) => {
        doc.font("DejaVuSans").fontSize(9).fillColor("gray")
          .text(term, 50, doc.y + 5, { width: 500, align: "justify" });
      });

      // Finalize PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateInvoicePDF };
