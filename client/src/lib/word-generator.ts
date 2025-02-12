import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";
import { saveAs } from "file-saver";
import type { ResumeData } from "@shared/schema";

function base64ToUint8Array(base64: string): Uint8Array {
  const base64Data = base64.split(',')[1];
  const binaryString = window.atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function generateWord(data: ResumeData) {
  const children: any[] = [];

  // Header with profile image
  if (data.profileImage) {
    try {
      const imageData = base64ToUint8Array(data.profileImage);
      children.push(new Paragraph({
        children: [
          new ImageRun({
            data: imageData,
            transformation: {
              width: 100,
              height: 100,
            },
          }),
        ],
      }));
    } catch (error) {
      console.error('Error adding profile image:', error);
    }
  }

  // Personal Information
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.personalInfo.fullName,
          bold: true,
          size: 32,
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: data.personalInfo.email, size: 24 }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: data.personalInfo.phone, size: 24 }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: data.personalInfo.location, size: 24 }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Summary", bold: true, size: 28 }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: data.personalInfo.summary, size: 24 }),
      ],
    })
  );

  // Experience Section
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Experience", bold: true, size: 28, break: 2 }),
      ],
    })
  );

  data.experience.forEach((exp) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: exp.position, bold: true, size: 26 }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ 
            text: `${exp.company} | ${exp.startDate} - ${exp.endDate}`,
            italics: true,
            size: 24 
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: exp.description, size: 24 }),
        ],
      })
    );
  });

  // Education Section
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Education", bold: true, size: 28, break: 2 }),
      ],
    })
  );

  data.education.forEach((edu) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: edu.institution, bold: true, size: 26 }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ 
            text: `${edu.degree} in ${edu.field}`,
            size: 24 
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ 
            text: `${edu.startDate} - ${edu.endDate}`,
            italics: true,
            size: 24 
          }),
        ],
      }),
      edu.gpa ? new Paragraph({
        children: [
          new TextRun({ text: `GPA: ${edu.gpa}`, size: 24 }),
        ],
      }) : null
    );
  });

  // Skills Section
  if (data.skills.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Skills", bold: true, size: 28, break: 2 }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: data.skills.join(", "), size: 24 }),
        ],
      })
    );
  }

  // Certificates Section
  if (data.certificates.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Certificates", bold: true, size: 28, break: 2 }),
        ],
      })
    );

    data.certificates.forEach((cert) => {
      const certChildren = [
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true, size: 26 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ 
              text: `${cert.issuer} | ${cert.date}`,
              italics: true,
              size: 24 
            }),
          ],
        })
      ];

      if (cert.fileUrl) {
        try {
          const imageData = base64ToUint8Array(cert.fileUrl);
          certChildren.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: imageData,
                  transformation: {
                    width: 200,
                    height: 120,
                  },
                }),
              ],
            })
          );
        } catch (error) {
          console.error('Error adding certificate image:', error);
        }
      }

      children.push(...certChildren);
    });
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: children.filter(Boolean),
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "resume.docx");
}