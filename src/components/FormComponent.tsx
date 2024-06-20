import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "./ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select"
import { Input } from "./ui/input"
import { z } from "zod"
import axios from 'axios';
import { formSchema } from '../lib/validator';
import { Checkbox } from './ui/checkbox';
import FileInput from './FileInput';
import DateInput from './DateInput';

const FormComponent = () => {
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
    })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formDataToSend = new FormData();
        formDataToSend.append('name', values.firstname + " " + values.lastname);
        formDataToSend.append('dob', values.dob.toISOString());
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
            console.log(response.data);
        } catch (error: any) {
            alert('Error submitting form: ' + error.response.data);
        }
        console.log(values)
    }

    // const handleSubmit = async (e: any) => {
    //     e.preventDefault();

    //     const formDataToSend = new FormData();
    //     formDataToSend.append('name', formData.name);
    //     formDataToSend.append('dob', formData.dob);
    //     formDataToSend.append('residentialAddress', formData.residentialAddress);
    //     formDataToSend.append('sameAsResidential', formData.sameAsResidential);
    //     if (!formData.sameAsResidential) {
    //         formDataToSend.append('permanentAddress', formData.permanentAddress);
    //     }
    //     formData.documents.forEach((doc: any, index: number) => {
    //         formDataToSend.append(`documents`, doc.file);
    //     });

    //     try {
    //         const response = await axios.post(`${url}/api/form/submitForm`, formDataToSend, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });
    //         console.log(response.data);
    //     } catch (error: any) {
    //         alert('Error submitting form: ' + error.response.data);
    //     }
    // };

    return (
        // <form onSubmit={handleSubmit}>
        //     <div>
        //         <label className='text-red-800'>Name *</label>
        //         <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
        //     </div>
        //     <div>
        //         <label>Date of Birth *</label>
        //         <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} required />
        //     </div>
        //     <div>
        //         <label>Residential Address *</label>
        //         <input type="text" name="residentialAddress" value={formData.residentialAddress} onChange={handleInputChange} required />
        //     </div>
        //     <div>
        //         <label>
        //             <input type="checkbox" name="sameAsResidential" checked={formData.sameAsResidential} onChange={handleInputChange} />
        //             Same as Residential
        //         </label>
        //     </div>
        //     {!formData.sameAsResidential && (
        //         <div>
        //             <label>Permanent Address *</label>
        //             <input type="text" name="permanentAddress" value={formData.permanentAddress} onChange={handleInputChange} required />
        //         </div>
        //     )}
        //     <div>
        //         <label>Upload Documents *</label>
        //         <input type="file" multiple onChange={handleFileChange} required />
        //     </div>
        //     <button type="submit">Submit</button>
        // </form>
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
                                <FormItem className='flex justify-start gap-4'>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div >
                                        <FormDescription>
                                            Same as Residential Address
                                        </FormDescription>
                                    </div>
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
                                        <Input {...field} className='border-[2] border-black' />
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
                                        <Input {...field} className='border-[2] border-black' />
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
                                                <SelectItem value="pdf">pdf</SelectItem>
                                                <SelectItem value="image">image</SelectItem>
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
                                                <SelectItem value="pdf">pdf</SelectItem>
                                                <SelectItem value="image">image</SelectItem>
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
