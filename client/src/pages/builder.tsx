import { ResumeForm } from "@/components/resume-form";
import { ResumePreview } from "@/components/resume-preview";
import { ExportButtons } from "@/components/export-buttons";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider } from "react-hook-form";
import { resumeSchema, type ResumeData } from "@shared/schema";

const defaultValues: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
  },
  education: [{ institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" }],
  experience: [{ company: "", position: "", startDate: "", endDate: "", description: "" }],
  skills: [],
  projects: [{ name: "", description: "", technologies: "", link: "" }],
  certificates: [{ name: "", issuer: "", date: "", fileUrl: "" }],
  profileImage: undefined,
};

export default function Builder() {
  const methods = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-3xl font-bold">Resume Builder</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <Card className="p-6">
                <ResumeForm />
              </Card>
              <ExportButtons />
            </div>

            <div className="sticky top-8">
              <Card className="p-6">
                <ResumePreview />
              </Card>
            </div>
          </div>
        </main>
      </div>
    </FormProvider>
  );
}