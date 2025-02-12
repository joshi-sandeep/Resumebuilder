import { jsPDF } from "jspdf";
import type { ResumeData } from "@shared/schema";

export async function generatePDF(data: ResumeData) {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  // Set fonts
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(data.personalInfo.fullName, margin, y);
  
  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(data.personalInfo.email, margin, y);
  y += 5;
  doc.text(data.personalInfo.phone, margin, y);
  y += 5;
  doc.text(data.personalInfo.location, margin, y);
  
  y += 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Summary", margin, y);
  
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const splitSummary = doc.splitTextToSize(data.personalInfo.summary, 170);
  doc.text(splitSummary, margin, y);
  
  // Add other sections similarly
  
  doc.save("resume.pdf");
}
