import { z } from "zod";

export const formSchema = z.object({
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
  street3: z.string().nonempty({ message: "Street 1 is required" }),
  street4: z.string().nonempty({ message: "Street 2 is required" }),
  fileName: z.string().nonempty({ message: "File name is required" }),
  fileType: z.string().nonempty({ message: "File type is required" }),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5000000, {
      message: "File size should be less than 5MB",
    }),
  fileName1: z.string().nonempty({ message: "File name is required" }),
  fileType1: z.string().nonempty({ message: "File type is required" }),
  file1: z
    .instanceof(File)
    .refine((file) => file.size <= 5000000, {
      message: "File size should be less than 5MB",
    }),
});
