
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { User, AnalysisResult, RiskLevel } from '../types';

export const generatePdfReport = (user: User, result: AnalysisResult) => {
  const doc = new jsPDF() as jsPDF & { lastAutoTable: { finalY: number } };
  const pageWidth = doc.internal.pageSize.width || 210;
  const pageHeight = doc.internal.pageSize.height || 297;
  
  // --- HEADER SECTION ---
  // Background Header Bar
  doc.setFillColor(17, 24, 39); // Gray-900 like
  doc.rect(0, 0, pageWidth, 40, 'F');

  // App Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('SOCIAL SENTRY AI', 15, 20);

  // Report Type Subtitle
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 163, 175); // Gray-400
  doc.text('FORENSIC INTELLIGENCE REPORT', 15, 28);

  // Metadata (Right Aligned)
  doc.setFontSize(9);
  doc.setTextColor(209, 213, 219); // Gray-300
  const dateStr = new Date().toLocaleDateString();
  const timeStr = new Date().toLocaleTimeString();
  doc.text(`Generated: ${dateStr} ${timeStr}`, pageWidth - 15, 18, { align: 'right' });
  doc.text(`Reference ID: ${user.id.toString().slice(-8)}`, pageWidth - 15, 24, { align: 'right' });

  let currentY = 55;

  // --- SECTION 1: TARGET PROFILE ---
  doc.setTextColor(17, 24, 39); // Dark text
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1. SUBJECT IDENTITY', 15, currentY);
  
  currentY += 5;

  autoTable(doc, {
    startY: currentY,
    theme: 'plain',
    head: [],
    body: [
        ['Display Name:', user.name],
        ['Username/Handle:', user.username],
        ['Platform:', user.platform],
        ['Total Posts Analyzed:', user.posts.length.toString()]
    ],
    columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50, textColor: [75, 85, 99] },
        1: { textColor: [17, 24, 39] }
    },
    styles: { fontSize: 10, cellPadding: 1.5 },
    margin: { left: 15, right: 15 }
  });
  
  currentY = doc.lastAutoTable.finalY + 15;

  // --- SECTION 2: RISK ASSESSMENT ---
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('2. RISK ASSESSMENT SUMMARY', 15, currentY);
  currentY += 8;

  // Color mappings
  const colors: Record<string, [number, number, number]> = {
      'High': [220, 38, 38],   // Red
      'Medium': [234, 88, 12], // Orange
      'Low': [22, 163, 74],    // Green
      'Unknown': [107, 114, 128] // Gray
  };
  const riskColor = colors[result.riskLevel] || colors['Unknown'];

  // Status Box
  doc.setDrawColor(209, 213, 219);
  doc.setFillColor(249, 250, 251); // Very light gray bg
  doc.roundedRect(15, currentY, pageWidth - 30, 35, 2, 2, 'FD');
  
  // Risk Indicator Strip
  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.rect(15, currentY, 4, 35, 'F');

  // Risk Label
  doc.setFontSize(14);
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text(result.riskLevel.toUpperCase(), 25, currentY + 12);
  
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128); // Gray 500
  doc.text('RISK CLASSIFICATION', 25, currentY + 20);

  // Confidence Score
  doc.setFontSize(20);
  doc.setTextColor(17, 24, 39);
  doc.text(`${result.riskScore}%`, 100, currentY + 15);
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text('CONFIDENCE', 100, currentY + 23);

  currentY += 45;

  // Logic Summary
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('Classifier Rationale:', 15, currentY);
  currentY += 6;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);
  const summaryLines = doc.splitTextToSize(result.summary, pageWidth - 30);
  doc.text(summaryLines, 15, currentY);
  currentY += (summaryLines.length * 5) + 15;

  // --- SECTION 3: TECHNICAL BREAKDOWN ---
  if (currentY > pageHeight - 60) { doc.addPage(); currentY = 20; }
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('3. MULTIMODAL ANALYSIS DETAIL', 15, currentY);
  currentY += 8;

  // Table for features
  autoTable(doc, {
    startY: currentY,
    head: [['Modality', 'Score', 'Detailed Findings']],
    body: [
        [
            'Visual (CNN)', 
            `${result.visualAnalysis.score}/100`, 
            `Classification: ${result.visualAnalysis.classification}\nDetected: ${result.visualAnalysis.detectedItems.join(', ') || 'None'}`
        ],
        [
            'Text (NLP)', 
            `${result.textAnalysis.score}/100`, 
            `Intent: ${result.textAnalysis.intent}\nKeywords: ${result.textAnalysis.flaggedKeywords.join(', ') || 'None'}`
        ]
    ],
    theme: 'grid',
    headStyles: { fillColor: [31, 41, 55], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
        0: { cellWidth: 35, fontStyle: 'bold' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 'auto' }
    },
    styles: { fontSize: 10, cellPadding: 3, valign: 'middle' },
    margin: { left: 15, right: 15 }
  });

  // --- FOOTER ---
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(`Social Sentry AI • Confidential Forensic Report • Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  doc.save(`Analysis_Report_${user.username}_${Date.now()}.pdf`);
};
