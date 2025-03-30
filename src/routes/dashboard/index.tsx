import { filterTodo, sortTodo } from "@/lib/todo";

import { AnimatedGrid } from "@/components/animated-grid";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TodoAllItem } from "@/types/todo";
import { TodoCard } from "@/components/features/todo/card";
import { categoryGetAllQuery } from "@/queries/category";
import { createFileRoute } from "@tanstack/react-router";
import { groupGetAllQuery } from "@/queries/group";
import { todoGetAllQuery } from "@/queries/todo";
import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(todoGetAllQuery);
		await context.queryClient.ensureQueryData(categoryGetAllQuery);
		await context.queryClient.ensureQueryData(groupGetAllQuery);
	},
});

const getUrgentTodos = (todoAll: TodoAllItem[]) => {
	const activeTodos = filterTodo(todoAll, {
		completed: false,
	});
	const sortedByPriority = sortTodo(activeTodos, {
		sortBy: "priority",
		sortOrder: "desc",
	});
	const sortedByDueDate = sortTodo(sortedByPriority, {
		sortBy: "dueDate",
		sortOrder: "asc",
	});
	return sortedByDueDate;
};

function RouteComponent() {
	const todoAllResult = useSuspenseQuery(todoGetAllQuery);
	const categoryAllResult = useSuspenseQuery(categoryGetAllQuery);
	const groupAllResult = useSuspenseQuery(groupGetAllQuery);

	const todoAll = todoAllResult.data;
	const categoryAll = categoryAllResult.data;
	const groupAll = groupAllResult.data;

	const urgentTodos = useMemo(() => getUrgentTodos(todoAll), [todoAll]);

	return (
		<>
			<div className="flex flex-row items-center gap-2">
				<SidebarTrigger />
				<h1 className="font-bold text-xl">Dashboard</h1>
				<div className="size-9" />
			</div>
			<Separator />
			<ScrollArea style={{ height: "calc(100svh - 90px)" }}>
				<AnimatedGrid objects={urgentTodos} render={(todo) => <TodoCard todo={todo} />} />
			</ScrollArea>
		</>
	);
}
