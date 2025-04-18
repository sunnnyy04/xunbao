import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { useState } from "react";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    rollNumber: z.string().min(1, "Roll Number is required"),
    email: z.string().email("Invalid email format"),
    branch: z.string().min(1, "Branch is required"),
    course: z.string().min(1, "Course is required"),
    phoneNumber: z.string().min(1, "Phone Number is required"),
    yearOfGraduation: z.number().min(1, "Year of Graduation is required"),
    studentId: z.string().min(1, "Student ID is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterForm() {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            rollNumber: "",
            email: "",
            branch: "",
            course: "",
            phoneNumber: "",
            yearOfGraduation: 1900,
            studentId: "",
        },
    });

    const [message, setMessage] = useState("");

    const onSubmit = async (data: FormData) => {
        setMessage("");
        const res = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await res.json();
        if (res.ok) {
            form.reset();
            setMessage("Registration successful!");
        } else {
            setMessage(result.error || "Something went wrong");
        }
    };

    return (
        <>
            <div className="absolute left-1/2 -translate-x-1/2 text-3xl underline text-white top-20">Registration Form</div>
            <div className="h-screen w-screen flex items-center justify-center">
                <div className="border p-8 rounded-2xl shadow-xl w-full max-w-md">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="studentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Student ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ID" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="rollNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Roll Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Roll Number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="example@domain.com" type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="branch"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Branch</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Computer Science" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="course"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Course</FormLabel>
                                        <FormControl>
                                            <Input placeholder="B.TECH" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+1234567890" type="tel" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="yearOfGraduation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Year of Graduation</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 2025" type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">
                                Register
                            </Button>
                        </form>
                    </Form>

                    {message && <p className="mt-4 text-sm">{message}</p>}
                </div>
            </div>
        </>
    );
}
