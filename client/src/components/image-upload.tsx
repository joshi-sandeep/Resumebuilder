import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient"; 

interface ImageUploadProps {
  onUpload: (url: string) => void;
  label: string;
}

export function ImageUpload({ onUpload, label }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) throw new Error("Upload failed");
      
      const data = await res.json();
      onUpload(data.url);
      toast({
        title: "Upload successful",
        description: "Your image has been uploaded",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={isUploading}
        className="hidden"
        id={`file-upload-${label.toLowerCase()}`}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isUploading}
        asChild
      >
        <label htmlFor={`file-upload-${label.toLowerCase()}`}>
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Uploading..." : `Upload ${label}`}
        </label>
      </Button>
    </div>
  );
}
