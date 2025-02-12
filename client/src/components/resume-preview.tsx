import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useFormContext } from "react-hook-form";
import type { ResumeData } from "@shared/schema";

export function ResumePreview() {
  const { watch } = useFormContext<ResumeData>();
  const data = watch();

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center space-x-6">
        <Avatar className="h-24 w-24">
          {data.profileImage ? (
            <AvatarImage src={data.profileImage} alt="Profile" />
          ) : (
            <AvatarFallback>
              {data.personalInfo.fullName.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          )}
        </Avatar>

        <div>
          <h1 className="text-3xl font-bold">{data.personalInfo.fullName}</h1>
          <p className="text-muted-foreground">{data.personalInfo.email}</p>
          <p className="text-muted-foreground">{data.personalInfo.phone}</p>
          <p className="text-muted-foreground">{data.personalInfo.location}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <p>{data.personalInfo.summary}</p>
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">Experience</h2>
        {data.experience.map((exp, i) => (
          <Card key={i} className="p-4 mb-4">
            <div className="flex justify-between mb-2">
              <div>
                <h3 className="font-medium">{exp.position}</h3>
                <p className="text-muted-foreground">{exp.company}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                {exp.startDate} - {exp.endDate}
              </div>
            </div>
            <p>{exp.description}</p>
          </Card>
        ))}
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">Education</h2>
        {data.education.map((edu, i) => (
          <Card key={i} className="p-4 mb-4">
            <div className="flex justify-between mb-2">
              <div>
                <h3 className="font-medium">{edu.institution}</h3>
                <p>{edu.degree} in {edu.field}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                {edu.startDate} - {edu.endDate}
              </div>
            </div>
            {edu.gpa && <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>}
          </Card>
        ))}
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        {data.projects.map((project, i) => (
          <Card key={i} className="p-4 mb-4">
            <div className="mb-2">
              <div className="flex justify-between">
                <h3 className="font-medium">{project.name}</h3>
                {project.link && (
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    View Project
                  </a>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Technologies: {project.technologies}
              </p>
            </div>
            <p>{project.description}</p>
          </Card>
        ))}
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">Certificates</h2>
        {data.certificates.map((cert, i) => (
          <Card key={i} className="p-4 mb-4">
            <div className="flex justify-between mb-2">
              <div>
                <h3 className="font-medium">{cert.name}</h3>
                <p className="text-muted-foreground">{cert.issuer}</p>
                <p className="text-sm text-muted-foreground">{cert.date}</p>
              </div>
            </div>
            {cert.fileUrl && (
              <img 
                src={cert.fileUrl} 
                alt={`Certificate: ${cert.name}`}
                className="mt-2 max-w-full h-auto rounded-lg"
              />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}