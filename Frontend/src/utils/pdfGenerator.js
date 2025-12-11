import jsPDF from 'jspdf';
import moment from 'moment';

// Company details
const COMPANY_INFO = {
  name: 'Gulmohar Resort',
  gst: '20AMUPB2430M1Z8',
  address: 'HARINDUNGRI GHATSILA , 832303',
  phone: 'Your Phone Number',
  email: 'info@gulmoharresort.com'
};

// Room categories mapping
const ROOM_CATEGORIES = {
  'C1': 'Category C - Room 1',
  'C2': 'Category C - Room 2', 
  'C3': 'Category C - Room 3',
  'C4': 'Category C - Room 4',
  'D1': 'Category D - Room 1',
  'D2': 'Category D - Room 2',
  'G1': 'Category G - Room 1',
  'G2': 'Category G - Room 2'
};

// Add logo to PDF using the PNG image
const addLogo = async (doc, x, y, width = 50, height = 25) => {
  return new Promise((resolve) => {
    try {
      // Create an image element to load the logo
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = function() {
        try {
          // Create a canvas to convert image to base64
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw image on canvas
          ctx.drawImage(img, 0, 0);
          
          // Convert to base64
          const imgData = canvas.toDataURL('image/png');
          
          // Add image to PDF
          doc.addImage(imgData, 'PNG', x, y, width, height);
          resolve(y + height + 5);
          
        } catch (error) {
          console.error('Error adding image to PDF:', error);
          // Fallback to text
          addTextLogo(doc, x, y);
          resolve(y + height + 5);
        }
      };
      
      img.onerror = function() {
        console.error('Error loading logo image');
        // Fallback to text
        addTextLogo(doc, x, y);
        resolve(y + height + 5);
      };
      
      // Load the logo image
      img.src = '/gulmohar-logo.png';
      
    } catch (error) {
      console.error('Error in addLogo:', error);
      // Fallback to text
      addTextLogo(doc, x, y);
      resolve(y + height + 5);
    }
  });
};

// Fallback text logo function
const addTextLogo = (doc, x, y) => {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 128, 47); // Gulmohar green
  doc.text('GULMOHAR RESORT', x, y + 8);
};

// Generate bill PDF
export const generateBillPDF = async (billData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set white background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

  let yPosition = 20;

  // Add logo (await since it's now async)
  yPosition = await addLogo(doc, 20, yPosition);

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('TAX INVOICE', 105, yPosition + 10, { align: 'center' });
  
  yPosition += 25;

  // Company details (left side)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('From:', 20, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.text(COMPANY_INFO.name, 20, yPosition + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(COMPANY_INFO.address, 20, yPosition + 10);
  doc.text(`GST: ${COMPANY_INFO.gst}`, 20, yPosition + 15);
  
  // Bill details (right side)
  doc.text('To:', 120, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.text(billData.customerName, 120, yPosition + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Mobile: ${billData.mobileNo}`, 120, yPosition + 10);
  doc.text(`Room: ${ROOM_CATEGORIES[billData.roomNumber] || billData.roomNumber}`, 120, yPosition + 15);
  
  yPosition += 30;

  // Invoice details
  doc.setFont('helvetica', 'bold');
  doc.text(`Bill No: ${billData.billNumber}`, 20, yPosition);
  doc.text(`Date: ${moment(billData.createdAt).format('DD/MM/YYYY')}`, 120, yPosition);
  
  yPosition += 10;
  
  if (billData.checkInDate && billData.checkOutDate) {
    doc.setFont('helvetica', 'normal');
    doc.text(`Check-in: ${moment(billData.checkInDate).format('DD/MM/YYYY')}`, 20, yPosition);
    doc.text(`Check-out: ${moment(billData.checkOutDate).format('DD/MM/YYYY')}`, 120, yPosition);
    yPosition += 10;
  }

  yPosition += 10;

  // Table header
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPosition, 170, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Description', 22, yPosition + 5);
  doc.text('Amount (Rs)', 160, yPosition + 5, { align: 'right' });
  
  yPosition += 15;

  // Table content
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  // Room charges
  const roomCharges = parseFloat(billData.roomCharges) || 0;
  if (roomCharges > 0) {
    doc.text('Room Charges', 22, yPosition);
    doc.text(roomCharges.toFixed(2), 180, yPosition, { align: 'right' });
    yPosition += 8;
  }
  
  if (billData.foodCharges > 0) {
    doc.text('Food Charges', 22, yPosition);
    doc.text(billData.foodCharges.toFixed(2), 180, yPosition, { align: 'right' });
    yPosition += 8;
  }
  
  if (billData.otherCharges > 0) {
    doc.text('Other Charges', 22, yPosition);
    doc.text(billData.otherCharges.toFixed(2), 180, yPosition, { align: 'right' });
    yPosition += 8;
  }

  // Subtotal
  yPosition += 5;
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Subtotal', 22, yPosition);
  doc.text(billData.subtotal.toFixed(2), 180, yPosition, { align: 'right' });
  
  yPosition += 10;
  
  // Tax breakdown
  doc.setFont('helvetica', 'normal');
  doc.text('SGST (2.5%)', 22, yPosition);
  doc.text(billData.sgst.toFixed(2), 180, yPosition, { align: 'right' });
  
  yPosition += 8;
  doc.text('CGST (2.5%)', 22, yPosition);
  doc.text(billData.cgst.toFixed(2), 180, yPosition, { align: 'right' });
  
  yPosition += 10;
  
  // Total
  doc.setFillColor(50, 128, 47);
  doc.rect(20, yPosition - 3, 170, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL AMOUNT', 22, yPosition + 3);
  doc.text(`Rs ${billData.grandTotal.toFixed(2)}`, 180, yPosition + 3, { align: 'right' });

  // Payment Details Section
  yPosition += 20;
  
  // Advance Amount
  doc.setFillColor(220, 237, 220);
  doc.rect(20, yPosition - 3, 170, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(27, 94, 32);
  doc.text('ADVANCE AMOUNT', 22, yPosition + 3);
  doc.text(`Rs ${(billData.advanceAmount || 0).toFixed(2)}`, 180, yPosition + 3, { align: 'right' });

  yPosition += 12;

  // Due Amount
  doc.setFillColor(255, 235, 238);
  doc.rect(20, yPosition - 3, 170, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(198, 40, 40);
  doc.text('DUE AMOUNT', 22, yPosition + 3);
  doc.text(`Rs ${(billData.dueAmount || 0).toFixed(2)}`, 180, yPosition + 3, { align: 'right' });

  // Footer
  yPosition += 30;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for choosing Gulmohar Resort!', 105, yPosition, { align: 'center' });
  doc.text('This is a computer-generated invoice.', 105, yPosition + 5, { align: 'center' });

  // Save the PDF
  doc.save(`Gulmohar_Bill_${billData.billNumber}.pdf`);
};

// Generate monthly summary PDF
export const generateMonthlySummaryPDF = async (summaryData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set white background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

  // Add logo and header
  let yPosition = 20;
  yPosition = await addLogo(doc, 20, yPosition);
  
  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('MONTHLY SUMMARY REPORT', 105, yPosition + 10, { align: 'center' });
  
  yPosition += 25;

  // Month and Year
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  doc.setFontSize(14);
  doc.text(`${monthNames[summaryData.month - 1]} ${summaryData.year}`, 105, yPosition, { align: 'center' });
  
  yPosition += 20;

  // Summary statistics
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary Statistics:', 20, yPosition);
  
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const stats = [
    `Total Bills: ${summaryData.totalBills}`,
    `Total Revenue: Rs ${summaryData.totalRevenue.toFixed(2)}`,
    `Room Charges: Rs ${(summaryData.totalRoomCharges || 0).toFixed(2)}`,
    `Food Charges: Rs ${summaryData.totalFoodCharges.toFixed(2)}`,
    `Other Charges: Rs ${summaryData.totalOtherCharges.toFixed(2)}`,
    `Total SGST: Rs ${summaryData.totalSGST.toFixed(2)}`,
    `Total CGST: Rs ${summaryData.totalCGST.toFixed(2)}`
  ];

  stats.forEach(stat => {
    doc.text(stat, 20, yPosition);
    yPosition += 6;
  });

  yPosition += 10;

  // Bills table header
  if (summaryData.bills && summaryData.bills.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Detailed Bills:', 20, yPosition);
    
    yPosition += 10;
    
    // Table header
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPosition, 170, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('Bill No', 22, yPosition + 5);
    doc.text('Date', 50, yPosition + 5);
    doc.text('Customer', 75, yPosition + 5);
    doc.text('Room', 115, yPosition + 5);
    doc.text('Amount', 180, yPosition + 5, { align: 'right' });
    
    yPosition += 12;
    
    // Table content
    doc.setFont('helvetica', 'normal');
    summaryData.bills.forEach(bill => {
      if (yPosition > 250) { // Start new page if needed
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(bill.billNumber, 22, yPosition);
      doc.text(moment(bill.createdAt).format('DD/MM/YY'), 50, yPosition);
      doc.text(bill.customerName.substring(0, 20), 75, yPosition);
      doc.text(bill.roomNumber, 115, yPosition);
      doc.text(`Rs ${bill.grandTotal.toFixed(2)}`, 180, yPosition, { align: 'right' });
      
      yPosition += 6;
    });
  }

  // Footer
  yPosition += 20;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(`Generated on: ${moment().format('DD/MM/YYYY HH:mm')}`, 105, yPosition, { align: 'center' });

  // Save the PDF
  doc.save(`Gulmohar_Monthly_Summary_${summaryData.month}_${summaryData.year}.pdf`);
};
