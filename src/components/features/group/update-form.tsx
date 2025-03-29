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

type GroupUpdateFormData = z.infer<typeof GroupUpdateInputSchema>;

const getFormValues = (group: GroupAllItem): GroupUpdateFormData => {
	return {
		id: group.id,
		name: group.name,
		description: group.description,
	};
};

type GroupUpdateFormProps = {
	group: GroupAllItem;
	onSuccess?: () => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function GroupUpdateForm({ group, onSuccess, open, onOpenChange }: GroupUpdateFormProps) {
	const queryClient = useQueryClient();
	const form = useForm<GroupUpdateFormData>({
		resolver: zodResolver(GroupUpdateInputSchema),
		defaultValues: getFormValues(group),
	});

	const updateMutation = useMutation({
		mutationFn: groupUpdateServerFn,
		onSuccess: (updatedGroup) => {
			queryClient.setQueryData(["group", "all"], (old: GroupAllItem[]) => {
				return old.map((c) => (c.id === group.id ? { ...updatedGroup } : c));
			});
			queryClient.setQueryData(["group", "list"], (old: GroupListItem[]) => {
				return old.map((c) => (c.id === group.id ? { ...updatedGroup } : c));
			});
			toast.success("Group updated");
			form.reset(getFormValues(updatedGroup));
			onSuccess?.();
			onOpenChange(false);
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
				onOpenChange(value);
				form.reset(getFormValues(group));
			}}
		>
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
