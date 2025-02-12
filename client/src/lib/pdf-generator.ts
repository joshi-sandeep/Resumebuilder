import { jsPDF } from "jspdf";
import type { ResumeData } from "@shared/schema";

export async function generatePDF(data: ResumeData) {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  // Header with profile image
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);

  // Add profile image if exists
  if (data.profileImage) {
    doc.addImage(data.profileImage, 'JPEG', margin, y, 30, 30);
    doc.text(data.personalInfo.fullName, margin + 40, y + 15);
    y += 35;
  } else {
    doc.text(data.personalInfo.fullName, margin, y);
    y += 10;
  }

  // Contact Information
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(data.personalInfo.email, margin, y);
  y += 5;
  doc.text(data.personalInfo.phone, margin, y);
  y += 5;
  doc.text(data.personalInfo.location, margin, y);
  y += 15;

  // Summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Summary", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const splitSummary = doc.splitTextToSize(data.personalInfo.summary, 170);
  doc.text(splitSummary, margin, y);
  y += splitSummary.length * 5 + 10;

  // Experience
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Experience", margin, y);
  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  data.experience.forEach((exp) => {
    doc.setFont("helvetica", "bold");
    doc.text(exp.position, margin, y);
    doc.setFont("helvetica", "italic");
    doc.text(`${exp.company} | ${exp.startDate} - ${exp.endDate}`, margin, y + 5);
    doc.setFont("helvetica", "normal");
    const splitDesc = doc.splitTextToSize(exp.description, 170);
    doc.text(splitDesc, margin, y + 10);
    y += splitDesc.length * 5 + 15;
  });

  // Education
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Education", margin, y);
  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  data.education.forEach((edu) => {
    doc.setFont("helvetica", "bold");
    doc.text(edu.institution, margin, y);
    doc.setFont("helvetica", "italic");
    doc.text(`${edu.degree} in ${edu.field}`, margin, y + 5);
    doc.text(`${edu.startDate} - ${edu.endDate}`, margin, y + 10);
    if (edu.gpa) {
      doc.text(`GPA: ${edu.gpa}`, margin, y + 15);
      y += 20;
    } else {
      y += 15;
    }
  });

  // Skills
  if (data.skills.length > 0) {
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Skills", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const skillsText = data.skills.join(", ");
    const splitSkills = doc.splitTextToSize(skillsText, 170);
    doc.text(splitSkills, margin, y);
    y += splitSkills.length * 5 + 10;
  }

  // Projects (Added -  Assumed structure based on other sections)
  if (data.projects.length > 0) {
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Projects", margin, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    data.projects.forEach((project) => {
      doc.setFont("helvetica", "bold");
      doc.text(project.name, margin, y);
      doc.setFont("helvetica", "italic");
      doc.text(project.description, margin, y + 5);
      y += 15;
    });
  }


  // Certificates
  if (data.certificates.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Certificates", margin, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    data.certificates.forEach((cert) => {
      doc.setFont("helvetica", "bold");
      doc.text(cert.name, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${cert.issuer} | ${cert.date}`, margin, y + 5);

      if (cert.fileUrl) {
        try {
          doc.addImage(cert.fileUrl, 'JPEG', margin, y + 10, 50, 30);
          y += 45;
        } catch (error) {
          console.error('Error adding certificate image:', error);
          y += 10;
        }
      } else {
        y += 10;
      }
    });
  }

  doc.save("resume.pdf");
}