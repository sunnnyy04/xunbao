import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SpaceElements from "./bgElements";
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
        <div className="relative h-screen w-screen overflow-hidden">
            <SpaceElements className="absolute inset-0 z-0" />

            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 space-y-8">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold underline text-white text-center">
                    Registration Form
                </h1>

                <div className="w-full max-w-md bg-black/70 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Full Name</FormLabel>
                                        <FormControl>
                                            <Input className="text-white" placeholder="Name..." {...field} />
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
                                            <Input className="text-white" placeholder="Roll Number" {...field} />
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
                                            <Input className="text-white" type="email" placeholder="example@domain.com" {...field} />
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
                                            <Input className="text-white" placeholder="Computer Science" {...field} />
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
                                            <Input className="text-white" placeholder="B.TECH" {...field} />
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
                                            <Input className="text-white" type="tel" placeholder="+1234567890" {...field} />
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
                                            <Input className="text-white" type="number" placeholder="e.g., 2025" {...field} />
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
                    {message && (
                        <p className="mt-4 text-sm text-white text-center">{message}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
