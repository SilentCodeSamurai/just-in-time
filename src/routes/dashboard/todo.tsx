import { TodoFilters, useTodoFilter } from "@/components/features/todo/filters";

import { AnimatedGrid } from "@/components/animated-grid";
import { TodoCard } from "@/components/features/todo/card";
import { TodoCreateForm } from "@/components/features/todo/create-form";
import { createFileRoute } from "@tanstack/react-router";
import { todoGetAllQuery } from "@/queries/todo";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";

const TodoSearchSchema = z.object({
	filter: z
		.object({
			groupId: z.string().nullable().optional(),
			categoryId: z.string().nullable().optional(),
			// tagIds: z.array(z.string()).optional(),
			priority: z.number().min(1).max(4).optional(),
			completed: z.boolean().optional(),
			dueDate: z.string({ description: "ISO Date" }).datetime({ offset: true }).optional(),
		})
		.optional(),
	paging: z
		.object({
			limit: z.number().optional(),
			offset: z.number().optional(),
		})
		.optional(),
	sorting: z
		.object({
			sortBy: z.enum(["createdAt", "dueDate", "priority"]).optional(),
			sortOrder: z.enum(["asc", "desc"]).optional(),
		})
		.optional(),
});

export type TodoSearch = z.infer<typeof TodoSearchSchema>;

export const Route = createFileRoute("/dashboard/todo")({
	loader: async ({ context }) => {
		const todos = await context.queryClient.ensureQueryData(todoGetAllQuery);
		return todos;
	},
	validateSearch: zodValidator(TodoSearchSchema),
	component: RouteComponent,
});

function RouteComponent() {
	const todoAllResult = useSuspenseQuery(todoGetAllQuery);
	const todoAll = todoAllResult.data;
	const todoFilter = useTodoFilter();

	const filteredTodoAll = todoFilter(todoAll);

	return (
		<>
			<div className="flex flex-col gap-4 w-full">
				<div className="flex flex-col gap-4">
					<div className="flex flex-row items-center gap-2">
						<h1 className="font-bold text-xl">Todos: {filteredTodoAll.length}</h1>
						<TodoCreateForm />
					</div>
					<TodoFilters />
				</div>
				{filteredTodoAll.length === 0 && <p>No todos found</p>}
				<AnimatedGrid objects={filteredTodoAll} render={(todo) => <TodoCard todo={todo} />} />
			</div>
		</>
	);
}
