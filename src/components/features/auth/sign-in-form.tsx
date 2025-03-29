import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { SignInInputSchema } from "@/services/user/schemas";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { userSignInServerFn } from "@/server/user";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export function SignInForm() {
	const router = useRouter();
	const form = useForm<z.infer<typeof SignInInputSchema>>({
		resolver: zodResolver(SignInInputSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const signInMutation = useMutation({
		mutationFn: (data: z.infer<typeof SignInInputSchema>) => userSignInServerFn({ data }),
		onSuccess: (data) => {
			if (data.success) {
				toast.success(data.success.message);
				router.navigate({ to: "/dashboard" });
			} else if (data.error) {
				toast.error(data.error.message);
				form.setError(data.error.path, { message: data.error.message });
			}
		},
		onError: () => {
			toast.error("Failed to sign in");
		},
	});

	function onSubmit(values: z.infer<typeof SignInInputSchema>) {
		signInMutation.mutate(values);
	}

	return (
		<Card className="w-[300px]">
			<CardHeader className="flex items-center gap-2">
				<Button variant="ghost" asChild>
					<Link to="/" viewTransition={true}>
						<ArrowLeft className="size-4" />
					</Link>
				</Button>
				<CardTitle>Sign In</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email*</FormLabel>
									<FormControl>
										<Input {...field} />
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

						<div className="flex flex-col gap-2">
							<Button type="submit" disabled={signInMutation.isPending}>
								{signInMutation.isPending ? "Signing in..." : "Sign In"}
							</Button>
							<Button type="button" variant="outline" asChild>
								<Link to="/sign-up" viewTransition={true}>
									Don't have an account?
								</Link>
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
