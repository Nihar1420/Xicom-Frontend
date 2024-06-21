import { z } from "zod";

function getFileExtension(fileName: string): string {
  return fileName?.split(".").pop()?.toLowerCase() ?? "";
}

const fileSchema = z.object({
  fileName: z.string().nonempty({ message: "File name is required" }),
  fileType: z.string().nonempty({ message: "File type is required" }),
  file: z.any(),
});

export const formSchema = z
  .object({
    firstname: z.string().nonempty({ message: "First name is required" }),
    lastname: z.string().nonempty({ message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    dob: z.date().refine(
      (date) => {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        return age >= 18;
      },
      { message: "You must be at least 18 years old" }
    ),
    sameAsResidential: z.boolean(),
    street1: z.string().nonempty({ message: "Street 1 is required" }),
    street2: z.string().nonempty({ message: "Street 2 is required" }),
    street3: z.string().optional(),
    street4: z.string().optional(),
    documents: z
      .array(fileSchema)
      .min(1, { message: "At least one document is required" }),
  })
  .superRefine((data, ctx) => {
    data.documents.forEach((document, index) => {
    const uploadedFileType = getFileExtension(document.file?.name);
    const fileType = document.fileType.split("/")[1];
    if (fileType !== uploadedFileType) {
      ctx.addIssue({
        path: ["documents", index, "file"],
        message: "File type does not match the uploaded file type",
        code: "custom",
      });
    }
  });
    if (!data.sameAsResidential) {
      if (!data.street3) {
        ctx.addIssue({
          path: ["street3"],
          message: "Street 1 is required",
          code: "custom",
        });
      }
      if (!data.street4) {
        ctx.addIssue({
          path: ["street4"],
          message: "Street 2 is required",
          code: "custom",
        });
      }
    }
  });
