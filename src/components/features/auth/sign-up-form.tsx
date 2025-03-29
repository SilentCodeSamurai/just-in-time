import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link, useRouter } from "@tanstack/react-router";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignUpInputSchema } from "@/services/user/schemas";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { userSignUpServerFn } from "@/server/user";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const SignUpFormSchema = SignUpInputSchema.extend({
	confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
}).refine((data) => data.password === data.confirmPassword, {
	path: ["confirmPassword"],
	message: "Passwords do not match",
});

export function SignUpForm() {
	const router = useRouter();
	const form = useForm<z.infer<typeof SignUpFormSchema>>({
		resolver: zodResolver(SignUpFormSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const signupUserMutation = useMutation({
		mutationFn: (data: z.infer<typeof SignUpInputSchema>) => userSignUpServerFn({ data }),
		onSuccess: (data) => {
			if (data.success) {
				toast.success(data.success.message);
				router.navigate({ to: "/dashboard" });
			} else if (data.error) {
				form.setError(data.error.path, { message: data.error.message });
				toast.error(data.error.message);
			}
		},
	});

	function onSubmit(values: z.infer<typeof SignUpFormSchema>) {
		signupUserMutation.mutate(values);
	}

	return (
		<Card className="w-[300px]">
			<CardHeader className="flex items-center gap-2">
				<Button variant="ghost" asChild>
					<Link to="/" viewTransition={true}>
						<ArrowLeft className="size-4" />
					</Link>
				</Button>
				<CardTitle>Sign Up</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											value={field.value}
											onChange={(e) =>
												field.onChange(e.target.value === "" ? undefined : e.target.value)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password*</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password*</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex flex-col justify-between gap-2">
							<Button disabled={signupUserMutation.isPending} type="submit">
								{signupUserMutation.isPending ? "Signing up..." : "Sign Up"}
							</Button>
							<Button type="button" variant="outline" asChild>
								<Link to="/sign-in" viewTransition={true}>
									Already have an account?
								</Link>
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
