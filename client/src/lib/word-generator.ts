import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import type { ResumeData } from "@shared/schema";

export async function generateWord(data: ResumeData) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
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
            new TextRun({
              text: data.personalInfo.email,
              size: 24,
            }),
          ],
        }),
        // Add other sections similarly
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "resume.docx");
}
