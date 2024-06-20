import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "./ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "./ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "./ui/select"
import { Input } from "./ui/input"
import { z } from "zod"
import axios from 'axios';
import { formSchema } from '../lib/validator';
import { Checkbox } from './ui/checkbox';
import FileInput from './FileInput';
import DateInput from './DateInput';
import { useState } from "react"
import { toast } from "react-toastify"

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
            fileName: "",
            fileType: "",
            file: undefined,
            fileName1: "",
            fileType1: "",
            file1: undefined
        },
    });
    const notify = (value: number) => {
        if (value === 200) {
            toast.success("Successfully submitted the form !", {
                position: "top-right"
            });
        } else if (value === 400) {
            toast.error("Something went wrong", {
                position: "top-right"
            });
        }
    };
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formDataToSend = new FormData();
        formDataToSend.append('name', values.firstname + " " + values.lastname);
        formDataToSend.append('dob', values.dob.toISOString());
        formDataToSend.append('email', values.email);
        formDataToSend.append('residentialAddress', values.street1 + " " + values.street2);
        formDataToSend.append('sameAsResidential', String(values.sameAsResidential));
        if (!values.sameAsResidential) {
            formDataToSend.append('permanentAddress', values.street3 + " " + values.street4);
        }
        const filesArray = [{
            fileName: values.fileName,
            fileType: values.fileType,
            file: values.file
        },
        {
            fileName: values.fileName1,
            fileType: values.fileType1,
            file: values.file1
        }]
        filesArray.forEach((doc: any) => {
            formDataToSend.append(`documents`, doc.file);
        });

        try {
            const response = await axios.post(`${url}/api/form/submitForm`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status == 200) {
                notify(200);
                form.reset();
            } else if (response.status == 400) {
                notify(400);
            }
        } catch (error: any) {
            alert('Error submitting form: ' + error.response.data);
        }
    }

    return (
        <Form {...form}>
            <div className='flex items-center justify-center w-full h-full'>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 p-6 flex flex-col gap-4">
                    <div className='flex justify-between'>
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({ field }) => (
                                <FormItem className='w-[45%]'>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your first name here.." {...field} className='border-[2] border-black' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastname"
                            render={({ field }) => (
                                <FormItem className='w-[45%]'>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your last name here.." {...field} className='border-[2] border-black' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex justify-between'>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className='w-[45%]'>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ex:example@mymail.com" {...field} className='border-[2] border-black' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                                <FormItem className='w-[45%]'>
                                    <FormLabel>Date of Birth</FormLabel>
                                    <FormControl>
                                        <DateInput {...field} control={form.control} />
                                    </FormControl>
                                    <FormDescription>
                                        (Min.age should be 18 Years)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <h4 className="scroll-m-20 font-semibold tracking-tight">
                        Residential Address
                    </h4>
                    <div className='flex justify-between'>
                        <FormField
                            control={form.control}
                            name="street1"
                            render={({ field }) => (
                                <FormItem className='w-[45%]'>
                                    <FormLabel>Street 1</FormLabel>
                                    <FormControl>
                                        <Input {...field} className='border-[2] border-black' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="street2"
                            render={({ field }) => (
                                <FormItem className='w-[45%]'>
                                    <FormLabel>Street 2</FormLabel>
                                    <FormControl>
                                        <Input {...field} className='border-[2] border-black' />
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
                                <FormItem className='flex items-center gap-4'>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            onClick={() => setDisabled((prev) => !prev)}
                                        />
                                    </FormControl>
                                    <h4 className="font-semibold">Same as Residential Address</h4>
                                </FormItem>
                            )}
                        />
                    </div>
                    <h4 className="scroll-m-20 font-semibold tracking-tight">
                        Permanent Address
                    </h4>
                    <div className='flex justify-between'>
                        <FormField
                            control={form.control}
                            name="street3"
                            render={({ field }) => (
                                <FormItem className='w-[45%]'>
                                    <FormLabel>Street 1</FormLabel>
                                    <FormControl>
                                        <Input {...field} className='border-[2] border-black' disabled={disabled} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="street4"
                            render={({ field }) => (
                                <FormItem className='w-[45%]'>
                                    <FormLabel>Street 2</FormLabel>
                                    <FormControl>
                                        <Input {...field} className='border-[2] border-black' disabled={disabled} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <h4 className="scroll-m-20 font-semibold tracking-tight">
                        Upload Documents
                    </h4>
                    <div className='flex justify-between'>
                        <FormField
                            control={form.control}
                            name="fileName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>File Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} className='border-[2] border-black' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fileType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type of File</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-[180px] border-[2]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="application/pdf">pdf</SelectItem>
                                                <SelectItem value="image/png">image</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>
                                        (image,pdf.)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Upload Document</FormLabel>
                                    <FormControl>
                                        <FileInput {...field} control={form.control} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex justify-between'>
                        <FormField
                            control={form.control}
                            name="fileName1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>File Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} className='border-[2] border-black' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fileType1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type of File</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-[180px] border-[2]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="application/pdf">pdf</SelectItem>
                                                <SelectItem value={"image/png" || "image/jpeg" || "image/webp"}>image</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>
                                        (image,pdf.)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="file1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Upload Document</FormLabel>
                                    <FormControl>
                                        <FileInput {...field} control={form.control} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
            </div>
        </Form>
    );
};

export default FormComponent;
