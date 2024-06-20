import { z } from "zod";

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
    fileName: z.string().nonempty({ message: "File name is required" }),
    fileType: z.string().nonempty({ message: "File type is required" }),
    file: z.array(
      z
        .instanceof(File)
        .refine((file) => file instanceof File && file.size <= 5000000, {
          message: "File size should be less than 5MB",
        })
    ),
    fileName1: z.string().nonempty({ message: "File name is required" }),
    fileType1: z.string().nonempty({ message: "File type is required" }),
    file1: z.array(
      z
        .instanceof(File)
        .refine((file) => file instanceof File && file.size <= 5000000, {
          message: "File size should be less than 5MB",
        })
    ),
  })
  .superRefine((data, ctx) => {
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
    const fileChecks = [...(data.file || []), ...(data.file1 || [])];
    const validMimeTypes = ["application/pdf", "image/png", "image/jpeg", "image/gif", "image/webp"];

    fileChecks.forEach((file, index) => {
      if (!validMimeTypes.includes(file.type)) {
        ctx.addIssue({
          path: ['files', index],
          message: `Invalid file type: ${file.type}`,
          code: "custom",
        });
      }
    });
  });
