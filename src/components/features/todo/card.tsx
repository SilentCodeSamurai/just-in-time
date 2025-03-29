"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TimerOff } from "lucide-react";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { motion, useAnimation } from "motion/react";
import { todoDeleteServerFn, todoUpdateServerFn } from "@/server/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PriorityBadge } from "./priority-badges";
import { TodoAllItem } from "@/types/todo";
import { TodoUpdateForm } from "./update-form";
import { Trash } from "lucide-react";
import { toast } from "sonner";

const getDiffDays = (date: Date) => {
	const now = new Date();
	const diffTime = date.getTime() - now.getTime();
	return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

const WARNING_COLORS_MAPPING: Map<number, string> = new Map([
	[0, "text-red-600"],
	[1, "text-orange-600"],
	[2, "text-amber-600"],
	[3, "text-yellow-600"],
	[5, "text-lime-600"],
	[7, "text-green-600"],
]);

export function getWarningColor(dueDate: Date) {
	const diffDays = getDiffDays(dueDate);
	for (const [key, value] of WARNING_COLORS_MAPPING.entries()) {
		if (diffDays <= key) return value;
	}
	return WARNING_COLORS_MAPPING.get(WARNING_COLORS_MAPPING.size - 1);
}

export const priorityClasses: Record<number, string> = {
	1: "from-priority-1 bg-priority-1",
	2: "from-priority-2 bg-priority-2",
	3: "from-priority-3 bg-priority-3",
	4: "from-priority-4 bg-priority-4",
};

export function TodoCard({ todo }: { todo: TodoAllItem }) {
	const queryClient = useQueryClient();
	const controls = useAnimation();
	const diffDays = todo.dueDate ? getDiffDays(todo.dueDate) : Infinity;
	const deleteMutation = useMutation({
		mutationFn: todoDeleteServerFn,
		onSuccess: () => {
			queryClient.setQueryData(["todo", "all"], (old: TodoAllItem[]) => {
				return old.filter((t) => t.id !== todo.id);
			});
			toast.success("Todo deleted");
		},
		onError: (error) => {
			toast.error(`Failed to delete todo: ${error}`);
		},
	});

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
		<motion.div animate={controls}>
			<Card className={`relative w-full gap-1 min-h-[200px] h-fit max-h-full`}>
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
					></div>
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
								todo.dueDate &&
								diffDays <= 0 &&
								(diffDays < 0 ? (
									<div className="relative">
										<TimerOff className="size-6 text-red-600 dark:text-red-500" />
										<TimerOff className="absolute inset-0 opacity-50 dark:opacity-70 rounded-full size-6 text-red-600 animate-ping" />
									</div>
								) : (
									<Clock className="size-6 text-orange-400" />
								))}
							<PriorityBadge priority={todo.priority} />
							<div className="flex flex-row items-center gap-2">
								<p suppressHydrationWarning className="text-gray-500 text-sm">
									{todo.createdAt.toLocaleString()}
								</p>
							</div>
						</div>
						<div className="flex flex-row items-center gap-2">
							<TodoUpdateForm
								todo={todo}
								onSuccess={animateUpdate}
								disabled={todo.completed || updateMutation.isPending || deleteMutation.isPending}
							/>
							<Dialog>
								<DialogTrigger asChild>
									<Button type="button" variant="destructive" className="size-8">
										<Trash className="size-4" />
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Delete {todo.title}?</DialogTitle>
										<DialogDescription>This action cannot be undone.</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<Button
											type="button"
											variant="destructive"
											onClick={() => deleteMutation.mutate({ data: { id: todo.id } })}
											disabled={deleteMutation.isPending}
										>
											Delete
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
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
						{todo.completed ? (
							<div className="flex flex-row items-center gap-2">
								<p>Completed: </p>
								<p suppressHydrationWarning>{todo.completedAt?.toLocaleString()}</p>
							</div>
						) : (
							todo.dueDate && (
								<div className="flex flex-row items-center gap-2">
									<p>Deadline: </p>
									<p
										suppressHydrationWarning
										className={`${!todo.completed ? getWarningColor(todo.dueDate) : ""}`}
									>
										{todo.dueDate?.toLocaleDateString()}
									</p>
								</div>
							)
						)}
					</CardDescription>
					<CardTitle className={`text-xl ${todo.completed ? "line-through opacity-50" : ""}`}>
						{todo.title}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className={`${todo.completed ? "line-through opacity-50" : ""}`}>{todo.description}</p>
				</CardContent>
			</Card>
		</motion.div>
	);
}
