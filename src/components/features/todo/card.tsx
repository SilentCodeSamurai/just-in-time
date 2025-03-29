"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, EllipsisVertical, TimerOff } from "lucide-react";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { differenceInHours, format, formatDistanceToNow } from "date-fns";
import { motion, useAnimation } from "motion/react";
import { todoDeleteServerFn, todoUpdateServerFn } from "@/server/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PriorityBadge } from "./priority-badges";
import { TodoAllItem } from "@/types/todo";
import { TodoDeleteDialog } from "./delete-dialog";
import { TodoUpdateForm } from "./update-form";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const WARNING_COLORS_MAPPING: Map<number, string> = new Map([
	[0, "text-red-600"],
	[1, "text-orange-400"],
	[2, "text-amber-400"],
	[3, "text-yellow-400"],
	[5, "text-lime-400"],
	[7, "text-green-400"],
]);

export function getWarningColor(dueDate: Date, now: Date) {
	const diffDays = differenceInHours(dueDate, now) / 24;
	for (const [key, value] of WARNING_COLORS_MAPPING.entries()) {
		if (diffDays <= key) return value;
	}
	return WARNING_COLORS_MAPPING.get(7);
}

export const priorityClasses: Record<number, string> = {
	1: "from-priority-1 bg-priority-1",
	2: "from-priority-2 bg-priority-2",
	3: "from-priority-3 bg-priority-3",
	4: "from-priority-4 bg-priority-4",
};

const getDueTime = (dueDate: Date) => {
	return new Date(dueDate.setHours(23, 59, 59, 999));
};

export function TodoCard({ todo }: { todo: TodoAllItem }) {
	const now = useRef(new Date());
	const queryClient = useQueryClient();
	const controls = useAnimation();
	const diffHours = todo.dueDate ? differenceInHours(getDueTime(todo.dueDate), now.current) : Infinity;
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [updateFormOpen, setUpdateFormOpen] = useState(false);

	const animateUpdate = () => {
		controls.start({
			transform: ["scale(1)", "scale(1.01)", "scale(1)"],
			transition: { duration: 0.2 },
		});
	};

	const updateMutation = useMutation({
		mutationFn: todoUpdateServerFn,
		onSuccess: (updatedTodo) => {
			queryClient.setQueryData(["todo", "all"], (old: TodoAllItem[]) => {
				return old.map((t) => (t.id === todo.id ? { ...t, ...updatedTodo } : t));
			});
			toast.success(`Todo ${updatedTodo.title} ${updatedTodo.completed ? "completed" : "uncompleted"}`);
			animateUpdate();
		},
		onError: (error) => {
			toast.error(`Failed to update todo: ${error}`);
		},
	});

	const handleChangeStatus = (completed: boolean) => {
		updateMutation.mutate({
			data: {
				id: todo.id,
				completed,
				meta: {
					now: new Date(),
				},
			},
		});
	};

	return (
		<>
			<TodoDeleteDialog todo={todo} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
			<TodoUpdateForm
				todo={todo}
				onSuccess={animateUpdate}
				open={updateFormOpen}
				onOpenChange={setUpdateFormOpen}
			/>
			<motion.div animate={controls}>
				<Card className={`relative w-full gap-1 pl-2 lg:pl-0`}>
					{/* <div
					className={`rounded-sm z-10 absolute top-1/2 left-[-4px] w-[8px] h-[60%] bg-priority-${todo.priority} transform -translate-y-1/2`}
				></div> */}
					<div className="top-0 right-0 bottom-0 -left-0 absolute rounded-xl h-full overflow-hidden pointer-events-none">
						<div
							className={`opacity-10 absolute top-[-2px] left-0 right-0 bottom-0 z-0 transition-all ease-in-out ${todo.completed ? "bg-green-500" : ""}`}
						/>
						<div
							className="top-0 left-[-5px] z-0 absolute w-4 h-full"
							style={{
								background: `linear-gradient(to right, ${todo.category?.color || "gray"} 0%, transparent 100%)`,
							}}
						/>
					</div>

					<CardHeader>
						<div className="flex flex-row justify-between items-center gap-2">
							<div className="flex flex-row items-center gap-2">
								<Checkbox
									className="size-5"
									checked={todo.completed}
									onCheckedChange={handleChangeStatus}
								/>
								{!todo.completed &&
									(todo.dueDate && diffHours <= 0 ? (
										<div className="relative">
											<TimerOff className="size-6 text-red-600 dark:text-red-500" />
											<TimerOff className="absolute inset-0 opacity-50 dark:opacity-70 rounded-full size-6 text-red-600 animate-ping" />
										</div>
									) : (
										diffHours < 120 &&
										todo.dueDate && (
											<Clock
												className={cn("size-5", getWarningColor(todo.dueDate, now.current))}
											/>
										)
									))}

								<PriorityBadge priority={todo.priority} />
								<div className="flex flex-row items-center gap-2">
									<p suppressHydrationWarning className="text-gray-500 text-sm">
										{format(todo.createdAt, "dd/MM/yyyy")}
									</p>
								</div>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button type="button" variant="ghost" className="size-8">
										<EllipsisVertical className="size-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem
										onClick={() => setUpdateFormOpen(true)}
										disabled={todo.completed || updateMutation.isPending}
									>
										Edit
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} variant="destructive">
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<CardDescription>
							{todo.category && (
								<div className="flex flex-row items-center gap-2">
									<div
										className="rounded-full w-2 h-2"
										style={{ backgroundColor: todo.category.color || "gray" }}
									></div>
									<p>{todo.category?.name}</p>
								</div>
							)}
							{todo.completed && todo.completedAt ? (
								<div className="flex flex-row items-center gap-2">
									<p>Completed: </p>
									<p suppressHydrationWarning>{format(todo.completedAt, "dd/MM/yyyy")}</p>
								</div>
							) : (
								todo.dueDate && (
									<div className="flex flex-row items-center gap-2 text-md">
										<p>Deadline: </p>
										<p
											suppressHydrationWarning
											className={`${!todo.completed ? getWarningColor(todo.dueDate, now.current) : ""}`}
										>
											{formatDistanceToNow(todo.dueDate, { addSuffix: true })}
										</p>
									</div>
								)
							)}
						</CardDescription>
						<CardTitle className={`text-sm lg:text-xl ${todo.completed ? "line-through opacity-50" : ""}`}>
							{todo.title}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className={`text-sm ${todo.completed ? "line-through opacity-50" : ""}`}>
							{todo.description}
						</p>
					</CardContent>
				</Card>
			</motion.div>
		</>
	);
}
