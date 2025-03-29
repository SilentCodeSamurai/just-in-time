"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GroupAllItem, GroupListItem } from "@/types/group";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { GroupUpdateInputSchema } from "@/services/group/schemas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { groupUpdateServerFn } from "@/server/group";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type GroupUpdateFormProps = {
	group: GroupAllItem;
	onSuccess?: () => void;
};

export function GroupUpdateForm({ group, onSuccess }: GroupUpdateFormProps) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();
	const form = useForm<z.infer<typeof GroupUpdateInputSchema>>({
		resolver: zodResolver(GroupUpdateInputSchema),
		defaultValues: {
			id: group.id,
			name: group.name,
			description: group.description,
		},
	});

	const updateMutation = useMutation({
		mutationFn: groupUpdateServerFn,
		onSuccess: (updatedGroup) => {
			queryClient.setQueryData(["category", "all"], (old: GroupAllItem[]) => {
				return old.map((c) => (c.id === group.id ? { ...c, ...updatedGroup } : c));
			});
			queryClient.setQueryData(["category", "list"], (old: GroupListItem[]) => {
				return old.map((c) => (c.id === group.id ? { ...c, ...updatedGroup } : c))
			})
			toast.success("Group updated");
			form.reset(updatedGroup);
			onSuccess?.();
			setOpen(false);
		},
		onError: (error) => {
			toast.error(`Failed to update group: ${error}`);
		},
	});

	function onSubmit(values: z.infer<typeof GroupUpdateInputSchema>) {
		updateMutation.mutate({ data: values });
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(value) => {
				setOpen(value);
				form.reset(group);
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
					<DialogTitle>Update group</DialogTitle>
					<DialogDescription>Update the group details.</DialogDescription>
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
										<Input placeholder="Group name" {...field} />
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
										<Textarea
											value={field.value || ""}
											onChange={(e) => field.onChange(e.target.value)}
											placeholder="Group description"
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
							<Button type="submit" disabled={updateMutation.isPending}>
								Update
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
