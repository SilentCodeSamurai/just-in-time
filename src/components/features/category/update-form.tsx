"use client";

import { CategoryAllItem, CategoryListItem } from "@/types/category";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { CategoryUpdateInputSchema } from "@/services/category/schemas";
import { Input } from "@/components/ui/input";
import { categoryUpdateServerFn } from "@/server/category";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type CategoryUpdateFormData = z.infer<typeof CategoryUpdateInputSchema>;

const getFormValues = (category: CategoryAllItem): CategoryUpdateFormData => {
	return {
		id: category.id,
		name: category.name,
		description: category.description || undefined,
		color: category.color || undefined,
	};
};

type CategoryUpdateFormProps = {
	category: CategoryAllItem;
	onSuccess?: () => void;
};

export function CategoryUpdateForm({ category, onSuccess }: CategoryUpdateFormProps) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();
	const form = useForm<CategoryUpdateFormData>({
		resolver: zodResolver(CategoryUpdateInputSchema),
		defaultValues: getFormValues(category),
	});

	const updateMutation = useMutation({
		mutationFn: categoryUpdateServerFn,
		onSuccess: (updatedCategory) => {
			queryClient.setQueryData(["category", "all"], (old: CategoryAllItem[]) => {
				return old.map((c) => (c.id === category.id ? { ...c, ...updatedCategory } : c));
			});
			queryClient.setQueryData(["category", "list"], (old: CategoryListItem[]) => {
				return old.map((c) => (c.id === category.id ? { ...c, ...updatedCategory } : c));
			});
			toast.success("Category updated");
			form.reset(getFormValues(updatedCategory));
			onSuccess?.();
			setOpen(false);
		},
		onError: (error) => {
			toast.error(`Failed to update category: ${error}`);
		},
	});

	function onSubmit(values: CategoryUpdateFormData) {
		updateMutation.mutate({ data: values });
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(value) => {
				setOpen(value);
				form.reset(getFormValues(category));
			}}
		>
			<DialogTrigger asChild>
				<Button type="button" variant="outline" className="size-8">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="size-4"
					>
						<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
						<path d="m15 5 4 4" />
					</svg>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update category</DialogTitle>
					<DialogDescription>Update the category details.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
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
						<FormField
							control={form.control}
							name="id"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input type="hidden" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="submit" disabled={updateMutation.isPending || !form.formState.isDirty}>
								Update
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
