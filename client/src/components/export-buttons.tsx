import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { generatePDF } from "@/lib/pdf-generator";
import { generateWord } from "@/lib/word-generator";
import { useFormContext } from "react-hook-form";
import type { ResumeData } from "@shared/schema";

export function ExportButtons() {
  const { getValues } = useFormContext<ResumeData>();

  const handlePDFExport = async () => {
    const data = getValues();
    await generatePDF(data);
  };

  const handleWordExport = async () => {
    const data = getValues();
    await generateWord(data);
  };

  return (
    <div className="flex gap-4">
      <Button onClick={handlePDFExport} className="flex-1">
        <FileDown className="mr-2 h-4 w-4" /> Export as PDF
      </Button>
      <Button onClick={handleWordExport} className="flex-1">
        <FileDown className="mr-2 h-4 w-4" /> Export as Word
      </Button>
    </div>
  );
}
