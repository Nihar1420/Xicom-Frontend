import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { formSchema } from "../lib/validator";
import { Button } from "./ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import DateInput from "./DateInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "react-toastify";
import { SquarePlus, Trash2 } from "lucide-react";

const FormComponent = () => {
    const [disabled, setDisabled] = useState<boolean>(false);
    const url = "http://localhost:8000";
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            dob: new Date(),
            sameAsResidential: false,
            street1: "",
            street2: "",
            street3: "",
            street4: "",
            documents: [{ fileName: "", fileType: "", file: undefined }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "documents",
    });

    const notify = (value: any) => {
        if (value === 200) {
            toast.success("Successfully submitted the form!", {
                position: "top-right",
            });
        } else if (value === "At least two documents are required") {
            toast.error("Minimum 2 docs are required", {
                position: "top-right",
            });
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formDataToSend = new FormData();
        formDataToSend.append("name", values.firstname + " " + values.lastname);
        formDataToSend.append("dob", values.dob.toISOString());
        formDataToSend.append("email", values.email);
        formDataToSend.append("residentialAddress", values.street1 + " " + values.street2);
        formDataToSend.append("sameAsResidential", String(values.sameAsResidential));
        if (!values.sameAsResidential) {
            formDataToSend.append("permanentAddress", values.street3 + " " + values.street4);
        }

        values.documents.forEach((doc, index) => {
            if (doc.file) {
                formDataToSend.append(`documentsfileName`, doc.fileName);
                formDataToSend.append(`documentsfileType`, doc.fileType);
                formDataToSend.append("documents", doc.file);
            }
        });

        try {
            const response = await axios.post(`${url}/api/form/submitForm`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            form.reset();
            setDisabled(false);
            notify(response.status);
        } catch (error: any) {
            notify(error.response.data.message);
        }
    }

    return (
        <Form {...form}>
            <div className="flex items-center justify-center w-full h-full">
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 p-6 flex flex-col gap-4">
                    <div className="flex justify-between">
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({ field }) => (
                                <FormItem className="w-[45%]">
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your first name here.."
                                            {...field}
                                            className="border-[2] border-black"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastname"
                            render={({ field }) => (
                                <FormItem className="w-[45%]">
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your last name here.."
                                            {...field}
                                            className="border-[2] border-black"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex justify-between">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="w-[45%]">
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="ex:example@mymail.com"
                                            {...field}
                                            className="border-[2] border-black"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                                <FormItem className="w-[45%]">
                                    <FormLabel>Date of Birth</FormLabel>
                                    <FormControl>
                                        <DateInput {...field} control={form.control} />
                                    </FormControl>
                                    <FormDescription>(Min.age should be 18 Years)</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <h4 className="scroll-m-20 font-semibold tracking-tight">Residential Address</h4>
                    <div className="flex justify-between">
                        <FormField
                            control={form.control}
                            name="street1"
                            render={({ field }) => (
                                <FormItem className="w-[45%]">
                                    <FormLabel>Street 1</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="border-[2] border-black" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="street2"
                            render={({ field }) => (
                                <FormItem className="w-[45%]">
                                    <FormLabel>Street 2</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="border-[2] border-black" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name="sameAsResidential"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            onClick={() => setDisabled((prev) => !prev)}
                                        />
                                    </FormControl>
                                    <h4 className="font-semibold self-center">Same as Residential Address</h4>
                                </FormItem>
                            )}
                        />
                    </div>
                    <h4 className="scroll-m-20 font-semibold tracking-tight">Permanent Address</h4>
                    <div className="flex justify-between">
                        <FormField
                            control={form.control}
                            name="street3"
                            render={({ field }) => (
                                <FormItem className="w-[45%]">
                                    <FormLabel>Street 1</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="border-[2] border-black" disabled={disabled} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="street4"
                            render={({ field }) => (
                                <FormItem className="w-[45%]">
                                    <FormLabel>Street 2</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="border-[2] border-black" disabled={disabled} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <h4 className="scroll-m-20 font-semibold tracking-tight">Upload Documents</h4>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex justify-between items-center mb-4">
                            <FormField
                                control={form.control}
                                name={`documents.${index}.fileName`}
                                render={({ field }) => (
                                    <FormItem className="w-[25%]">
                                        <FormLabel>File Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="border-[2] border-black" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`documents.${index}.fileType`}
                                render={({ field }) => (
                                    <FormItem className="w-[25%]">
                                        <FormLabel>Type of File</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className="w-[180px] border-[2]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="application/pdf">pdf</SelectItem>
                                                    <SelectItem value="image/png">image/png</SelectItem>
                                                    <SelectItem value="image/jpeg">image/jpeg</SelectItem>
                                                    <SelectItem value="image/gif">image/gif</SelectItem>
                                                    <SelectItem value="image/webp">image/webp</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`documents.${index}.file`}
                                render={({ field }) => (
                                    <FormItem className="w-[40%]">
                                        <FormLabel>Upload File</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                onChange={(e) => field.onChange(e.target.files?.[0])}
                                                className="border-[2] border-black"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {
                                index === 0 ? (
                                    <Button
                                        type="button"
                                        onClick={() => append({ fileName: "", fileType: "", file: undefined })}
                                        className="ml-4 self-end"
                                    >
                                        <SquarePlus className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button type="button" onClick={() => remove(index)} className="ml-4 self-end">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )
                            }
                        </div>
                    ))}
                    <Button type="submit" className="mt-4">
                        Submit
                    </Button>
                </form>
            </div>
        </Form>
    );
};

export default FormComponent;
