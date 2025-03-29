"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { ExternalLink, Trash } from "lucide-react";
import { GroupAllItem, GroupListItem } from "@/types/group";
import { motion, useAnimation } from "motion/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { GroupUpdateForm } from "./update-form";
import { Link } from "@tanstack/react-router";
import { groupDeleteServerFn } from "@/server/group";
import { toast } from "sonner";

export function GroupCard({ group }: { group: GroupAllItem }) {
	const queryClient = useQueryClient();
	const controls = useAnimation();

	const deleteMutation = useMutation({
		mutationFn: groupDeleteServerFn,
		onSuccess: () => {
			queryClient.setQueryData(["group", "all"], (old: GroupAllItem[]) => {
				return old.filter((c) => c.id !== group.id);
			});
			queryClient.setQueryData(["group", "list"], (old: GroupListItem[]) => {
				return old.filter((c) => c.id !== group.id);
			});
			toast.success("Group deleted");
		},
		onError: (error) => {
			toast.error(`Failed to delete group: ${error}`);
		},
	});

	const handleUpdateSuccess = () => {
		controls.start({
			scale: [1, 1.01, 1],
			transition: { duration: 0.2 },
		});
	};

	return (
		<>
			<motion.div animate={controls}>
				<Card key={group.id} className={`w-full relative`}>
					<CardHeader>
						<div className="flex flex-row justify-between items-center gap-2">
							<div className="flex flex-row items-center gap-2">
								<div className="rounded-full size-4" style={{ backgroundColor: "inherit" }} />
							</div>
							<div className="flex flex-row items-center gap-2">
								<GroupUpdateForm group={group} onSuccess={handleUpdateSuccess} />
								<Dialog>
									<DialogTrigger asChild>
										<Button type="button" variant="destructive" className="size-8">
											<Trash className="size-4" />
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Delete group ?</DialogTitle>
											<DialogDescription>
												This action cannot be undone. This will delete the group.
											</DialogDescription>
										</DialogHeader>
										<DialogFooter>
											<Button
												type="button"
												variant="destructive"
												onClick={() => deleteMutation.mutate({ data: { id: group.id } })}
												disabled={deleteMutation.isPending}
											>
												Delete
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</div>
						</div>

						<CardTitle className="text-xl">{group.name}</CardTitle>

						<CardDescription>{group.description}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-row items-center gap-4 mt-4">
							<p className="text-md">TODOS: {group._count.todos}</p>
							{group._count.todos > 0 && (
								<Button asChild type="button" variant="outline" className="size-8">
									<Link
										to="/dashboard/todo"
										search={{ filter: { groupId: group.id } }}
										viewTransition={true}
									>
										<ExternalLink className="size-4" />
									</Link>
								</Button>
							)}
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</>
	);
}
