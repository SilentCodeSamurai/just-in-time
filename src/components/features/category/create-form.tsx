"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { CategoryAllItem } from "@/types/category";
import { CategoryCreateInputSchema } from "@/services/category/schemas";
import { CategoryListItem } from "@/types/category";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { categoryCreateServerFn } from "@/server/category";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export function CreateCategoryForm() {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();
	const form = useForm<z.infer<typeof CategoryCreateInputSchema>>({
		resolver: zodResolver(CategoryCreateInputSchema),
		defaultValues: {
			name: "",
			description: "",
			color: "",
		},
	});

	const createMutation = useMutation({
		mutationFn: categoryCreateServerFn,
		onSuccess: (createdCategory) => {
			queryClient.setQueryData(["category", "all"], (old: CategoryAllItem[]) => [...old, createdCategory]);
			queryClient.setQueryData(["category", "list"], (old: CategoryListItem[]) => [...old, createdCategory]);
			toast.success("Category created");
			setOpen(false);
		},
		onError: (error) => {
			toast.error(`Failed to create category: ${error}`);
		},
	});

	function onSubmit(values: z.infer<typeof CategoryCreateInputSchema>) {
		createMutation.mutate({ data: values });
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(value) => {
				setOpen(value);
				if (!value) {
					form.reset();
				}
			}}
			
		>
			<DialogTrigger asChild>
				<Button variant="outline" className="size-8">
					<Plus className="size-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create category</DialogTitle>
					<DialogDescription>Create a new category.</DialogDescription>
				</DialogHeader>
				<Form {...form} >
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Category name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input
											value={field.value || ""}
											onChange={(e) => field.onChange(e.target.value)}
											placeholder="Category description"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="color"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Color</FormLabel>
									<FormControl>
										<Input
											value={field.value || ""}
											onChange={(e) => field.onChange(e.target.value)}
											placeholder="Category color"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="submit" disabled={createMutation.isPending}>
								Create
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
