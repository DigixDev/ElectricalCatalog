import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportPdfOptions {
  fileName?: string;
  onProgress?: (status: string) => void;
}

export async function generateProformaPdf(
  element: HTMLElement,
  options: ExportPdfOptions = {}
): Promise<void> {
  const { fileName = 'Proforma-Invoice.pdf', onProgress } = options;

  onProgress?.('در حال محاسبه ابعاد و آماده‌سازی گرافیکی سند...');

  // Temporary clone or styling ensure high contrast print layout
  const originalDisplay = element.style.display;
  if (originalDisplay === 'none') {
    element.style.display = 'block';
  }

  try {
    onProgress?.('در حال رندر تایپوگرافی و المان‌های رسمی با کیفیت بالا...');

    const canvas = await html2canvas(element, {
      scale: 2, // High resolution (300 DPI equivalent)
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 1024,
    });

    onProgress?.('در حال تولید فایل PDF استاندارد A4...');

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Additional pages if the items list is very long
    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    onProgress?.('در حال دانلود فایل...');
    pdf.save(fileName);
  } finally {
    if (originalDisplay === 'none') {
      element.style.display = 'none';
    }
  }
}
